module.exports.register_taxonomy=function(ob)
{
    if(ob.taxonomy && ob.title)
    {
        this.nr_registered_taxonomies[ob.taxonomy]=ob;
    }
}

module.exports.use_taxonomy=function(ob)
{
    if(!ob.post_type || !ob.taxonomy){return;}

	var tx=get_array(ob.taxonomy);
	var pt=get_array(ob.post_type); 

	/* Loop through all provided post types */
	for(var n=0; n<pt.length; n++)
	{
		/* Create array in register list if not exist already. */
		if(!this.registered_taxonomies_to_post[pt[n]])
		{
			this.registered_taxonomies_to_post[pt[n]]=[];
		}

		/* Loop through all meta box id */
		for(var i=0; i<tx.length; i++)
		{
			var a=tx[i];

			/* Insert the meta box id if already not inserted by other plugin or theme. */
			if(this.registered_taxonomies_to_post[pt[n]].indexOf(a)==-1)
			{
				this.registered_taxonomies_to_post[pt[n]].push(a);
			}
		}
    }
}

module.exports.delete_term=function(term_ids_ar, d_next)
{
	this.do_action('pre_delete_term', term_ids_ar, function($)
	{
		term_ids=term_ids_ar.join(',');

		// Firstly delete term meta
		var delete_meta=($, next)=>
		{
			var q='DELETE FROM '+nr_db_config.tb_prefix+'termmeta WHERE owner_term_id IN ('+term_ids+')';
			nr_db_pool.query(q, e=>{next($)});
		}

		// Then delete term+post relationship
		var delete_rel=($, next)=>
		{
			var q='DELETE FROM '+nr_db_config.tb_prefix+'term_relationships WHERE owner_term_id IN ('+term_ids+')';
			nr_db_pool.query(q, e=>{next($)});
		}

		// Now set orphan posts term parent
		var set_parent=($, next)=>
		{
			var q='UPDATE '+nr_db_config.tb_prefix+'terms SET parent=0 WHERE parent IN ('+term_ids+')';
			nr_db_pool.query(q, e=>{next($)});
		}

		// Finally delete term
		var delete_term=($, next)=>
		{
			var q='DELETE FROM '+nr_db_config.tb_prefix+'terms WHERE term_id IN ('+term_ids+')';
			nr_db_pool.query(q, e=>{next($)});
		}

		// At last invoke delete term hook
		var finalize=function ($, next)
		{
			$.do_action('delete_term', term_ids_ar, function($, id_bummer, nxt_bummer)
			{
				d_next($);
			});
		}

		$.series_fire
		([
			delete_meta, 
			delete_rel, 
			set_parent, 
			delete_term, 
			finalize
		]);
	});
}

module.exports.set_post_terms=function(post_id, term_id, taxonomy, append, next)
{
	term_id=get_array(term_id);
	term_id.push(0); // zero to avoid error if no term id assigned.

	var maiden=term_id;

    var rel=nr_db_config.tb_prefix+'term_relationships';
    var terms=nr_db_config.tb_prefix+'terms';

	/* Fetch terms except currently selected in editor */
	var exist_in='term_id NOT IN ('+term_id.join(',')+') AND';

    var common='owner_post_id='+post_id+' AND owner_term_id IN (SELECT term_id FROM '+terms+' WHERE '+exist_in+' taxonomy="'+taxonomy+'")';
    var common_ex='owner_post_id='+post_id+' AND owner_term_id IN (SELECT term_id FROM '+terms+' WHERE taxonomy="'+taxonomy+'")';

    var del_abandoned=($, next)=>
    {
		/* Delete those term relationships that are not currently selected in editor but exist in relation */
		var q='DELETE FROM '+rel+' WHERE '+common;
        nr_db_pool.query(q, function(e,r)
        {
            next($);
        });
    }

    var get_existing=($, next)=>
    {
		/* Fetch those terms that are selected in editor and already exist in relationship */
        var q='SELECT owner_term_id FROM '+rel+' WHERE '+common_ex;
        nr_db_pool.query(q, (e,r)=>
        {
            if(!e)
            {
				/* Now filter out those already exist terms. */
                r=r.map(item=>item.owner_term_id.toString());
                maiden=term_id.filter(item=>r.indexOf(item.toString())==-1);
			}
			
            next($);
        })
    }

    var add_maiden=($, next)=>
    {
		/* Now add maiden relation ships */
		maiden=maiden.filter(item=>item!==0);

        if(maiden.length>0)
        {
			var v=maiden.map(term_id_num=>'('+post_id+','+term_id_num+')');

			var q='INSERT INTO '+rel+' (owner_post_id, owner_term_id) VALUES '+v.join(',');
			
			nr_db_pool.query(q, function(e)
			{
				next($);
			});
        }
		else
		{
			next($);
		}
    }

	var funcs=[get_existing, add_maiden, next];

	append!==true ? funcs.unshift(del_abandoned) : null;

	this.series_fire(funcs);
}

