module.exports.get=function($, next)
{
    // get environment configs
    var resp=require(node_modules.path.resolve(__dirname, '../../../../nr-utilities/configs.njs'));
    
    // Store desired data
    for(var k in $.nr_set_option_queue.core.c)
    {
        $._POST.fields.indexOf(k)>-1 ? resp[k]=$.nr_set_option_queue.core.c[k] : 0;
    }

    // Add time zone value
    resp.time_zone = $.get_option('time_zone', true) || 'UTC';

    $.echo(resp);	

    next($);			
}

module.exports.gen=function($, next)
{
    /* Get time zone */
    var t_zones=[];
    nr_timezones.map(item=>
    {
        return item.name;
    }).sort().forEach(item=>
    {
        nr_timezones.forEach(item2=>
        {
            item==item2.name ? t_zones.push(item2) : null;
        })
    });

    $.echo
    ({
        'time_zones':t_zones.map(t=>{return{value:t.zone, title:t.name}})
    });

    next($);
}

module.exports.save=function($, next)
{
    var v=$._POST.values;

    set_utility_configs(false, v);

    $.add_option(v, true);
    
    $.echo({'status':'success'});
    
    next($);
}

module.exports.permalink_page=function($, next)
{
    var send_perm=($, next)=>
    {
        // Configurations
        var resp=
        {
            'post_types'        :   $.registered_post_types,
            'taxonomies'        :   $.nr_registered_taxonomies,
            'used_taxonomies'   :   $.registered_taxonomies_to_post
        }

        // get already set values
        var p_types=Object.keys(resp.post_types).map(pt=>pt);
        var permalink=p_types.map(p=>p+'_post_permalink');
        var taxonomy=p_types.map(p=>p+'_post_taxonomy');
        var fields=['term_permalink'].concat(permalink, taxonomy);
        var v={};
        fields.forEach(f=>v[f]=$.get_option(f, true));

        $.echo({configs:resp, values:v});
        
        next($);
    }

    $.series_fire( [register_post_types, register_taxonomies, use_taxonomies, send_perm, next]);
}

module.exports.basic_get=function($, next)
{
    var fields      = $._POST.fields;
    var package_name= $._POST.package_name;

    !Array.isArray(fields) ? fields=[] : 0;

    var ob={};

    fields.forEach(f=>
    {
        ob[f]=$.get_option(f, package_name);
    });

    $.echo(ob);

    next($);
}

module.exports.basic_save=function($, next)
{
    var values      = $._POST.values;
    var fields      = $._POST.fields;
    var package_name= $._POST.package_name;

    (typeof values!=='object' || Array.isArray(values)) ? values={} : 0;
    !Array.isArray(fields) ? fields=[] : 0;

    var ob={};

    for(var k in values)
    {
        fields.indexOf(k)>-1 ? ob[k]=values[k] : 0;
    }

    $.update_option(ob, package_name);

    $.echo({status:'success', message:'Saved'});
    next($);
}