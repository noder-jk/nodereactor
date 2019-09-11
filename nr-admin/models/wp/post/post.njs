/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Renderer functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
module.exports.get_post_types=function(condition)
{
	var resp={};

	var pts=this.registered_post_types;

	if(condition===true || typeof condition!=='object')
	{
		return pts;
	}

	for(var k in pts)
	{
		for(var k2 in condition)
		{
			pts[k]==condition[k2] ? resp[k]=pts[k] : null;
		}
	}

	return resp;
}

module.exports.get_posts_by=function(by, arg, next)
{
	var ob={'intersect':{[by]:arg}};

	!ob.intersect.post_status ? ob.intersect.post_status='any' : 0;

	this.get_posts(ob, next);
}

/* ~~~~~~~~~~~~~~~~Core post processor functions~~~~~~~~~~~~~~~~ */
module.exports.get_posts=function(nr_condition, get_p_n)
{
	var hlpr				= require('./helper.njs');

	// Invoke hook so they can modify query object
	hlpr.before_get_posts(this, nr_condition, function($, query, bummer_next)
	{
		// Set defaults
		typeof nr_condition!=='object' ? nr_condition={} : 0;
		var paginator_call 		= nr_condition.paginator_call==true;
		var paginator_singular	= paginator_call && nr_condition.pagination && nr_condition.pagination.is_singular;
	
		// If it is pagination call for single post, then query only one column and remove post_name, post_id from object.
		if(paginator_singular)
		{
			nr_condition.columns=[nr_db_config.tb_prefix+'posts.post_id'];
			nr_condition.intersect.post_name.values=[];
			nr_condition.intersect.post_id.values=[];
		}

		// Combine defaults and modified query (by hook)
		nr_condition			= hlpr.nr_set_default_post_condition(nr_condition);
		nr_condition			= hlpr.nr_fill_post_cond(nr_condition, query);
		
		// Process condition and set utility parameters like page, limit etc.
		var prcd_condition		= hlpr.nr_condition_processor(query, nr_condition);
		var args				= prcd_condition.args;
		var where_clause		= prcd_condition.clause;
		var left_offset			= 0;
		var limit				= '';

		// Set default offset and limit if it is not paginator call or not singular post pagination
		if(!paginator_call || !paginator_singular)
		{
			left_offset			= Math.floor(args.pagination.total/2);
			limit				= args.posts_per_page>=0 ? ' LIMIT '+args.posts_per_page : '';
		}
		
		if(paginator_call==true)
		{
			args.current_page	= args.page>=1 ? args.page : 1;
			args.page			= args.page-left_offset;

			// Set pagination limit only if it is not single pagination. 
			// It's not possible to trace single post position using limit and offset. 
			// Because it's a matter of taxonomy/term classification.
			// So no way other than fetching all post and trace position.
			if(!paginator_singular)
			{
				var lim				= args.posts_per_page*args.pagination.total;
				lim>=0 ? limit		= ' LIMIT '+lim : 0;
			}
		}

		args.page<1 			? args.page=1 : 0;
		var offset				= (limit!=='' && args.posts_per_page>=0) ? ' OFFSET '+(args.posts_per_page*(args.page-1)) : '';
		var orderby				= ' ORDER BY '+args.orderby;
		var order				= ' '+args.order+' ';
		

		/* ~~~~~~~~~~~~~~~~~~~Now create sql from args~~~~~~~~~~~~~~~~~~~ */

		/* Define table name using prefix */
		var posts=nr_db_config.tb_prefix+'posts';
		var postmeta=nr_db_config.tb_prefix+'postmeta';
		var terms=nr_db_config.tb_prefix+'terms';
		var termmeta=nr_db_config.tb_prefix+'termmeta';
		var term_rel=nr_db_config.tb_prefix+'term_relationships';
		var users=nr_db_config.tb_prefix+'users';

		/* Step 1: Add columns */
		var sql='SELECT DISTINCT '+args.columns.join(',');
		
		/* Step 2: Add tables, with join. */
		sql=sql+' FROM '+posts+' \
				LEFT JOIN '+users+' ON '+posts+'.owner_user_id='+users+'.user_id \
				LEFT JOIN '+postmeta+' ON '+posts+'.post_id='+postmeta+'.owner_post_id \
				LEFT JOIN '+term_rel+' ON '+posts+'.post_id='+term_rel+'.owner_post_id \
				LEFT JOIN '+terms+' ON '+term_rel+'.owner_term_id='+terms+'.term_id \
				LEFT JOIN '+termmeta+' ON '+terms+'.term_id='+termmeta+'.owner_term_id ';
		
		/* Step 3: Add WHERE clause. */
		var clause_parent=[];
		where_clause.intersect.length>0 	? clause_parent.push('('+where_clause.intersect.join(' AND ')+')')	: 0;
		where_clause.exclude.length>0 		? clause_parent.push('('+where_clause.exclude.join(' AND ')+')')	: 0;
		where_clause.unite.length>0 		? clause_parent.push('('+where_clause.unite.join(' OR ')+')') 		: 0;
		
		/* Step 4: Determine if where clause need. */
		var where_word=clause_parent.length>0 ? ' WHERE ' : '';
		
		/* Step 5: Create final SQL command */
		sql = sql + where_word + clause_parent.join(' AND ') + orderby + order + limit + offset;
		
		// console.log('________________sql________________');
		// console.log(sql);
		// return;

		nr_db_pool.query(sql,function(e,result)
		{
			if(e)
			{
				get_p_n($, result, e);
				return;
			}

			if(paginator_call==true)
			{
				get_p_n($, {'posts':result, 'args':args}, e);
				return;
			}
			
			var all_post_id=[];
			
			/* Loop through all posts and process */
			for(var i=0; i<result.length; i++)
			{
				/* Gather all post id to get meta by IDs */
				all_post_id.push(result[i].post_id);
				
				/* Process excerpt */
				if(!result[i].post_excerpt || /\S+/.test(result[i].post_excerpt)==false)
				{
					result[i].post_excerpt=node_modules['html-to-text'].fromString(result[i].post_content, {wordwrap: 130});
				}
				
				result[i].post_meta={};
				
				/* Set attachment id if it attachment post */
				result[i].post_type=='attachment' ? result[i].post_content=nr_render_attachment(result[i]) : 0;
			}
			
			// get post meta
			$.get_post_meta(all_post_id, false, false, function($, mts)
			{
				// assign meta to post
				result=hlpr.meta_processor(mts, 'owner_post_id', 'post_id', 'post_meta', result);

				// Include post media url
				$.include_post_media(result, function($, content)
				{
					// pass to callback
					get_p_n($, content, e);
				});
			});
		});
	});
}

