global.nr_get_node_active=function($,call_back)
{
	/* Retrieve active plugins, themes, options from database. */
	var q='SELECT * FROM '+nr_db_config.tb_prefix+'nodes WHERE active=1';
	
	nr_pool.query(q, function(err, result)
	{
		if(!err)
		{
			$.nr_call_real_set_option=true;

			var active_nodes={'themes':[], 'plugins':[]};

			for(var i=0; i<result.length; i++)
			{
				switch(result[i].type)
				{
					case 'theme'	:	$.nr_active_theme=result[i].nr_package;	
										result[i].options ? $.nr_set_option_queue.theme[result[i].nr_package] = JSON.parse(result[i].options) : 0;
										
										var l=$.get_option('area_widget_linking', $.nr_active_theme);
										$.nr_widget_linked_to_sidebar= l==false ? {} : l;
										
										active_nodes.themes.push(result[i].nr_package);
										break;
										
					case 'plugin'	:	$.nr_active_plugins.push(result[i].nr_package); 
										result[i].options ? $.nr_set_option_queue.plugin[result[i].nr_package] = JSON.parse(result[i].options) : 0;
										
										active_nodes.plugins.push(result[i].nr_package);
										break;
										
					case 'core'		:	result[i].options ? $.nr_set_option_queue.core.c = JSON.parse(result[i].options) : 0;
										break;
				}
			}

			$.nr_active_nodes=active_nodes;
		}
		call_back($);
	});
}

global.parse_node_type=function(p)
{
	if(p===false){return {'nr_package':true}}

	if(nr_themes[p]){return {'nr_package': p}}

	if(nr_plugins[p]){return {'nr_package': p}}

	return false;
}