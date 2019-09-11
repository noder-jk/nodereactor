import React from "react";

import {do_shortcodes} from 'nodereactor/react';

const invokeHooks=(h_name, single_hook, properties)=>
{
    let before=false;
    let comps_ar=[];

    // Loop through all the hook object keys
    for(let n in single_hook)
    {
        if(n!==h_name){continue;}

        // Make object if its component directly
        if(typeof single_hook[n]=='function')
        {
            single_hook[n]={'component':single_hook[n], 'before':false};
        }

        // Check if the name matches with desired hook, and if it's object.
        if(typeof single_hook[n]=='object' && single_hook[n].component)
        {
            // decide if it should be appended or prepended.
            before=single_hook[n].before==true;

            // Make component array if not already
            let comps=single_hook[n].component;
            !Array.isArray(comps) ? comps=[comps] : 0;

            // Loop through all the components in component array
            comps.forEach(C=>
            {
                // This block is to add content before/after specific hook
                comps_ar.push(<C key={h_name+'_'+n} properties={properties}/>);
            });
        }
    }

    return {position:(before ? 'unshift' : 'push'), content:comps_ar}
}

const FindActionHook=(props)=>
{
    let comps=window.nr_vendor_comps;

    let {
            hook='', 
            danger=false, 
            value='', 
            properties={}
        }=props;

    value = danger==true ? [do_shortcodes(value)] : [value];

    /* Loop through all node type, theme and plugin to find hook */
    for(let k in comps)
    {
        /* Loop through individual node (theme and plugin) */
        for(let i=0; i<comps[k].length; i++)
        {
            /* Check if the specified hook is available in the node */
            if(comps[k][i] && comps[k][i].component && typeof comps[k][i].component.action_hooks=='object')
            {
                let hooks=comps[k][i].component.action_hooks;

                /* Check the hook type, multiple or single, position defined or not. */
                !Array.isArray(hooks) ? hooks=[hooks] : 0;
                
                hooks.forEach(h=>
                {
                    let {position, content}=invokeHooks(hook, h, properties);
                    value[position](content);
                });
            }
        }
    }

    return value;
}

export {FindActionHook}