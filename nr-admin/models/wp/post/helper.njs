module.exports.nr_set_default_post_condition=function(nr_cond)
{
	/* Set default values to nr_cond for different object */
	var join=['intersect', 'unite', 'exclude'];

	var ex=false;
	// Loop through all type of set
	for(var n=0; n<join.length; n++)
	{
		if(nr_cond[join[n]] && nr_cond[join[n]].post_status)
		{
			var st=nr_cond[join[n]].post_status;

			if(typeof st=='string' && st.toLocaleLowerCase()=='any')
			{
				delete nr_cond[join[n]].post_status;
			}

			ex=true;
		}
	}
	
	// Set at least intersection, if not exist any set
	if(!ex)
	{
		!nr_cond.intersect ? nr_cond.intersect={} : 0;
		nr_cond.intersect.post_status='publish';
	}
	
	return nr_cond;
}

module.exports.nr_fill_post_cond=function(nr_cond, args)
{
	/* Loop through intersect, unite, exclude */
	for(var k in args)
	{
		/* Store the first level value to condition, if not exist already. */
		nr_cond[k] ? 0 : nr_cond[k]=args[k];

		if(typeof args[k]=='object' && !Array.isArray(args[k]))
		{
			/* Loop through table columns */
			for(var k2 in args[k])
			{
				nr_cond[k][k2] ? 0 : nr_cond[k][k2]=args[k][k2];
			}
		}
	}
	
	return nr_cond;
}

const get_commons=function($)
{
	/* Define table name using prefix */
	var posts			=	nr_db_config.tb_prefix+'posts';
	var users			=	nr_db_config.tb_prefix+'users';
	
	/* Some Default Values */
	var per_page		=	$.bloginfo( 'posts_per_page') || 10;

	var page_offset		=	0;

	var common_fields=	
	{
		'post_id'       : 	{'values':[],'operator':'IN'},
		'post_type'     : 	{'values':[],'operator':'IN'},
		'post_name'		:	{'values':[],'operator':'IN'},
		'post_parent'   : 	{'values':[],'operator':'IN'},
		'post_status'   : 	{'values':[],'operator':'IN'},
		'post_title'    : 	{'values':[],'operator':'IN'},
		'post_content'  : 	{'values':[],'operator':'IN'},
		'post_excerpt'  : 	{'values':[],'operator':'IN'},
		'post_date'  	: 	{'values':[],'operator':'IN'},
		'post_modified' : 	{'values':[],'operator':'IN'},
		'real_path'		: 	{'values':[],'operator':'IN'},
		'virtual_path'	: 	{'values':[],'operator':'IN'},
		'mime_type'		: 	{'values':[],'operator':'IN'},
		'comment_status':	{'values':[],'operator':'IN'},

		'meta_key'		:	{'values':[],'operator':'IN'},
		'meta_value'	:	{'values':[],'operator':'IN'},

		'term_name'		: 	{'values':[],'operator':'IN'},
		'term_parent'	: 	{'values':[],'operator':'IN'},
		'term_taxonomy'	:	{'values':[],'operator':'IN'},
		'term_slug'		:	{'values':[],'operator':'IN'},
		'term_id'		:	{'values':[],'operator':'IN'},
		'term_description':	{'values':[],'operator':'IN'},

		'term_meta_key':	{'values':[],'operator':'IN'},
		'term_meta_value':	{'values':[],'operator':'IN'},

		'user_id'		:	{'values':[],'operator':'IN'},
		'user_login'	:	{'values':[],'operator':'IN'},
		'display_name'	:	{'values':[],'operator':'IN'},
		'user_email'	:	{'values':[],'operator':'IN'},
		'user_status'	:	{'values':[],'operator':'IN'},
		'user_role'		:	{'values':[],'operator':'IN'}
	};
	
	/* Default fields and arguments */
	var query_object=
	{
		'intersect'		:	node_modules.deepcopy(common_fields),
		'unite'			:	node_modules.deepcopy(common_fields),
		'exclude'		:	node_modules.deepcopy(common_fields),

		'posts_per_page': 	per_page,
		'page'          : 	page_offset,
		'orderby'       : 	posts+'.post_date',
		'order'         : 	'DESC',

		'columns'       : 	[
								posts+'.*',
								users+'.user_id',
								'UNIX_TIMESTAMP('+users+'.user_registered) AS user_registered_unix'
							],
		'pagination'	:	{
								'total'	: 7,
								'is_singular':false
							}
	};

	return query_object;
}

