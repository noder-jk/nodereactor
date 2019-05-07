module.exports.run=function($, next)
{
    $=add_action($, 'register_taxonomies', function($, next)
    {
        var tax=
        {
            'taxonomy':'category',
            'hierarchical':true,
            'title':'Category',
            'multiple':true
        }

        var tag=
        {
            'taxonomy':'tag',
            'hierarchical':false,
            'title':'Tag',
            'multiple':true
        }

        $=register_taxonomy($, tax);
        $=register_taxonomy($, tag);

        next($);
    });

    $=add_action($, 'use_taxonomies', function($, next)
    {
        var lnk=
        {
			'post_type':'post', 
			"taxonomy":
			[
				"category",
				"tag"
			]
        };

		$=use_taxonomy($, lnk);

        next($);
    });

    next($);
}