module.exports.get_for_admin=function($)
{
    register_nav_menus($, function($)
    {
        var nr_menus=get_option($, 'nr_nav_menus', 0);
    
        var locations=$.nr_menu_locations;
        
        exit($, {locations, nr_menus});
    });
}

module.exports.save_menus=function($)
{
    if(typeof $._POST.menus=='object')
    {
        var cur_menus=get_option($, 'nr_nav_menus', 0);
        typeof cur_menus!=='object' ? cur_menus={} : null;

        cur_menus=Object.assign(cur_menus, $._POST.menus);
        
        $=add_option($, {'nr_nav_menus':cur_menus}, 0);
    }
    
    exit($);
}

module.exports.get_menu_for_visitor=function($)
{
    var cr_menus=get_option($, 'nr_nav_menus', 0);

    var cur_menus = (!cr_menus || cr_menus==0) ? {} : node_modules.deepcopy(cr_menus);

    var term_ids=[];
    var post_ids=[];

    /* Loop through all menus and collect post id and term id */
    var recurs=(obj)=>
    {
        if(Array.isArray(obj))
        {
            obj.forEach(item=>recurs(item));
        }
        else if(typeof obj=='object')
        {
            (obj.post_id && post_ids.indexOf(obj.post_id)==-1) ? post_ids.push(obj.post_id) : 0;
            (obj.term_id && term_ids.indexOf(obj.term_id)==-1) ? term_ids.push(obj.term_id) : 0;

            Array.isArray(obj.children) ? recurs(obj.children) : 0;
        }
    }

    for(var k in cur_menus)
    {
        cur_menus[k].items ? recurs(cur_menus[k].items) : 0;
    }
    
    /* Now get permalink of all that posts and terms */
    get_permalink($, 'post_id', post_ids, function($, p_urls)
    {
        get_term_link($, 'term_id', term_ids, false, function($, t_urls)
        {
            var cm={};

            /* Loop through all the menus recursively and set their url */
            var rec=(arr)=>
            {
                return arr.map(item=>
                {
                    (item.term_id && t_urls[item.term_id]) ? item.url=t_urls[item.term_id] : '';
                    (item.post_id && p_urls[item.post_id]) ? item.url=p_urls[item.post_id] : '';

                    Array.isArray(item.children) ? item.children=rec(item.children) : 0;

                    return item;
                });
            }

            for(var k in cur_menus)
            {
                cm[k]={};

                cur_menus[k].association ? cm[k].association=cur_menus[k].association : 0;

                cur_menus[k].items ? cm[k].items=rec(cur_menus[k].items) : 0;
            }

            exit($, cm);
        });
    });
}

module.exports.del_menu=function()
{
    if($._POST.menu_name && typeof $._POST.menu_name=='string')
    {
        var cur_menus=get_option($, 'nr_nav_menus', 0);
        
        delete cur_menus[$._POST.menu_name];

        $=add_option($, {'nr_nav_menus':cur_menus}, 0);
    }

    exit($);
}