module.exports.insert_term=function(args, i_next)
{
	var taxonomy	= args.taxonomy;
	var term		= args.name;
	var term_id		= args.term_id || false;
	var parent		= args.parent || 0;
	var description	= args.description || '';
	var slug		= args.slug || term;
	slug			= slug.trim().toLowerCase().replace(/\s/g, '-');

    var term_tbl=nr_db_config.tb_prefix+'terms';

	// Check if same slug is exist in same level
	var check_slug=($, next)=>
	{
		var t_id=(term_id && term_id>0) ? 'term_id!='+term_id+' AND ' : '';

		var q='SELECT term_id FROM '+term_tbl+' WHERE '+t_id+' parent='+parent+' AND taxonomy="'+taxonomy+'" AND slug="'+slug+'"';

		nr_db_pool.query(q, function(e,r)
		{
			next($, (!e && r.length>0));
		});
	}

	// Insert if not exist
	var insert_term=($, next)=>
	{
		var q='INSERT INTO '+term_tbl+' (name, slug , description, parent, taxonomy) values ("'+term+'", "'+slug+'", "'+description+'", "'+parent+'", "'+taxonomy+'")';

		nr_db_pool.query(q, (e, r)=>
		{
			if(!r || !r.insertId)
			{
				next($, false, e);
				return;
			}

			$.do_action('insert_term', r.insertId, function($, id, bummer)
			{
				next($, r.insertId, e);
			});
		});
	}

	// or update existing one
	var update_term=($, next)=>
	{
		var q='UPDATE '+term_tbl+' SET name="'+term+'", slug="'+slug+'", description="'+description+'", parent="'+parent+'" WHERE term_id='+term_id;
		
		nr_db_pool.query(q, (e, r)=>
		{
			if(!r)
			{
				next($, false, e);
				return;
			}

			$.do_action('insert_term', term_id, function($, id, bummer)
			{
				next($, term_id, !e);
			});
		});
	}

	check_slug(this, function($, exist)
	{
		if(exist)
		{
			i_next($, false, {'message':'Slug Exist'});
			return;
		}

		!term_id ? insert_term($, i_next) : update_term($, i_next);
	});
}

module.exports.get_term_link=function(by, arg, taxonomy, t_next)
{
	var perm_urls={};
	var url_base='';

	var ob={'intersect':{[by]:arg}};

	var term_structure=this.bloginfo('term_permalink') || 'tt';
	
	if(term_structure=='tt' && taxonomy)
	{
		url_base='/'+taxonomy;
		ob.intersect.taxonomy=taxonomy;
	}
	
	/* Firstly get the term that should pass url */
	this.get_terms(ob, function($, terms)
	{
		var all_tax=$.get_taxonomies();
		
		!Array.isArray(terms) ? terms=[] : 0;
		
		var funcs=[];

		terms.forEach(term=>
		{
			/* Loop through all terms to get parent. 
			I don't know how to fetch recursive data using core MySQL query. 
			Perhaps this block will be refactored in future. 
			But I don't think it's a big deal for node as usually people don't use too deep taxonomy or post hierarchy. */
			var fnc=($, term, next)=>
			{
				/* If taxonomy registrar plugin/theme get deactivated than those will be moved to non hierarchical url. Cause then it's not possible identify whether hierarchy or not. */
				var hierarchical=(all_tax[term.taxonomy] && all_tax[term.taxonomy].hierarchical==true)
				
				if(!hierarchical || term.parent==0)
				{
					perm_urls[term[by]]=url_base+'/'+term.slug;
				
					next($);

					return;
				}
				
				var hierarchy=[term.slug];

				/* Get ancestors post names through hierarchy function */
				var get_nest=(term_item)=>
				{
					$.get_terms_by('term_id', term_item.parent, function($, r)
					{
						if(Array.isArray(r) && r.length>0)
						{
							var pst=r[0];

							hierarchy.unshift(pst.slug);
							
							if(pst.parent>0)
							{
								get_nest(pst);
								return;
							}
						}
						
						/* If no mote parent found, end here */
						perm_urls[term[by]]=url_base+'/'+hierarchy.join('/');	
						
						next($);
					});
				}
				
				get_nest(term);
			}

			funcs.push([fnc, term]);
		});

		funcs.push(($, next)=>
		{
			!Array.isArray(arg) ? perm_urls=perm_urls[arg] : 0;
			t_next($, perm_urls);
		});

		$.series_fire( funcs);
	});
}

module.exports.get_terms_by=function(by, arg, next)
{
	this.get_terms({'intersect':{[by]:arg}}, next);
}

