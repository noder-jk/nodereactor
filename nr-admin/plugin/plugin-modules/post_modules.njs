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

		$=register_post_module($,box);
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

		$=register_post_module($,box);
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

		$=register_post_module($,box);
		next($);
	}
	$=add_action($, 'register_post_modules', featured_image_metabox);
	$=add_action($, 'register_post_modules', custom_template_meta_field);
	$=add_action($, 'register_post_modules', post_parent);
	

	function register_meta($, next)
	{
		$=use_post_module($, 
		{
			'post_type':'post', 
			"modules":
            [
                "title",
                "media",
                "editor",
                "comment",
                "excerpt",
                "featured_image"
            ]
		});


		$=use_post_module($, 
		{
			'post_type':'page', 
			"modules":
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

		$=use_post_module($, 
		{
			'post_type':'attachment', 
			"modules":
			[
				"title",
				"editor",
                "comment",
				"excerpt"
			]
		});

		next($);
	}

	$=add_action($, 'use_post_modules', register_meta);


	next($);
}