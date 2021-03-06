module.exports.get=function($)
{
	/* This method is to provide single post and meta boxes for editor purpose */
	function init_post_response($)
	{
		var pt=$._POST['post_type'];

		var meta_boxes=[];
		var post_modules=[];

		/* Loop through all the registered connection between meta box and post type. */
		for(var k in $.registered_meta_box_to_post)
		{
			/* Process if currently accessed post type match the registered post type */
			if(k!==pt){continue;}
			
			var rmb=$.registered_meta_box_to_post[k];
			post_modules=rmb;

			for(var i=0; i<rmb.length; i++)
			{
				$.nr_registered_meta_boxes[rmb[i]] ? meta_boxes.push($.nr_registered_meta_boxes[rmb[i]]) : 0;
			}
		}
		
		/* Now generate meta box for taxonomy */
		/* Set taxonomy menu to post type menu */
		var k=pt;
		if($.registered_taxonomies_to_post[k] && Array.isArray($.registered_taxonomies_to_post[k]))
		{
			$.registered_taxonomies_to_post[k].forEach(function(taxonomy)
			{
				if($.nr_registered_taxonomies[taxonomy])
				{
					var rtx=$.nr_registered_taxonomies[taxonomy];
					
					meta_boxes.push
					({
						'id':rtx.taxonomy,
						'title':rtx.title,
						'component':'PostTaxonomy',
						'position':'right',
						'nr_package':true
					});
				}
			});
		}

		var editor_resp=
		{
			'meta_boxes':meta_boxes, 
			'post_type':$._POST['post_type'],
			'post_modules':post_modules,
			'custom_templates':$.nr_custom_templates
		}

		if($._POST.post_id)
		{
			var ob=
			{
				'intersect':
				{
					'post_id':$._POST.post_id, 
					'post_type':$._POST['post_type'],
					'post_status':'any'
				}
			};

			$.get_posts(ob, function($, r)
			{
				r=r[0] ? r[0] : 'not_found';

				editor_resp.post=r;

				$.get_permalink('post_id', r.post_id, function($, url)
				{
					editor_resp.permalink=url;

					$.exit(editor_resp);
				});
			})
		}
		else
		{
			$.echo(editor_resp);
			$.exit();
		}
	}
	
	if(!$._POST['post_type'])
	{
		$.exit();
		return;
	}

	var funcs=
	[
		register_meta_boxes, 
		use_meta_boxes, 
		register_taxonomies, 
		use_taxonomies, 
		register_custom_templates, 
		init_post_response
	];
	
	$.series_fire( funcs);
}

module.exports.get_post_list=function($)
{
	/* This function provides post list for admin post list */
	var posts=nr_db_config.tb_prefix+'posts';
	var users=nr_db_config.tb_prefix+'users';
	
	var condition=$._POST.query || '{}';

	try
	{
		condition=JSON.parse(condition);
	}
	catch(e)
	{

	}
	typeof condition!=='object' ? condition={} : 0;

	// Set necessary columns
	var f=
	[
		posts+'.post_id',
		posts+'.post_title',
		posts+'.post_name',
		posts+'.post_status',
		posts+'.post_date',
		posts+'.post_modified',
		posts+'.post_type',
		users+'.display_name'
	];
	
	var q_ob=
	{
		'fields':f, 
		'intersect':{}, 
		'posts_per_page':condition.posts_per_page || 20, 
		'page':condition.page || 1
	}
	
	/* Process post filter from post list page. */
	for(var k in condition)
	{
		switch(k)
		{
			case 'post_type'	:
			case 'post_status'	:	q_ob.intersect[k]=condition[k];
									break;
			
			case 'keyword'		:	/\S+/.test(condition[k])==true ? q_ob.keyword=condition[k].trim() : 0;
									break;
		}
	}

	
	var process_list=($, next)=>
	{
		/* Now get posts and send to browser. */
		$.get_posts(q_ob, function($, post_ob)
		{
			$.get_pagination(q_ob, function($, pgn)
			{
				var post_ids=[];

				var rg=$.registered_taxonomies_to_post;
				var txes=rg[condition.post_type] || [];


				/* Collect post ids and modify some column */
				for(var i=0; i<post_ob.length; i++)
				{
					post_ob[i].post_date=nr_local_time($, post_ob[i].post_date);
					post_ob[i].post_modified=nr_local_time($, post_ob[i].post_modified);
					post_ob[i].post_edit_link=$.get_edit_post_link(post_ob[i].post_id, post_ob[i].post_type);

					post_ids.push(post_ob[i].post_id);
				}
				
				var get_perms=($, next)=>
				{
					$.get_permalink( 'post_id', post_ids, function($, urls)
					{
						for(var i=0; i<post_ob.length; i++)
						{
							post_ob[i].post_url=urls[post_ob[i].post_id] || ''; 
						}

						next($);
					});
				}

				var get_taxs=($, next)=>
				{

					/* ----------------Collect connected taxonomies---------------- */
					var rel=nr_db_config.tb_prefix+'term_relationships';
					var trm=nr_db_config.tb_prefix+'terms';
					var q='SELECT '+rel+'.owner_post_id, '+trm+'.name, '+trm+'.taxonomy FROM '+rel+' LEFT JOIN '+trm+' ON '+rel+'.owner_term_id='+trm+'.term_id WHERE '+rel+'.owner_post_id IN ('+post_ids.join(',')+')';

					nr_db_pool.query(q, function(e, r)
					{
						(e || !Array.isArray(r)) ? r=[] : 0;

						/* provide terms in post list */
						r.forEach(item=>
						{
							for(var i=0; i<post_ob.length; i++)
							{
								if(post_ob[i].post_id==item.owner_post_id)
								{
									!post_ob[i].terms ? post_ob[i].terms={} : 0;

									!post_ob[i].terms[item.taxonomy] ? post_ob[i].terms[item.taxonomy]=[] : 0;

									post_ob[i].terms[item.taxonomy].push(item.name);
								}
							}
						});

						next($);
					});
				}

				var resp_now=($, next)=>
				{
					$.echo({'posts':post_ob, 'pagination':pgn, 'taxonomies':txes});

					$.exit();
				}

				$.series_fire( [get_perms, get_taxs, resp_now]);
			});
		});
	}
	

	$.series_fire( [register_post_types, register_taxonomies, use_taxonomies, process_list]);
}

