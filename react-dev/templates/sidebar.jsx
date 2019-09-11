import React from 'react';

import {Placeholder} from 'nodereactor/react';
import {FindComp} from '../helper/comp-finder';

const SidebarProcessor=(props)=>
{
    /* Store widget lst in variable, so no need to fetch again. */
    let {response, properties}=props;

    if(!window.nr_widget_list)
    {
        window.nr_widget_list=response;
    }
    

    /* Store simplified alias of widget objects */
    let sidebars=window.nr_widget_list.sidebars;
    let widgets=window.nr_widget_list.widgets;
    let l=window.nr_widget_list.widget_in_sidebar;

    /* Get the sidebar/area id */
    const {sidebar_id, WidgetContainer}=properties;

    /* Store multiple widget component to render output */
    let comps=[];

    /* Check if the area exist in fetched area list */
    if(sidebars[sidebar_id] && l[sidebar_id])
    {
        /* Loop through all the widgets that was saved for this area */
        for(let i=0;i<l[sidebar_id].length; i++)
        {
            /* Simplify alias */
            let s=l[sidebar_id][i];

            /* Loop through all actual registered available widgets */
            for(let n=0; n<widgets.length; n++)
            {
                let w=widgets[n];

                /* Now load the component to render actual widget */
                if(w.nr_package==s.nr_package && w.id==s.widget_id)
                {
                    comps.push
                    (
                        <WidgetContainer key={s.key} title={s.properties.nr_widget_title}>
                            <FindComp comp_props={{'component':w.output_component, 'nr_package':s.nr_package}} {...s.properties}/>
                        </WidgetContainer>
                    )
                }
            }
        }
    }

    return comps;
}

const dynamic_sidebar=(sidebar_id, container)=>
{
    let props={'sidebar_id':sidebar_id, 'WidgetContainer':container};


    if(window.nr_widget_list)
    {
        return <SidebarProcessor response={window.nr_widget_list} properties={props}/>
    }

    return <Placeholder action="nr_get_widget_list" Data={{'sidebar':sidebar_id}} component={SidebarProcessor} properties={props}/>
}

export {dynamic_sidebar}