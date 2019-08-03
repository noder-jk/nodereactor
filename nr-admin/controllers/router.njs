const get_node_path=(path, node_type)=>
{
	var node=path.split('/').filter(item=>/\S+/.test(item));

	var node_name=node[1] || '';

	var p=node_type[node_name] ? node_type[node_name].dir+'/'+node.slice(2).join('/') : false;

	return p;
}

const is_it_file_request=($, f_next)=>
{
	var p='';

	if($.nr_pathname.indexOf('/theme/')===0)
	{
		/* Serve theme static files */
		p=get_node_path($.nr_pathname, nr_themes);
	}
	else if($.nr_pathname.indexOf('/plugin/')===0)
	{
		/* Serve plugins static files */
		p=get_node_path($.nr_pathname, nr_plugins);
	}
	else if($.nr_pathname.indexOf('/nr-content/')===0)
	{
		/* Serve static files from nr-content folder */
		p=nr_contents+$.nr_pathname.slice('/nr-content/'.length);
	}
	else if($.nr_pathname.indexOf('/nr-react/')===0)
	{
		/* Serve react static build files */
		p=normalize_path(nr_project_root+'/build/'+$.nr_pathname.slice('/nr-react/'.length));
	}
	else
	{
		/* Or refer to core NodeReactor directory */
		p=normalize_path(nr_package_root+$.nr_pathname);
	}
	
	p=!p ? '' : normalize_path(p);

	var ext=node_modules.path.extname(p);
	ext=ext.toLowerCase();

	/* Prevent njs and jsx files */
	if(ext!=='.jsx' && ext!=='.njs')
	{
		file_exists($, p, ($, exists)=>
		{
			f_next($, (exists ? p : false));
		});

		return;
	}

	f_next($, false);
}

const get_pat_array=(str)=>
{
	typeof str!=='string' ? str='' : 0;
	
	return str.split('\n').map(item=>
	{
		item=item.trim();

		var rg=false;
		
		try
		{
			/\S+/.test(item)==true ? rg=new RegExp(item) : 0;
		}
		catch(e)
		{

		}
		return rg;
	}).filter(item=>item!==false);
}

const is_pattern_matched=(pathname)=>
{
	var pats=get_pat_array(file_request_pattern);

	var matched=false;
	pats.forEach(item=>
	{
		item.test(pathname)==true ? matched=true : 0;
	});

	return matched;
}

const allowed_hotlinked=($)=>
{
	var ref=$._SERVER['HTTP_REFERER'] || '';

	var host=$._SERVER['HTTP_HOST'] || '';
	var prot=$._SERVER['SERVER_PROTOCOL'] || '';

	var self_ref=prot + '://' + host;

	var matched=false;
	
	if(!project_mode_dev && ref && ref.indexOf(self_ref)!==0)
	{
		var pats=get_pat_array(hot_linking_pattern);

		pats.forEach(item=>
		{
			item.test(ref)==true ? matched=true : 0;
		});
	}
	else
	{
		return true;
	}
	
	return matched;
}