module.exports.before_get_posts=function($, condition, callback)
{
	var commons=get_commons($);
	
	/* Set search keyword */
	if(condition && typeof condition=='object')
	{
		if(condition.keyword && typeof condition.keyword=='string')
		{
			commons.unite.post_title	=	{values:['%'+condition.keyword+'%'], operator:'LIKE'};
			commons.unite.post_content	=	{values:['%'+condition.keyword+'%'], operator:'LIKE'};
			commons.unite.post_excerpt	=	{values:['%'+condition.keyword+'%'], operator:'LIKE'};
		}

		condition.page ? commons.page=condition.page : 0;
	}

	$.do_action('before_get_posts', commons, callback);
}

module.exports.nr_condition_processor=function(args,condition)
{
	/* Define table name using prefix */
	var posts=nr_db_config.tb_prefix+'posts';
	var meta=nr_db_config.tb_prefix+'postmeta';
	var terms=nr_db_config.tb_prefix+'terms';
	var term_meta=nr_db_config.tb_prefix+'termmeta';
	var users=nr_db_config.tb_prefix+'users';
	
	var clause={'intersect':[],'unite':[], 'exclude':[]};

	/* Generate conditions for where clauses. */
	for(var key in condition)
	{
		switch(key)
		{
			case 'pagination'	: 	for(var column in condition[key])
			{
				switch(column)
				{
					case 'total' 	: 	condition[key][column]=get_int(condition[key][column], 7);
										break;
				}
			}
			break;

			case 'columns'		:	condition[key]=get_array(condition[key]);
									break;
									
			case 'orderby'		:
			case 'offset'		:
			case 'order'		:
			case 'posts_per_page':	condition[key]=condition[key];
									break;
			
			case 'intersect'	:
			case 'unite'		:
			case 'exclude'		: 	for(var column in condition[key])
			{
				var last_p;

				switch(column)
				{
					case 'post_id'      :
					case 'post_type'    :
					case 'post_name'	:
					case 'post_parent'  :
					case 'post_status'  :
					case 'post_title'   :
					case 'post_content' :
					case 'post_excerpt' :
					case 'post_date'  	:
					case 'post_modified':
					case 'real_path'	:
					case 'virtual_path'	:
					case 'mime_type'	:
					case 'comment_status':	last_p=[column, posts]; break;

					case 'meta_key'		:	
					case 'meta_value'	:	last_p=[column, meta]; break;

					case 'term_name'	: 
					case 'term_parent'	: 
					case 'term_taxonomy':
					case 'term_slug'	:
					case 'term_id'		:
					case 'term_description':column_n=column;
											column_n!=='term_id' ? column_n=column_n.replace('term_', '') : 0;
											last_p=[column_n, terms];
											break;

					case 'term_meta_key':	
					case 'term_meta_value':	column_n=column;
											column_n=column_n.replace('term_', '');
											last_p=[column_n, term_meta];
											break;

					case 'user_id'		:	
					case 'user_login'	:
					case 'display_name'	:
					case 'user_email'	:
					case 'user_status'	:
					case 'user_role'	:	last_p=[column, users]; break;
				}

				if(last_p)
				{
					var c=module.exports.get_sql_clauses(condition[key][column], key, last_p[0], last_p[1]);
					clause[key]=clause[key].concat(c.clause);
					condition[key][column]=c.column;
				}
			}
		}
		
		args[key]!==undefined ? args[key]=condition[key] : 0;
	}

	return {'args':args, 'clause':clause};
}

const get_sql_operator=function(conditions)
{
	if(typeof conditions=='object' && !Array.isArray(conditions))
    {
        /* If it is object (not array), then get it's operator, or set default operator (IN or LIKE). */
        typeof conditions.operator=='string' ? conditions.operator=conditions.operator.trim().toUpperCase() : 0;
        
        var opr=conditions.operator;
        (opr!=='LIKE' && opr!=='COMPARE') ? conditions.operator='IN' : 0;    // set operator
        conditions.values	=conditions.values ? get_array(conditions.values) : []; // set values
    }
    else
    {
        conditions={'operator':'IN', 'values':get_array(conditions)};
    }
    
	return conditions;
}