module.exports.insert_post=function(fields, save_post_callback)
{
	if(!this.is_user_logged_in())
	{
		save_post_callback ? save_post_callback(this, false) : 0;
		return;
	}

	/* Generate columns and values */
	var cols				= {};
	cols.post_id			= fields.post_id 			|| 0;
	cols.owner_user_id		= fields.user_id 			|| this.get_current_user_id();
	cols.post_title			= fields.post_title 		|| '';
	cols.post_content		= fields.post_content		|| '';
	cols.post_excerpt		= fields.post_excerpt		|| '';
	cols.post_parent		= fields.post_parent 		|| 0;
	cols.post_type			= fields.post_type			|| 'post';
	cols.comment_status		= fields.comment_status		|| 0;

	fields.post_date		? cols.post_date			= fields.post_date			: 0;
	fields.post_modified	? cols.post_modified		= fields.post_modified		: 0;
	fields.post_name		? cols.post_name			= fields.post_name			: 0;
	fields.virtual_path 	? cols.virtual_path			= fields.virtual_path 		: 0;
	fields.real_path 		? cols.real_path			= fields.real_path 			: 0;
	fields.post_status 		? cols.post_status			= fields.post_status 		: 0;
	fields.mime_type 		? cols.mime_type			= fields.mime_type	 		: 0;
	
	/* Determine post action based on post id */
	var post_action 		= (cols.post_id && cols.post_id>0)	? 'update' 			: 'create';
	
	/* Firstly get the slug and then save/update */
	var pdt=
	{
		post_name:cols.post_name,
		post_id:cols.post_id
	}

	// firstly get available unique slug
	this.get_available_slug(pdt, function($, slug)
	{
		cols.post_name=slug;
		cols.post_content=$.exclude_post_media(cols.post_content,cols.post_type);
		
		if(post_action=='create')
		{
			// generate sql
			var columns=[];
			var values=[];
			for(var k in cols)
			{
				columns.push(k);
				values.push(nr_db_pool.escape(cols[k]));
			}
			var q='INSERT INTO '+nr_db_config.tb_prefix+'posts ('+columns.join(',')+') VALUES ('+values.join(',')+')';
			
			// run db query
			nr_db_pool.query(q, function(e, r)
			{
				var id=(r && r.insertId) ? r.insertId : false;

				if(!id)
				{
					save_post_callback($, id);
					return;
				}

				// Invoke insert post hook
				$.do_action('insert_post', id, function($, p, next)
				{
					save_post_callback($, id);
				});
			});
		}
		else if(post_action=='update')
		{
			// generate sql
			var values=[];
			for(var k in cols)
			{
				if(k!=='user_id')
				{
					values.push(k+'='+nr_db_pool.escape(cols[k]));
				}
			}
			var q='UPDATE '+nr_db_config.tb_prefix+'posts SET '+values.join(', ')+' WHERE post_id='+fields.post_id;

			// Run db query
			nr_db_pool.query(q, function(e, r)
			{
				// Invoke insert post hook
				$.do_action('insert_post', fields.post_id, function($, i, n)
				{
					save_post_callback($, (r ? fields.post_id : false));
				});
			});
		}
	});
}

