module.exports.run=function($,next)
{
	/* Create a search widget. */
	function search_widget_reg($, next)
	{
		var widget_object=	
		{
			'id':	'nr_search_widget',
			'title':'Search Box',
			'input_component': 'SearchWidgetInput',
			'output_component': 'SearchWidgetOutput',
			'package':false
		}
		
		$.register_widget(widget_object);
		next($);
	}
	
	function arbitrary_text_widget($, next)
	{
		var arbit_obj=
		{
			'id':'arbitrary_text_widget_handler',
			'title':'Arbitrary Text',
			'input_component':'ArbitraryTextInput',
			'output_component':'ArbitraryTextOutput',
			'package':false
		}
		$.register_widget(arbit_obj);
		next($);
	}
	
	function custom_html_widget($, next)
	{
		var cust_obj=
		{
			'id':'custom_html_widget_handler',
			'title':'Custom HTML',
			'input_component':'CustomHtmlInput',
			'output_component':'CustomHtmlOutput',
			'package':false
		}
		$.register_widget(cust_obj);
		next($);
	}

	function recent_post_widget($, next)
	{
		var widget_object=	
		{
			'id':'nr_recent_post_widget',
			'title':'Recent Posts',
			'input_component':'RecentPostInput',
			'output_component':'RecentPostOutput',
			'package':false
		}
		$.register_widget(widget_object);
		next($);
	}

	function menu_widget($, next)
	{
		var widget_object=	
		{
			'id':'nr_menu_widget',
			'title':'Menu in Widget',
			'input_component':'MenuWidgetInput',
			'output_component':'MenuWidgetOutput',
			'package':false
		}
		$.register_widget(widget_object);
		next($);
	}
	
	$.add_action('widgets_init',	custom_html_widget);
	$.add_action('widgets_init',	arbitrary_text_widget);
	$.add_action('widgets_init',	recent_post_widget);
	$.add_action('widgets_init',	search_widget_reg);
	$.add_action('widgets_init',	menu_widget);
	
	next($);
}