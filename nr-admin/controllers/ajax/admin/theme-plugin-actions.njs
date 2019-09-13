// Insert completely new theme/plugin with active status. Active because first attempt is always active.
function insert_theme_plugin($, nr_package, node_type, call_back)
{
	var q='INSERT INTO '+nr_db_config.tb_prefix+'nodes (nr_package,type,active) VALUES ("'+nr_package+'", "'+node_type+'", 1)';
	
	nr_db_pool.query(q,function(e,r)
	{
		e ? $.exit( {'status':'error','message':'Error in inserting.'}) : call_back($, r.insertId);
	});
}

// If it's plugin, then deactivate itself. Otherwise deactivate previously active theme
function deactivate_other_node($, node_package, node_type, clback)
{
	var q=false;
	
	if(node_type=='theme')
	{
		q='UPDATE '+nr_db_config.tb_prefix+'nodes SET active=0 WHERE type="'+node_type+'" AND nr_package!="'+node_package+'"';
	}
	else if(node_type=='plugin')
	{
		q='UPDATE '+nr_db_config.tb_prefix+'nodes SET active=0 WHERE type="'+node_type+'" AND nr_package="'+node_package+'"'
	}
	
	if(q)
	{
		nr_db_pool.query(q,function(e,r)
		{
			$.echo( (e ? {'status':'error','message':'Error in deactivating.'} : {'status':'success'}));

			clback($);
		});
		return;
	}
	
	$.echo({'status':'error','message':'Unknown error'});
	clback($);
}

// Namely it checks whether the theme/plugin is already entered in database.
function check_if_node_exist_in_db($, nr_package, node_type, call_back)
{
	var q='SELECT * FROM '+nr_db_config.tb_prefix+'nodes WHERE type="'+node_type+'" AND nr_package="'+nr_package+'"';
	
	nr_db_pool.query(q,function(e,r)
	{
		e ? $.exit({'status':'error','message':'Error in checking if '+node_type+' exist.'}) : call_back($, (r.length>0 ? true : false));
	});
}

// It's to activate existing entry in database
function activate_existing($, nr_package,call_back)
{
	var q='UPDATE '+nr_db_config.tb_prefix+'nodes SET active=1 WHERE type="'+node_type+'" AND nr_package="'+nr_package+'"';
	
	nr_db_pool.query(q,function(e,r)
	{
		e ? $.exit({'status':'error','message':'Error in updating/activating'}) : call_back($, true);
	});
}

// This function invoke activation deactivation hook
function activation_deactivation_hook($, activation, nr_package, cb)
{
	/* Run the activation/deactivation hook */
	var event= activation ? 'activate' : 'deactivate';

	var p=nr_plugins[nr_package] || nr_themes[nr_package];
	if(p && p.dir)
	{
		var hook_file=require(normalize_path(p.dir+'/index.njs'));

		typeof hook_file[event]=='function' ? hook_file[event]($, cb) : cb($);
	}
	
	// Delete run time data associated with deactivated extension
	if(!activation)
	{
		delete nrg[nr_package];
		uninclude(nr_package);
	}
}

module.exports.run=function($)
{
	var node_package= $._POST.node_package || '';
	node_type		= $._POST.type=='plugin' ? 'plugin' : 'theme';
	
	var hooker=function($, deactivate_plugin)
	{
		var status={'status':'success'};

		// Deactivating plugin
		if(deactivate_plugin)
		{
			deactivate_other_node($, node_package, node_type, function($)
			{
				activation_deactivation_hook($, false, node_package, function($)
				{
					$.exit(status);
				});
			});

			return;
		}

		// Activate plugin
		if(node_type=='plugin' )
		{
			activation_deactivation_hook($, true, node_package, function($)
			{
				$.exit(status);
			});

			return;
		}

		// Toggle theme active status
		deactivate_other_node($, node_package, node_type, function($)
		{
			// Firstly invoke activation hook of 
			activation_deactivation_hook($, true, node_package, function($)
			{
				// Then invoke deactivation hook, because if another theme gets activated, then previous one must be deactivated
				activation_deactivation_hook($, false, $.nr_active_theme, function($)
				{
					$.exit(status);
				});
			});
		});
	}

	if($._POST.type=='plugin' && $._POST.to_do=='deactivate')
	{
		/* If this is to deactivate any plugin. */
		/* (Theme can not be deactivate in this manner. Theme get deactivated only when another one gets activated. So it will be handled in third 'else if' block.) */
		
		hooker($, true);
		return;
	}
	else if($._POST.to_do=='activate')
	{
		/* Firstly check whether already the theme/plugin inserted into database or not. */
		check_if_node_exist_in_db($, node_package, node_type, function($,result)
		{
			if(result==true)
			{
				/* It means theme/plugin already inserted into db. So simply activate it. */
				activate_existing($, node_package, function($, result)
				{
					hooker($);
				});
			}
			else
			{
				/* It means the theme/plugin has not been inserted into db yet. So insert now. */
				insert_theme_plugin($,node_package, node_type, function($, ins_id)
				{
					hooker($);
				});
			}
		});
	}
}