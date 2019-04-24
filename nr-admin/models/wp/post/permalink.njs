
global.get_permalink=function($, by, arg, p_next)
{
	var process_url=($)=>
	{
		var perm_posts=[];
		var perm_urls={};

		/* Firstly check if the post exists */
		var fetch_posts=($, next)=>
		{
			get_post_by($, by, arg, function($, r)
			{
				if(Array.isArray(r) && r.length>0)
				{
					/* Store fetched posts in variable to be used to retrieve permalink structure, term based permalink etc */
					perm_posts=r || []; // create permalink for isolated status too
					
					/* Check if theres are enough post after filter */
					if(perm_posts.length>0)
					{
						next($);
						return;
					}
				}

				/* If no post or error, simply send nothing */
				p_next($, perm_urls);
			});
		}

		/* Now determine which permalink structure should be applied */
		var permalink_mode=($, next)=>
		{
			/* Get all registered post types */
			var post_types=get_post_types($, true);

			var funcs=[];

            /* Loop through all post to generate permalink */
			perm_posts.forEach(item=>
			{
				/* Create a series of function, cause parent post name retrieval is asyncronous process */
				var fnc=($, post, next)=>
				{
					/* check if the post type is defined as hierarchical in registration */
					var hierarchical=(post_types[post.post_type] && post_types[post.post_type].hierarchical==true);
					
					var structure=bloginfo($, post.post_type+'_post_permalink', false);

					/* If hierarchical, send it hierarchically, no need terms or other things */
					if(hierarchical==true)
					{
                        /* If the parent already 0, then no need to call parent collector */
                        if(item.post_parent==0)
                        {
                            perm_urls[post[by]]='/'+post.post_name;	
                            next($);
                            return;
                        }

                        var hierarchy=[post.post_name];

						/* Get ancestors post names through recursive function */
						var get_nest=(post_item)=>
						{
                            get_post_by($, 'post_id', post_item.post_parent, function($, r)
                            {
                                if(Array.isArray(r) && r.length>0)
                                {
                                    var pst=r[0];

									/* Append post parent post name in hierarchy url */
                                    hierarchy.unshift(pst.post_name);
									
									/* Fetch again if it still is not the root parent */
                                    if(pst.post_parent>0)
                                    {
                                        get_nest(pst);
                                        return;
                                    }
                                }
                                
                                /* If no mote parent found, end here */
                                perm_urls[post[by]]='/'+hierarchy.join('/');	

                                next($);
                            });
						}
						
                        get_nest(item);

                        return;
					}
					
					/* Set default url */
					perm_urls[post[by]]='/'+post.post_name
					
                    /* Other wise check it's defined permalink structure */
                    if(structure=='tn' || structure=='ttn')
                    {
						var pt=post.post_type;

						/* At first retrieve the taxonomy that is defined to be used in permalink building */
						var taxo=bloginfo($, pt+'_post_taxonomy', false);
						if(taxo)
						{
							/* Then retrieve the primary term from post meta. It is necessary if multiple term is selected for a post. */
							var mk='primary_term_id_of_'+taxo;
							get_post_meta($, post.post_id, mk, false, function($, meta)
							{
								var t_id=meta.map(item=>item.meta_value);
								t_id=t_id[0] ? t_id[0] : false;

								if(t_id)
								{
									get_term_link($, 'term_id', t_id, false, function($, urls)
									{
										var url_base='';
										structure=='ttn' ? url_base='/'+taxo : 0; // prepend taxonomy if it is taxonomy/terms/post_name

										perm_urls[post[by]]=url_base+(urls[t_id] ? urls[t_id] : '')+'/'+post.post_name;	
										
										next($);
									});

									return;
								}
								
								next($);
							});

							return;
						}
                    }

					next($);
				}

				funcs.push([fnc, item])
			});

			funcs.push(($, next)=>
			{
				p_next($, perm_urls);
			});

			series_fire($, funcs);
		}

		series_fire($, [fetch_posts, permalink_mode]);
	}

	/* Firstly initialize hooks, and then process url */
	series_fire($, [register_post_types, register_taxonomies, use_taxonomies, process_url])
}
