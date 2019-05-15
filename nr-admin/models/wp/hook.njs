/* --------------Registrar functions that register hooks, filters and do action.-------------- */
module.exports.add_action=function(hook, callback)
{
	if(hook && (hook.indexOf('nr_ajax_')===0 || hook.indexOf('nr_socket_')===0))
	{
		this.nr_registered_ajax[hook]=callback;
		return;
	}
	
	!this.nr_hooks[hook] ? this.nr_hooks[hook]=[] : 0;
	
	this.nr_hooks[hook].push(callback);
}

global.remove_action=function($, hook)
{
	delete $.nr_hooks[hook];
	return $;
}

global.do_action=function($,hook,params,callback)
{
	/* Determine callback and passable parameters */
	var next=!callback ? params : callback;
	var params=callback ? params : false;

	/* Check if the hook exist in registered array, and it has at least one function to invoke */
	if($.nr_hooks[hook] && $.nr_hooks[hook].length>0)
	{
		var hks=[];

		/* Loop through all hooked function and store in the array */
		for(var i=0; i<$.nr_hooks[hook].length; i++)
		{
			var fnc=$.nr_hooks[hook][i];

			hks.push(params!==false ? [fnc, params] : fnc);
		}

		hks.push(next);
		
		/* Finally call all that in series mode */
		$.series_fire( hks);
	}
	else if(typeof next=='function')
	{
		next($);
	}
}

/* --------------post hooks-------------- */
global.use_post_modules=function($, callback)
{
	do_action($,'use_post_modules',callback);
}

global.register_post_modules=function($,callback)
{
	do_action($,'register_post_modules',callback); 
}

global.register_post_types=function($,callback)
{
	do_action($,'register_post_types',callback);
}

global.save_post=function($,callback)
{
	do_action($,'save_post',callback);
}


global.register_custom_templates=function($,callback)
{
	do_action($,'register_custom_templates',callback);
}



/* ----------------Core, themes, plugins related hooks---------------- */
global.admin_menu=function($,callback)
{
	do_action($,'admin_menu',callback);
}

global.widgets_init=function($,callback)
{
	do_action($,'widgets_init',callback);
}

global.nodes_init=function($,callback)
{
	do_action($,'nodes_init',callback);
}

global.save_post=function($,callback)
{
	do_action($,'save_post',callback);
}

global.delete_user=function($, user_id, callback)
{
	do_action($, 'delete_user', user_id, callback);
}

global.register_nav_menus=function($, callback)
{
	do_action($, 'register_nav_menus', callback);
}

/* Taxonomy */
global.register_taxonomies=function($, callback)
{
	do_action($, 'register_taxonomies', callback);
}

global.use_taxonomies=function($, callback)
{
	do_action($, 'use_taxonomies', callback);
}

/* socket */
global.socket_connected=function($, callback)
{
	do_action($, 'socket_connected', callback);
}

global.socket_disconnected=function($, callback)
{
	do_action($, 'socket_disconnected', callback);
}