module.exports.run=function($,next)
{
	function featured_image_metabox($, next)
	{
		var box={
					'id':'featured_image',
					'title':'Featured Image',
					'component':'FeaturedImage',
					'position':'right',
					'package':false
				}

		$.register_meta_box(box);

		next($);
	}

	function custom_template_meta_field($, next)
	{
		var box={
					'id':'custom_template',
					'title':'Custom Template',
					'component':'CustomTemplate',
					'position':'right',
					'package':false
				}

		$.register_meta_box(box);
		next($);
	}

	function post_parent($, next)
	{
		var box=
		{
			'id':'hierarchy',
			'title':'Post Parent',
			'component':'PostHierarchy',
			'position':'right',
			'package':false
		}

		$.register_meta_box(box);
		
		next($);
	}

	$.add_action('register_meta_boxes', featured_image_metabox);
	$.add_action('register_meta_boxes', custom_template_meta_field);
	$.add_action('register_meta_boxes', post_parent);
	

	function register_meta($, next)
	{
		$.use_meta_box
		({
			'post_type':'post', 
			"module":
            [
                "title",
                "media",
                "editor",
                "comment",
                "excerpt",
                "featured_image"
            ]
		});


		$.use_meta_box
		({
			'post_type':'page', 
			"module":
            [
                "title",
                "media",
                "editor",
                "excerpt",
                "hierarchy",
                "custom_template",
                "featured_image"
            ]
		});

		$.use_meta_box
		({
			'post_type':'attachment', 
			"module":
			[
				"title",
				"editor",
                "comment",
				"excerpt"
			]
		});

		next($);
	}

	$.add_action('use_meta_boxes', register_meta);


	next($);
}