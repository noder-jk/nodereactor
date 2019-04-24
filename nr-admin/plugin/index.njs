module.exports.run=function($,next)
{
	$=add_action($,'widgets_init', function($, next)
	{
		$=register_sidebar($, {'title':'Right Panel core', 'id':'right_sidcore'});
		next($);
	});
	
		
	$=add_action($,'widgets_init', function($, next)
	{
		$=register_sidebar($, {'title':'Right Panel core 2', 'id':'right_side_panel_core_2'});
		next($);
	});

	$=add_action($,'register_custom_templates',function($, next)
	{
		var ob=
		{
			'component':'TestCustomTemplate', 
			'title':'First Test',
			'package':false
		}

		$=register_custom_template($, ob);

		next($);
	});



	$=add_action($, 'socket_connected', function($, next)
	{
		console.log('plug resp: -> hi socket connected', $.nr_socket.id);
		console.log(is_user_logged_in($));
		next($);
	});

	$=add_action($, 'socket_disconnected', function($, next)
	{
		console.log('plug resp: -> hi socket has been disconnected', $.nr_socket.id);
		next($);
	});


	var meta_box_file	= require(nr_admin+'plugin/plugin-modules/post_modules.njs').run;
	var widget_file		= require(nr_admin+'plugin/plugin-modules/widgets.njs').run;
	var post_type		= require(nr_admin+'plugin/plugin-modules/post_type.njs').run;
	var taxonomy		= require(nr_admin+'plugin/plugin-modules/taxonomy.njs').run;
	
	var methods=[meta_box_file, widget_file, post_type, taxonomy, next];

	series_fire($, methods);
}