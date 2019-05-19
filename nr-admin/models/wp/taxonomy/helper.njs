const get_commons=function($)
{
	/* Define table name using prefix */
	var terms			=	nr_db_config.tb_prefix+'terms';
	
	var common_fields=	
	{
		'term_id'       : 	{'values':[],'operator':'IN'},
		'name'          : 	{'values':[],'operator':'IN'},
		'description'	:	{'values':[],'operator':'IN'},
		'parent'        : 	{'values':[],'operator':'IN'},
		'slug'          : 	{'values':[],'operator':'IN'},
        'taxonomy'      : 	{'values':[],'operator':'IN'},
        'meta_key'      :   {'values':[],'operator':'IN'},
        'meta_value'    :   {'values':[],'operator':'IN'}
	};
	
	/* Default fields and arguments */
	var query_object=
	{
		'intersect'		:	node_modules.deepcopy(common_fields),
		'unite'			:	node_modules.deepcopy(common_fields),
		'exclude'		:	node_modules.deepcopy(common_fields),

		'orderby'       : 	terms+'.term_id',
		'order'         : 	'DESC'
	};

	return query_object;
}


global.pre_get_terms=function($, callback)
{
	var commons=get_commons($);
	
	$.query=commons;

	$.do_action('pre_get_terms', callback);
}

module.exports.nr_fill_term_cond=function(nr_cond, args)
{
	/* Loop through all hook and pre_get provided params, and fill the condition */
	for(var k in args)
	{
		/* Store the first level value to condition, if not exist already. */
		nr_cond[k] ? 0 : nr_cond[k]=args[k];

		if(typeof args[k]=='object')
		{
			/* Set second level keys etc */
			for(var k2 in args[k])
			{
				nr_cond[k][k2] ? 0 : nr_cond[k][k2]=args[k][k2];
			}
		}
	}

	return nr_cond;
}

module.exports.nr_term_condition_processor=function(args,condition)
{
	/* Define table name using prefix */
	var pst=nr_db_config.tb_prefix+'posts';
	var terms=nr_db_config.tb_prefix+'terms';
	var mets=nr_db_config.tb_prefix+'termmeta';
	
	var clause={'intersect':[],'unite':[], 'exclude':[]};

	/* Generate conditions for where clauses. */
	for(var key in condition)
	{
		switch(key)
		{				
			case 'orderby'		:
			case 'order'		:   condition[key]=condition[key];
									break;
			
			case 'intersect'	:
			case 'unite'		:
			case 'exclude'		: 	for(var column in condition[key])
			{
				switch(column)
				{
                    case 'term_id'      :
                    case 'name'         :
                    case 'description'  :
                    case 'parent'       :
                    case 'slug'         :
                    case 'taxonomy'     :   var c=get_sql_clauses(condition[key][column], key, column, terms);
											clause[key]=clause[key].concat(c.clause);
											condition[key][column]=c.column;
											break;
											
                    case 'post_id'     :   	var c=get_sql_clauses(condition[key][column], key, column, pst);
											clause[key]=clause[key].concat(c.clause);
											condition[key][column]=c.column;
                                            break;
                                            
                    case 'meta_key'     :
                    case 'meta_value'   :	var c=get_sql_clauses(condition[key][column], key, column, mets);
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