module.exports.run=($)=>
{
	var check_if_file=($, inc_next)=>
	{
		is_it_file_request($, ($, f)=>
		{
			$.requested_file_path=f;
			inc_next($);
		});
	}

	var send_if_file=($, after_filter, inc_next)=>
	{
		if($.requested_file_path && !allowed_hotlinked($))
		{
			$.http_response_code(403);
			exit($, 'Access Forbidden');
			return;
		}
			
		if($.requested_file_path && (!nr_db_config || !track_file_request || after_filter || (track_file_request && !is_pattern_matched($.nr_pathname))))
		{
			$ = readfile($, $.requested_file_path);
			exit($);
			return;
		}

		inc_next($);
	}

	var load_static=($, next)=>
	{
		/* If it is any get request, then simply send the react index file always. */
		if($._SERVER['REQUEST_METHOD']=='GET')
		{
			var p=nr_project_root+'/build/index.html';

			/* Use async, cause this action will be called every time user hit the server */
			file_get_contents($, p, ($, data)=>
			{
				var def_resp=data || 'Sorry! <br/>"'+p+'" not found. <br/>You must build react app for static serve.';
				
				exit($, def_resp);
			});

			return;
		}
		next($);
	}
	
	/* Include various functions files that registers hooks and provide custom features. */
	var include_nodes=function($, next)
	{
		var include_funcs=[];
		
		/* Call index.njs from core. Its similar to theme's index.njs. It creates hook for core functionality. */
		var core_funcs=require(normalize_path(nr_admin+'plugin/index.njs'));
		include_funcs.push(core_funcs.run);
		
		/* Load core ajax-controller */
		var ajax_controller=require(normalize_path(nr_controllers+'routes.njs'));
		include_funcs.push(ajax_controller.run);

		/* Load theme index file. */
		if(nr_themes[$.nr_active_theme])
		{
			var theme_funcs=include(nr_themes[$.nr_active_theme].dir+'/'+'index.njs');
			(theme_funcs && theme_funcs.run) ? include_funcs.push(theme_funcs.run) : 0;
		}
		
		/* Lastly load all the plugins */
		for(var i=0; i<$.nr_active_plugins.length; i++)
		{
			if(nr_plugins[$.nr_active_plugins[i]])
			{
				var plugin_funcs=include(nr_plugins[$.nr_active_plugins[i]].dir+'/'+'index.njs');
			
				(plugin_funcs && plugin_funcs.run) ? include_funcs.push(plugin_funcs.run) : 0;
			}
		}

		include_funcs.push(next);
		
		$.series_fire(include_funcs);
	}
	
	/* Handle socket event */
	var socket_event=($, next)=>
	{
		if($._SERVER['REQUEST_METHOD']=='IO')
		{
			var ev=$.socket_event;
		
			delete $.socket_event;

			ev=='connected' ? socket_connected($) : 0;

			ev=='disconnected' ? socket_disconnected($) : 0;
			
			if(ev=='connected' || ev=='disconnected'){return;}
		}
		
		next($);
	}

	var ajax_router=function($)
	{
		var logged=is_user_logged_in($);
		var found=false;

		if($._POST['action'] || $._IO['action'])
		{
			/* Loop through all registered ajax and socket handlers */
			for(var k in $.nr_registered_ajax)
			{
				var methd=false;

				if($._SERVER['REQUEST_METHOD']=='IO')
				{
					if((k=='nr_socket_'+$._IO['action'] && logged) || k=='nr_socket_nopriv_'+$._IO['action'])
					{
						delete $._IO['action'];

						methd=$.nr_registered_ajax[k];
					}
				}
				else if((k=='nr_ajax_'+$._POST['action'] && logged) || k=='nr_ajax_nopriv_'+$._POST['action'])
				{
					delete $._POST['action'];

					methd=$.nr_registered_ajax[k];
				}

				if(typeof methd=='function')
				{
					var args=get_args(methd);

					/* Ensure core ajax requests gets handler key too as these are registered through loop. Three args indicates it is core. */
					args.length==3 ? methd($, k, exit) : methd($, exit);
					
					found=true;
					
					break;
				}
			}
		}
		
		!found ? exit($) : 0;
	}

	/* Call all the function in a series action */

	/* These for if NR is installed already */
	var funcs=
	[
		check_if_file,
		[send_if_file, false], 
		nr_get_node_active, 
		get_user_sessions, 
		nr_get_user, 
		include_nodes, 
		nodes_init, 
		[send_if_file, true], 
		load_static, 
		socket_event,
		ajax_router
	];

	/* If not installed yet */
	var funcs2=
	[
		check_if_file,
		[send_if_file,false],
		load_static,
		include_nodes,
		socket_event,
		ajax_router
	];

	$.series_fire( nr_db_config ? funcs : funcs2);
}