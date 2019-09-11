module.exports.save=function($)
{
    var args=$._POST.values || {};

    var feat=args.featured_image;
    delete args.featured_image;

    // Check required fields
    if(!args.name || /\S+/.test(args.name)==false)
    {
        $.exit( {'status':'error', 'message':'Name is required.'});
        return;
    }
    
    $.insert_term(args, function($, t_id, e)
    {
        if(t_id)
        {
            var fet_ob=feat ? {'featured_image':feat} : {};
            
            $.update_term_meta(t_id, fet_ob, function($)
            {
                $.exit( {'status':'success'});
            });
            
            return;
        }
        
        $.exit( {'status':'error', 'message':'Check if the slug exist in same level already.'});
    });
}

module.exports.get_taxonomy=function($)
{
    var taxonomy=$._POST.taxonomy;

    var resp={'taxonomies':[], 'hierarchical':false, 'taxonomy_title':''};

    /* Firstly initiate taxonomy register hook to get taxonomy list and their props */
    var ret_taxonomy=($, next)=>
    {
        register_taxonomies($, function($)
        {
            if($.nr_registered_taxonomies[taxonomy])
            {
                /* Check if the accessed taxonomy is hierarchical */
                resp.hierarchical=$.nr_registered_taxonomies[taxonomy].hierarchical==true;
                
                resp.taxonomy_title=$.nr_registered_taxonomies[taxonomy].title;

                next($);
                return;
            }
            
            $.exit();
        });
    }

    /* Now fetch all taxonomies and terms from database */
    var fetch_taxs=($, next)=>
    {
        // generate query string
        var terms=nr_db_config.tb_prefix+'terms';
        var rel=nr_db_config.tb_prefix+'term_relationships';
        var q='SELECT DISTINCT  '+terms+'.*, \
                    (SELECT COUNT(rel_id) FROM '+rel+' WHERE owner_term_id='+terms+'.term_id) As post_count \
                    FROM '+terms+' LEFT JOIN '+rel+' \
                    ON '+terms+'.term_id='+rel+'.owner_term_id \
                    WHERE '+terms+'.taxonomy="'+taxonomy+'"';
        
        // run query in database
        nr_db_pool.query(q, function(e, r)
        {
            // Collect term id
            var ids=r.map(t=>t.term_id);

            // get featured image of every single terms
            $.get_the_term_thumbnail_url(ids, function($, urls)
            {
                // Assign featured image url in terms based on their ID
                for(var k in urls)
                {
                    r.forEach(function(t, i)
                    {
                        t.term_id==k ? r[i].featured_image=urls[k] : 0;
                    });
                }

                resp.taxonomies=r;

                $.echo(resp);
                
                next($);
            });
        });
    }
    
    var final_resp=($)=>
    {
        $.exit( resp);
    }

    $.series_fire( [ret_taxonomy, fetch_taxs, final_resp]);
}

module.exports.delete=function($)
{
    if($._POST.term_ids)
    {
        $.delete_term($._POST.term_ids, function($, next)
        {
            $.exit( {'status':'success'});
        });
    }
    else
    {
        $.exit();
    }
}

module.exports.get_for_editor=function($)
{
    var taxonomy=$._POST.taxonomy;
    var post_id=$._POST.post_id;

    var terms=nr_db_config.tb_prefix+'terms';
    var rel=nr_db_config.tb_prefix+'term_relationships';

    var hierarchical=false;
    var multiple=false;

    var all_terms='SELECT * FROM '+terms+' WHERE taxonomy="'+taxonomy+'"';
    var current_terms='SELECT * FROM '+terms+' WHERE taxonomy="'+taxonomy+'" AND term_id IN (SELECT owner_term_id FROM '+rel+' WHERE owner_post_id='+post_id+')';


    var check_exist=($, next)=>
    {
        if($.nr_registered_taxonomies[taxonomy])
        {
            hierarchical=$.nr_registered_taxonomies[taxonomy].hierarchical==true;
            multiple=$.nr_registered_taxonomies[taxonomy].multiple==true;
            next($);
            return;
        }
        $.exit();
    }

    var get_all=($, next)=>
    {
        nr_db_pool.query(all_terms, function(e,r)
        {
            all_terms=r || [];
            next($);
        })
    }

    var get_of_post=($, next)=>
    {
        nr_db_pool.query(current_terms, function(e,r)
        {
            current_terms=r || [];
            current_terms=current_terms.map(item=>item.term_id);

            next($);
        });
    }

    var resp=($, next)=>
    {
        $.exit
        ({
            'all_terms':all_terms, 
            'current_terms':current_terms, 
            'hierarchical':hierarchical,
            'multiple':multiple
        });
    }

    $.series_fire( [register_taxonomies, check_exist, get_all, get_of_post, resp]);
}

module.exports.save_from_editor=function($)
{
    var term_ids=$._POST.current_terms || [];
    var taxonomy=$._POST.taxonomy || '';
    var post_id=$._POST.post_id || 0;

    $.set_post_terms(post_id, term_ids, taxonomy, false, function($)
    {
        $.exit();
    });
}

module.exports.t_for_nav=function($)
{
    $.get_terms(false, function($, trms)
    {
        var tts={};

        trms.map(t=>
        {
            !tts[t.taxonomy] ? tts[t.taxonomy]=[] : 0;

            tts[t.taxonomy].push(t);
        });

        $.exit( {'objects':tts});
    });
}