import React, {Component} from "react";
import Spinner from 'react-svg-spinner';

import {ajaxRequest} from 'nodereactor/react';
import {FindComp} from '../helper/comp-finder';

class InitFrontEnd extends Component
{
    constructor(props)
    {
        super(props);

        this.state=
        {
            'content':<div className="text-center"><Spinner size="15px"/></div>
        }
    }

    componentDidMount()
    {
        let pathname=window.location.pathname;

        ajaxRequest('get_init_frontend'+window.location.search, {pathname}, (r, d, e)=>
        {
            if(e)
            {
                this.setState({'content':<p className="text-center text-danger">Request Error.</p>});
                return;
            }
            
            let {nr_configs={}}=r;
            let {nr_package=' ', component='Index', redirect_to=false}=nr_configs;

            if(redirect_to!==false)
            {
                window.location.replace(redirect_to);
                return;
            }

            let params=Object.assign({}, r);
            delete params.nr_configs;
            
            /* Parameters to pass to theme component finder. */
            let find_params=
            {
                'nr_package':nr_package, 
                'component':component, 
                'fallback_component':'Index'
            }
            
            /* Now load the theme component */
            this.setState({'content': <FindComp comp_props={find_params} {...params}/>});
        });
    }

    render()
    {
        return this.state.content
    }
}

export {InitFrontEnd}