module.exports.get_edit_post_link=function(id, post_type)
{
	return '/nr-admin/post_type_'+post_type+'/edit/'+id;
}

module.exports.get_the_post_thumbnail_url=function(id, callback)
{
	this.get_post_meta(id, 'featured_image', false, function($, meta)
	{
		var attachment=meta.meta_value;

		if(!attachment)
		{
			callback($, '');
			return;
		}

		$.get_attachment_url(attachment, function($, url)
		{
			callback($, (url || ''));
		});
	});
}

module.exports.get_available_slug=function(fields, get_slug_call_back)
{
	!fields.post_id ? fields.post_id=0 : 0;
	
	var s=fields.post_name;
	
	s ? s=s.trim().replace(/\s/g,'-').replace(/[\/\\\:\*\^]/g,'').toLowerCase() : 0;
	
	(!s || /\S+/.test(s)==false) ? s = 'untitled' : 0;
	
	s=s.trim();
	var num=2;

	function get_slug_inner($, s, get_slug_call_back)
	{
		var q='SELECT post_id FROM '+nr_db_config.tb_prefix+'posts WHERE post_name='+nr_db_pool.escape(s)+' AND post_id!="'+fields.post_id+'"';
		
		nr_db_pool.query(q, function(e,r)
		{
			if(!e && /\S+/.test(s)==true)
			{
				if(r.length==0)
				{
					/* If no post is created with this slug then make it. */
					get_slug_call_back($, s);
				}
				else
				{
					if(num>2)
					{
						s=s.split('-');
						s.pop();
						s=s.join('-');
					}
					num++;
					get_slug_inner($,s+'-'+(num-1),get_slug_call_back);
				}
			}
		});
	}
	
	get_slug_inner(this, s, get_slug_call_back);
}

module.exports.delete_post=function(post_id, d_next)
{
	var post_ids=get_array(post_id);
	
	// Delete post
	var del_p=($, next)=>
	{
		var ignore_attachment=$.delete_attachment_post_too==true ? '' : ' AND post_type!="attachment"';

		var q='DELETE FROM '+nr_db_config.tb_prefix+'posts WHERE post_id IN ('+post_ids.join(',')+')'+ignore_attachment;
		
		nr_db_pool.query(q, (e,r)=>
		{
			next($);
		});
	}

	// Delete post term relation link
	var del_rel=($, next)=>
	{
		var q='DELETE FROM '+nr_db_config.tb_prefix+'term_relationships WHERE owner_post_id IN ('+post_ids.join(',')+')';
		
		nr_db_pool.query(q,(e,r)=>
		{
			next($);
		});
	}

	// Invoke before delete post hook
	this.do_action('before_delete_post', post_ids, function($, ids, bummer)
	{
		// Delete post meta and execute functions above
		$.delete_post_meta(post_ids, true, function($)
		{
			// Delete term relation
			del_rel($, function($)
			{
				// delete 
				del_p($, function($)
				{
					// Invoke after delete hook
					$.do_action('delete_post', post_ids, function($, id, nxt)
					{
						// Call delete callback
						d_next($);
					});
				});
			});
		});
	});
}

module.exports.register_post_type=function(ob)
{
	var id=ob.id;

	if(id && !this.registered_post_types[id])
	{
		this.registered_post_types[id]=ob;
	}
}

module.exports.register_custom_template=function(ob)
{
	if(typeof ob=='object' && ob.title && ob.component && ob.package)
	{
		var n_type=parse_node_type(ob.package);
		delete ob.package;
		
		if(n_type)
		{
			ob.nr_package=n_type.nr_package;
			this.nr_custom_templates[ob.component]=ob.title;
		}
	}
}