module.exports.navs=function($)
{
    var init_nav_render=function($)
    {
        var pt=$.registered_post_types;

        var ob={}
        for(var k in pt)
        {
            if(k=='attachment'){continue;}

            var key='post_type_'+k;
            ob[key]={'main':{},'sub':[]}

            ob[key].main=
            {
                'page_title':'Post Type - '+pt[k].title,
                'menu_title':pt[k].title,
                'menu_icon':pt[k].icon,
                'slug':'all',
                'component':'PostList',
                'nr_package':true
            }

            var sb_pages=[];

            sb_pages.push
            ({
                'page_title':'Create - '+pt[k].title,
                'menu_title':'Create',
                'slug':'create',
                'component':'InitPostEditor',
                'nr_package':true
            });
            
            sb_pages.push
            ({
                'page_title':'Edit - '+pt[k].title,
                'menu_title':'Edit',
                'slug':'edit',
                'component':'InitPostEditor',
                'hide_if_not':'/nr-admin/'+key+'/edit',
                'nr_package':true
            });

            /* Set taxonomy menu to post type menu */
            if($.registered_taxonomies_to_post[k] && Array.isArray($.registered_taxonomies_to_post[k]))
            {
                $.registered_taxonomies_to_post[k].forEach(function(taxonomy)
                {
                    if($.nr_registered_taxonomies[taxonomy])
                    {
                        var rtx=$.nr_registered_taxonomies[taxonomy];
                        
                        sb_pages.push
                        ({
                            'page_title':'Manage '+rtx.title,
                            'menu_title':rtx.title,
                            'slug':'taxonomy_'+rtx.taxonomy,
                            'component':'TaxonomyPage',
                            'nr_package':true
                        })
                    }
                });
            }

            ob[key].sub=sb_pages;
        }
        
        /* Separate index main menu to add post types after it. */
        var index=$.nr_admin_menus_runtime.index;
        delete $.nr_admin_menus_runtime.index;

        /* Now generate new menu object including post types */
        $.nr_admin_menus_runtime=Object.assign({'index':index}, ob, $.nr_admin_menus_runtime);


        /* Now add registered sub menus to main menus. It's separately because, users sub menu adder might be called before the main menu register. */
        for(var i=0; i<$.nr_admin_submenus_runtime.length; i++)
        {
            var params=$.nr_admin_submenus_runtime[i];

            if(params.parent_slug)
            {
                var parent_slug=params.parent_slug;
                delete params.parent_slug;

                $.add_menu_page(params, parent_slug);
            }
        }

        /* Finally send the menus to the react as json */
        $.echo({'nr_admin_navs':$.nr_admin_menus_runtime});
        exit($);
    }
    
    $.series_fire( [admin_menu, register_post_types, register_taxonomies, use_taxonomies, init_nav_render]);
}