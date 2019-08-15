const get_node_type=function(nr_package)
{
	var type=false;
	
	if(nr_themes[nr_package])
	{
		type='theme'
	}
	else if(nr_plugins[nr_package])
	{
		type='plugin';
	}

	return type;
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~get option and set option~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
module.exports.update_option=function(option, nr_package)
{
	this.add_option(option, nr_package);
}

module.exports.add_option=function(option, nr_package)
{
	/* to_set parameter is json, key value paired data. */
	if(nr_package===0)
	{
		for(var k in option)
		{
			this.nr_set_option_queue.core.c[k]=option[k];
		}
		return;
	}
	
	var type=get_node_type(nr_package);
	
	if(type!==false)
	{
		this.nr_set_option_queue[type][nr_package]==undefined ? this.nr_set_option_queue[type][nr_package]={} : 0;
		
		for(var k in option)
		{
			this.nr_set_option_queue[type][nr_package][k]=option[k];
		}
	}
}

module.exports.get_option=function(key, nr_package)
{
	if(nr_package===0)
	{
		return this.nr_set_option_queue.core.c[key];
	}
	
	var type=get_node_type(nr_package);
	
	if(type!==false && this.nr_set_option_queue[type] && this.nr_set_option_queue[type][nr_package])
	{
		return this.nr_set_option_queue[type][nr_package][key];
	}
}

module.exports.delete_option=function(key, nr_package)
{
	if(nr_package===0)
	{
		if(this.nr_set_option_queue.core.c[key])
		{
			delete this.nr_set_option_queue.core.c[key];
		}
	}
	else
	{
		var type=get_node_type(nr_package);
		
		if(type!==false && this.nr_set_option_queue[type] && this.nr_set_option_queue[type][nr_package])
		{
			if(this.nr_set_option_queue[type][nr_package][key])
			{
				delete this.nr_set_option_queue[type][nr_package][key];
			}
		}
	}
}

global.real_set_option=function($, resp_next)
{
	// for core functions. Not for developers.
	if($.nr_call_real_set_option!==true && typeof resp_next=='function')
	{
		resp_next($);
		return;
	}
	
	var op_funcs=[];

	/* Loop through all type (theme, plugin and core) */
	for(var type in $.nr_set_option_queue)
	{
		/* Loop through every individual option of single type such as plugin 2 */
		for(var k in $.nr_set_option_queue[type])
		{
			/* Convert to json and escape options */
			var options=nr_db_pool.escape(JSON.stringify($.nr_set_option_queue[type][k]));
			
			var q='UPDATE '+nr_db_config.tb_prefix+'nodes SET options='+options+' WHERE type="'+type+'" AND nr_package="'+k+'"';
			
			/* Generate series with updater functions */
			op_funcs.push
			([
				($, q, next)=>
				{
					nr_db_pool.query(q, function(e)
					{
						next($);
					});
				},
				q
			]);
		}
	}

	typeof resp_next=='function' ? op_funcs.push(resp_next) : 0;

	$.series_fire(op_funcs);
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Other necessary functions.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
global.bloginfo=function($, key, fallback)
{
	// All the option values owned by core can be retrieved by bloginfo. OR get_option('option_name', 0). 0 means the owner core.
	return $.nr_set_option_queue.core.c[key]==undefined ? (fallback!==undefined ? fallback : false) : $.nr_set_option_queue.core.c[key];
}