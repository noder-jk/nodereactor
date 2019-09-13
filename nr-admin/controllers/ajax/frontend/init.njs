module.exports.init=function($)
{
	/* Set response data object */
	var nr_resp=
	{
		'nr_configs':
		{
			'nr_package': $.nr_active_theme,
			'component'	: 'Index',
			'nr_installed':nr_db_config ? true : false
		},
		'queried_object':{},
		'is_singular':false
	}

	/* Process url */
	var pathname=$._POST['pathname'];
	var pathname_parts=pathname.split('/').filter(item=>/\S+/.test(item)==true);

	/* Parse the last part, it could be post/term/post-type */
	var object_=pathname_parts[pathname_parts.length-1];

	/* Query object to get posts */
	var p_query={'intersect':{}, 'pagination':{'is_singular':false}};

	// Set which page to show in pagination
	$._GET['page'] 	? p_query.page=$._GET['page'] : 0;

	// Get and store currently queried object. Maybe individual post/term/home 
	var get_queried_ob=function($, cb)
	{
		var qb=nr_resp.queried_object;

		if(typeof qb!=='object')
		{
			cb($);
			return;
		}

		if(qb.type=='term')
		{
			var ob={slug:qb.name};
			qb.taxonomy ? ob.taxonomy=qb.taxonomy : 0;

			$.get_terms({intersect:ob}, function($, terms)
			{
				nr_resp.queried_object=terms[0] || {};
				cb($);
			});
		}
		else if(qb.type=='post')
		{
			$.get_posts_by('post_name', qb.name, function($, posts)
			{
				nr_resp.queried_object=posts[0] || {};
				cb($);
			});
		}
	};

	/* Retrieve posts based on accessed page */
	var send_resp=($)=>
	{
		$.get_posts(p_query, ($, posts_for_theme)=>
		{
			if(p_query.pagination.is_singular)
			{
				var pst=posts_for_theme[0] || {};
				p_query.current_post_id=pst.post_id;
			}
			
			/* Now get pagination */
			$.get_pagination(p_query, ($, pagination)=>
			{
				nr_resp.pagination=pagination;

				var post_ids=posts_for_theme.map(item=>item.post_id);

				$.get_permalink( 'post_id', post_ids, function($, urls)
				{
					var psts=posts_for_theme.map(item=>
					{
						var perm=urls[item.post_id] || '';
						item.post_permalink=perm;
						return item;
					});

					nr_resp.posts=psts;

					// If it is single post/page whatever, then set custom template component name if available
					if(nr_resp.is_singular==true)
					{
						var pst=psts[0] || {};

						/* ************
							Need to check if custom template is still enabled
						************ */

						if(pst.post_meta && pst.post_meta.custom_template)
						{
							nr_resp.nr_configs.component=pst.post_meta.custom_template;
						}
					}
					
					// Generate queried object
					get_queried_ob($, function($)
					{
						// then invoke hook so third parties can modify
						$.do_action('theme_response', nr_resp, function($, nr_resp, bummer_next)
						{
							$.exit(nr_resp);
						});
					});
				});
			});
		});
	};

	var set_post_types=($, next)=>
	{
		/* Set only registered post types to be queried for visitor */
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
			nr_resp.queried_object='home';

			$._GET['search'] ? p_query.keyword=$._GET['search'] : 0;
			
			/* No need to set query parameters, home shows default query */
			send_resp($);
			return;
		}

		next($);
	}

	// Manage logut functionalities if url matched
	var check_logout=($, next)=>
	{
		var p=pathname_parts.join('/');

		var red=function($)
		{
			nr_resp.nr_configs.redirect_to='/';
			$.exit(nr_resp);
		}

		if(p=='logout/all')
		{
			console.log('');
			console.log('Log out all called');
			nr_logout_all($, red);
		}
		else if(p=='logout')
		{
			console.log('');
			console.log('Log out called');
			nr_logout($, red);
		}
		else
		{
			next($);
		}
	}

	/* otherwise it might be individual post */
	var check_post=($, next)=>
	{
		$.get_permalink('post_name', [object_], true, function($, reslt)
		{
			// Set query to paginate under same term/taxonomy/parent
			p_query.intersect=Object.assign(p_query.intersect, reslt.query);

			var url=reslt.urls;

			/* url exist means the url is valid */
			if(typeof url=='object' && url[object_])
			{
				/* Delete page offset and post type as it single post */
				delete p_query.page;
				delete p_query.intersect.post_type;

				nr_resp.is_singular=true;

				pathname.slice(-1)=='/' ? pathname=pathname.slice(0, -1) : 0;
				if(url[object_]==pathname)
				{
					/* Set post name for query as it is individual post. */
					p_query.intersect.post_name=object_;
					p_query.intersect.post_name=object_;
					p_query.pagination.is_singular=true;

					nr_resp.queried_object.type='post';
					nr_resp.queried_object.name=object_;

					send_resp($);

					return;
				}
			}
			
			/* Pass to next permalink type checker. Here it's not found */
			next($);
		});
	}

	var check_term=($, next)=>
	{
		var taxonomy=false;
		var term_structure=$.bloginfo( 'term_permalink') || 'tt';
		
		var paths=pathname_parts;
		term_structure=='tt' ? taxonomy=paths[0] : 0;

		$.get_term_link( 'slug', [object_], taxonomy, function($, url)
		{
			if(url[object_])
			{
				pathname.slice(-1)=='/' ? pathname=pathname.slice(0, -1) : 0;
				if(url[object_]==pathname)
				{
					/* Term page has been found, so set post query and send posts */
					taxonomy  ? p_query.intersect.term_taxonomy=taxonomy : 0;

					nr_resp.queried_object.type='term';
					nr_resp.queried_object.name=object_;
					nr_resp.queried_object.taxonomy=taxonomy;
					
					send_resp($);

					return;
				}
			}
			next($);
		});
	}

	/* Send nothing if all the previous checker fails to find content */
	var eventually=($, next)=>
	{
		$.exit( nr_resp);
	}

	$.series_fire
	([
		register_post_types, 
		set_post_types, 
		check_home, 
		check_logout,
		check_post, 
		check_term, 
		eventually
	]);
}