import React from "react";

import {do_shortcodes} from 'nodereactor/react';

const FindActionHook=(props)=>
{
    const comps=window.nr_vendor_comps;

    const {hook='', danger=false}=props;

    let {value='', properties={}}=props;

    value = danger==true ? [do_shortcodes(value)] : [value];

    /* Loop through all node type, theme and plugin to find hook */
    for(let k in comps)
    {
        /* Loop through individual node (theme and plugin) */
        for(let i=0; i<comps[k].length; i++)
        {
            /* Check if the specified hook is available in the node */
            if(comps[k][i] && comps[k][i].component && comps[k][i].component.action_hooks)
            {
                let hooks=comps[k][i].component.action_hooks;

                /* Check the hook type, multiple or single, position defined or not. */
                if(Array.isArray(hooks))
                {
                    for(let n=0; n<hooks.length; n++)
                    {
                        if(typeof hooks[n]=='object' && !Array.isArray(hooks[n]) && hooks[n][hook])
                        {
                            let Method={'h':hooks[n][hook]}

                            /* Add hook before or after based on developers preference */
                            value[hooks[n].before==true ? 'unshift' : 'push'](<Method.h key={k+'_'+i+'_hook'} properties={properties}>{value}</Method.h>);
                        }
                    }
                }
                else if(typeof hooks=='object' && hooks[hook])
                {
                    /* It is single hook. So directly add after the hook caller. */
                    let Hook={'h':hooks[hook]}

                    value.push(<Hook.h key={k+'_'+i} properties={properties}>{value}</Hook.h>);
                }
            }
        }
    }

    return value;
}

export {FindActionHook}