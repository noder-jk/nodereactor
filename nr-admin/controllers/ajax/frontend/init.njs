module.exports.init=function($)
{
	/* Set meta data */
	var nr_resp=
	{
		'nr_configs':
		{
			'nr_package': $.nr_active_theme,
			'component'	: 'Index',
			'nr_installed':nr_db_config ? true : false
		},
		'is_singular':false
	}
	
	/* Process url */
	var pathname=$._POST['pathname'];

	var pathname_parts=pathname.split('/').filter(item=>/\S+/.test(item)==true);


	/* Parse the last part, it could be post/term/post-type */
	var object_=pathname_parts.slice(-1);

	/* Query object to get posts */
	var p_query={'intersect':{}}

	$._GET['page'] 	? p_query.page=$._GET['page'] : 0;

	/* Redirect if the term is changed */
	var redirect=($, red)=>
	{
		nr_resp.nr_configs.redirect_to=red;

		exit($, nr_resp);
	}

	/* Retrieve posts based on accessed page */
	var send_resp=($)=>
	{
		get_posts($, p_query, ($, posts_for_theme)=>
		{
			/* Now get pagination */
			get_pagination($, p_query, ($, pagination)=>
			{
				nr_resp.pagination=pagination;

				var post_ids=posts_for_theme.map(item=>item.post_id);

				get_permalink($, 'post_id', post_ids, function($, urls)
				{
					var psts=posts_for_theme.map(item=>
					{
						var perm=urls[item.post_id] || '';
						item.post_permalink=perm;
						return item;
					});

					nr_resp.posts=psts;
					
					exit($, nr_resp);
				});
			});
		});
	};

	var set_post_types=($, next)=>
	{
		/* Set post types */
		var pts=$.registered_post_types;
		var post_types=Object.keys(pts).map(item=>pts[item].show_in_feed ? item : false).filter(item=>item!==false);

		p_query.intersect.post_type=post_types;

		next($);
	}
 
	/* Check if it home request */
	var check_home=($, next)=>
	{
		if(pathname=='' || pathname=='/')
		{
			$._GET['search'] ? p_query.keyword=$._GET['search'] : 0;
			
			/* No need to set query parameters, home shows default query */
			send_resp($);
			return;
		}

		next($);
	}

	var check_logout=($, next)=>
	{
		var p=pathname_parts.join('/');

		if(p=='logout/all')
		{
			session_destroy($);
			
			redirect($, '/');
		}
		else if(p=='logout')
		{
			delete $._SESSION['user_login'];
			delete $._SESSION['user_id'];
			
			redirect($, '/');
		}
		else
		{
			next($);
		}
	}

	/* otherwise it might be individual post */
	var check_post=($, next)=>
	{
		get_permalink($, 'post_name', object_, function($, url)
		{
			/* url exist means the url is valid */
			if(url[object_])
			{
				/* Delete page offset and post type as it single post */
				delete p_query.page;
				delete p_query.intersect.post_type;

				nr_resp.is_singular=true;

				if(url[object_]==pathname)
				{
					/* Set post name for query as it is individual post. */
					p_query.intersect.post_name=object_;
					send_resp($);
				}
				else
				{
					/* redirect if somehow the url not matched, cause may be permalink structure has been changed. */
					redirect($, url[object_]);
				}
				return;
			}
			
			/* Pass to next permalink type checker. Here it's not found */
			next($);
		});
	}

	var check_term=($, next)=>
	{
		var taxonomy=false;
		
		var term_structure=bloginfo($, 'term_permalink', 'tt');
		
		var paths=pathname_parts;

		term_structure=='tt' ? taxonomy=paths[0] : 0;

		get_term_link($, 'slug', object_, taxonomy, function($, url)
		{
			if(url[object_])
			{
				if(url[object_]==pathname)
				{
					/* Term page has been found, so set post query and send posts */
					taxonomy  ? p_query.intersect.term_taxonomy=taxonomy : 0;
					
					send_resp($);
				}
				else
				{
					redirect($, url[object_]);
				}
				return;
			}
			next($);
		});
	}

	/* Send nothing if all the previous checker fails to find content */
	var eventually=($, next)=>
	{
		exit($, nr_resp);
	}

	series_fire($, [register_post_types, set_post_types, check_home, check_logout, check_post, check_term, eventually]);
}