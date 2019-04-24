import React from "react";
import * as AdminComps from '../admin/dashboard/pages';

const FindComp=(props)=>
{
    const vendor_comps=window.nr_vendor_comps;
    
    const {comp_props={}}=props;
    
    const {node_type=false, nr_package=false, component, fallback_component=false}=comp_props;

    let params=Object.assign({},props);
    delete params.comp_props;

    const default_resp=<small className="text-danger"><u><b><i>{component}</i></b></u> not found.</small>

    if(node_type===true)
    {
        if(AdminComps[component])
        {
            /* If it's admin component */
            let Cmp={c:AdminComps[component]}
            return <Cmp.c {...params}/>;
        }
    }
    else if(typeof node_type=='string' && vendor_comps[node_type] && nr_package!==false)
    {
        let ret=(component)=>
        {
            /* Find in third party components, theme and plugins. */
            for(let i=0; i<vendor_comps[node_type].length; i++)
            {
                let node=vendor_comps[node_type][i];

                if(node.component && node.nr_package==nr_package && node.component[component])
                {
                    let Cmpc={c:node.component[component]}
                    return <Cmpc.c {...params}/>
                }
            }
            return false;
        }
        
        let resp=ret(component);

        if(resp==false && fallback_component!==false)
        {
            resp=ret(fallback_component);
        }

        if(resp)
        {
            return resp;
        }
    }
    
    return default_resp;
}

export {FindComp}