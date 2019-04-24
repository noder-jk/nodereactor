import React, {Component} from "react";
import axios from 'axios';
import Spinner from 'react-svg-spinner';

import {ajax_url } from 'nodereactor/react';
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

        axios({
            'method':'post',
            'url':ajax_url+window.location.search,
            'data':{'action':'get_init_frontend', 'pathname':pathname}
        }).then(r=>
        {
            if(r.data)
            {
                let {nr_configs={}}=r.data;
                let {nr_package=' ', component='Index', redirect_to=false}=nr_configs;

                if(redirect_to!==false)
                {
                    window.location.replace(redirect_to);
                    return;
                }

                let params=Object.assign({}, r.data);
                delete params.nr_configs;
                
                /* Parameters to pass to theme component finder. */
                let find_params=
                {
                    'node_type':'themes',
                    'nr_package':nr_package, 
                    'component':component, 
                    'fallback_component':'Index'
                }
                
                /* Now load the theme component */
                this.setState({'content': <FindComp comp_props={find_params} {...params}/>});
            }
        }).catch(e=>
        {
            this.setState({'content':<p className="text-center text-danger">Request Error.</p>});
        });
    }

    render()
    {
        return this.state.content
    }
}

export {InitFrontEnd}