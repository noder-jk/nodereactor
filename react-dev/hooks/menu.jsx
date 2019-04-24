import React from 'react';

import {Placeholder} from 'nodereactor/react';

const MenuProcessor=(props)=>
{
    /* Store widget lst in variable, so no need to fetch again. */
    window.nr_menu_list=props.ResponseData;

    let {
            id='', 
            menu_name=false, 
            li_class='', 
            ul_class='', 
            anchor_class='', 
            li_active_class='',
            Renderer=false
        }=props;

    let menus=window.nr_menu_list || {};

    let render_menus=[];

    if(menu_name!==false)
    {
        /* This block collect menu by menu name itself. not by location. */
        if(menus[menu_name])
        {
            render_menus.push(menus[menu_name].items);
        }
    }
    else
    {
        /* This block collects menus by menu location. */
        Object.keys(menus).map(item=>
        {
            if(menus[item].association && Array.isArray(menus[item].association) && menus[item].association.indexOf(id)>-1)
            {
                render_menus.push(menus[item].items);
            }
        });
    }
    
    if(Renderer)
    {
        return <Renderer menus={render_menus}/>
    }

    /* Loop through all menus recursively */
    let recurs=(menu)=>
    {
        if(Array.isArray(menu))
        {
            return  <ul key={menu.key} className={ul_class}>
                        {menu.map(m=>recurs(m))}
                    </ul>
        }
        else if(typeof menu=='object')
        {
            return  <li key={menu.key} className={li_class}>
                        <a href={menu.url} className={anchor_class + (window.location.pathname==menu.url ? li_active_class : '')}>{menu.title}</a>
                        {(menu.children && Array.isArray(menu.children)) ? recurs(menu.children) : null}
                    </li>
        }

        return null;
    }
    
    return render_menus.map(item=>recurs(item));
}


const nr_nav_menu=(props)=>
{
    if(window.nr_menu_list)
    {
        return <MenuProcessor ResponseData={window.nr_menu_list} properties={props}/>
    }

    return <Placeholder Data={{'action':'nr_get_menu_for_visitor'}} Component={MenuProcessor} {...props}/>
}

export {nr_nav_menu}