module.exports.get_term_meta=function(trm_id, meta_k, meta_v, next)
{
	term_id			= get_array(trm_id);

	var meta_key 	= meta_k 	? " AND meta_key="+nr_db_pool.escape(meta_k) : '';
	var meta_value	= meta_v	? " AND meta_value="+nr_db_pool.escape(meta_v) : "";
	
	var q="SELECT * FROM "+nr_db_config.tb_prefix+"termmeta WHERE owner_term_id IN ("+term_id.join(',')+")" + meta_key + meta_value;
	
	var $=this;
	
	nr_db_pool.query(q, function(e,r)
	{
		e ? r=[] : 0;

		if(!Array.isArray(trm_id))
		{
			if(Array.isArray(r))
			{
				r=r[0] || {};
			}
		}

		next($, r);
	});
}

module.exports.get_terms=function(nr_condition, get_p_n)
{
	var helper=require('./helper.njs');
	var pst_helper=require('../post/helper.njs');
	
	/* Get query object, that will come through registered hooks too. [Oh god! what a complicated function. Need refactoring.] */
	helper.pre_get_terms(this, function($, query, not_appl)
	{
		typeof nr_condition!=='object' ? nr_condition={} : 0;

		nr_condition			= helper.nr_fill_term_cond(nr_condition, query);
		
		var processed_condition	= helper.nr_term_condition_processor(query,nr_condition);
		var args				= processed_condition.args;
		var where_clause		= processed_condition.clause;
		
		var orderby				= ' ORDER BY '+args.orderby;
		var order				= ' '+args.order+' ';
		
		
		/* ~~~~~~~~~~~~~~~~~~~Now create sql from args~~~~~~~~~~~~~~~~~~~ */

		/* Define table name using prefix */
		var terms=nr_db_config.tb_prefix+'terms';
		var meta=nr_db_config.tb_prefix+'termmeta';
		var posts=nr_db_config.tb_prefix+'posts';
		var rel=nr_db_config.tb_prefix+'term_relationships';

		var sql='SELECT DISTINCT '+terms+'.* FROM '+terms+' \
					LEFT JOIN '+meta+' ON '+terms+'.term_id='+meta+'.owner_term_id \
					LEFT JOIN '+rel+' ON '+terms+'.term_id='+rel+'.owner_term_id \
					LEFT JOIN '+posts+' ON '+rel+'.owner_post_id='+posts+'.post_id ';
		
		/* Step 3: Add WHERE clause. */
		var clause_parent=[];
		where_clause.intersect.length>0 	? clause_parent.push('('+where_clause.intersect.join(' AND ')+')')	: 0;
		where_clause.exclude.length>0 		? clause_parent.push('('+where_clause.exclude.join(' AND ')+')')	: 0;
		where_clause.unite.length>0 		? clause_parent.push('('+where_clause.unite.join(' OR ')+')') 		: 0;
		
		/* Step 4: Determine if where clause need. */
		var where_word=clause_parent.length>0 ? ' WHERE ' : '';
		
		/* Step 6: Create final SQL command */
		sql = sql + where_word + clause_parent.join(' AND ') + orderby + order;
		
		
		nr_db_pool.query(sql,function(e, result)
		{
			if(e)
			{
				get_p_n($, result);
				return;
			}

			var all_term_id=[];
			
			/* Loop through all */
			for(var i=0; i<result.length; i++)
			{
				/* Gather all post id to get meta by IDs */
				all_term_id.push(result[i].term_id);
				
				result[i].termmeta={};
			}
			

			/* get term meta and attach to terms list */
			$.get_term_meta(all_term_id, false, false, function($, mets)
			{
				var attached=pst_helper.meta_processor(mets, 'owner_term_id', 'term_id', 'termmeta', result);
				
				get_p_n($, attached);
			});
		});
	});
}


module.exports.get_the_term_thumbnail_url=function(id, callback)
{
	var ids=!Array.isArray(id) ? [id] : id;

	this.get_term_meta(ids, 'featured_image', false, function($, meta)
	{
		var attachment=meta.map(m=>m.meta_value);
		
		$.get_attachment_url(attachment, function($, url)
		{
			var urls_={};

			// Manage middle man connection among term id and attachment post id
			for(var u in url)
			{
				meta.forEach(function(m)
				{
					u==m.meta_value ? urls_[m.owner_term_id]=url[u] : 0;
				})
			}
			
			!Array.isArray(id) ? urls_=urls_[id] : 0;

			callback($, urls_);
		});
	});
}

module.exports.get_taxonomies=function()
{
	return this.nr_registered_taxonomies;
}

module.exports.update_term_meta=function(term_id, meta_ob, next)
{
	var helper=require('../post/helper.njs');
	helper.meta_updater(this, 'termmeta', term_id, 'owner_term_id', meta_ob, next);
}
