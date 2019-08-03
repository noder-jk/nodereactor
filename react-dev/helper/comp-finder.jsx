import React from "react";
import * as AdminComps from '../admin/dashboard/pages';

const FindComp=(props)=>
{
    const vendor_comps=window.nr_vendor_comps;
    
    const {comp_props={}}=props;
    
    const   {
                nr_package=false, 
                component, 
                fallback_component=false, 
                fallback_content=false
            }=comp_props;

    let params=Object.assign({},props);
    delete params.comp_props;

    const default_resp=fallback_content || <small className="text-danger">Component <u><b><i>{component}</i></b></u> not found.</small>

    if(nr_package===true)
    {
        if(AdminComps[component])
        {
            /* If it's admin component */
            let Cmp={c:AdminComps[component]}
            return <Cmp.c {...params}/>;
        }
    }
    else
    {
        let ret=(component)=>
        {
            /* Find in third party components, theme and plugins. */
            for(var node_type in vendor_comps)
            {
                for(let i=0; i<vendor_comps[node_type].length; i++)
                {
                    let node=vendor_comps[node_type][i];

                    if(node.component && node.nr_package==nr_package && node.component[component])
                    {
                        let Cmpc={c:node.component[component]}
                        return <Cmpc.c {...params}/>
                    }
                }
            }
            
            return false;
        }
        
        let resp=ret(component);

        if(!resp && fallback_component)
        {
            resp=ret(fallback_component);

            if(!resp)
            {
                return <small className="text-danger">
                            Component <u><b><i>{component}</i></b></u> not found.
                            Fallback component <u><b><i>{fallback_component}</i></b></u> not found too.
                        </small>
            }
        }

        if(resp)
        {
            return resp;
        }
    }
    
    return default_resp;
}

export {FindComp}