module.exports.delete_media=function($)
{
	if($._POST.post_id)
    {
		$.delete_attachment($._POST.post_id, ($)=>
		{
			$.exit( {'status':'success'})
		});
    }
    else
    {
        $.exit();
    }
}

module.exports.delete_posts=function($)
{
	if($._POST.post_id)
    {
		$.delete_post($._POST.post_id, ($)=>
		{
			$.exit( {'status':'success'});
		});
    }
    else
    {
        $.exit();
    }
}

module.exports.check_slug=function($)
{
	var dt=
	{
		post_name: $._POST.post_name, 
		post_id:$._POST.post_id
	};

	$.get_available_slug(dt, function($, result)
	{
		$.exit( {post_name:result});
	});
}

module.exports.save=function($)
{
	var fields	= $._POST.post;
	
	!fields.post_name ? fields.post_name='' : 0;
	
	/* Retrieve post parent from meta box and delete from meta. Rather set to column. */
	if(fields.post_meta.nr_post_parent)
	{
		var prnt=fields.post_meta.nr_post_parent;
		fields.post_parent=prnt;

		delete fields.post_meta.nr_post_parent;
	}
	
	$.insert_post( fields, function($, r)
	{
		if(!r)
		{
			$.exit();
			return;
		}
		
		var p_id=r;

		var resp=
		{
			'status':'success', 
			'message':'Done',
			'post_id':p_id,
			'post_type':fields.post_type
		}

		// Update post meta data
		$.update_post_meta(p_id, fields.post_meta, function($)
		{
			$.do_action('insert_post_from_editor', p_id, function($, id, next)
			{
				// now get the url of the saved post
				$.get_permalink('post_id', p_id, function($, url)
				{
					resp.permalink=url;
					
					$.exit( resp);
				});
			});
		});
	});
}

module.exports.get_hierarchy=function($)
{
	var q_ob=
	{
		'intersect':
		{
			'post_type':$._POST.post_type
		},
		'posts_per_page':-1
	}

	$.get_posts(q_ob, function($, r)
	{
		$.exit({'posts':r});
	});
}

module.exports.get_featured_image=function($)
{
	$.get_attachment_url($._POST.post_id, function($, url)
	{
		$.exit(url ? {'url':url} : '');
	});
}

module.exports.p_for_nav=function($)
{
	var ob=
	{
		'intersect':
		{
			'post_status':'publish'
		},
		'unite':
		{
			'post_type':['page', 'post']
		}
	}

	$.get_posts(ob, function($, pst)
	{
		var posts={};

		pst.map(item=>
		{
			!posts[item.post_type] ? posts[item.post_type]=[] : 0;

			posts[item.post_type].push(item);
		});

		$.exit( {'objects':posts});
	});
}