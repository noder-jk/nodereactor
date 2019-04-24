global.nr_set_default_post_condition=function(nr_cond)
{
	/* Set default values to nr_cond for different object */
	var join=['intersect', 'unite', 'exclude'];

	var ex=false;
	for(var n=0; n<join.length; n++)
	{
		(nr_cond[join[n]] && nr_cond[join[n]].post_status) ? ex=true : 0;
	}
	
	if(!ex)
	{
		!nr_cond.intersect ? nr_cond.intersect={} : 0;
		nr_cond.intersect.post_status='publish';
	}
	
	return nr_cond;
}

global.nr_fill_post_cond=function(nr_cond, args)
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

const get_commons=function()
{
	/* Define table name using prefix */
	var posts			=	nr_db_config.tb_prefix+'posts';
	var users			=	nr_db_config.tb_prefix+'users';
	
	/* Some Default Values */
	var per_page		=	bloginfo($, 'posts_per_page', 10);

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
								users+'.user_login',
								users+'.display_name',
								users+'.user_email',
								users+'.user_registered',
								users+'.user_status',
								users+'.user_role',
								'UNIX_TIMESTAMP('+users+'.user_registered) AS user_registered_unix'
							],
		'pagination'	:	{
								'total'	: default_pagination
							}
	};

	return query_object;
}

global.pre_get_posts=function($, condition, callback)
{
	var commons=get_commons();
	
	/* Set search keyword */
	if(condition && typeof condition=='object')
	{
		if(condition.keyword && typeof condition.keyword=='string')
		{
			commons.unite.post_title	=	{values:['%'+condition.keyword+'%'], operator:'LIKE'};
			commons.unite.post_content	=	{values:['%'+condition.keyword+'%'], operator:'LIKE'};
			commons.unite.post_excerpt	=	{values:['%'+condition.keyword+'%'], operator:'LIKE'};
		}

		if(condition.page)
		{
			commons.page=condition.page;
		}
	}

	$.query=commons;

	do_action($, 'pre_get_posts', callback);
}

global.nr_condition_processor=function(args,condition)
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
					case 'total' 	: 	condition[key][column]=get_int(condition[key][column],default_pagination);
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
					case 'comment_status':	var c=get_sql_clauses(condition[key][column], key, column, posts);
											clause[key]=clause[key].concat(c.clause);
											condition[key][column]=c.column;
											break;

					case 'meta_key'		:	
					case 'meta_value'	:	var c=get_sql_clauses(condition[key][column], key, column, meta);
											clause[key]=clause[key].concat(c.clause);
											condition[key][column]=c.column;
											break;

					case 'term_name'	: 
					case 'term_parent'	: 
					case 'term_taxonomy':
					case 'term_slug'	:
					case 'term_id'		:
					case 'term_description':column_n=column;
											column_n!=='term_id' ? column_n=column_n.replace('term_', '') : 0;
											var c=get_sql_clauses(condition[key][column], key, column_n, terms);
											clause[key]=clause[key].concat(c.clause);
											condition[key][column]=c.column;
											break;

					case 'term_meta_key':	
					case 'term_meta_value':	column_n=column;
											column_n=column_n.replace('term_', '');
											var c=get_sql_clauses(condition[key][column], key, column_n, term_meta);
											clause[key]=clause[key].concat(c.clause);
											condition[key][column]=c.column;
											break;

					case 'user_id'		:	
					case 'user_login'	:
					case 'display_name'	:
					case 'user_email'	:
					case 'user_status'	:
					case 'user_role'	:	var c=get_sql_clauses(condition[key][column], key, column, users);
											clause[key]=clause[key].concat(c.clause);
											condition[key][column]=c.column;
											break;
				}
			}
		}
		
		args[key]!==undefined ? args[key]=condition[key] : 0;
	}

	return {'args':args, 'clause':clause};
}