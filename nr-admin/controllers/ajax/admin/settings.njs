module.exports.get=function($)
{
    var resp={}

    var t_zones=[];

    /* Sort by zone name */
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

    resp.time_zones=t_zones;

    resp.values={}
    
    for(var k in $.nr_set_option_queue.core.c)
    {
        resp.values[k]=$.nr_set_option_queue.core.c[k];
    }

    resp.values.time_zone       = $.get_option('time_zone',0)==false ? 'UTC' : $.get_option('time_zone',0);

    $.echo(resp);	

    exit($);				
}

module.exports.save=function($)
{
    $.add_option($._POST, 0);
    $.echo({'status':'done'});
	exit($);
}

module.exports.permalink_page=function($)
{
    var send_perm=($, next)=>
    {
        var resp=
        {
            'post_types'        :   $.registered_post_types,
            'taxonomies'        :   $.nr_registered_taxonomies,
            'used_taxonomies'   :   $.registered_taxonomies_to_post
        }

        exit($, resp);
    }

    $.series_fire( [register_post_types, register_taxonomies, use_taxonomies, send_perm]);
}