/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Renderer functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
global.get_post_types=function($, condition)
{
	var resp={};

	var pts=$.registered_post_types;

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

module.exports.get_post_by=function(by, arg, next)
{
	this.get_posts({'intersect':{[by]:arg}}, next);
}

/* ~~~~~~~~~~~~~~~~Core post processor functions~~~~~~~~~~~~~~~~ */
module.exports.get_posts=function(nr_condition,get_p_n)
{
	/* Get query object, that will come through registered hooks too. [Oh god! what a complicated function. Need refactoring.] */
	pre_get_posts(this, nr_condition, function($)
	{
		typeof nr_condition!=='object' ? nr_condition={} : 0;

		var paginator_call 		= nr_condition.paginator_call==true;
		
		nr_condition			= nr_set_default_post_condition(nr_condition);


		nr_condition			= nr_fill_post_cond(nr_condition, $.query);
		
		var processed_condition	= nr_condition_processor($.query, nr_condition);

		var args				= processed_condition.args;
		var where_clause		= processed_condition.clause;
		var left_offset			= Math.floor(args.pagination.total/2);
		var limit				= args.posts_per_page>=0 ? ' LIMIT '+args.posts_per_page : '';
		
		if(paginator_call==true)
		{
			args.current_page	= args.page>=1 ? args.page : 1;
			args.page			= args.page-left_offset;

			var lim				= args.posts_per_page*args.pagination.total;
			lim>=0 ? limit		= ' LIMIT '+lim : 0;
		}

		args.page<1 			? args.page=1 : 0;
		var offset				= args.posts_per_page>=0 ? ' OFFSET '+(args.posts_per_page*(args.page-1)) : '';
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
		var f=[];
		for(var i=0; i<args.columns.length; i++)
		{
			f.push(args.columns[i]);
		}

		var sql='SELECT DISTINCT '+f.join(',');
		
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
		
		/* Step 6: Create final SQL command */
		sql = sql + where_word + clause_parent.join(' AND ') + orderby + order + limit + offset;
		
		// console.log('________________sql________________');
		// console.log(sql);
		
		// return;

		$.nr_db.query(sql,function(e,result)
		{
			if(e)
			{
				get_p_n($, result);
				return;
			}

			if(paginator_call==true)
			{
				get_p_n($, {'posts':result, 'args':args});
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
			
			/* Now run multiple helper functions to process other things one after another through series function */
			var stack=	
			[
				[get_post_meta, all_post_id, false, false], 
				[($,r,res,nxt)=>{meta_processor($, r, res, nxt);}, result], 
				include_post_media,
				($,content,next)=>{get_p_n($, content)}
			];
					
			$.series_fire( stack);
		});
	});
}

module.exports.nr_insert_post=function(fields, save_post_callback)
{
	if(!is_user_logged_in(this))
	{
		save_post_callback ? save_post_callback(this, false) : 0;
		return;
	}

	/* Generate columns and values */
	var cols				= {};
	cols.post_id			= fields.post_id 			? fields.post_id			: 0;
	cols.owner_user_id		= fields.user_id 			? fields.user_id 			: get_current_user_id(this);
	cols.post_title			= fields.post_title 		? fields.post_title 		: '';
	cols.post_content		= fields.post_content		? fields.post_content		: '';
	cols.post_excerpt		= fields.post_excerpt		? fields.post_excerpt		: '';
	cols.post_parent		= fields.post_parent 		? fields.post_parent		: 0;
	cols.post_type			= fields.post_type			? fields.post_type			: 'post';
	cols.comment_status		= fields.comment_status		? fields.comment_status		: 0;
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
	get_available_slug(this, {post_name:cols.post_name,post_id:cols.post_id}, function($,slug)
	{
		cols.post_name=slug;
		cols.post_content=exclude_post_media(cols.post_content,cols.post_type);
		
		if(post_action=='create')
		{
			var columns=[];
			var values=[];

			for(var k in cols)
			{
				columns.push(k);
				values.push($.nr_db.escape(cols[k]));
			}
			
			var q='INSERT INTO '+nr_db_config.tb_prefix+'posts ('+columns.join(',')+') VALUES ('+values.join(',')+')';
			$.nr_db.query(q, function(e,r)
			{
				var id=(r && r.insertId) ? r.insertId : false;

				save_post_callback($, id);
			});
		}
		else if(post_action=='update')
		{
			var values=[];
			for(var k in cols)
			{
				if(k!=='user_id')
				{
					values.push(k+'='+$.nr_db.escape(cols[k]));
				}
			}
			
			var q='UPDATE '+nr_db_config.tb_prefix+'posts SET '+values.join(', ')+' WHERE post_id='+fields.post_id;

			$.nr_db.query(q, function(e, r)
			{
				save_post_callback($, (r ? fields.post_id : false));
			});
		}
	});
}

global.get_edit_post_link=function(id, post_type)
{
	return '/nr-admin/post_type_'+post_type+'/edit/'+id;
}

global.get_available_slug=function($,fields,get_slug_call_back)
{
	!fields.post_id ? fields.post_id=0 : 0;
	
	s=fields.post_name;
	
	s ? s=s.trim().replace(/\s/g,'-').replace(/[\/\\\:\*\^]/g,'').toLowerCase() : 0;
	
	(!s || /\S+/.test(s)==false) ? s = 'untitled' : 0;
	
	s=s.trim();
	num=2;
	function get_slug_inner($,s,get_slug_call_back)
	{
		$.nr_db.query
		(
			'SELECT post_id FROM '+nr_db_config.tb_prefix+'posts WHERE post_name='+$.nr_db.escape(s)+' AND post_id!="'+fields.post_id+'"',
			function(e,r)
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
			}
		);
	}
	
	get_slug_inner($,s,get_slug_call_back);
}

global.nr_delete_post=function($, post_id, next)
{
	var post_ids=get_array(post_id);
	
	var del_p=($, post_id, next)=>
	{
		var ignore_attachment=$.delete_attachment_post_too==true ? '' : ' AND post_type!="attachment"';

		var q='DELETE FROM '+nr_db_config.tb_prefix+'posts WHERE post_id IN ('+post_id+')'+ignore_attachment;
		
		$.nr_db.query(q,(e,r)=>
		{
			next($);
		});
	}

	var del_rel=($, next)=>
	{
		var q='DELETE FROM '+nr_db_config.tb_prefix+'term_relationships WHERE owner_post_id IN ('+post_ids.join(',')+')';
		
		$.nr_db.query(q,(e,r)=>
		{
			next($);
		});
	}

	var funcs=
	[
		[delete_post_meta, post_ids, false], //Delete post meta firstly
		del_rel,
		[del_p, post_ids], // Then delete post content
		next
	];

	$.series_fire( funcs);
}

module.exports.register_post_type=function(ob)
{
	var id=ob.id;

	if(id && !this.registered_post_types[id])
	{
		this.registered_post_types[id]=ob;
	}
}

global.register_custom_template=function($, ob)
{
	if(typeof ob=='object' && ob.title && ob.component && ob.package)
	{
		var n_type=parse_node_type(ob.package);
		delete ob.package;
		
		if(!n_type){return $;}

		ob.node_type=n_type.node_type;
		ob.nr_package=n_type.nr_package;

		$.nr_custom_templates[ob.component]=ob.title;
	}

	return $;
}