module.exports.get_sql_clauses=function(column, key, column_name, table)
{
	var w_clause=[];

	column=get_sql_operator(column);

    if(column.values.length>0)
    {
        /* At first append and prepend double quotes as it is string. */
        if(column.operator!=='COMPARE')
        {
            for(var i=0; i<column.values.length; i++)
            {
                column.values[i]='"'+trim(column.values[i],'"')+'"';
            }
        }
        
        var join_by=key=='unite' ? ' OR ' : ' AND ';
        
        /* Now add values to corresponding key. */
        if(column.operator=='IN')
        {
            /* If it is IN operator */
            w_clause.push(table+'.'+column_name+' '+(key=='exclude' ? 'NOT' : '')+' IN ('+column.values.join(',')+')');
        }
        else if(column.operator=='LIKE')
        {
            var likes=[];
            for(var num=0; num<column.values.length; num++)
            {
                likes.push(table+'.'+column_name+' '+(key=='exclude' ? 'NOT' : '')+' LIKE '+column.values[num]);
            }
            
            likes.length>0 ? w_clause.push(likes.join(join_by)) : null;
        }
        else if(column.operator=='COMPARE')
        {
            var comp=[];
            for(var num=0; num<column.values.length; num++)
            {
                var v=column.values[num];
                comp.push(table+'.'+column_name+v);
            }
            comp.length>0 ? w_clause.push(comp.join(join_by)) : null;
        }
	}
	
	return {'column':column, 'clause':w_clause}
}


module.exports.meta_processor=function (mets, owner_id, id, key, result)
{
	/* This function simply assign meta to post using post id. */
	for(var i=0; i<mets.length; i++)
	{
		for(var n=0; n<result.length; n++)
		{
			if(mets[i][owner_id]==result[n][id])
			{
				result[n][key][mets[i].meta_key]=mets[i].meta_value
			}
		}
	}
	
	return result;
}


module.exports.meta_updater=function($, table, id, owner_col, meta_ob, next)
{
	var meta			= nr_db_config.tb_prefix+table;
	var to_insert_meta	= meta_ob;

	/* update existing */
	var update_first=($, u_next)=>
	{
		// arrange getter query
		var meta_key=Object.keys(meta_ob).map(key=>nr_db_pool.escape(key)).join(',');
		var q='SELECT meta_key FROM '+meta+' WHERE '+owner_col+'='+id+' AND meta_key IN ('+meta_key+')';

		nr_db_pool.query(q, function(e, r)
		{
			(e || !r) ? r=[] : 0;
			r=r.map(mt=>mt.meta_key);

			// Now update existing meta
			var funcs=[];

			for(var k in meta_ob)
			{
				// Check if already exist
				if(r.indexOf(k)==-1){continue;}

				// generate key, value
				var key=nr_db_pool.escape(k);

				typeof meta_ob[k]=='object' ? meta_ob[k]=JSON.stringify(meta_ob[k]) : 0;
				var value=nr_db_pool.escape(meta_ob[k]);

				// As long as exist, and gonna be updated.
				delete to_insert_meta[k];

				// Now create updater function and add to series array
				funcs.push([function($, key, value, next)
				{
					var q='UPDATE '+meta+' SET meta_value='+value+' WHERE '+owner_col+'='+id+' AND meta_key='+key;

					nr_db_pool.query(q, function(e, r)
					{
						next($);
					});

				}, key, value]);
			}

			// Append the next method
			funcs.push(u_next);
			
			// Finally invoke in series mode
			$.series_fire(funcs);
		});
	}

	var insert_now=($, next)=>
	{
		var insert=Object.keys(to_insert_meta).map(key=>
		{
			var k=nr_db_pool.escape(key);
			var v=to_insert_meta[key];

			typeof v=='object' ? v=JSON.stringify(v) : 0;
			v=nr_db_pool.escape(v.toString());

			return '('+id+', '+k+', '+v+')';
		});

		var q='INSERT INTO '+meta+' ('+owner_col+', meta_key, meta_value) VALUES '+insert.join(',');

		nr_db_pool.query(q, function(e,r)
		{
			next($);
		});
	}

	update_first($, function($)
	{
		insert_now($, function($)
		{
			next($);
		});
	});
}
