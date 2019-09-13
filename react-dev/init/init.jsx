import React, {Component} from 'react';
import {Helmet} from 'react-helmet';

import Spinner from "react-svg-spinner";
import Socket from 'socket.io-client/dist/socket.io.js';

import {Init} from '../hooks/core';
import {InitAdmin} from '../admin';
import {InitFrontEnd} from '../frontend';
import {NodeReactorInstaller} from '../installer';
import {LoginRegistration, ajax_request} from 'nodereactor/react';

import 'bootstrap/dist/css/bootstrap.min.css';

class InitApp extends Component
{
    constructor(props)
    {
        super(props);
        this.state={content:<div className="text-center"><Spinner size="15px"/></div>}
    }

    componentDidMount()
    {
        let req_v=
        {
            'pathname':window.location.pathname,
            'search':window.location.search
        };
        
        ajax_request('nr_get_init_component', req_v, (r, x, e)=>
        {
            if(e)
            {
                this.setState({'content':<p className="text-center text-danger">Request Failed.</p>});
                return;
            }

            let {nr_configs={}}=r;

            let configs=nr_configs;

            /* Delete deactivated theme/plugin from vendor components object */
            let new_vendors={'themes':[], 'plugins':[]};
            if(typeof configs.active_nodes=='object')
            {
                for(let k in window.nr_vendor_comps)
                {
                    /* If there is any other property except theme and plugin delete those. */
                    if(!configs.active_nodes[k] || !Array.isArray(window.nr_vendor_comps[k]))
                    {
                        continue;
                    }
                    
                    /* Loop through all theme/plugin and check if the package is in active node. If not, delete. */
                    for(let i=0; i<window.nr_vendor_comps[k].length; i++)
                    {
                        let pkg=window.nr_vendor_comps[k][i].nr_package;
                        
                        if(pkg && configs.active_nodes[k].indexOf(pkg)>-1 && Array.isArray(new_vendors[k]))
                        {
                            new_vendors[k].push(window.nr_vendor_comps[k][i]);
                        }
                    }
                }
            }
            
            window.nr_vendor_comps=new_vendors;
            window.nr_configs=configs;

            /* Initialize socket connection */
            if(configs.nr_installed==true)
            {
                window.nr_socket_client=Socket(configs.nr_home_url);

                /* Set cookie handler for socket request */
                window.nr_socket_client.on('nr_set_cookie_through_socket', cookie=>
                {
                    let c_ar=Array.isArray(cookie) ? cookie : [];

                    c_ar.map(item=>document.cookie=item);
                })
            }

            /* Detect which root component to load */
            let comps={InitAdmin, InitFrontEnd, LoginRegistration, NodeReactorInstaller};
            
            let Comps={'component':InitFrontEnd}
            
            /* Check if server specified component exist here */
            if(configs.component && comps[configs.component])
            {
                Comps.component=comps[configs.component];
            }

            this.setState({'content':<Comps.component {...nr_configs}/>});
        });
    }

    render()
    {
        let {site_name=''}=window.nr_configs || {};

        return <div>
            <Helmet>
                <title>
                    {site_name}
                </title>
            </Helmet>

            <Init/>

            {this.state.content}
        </div> 
    }
}

export {InitApp}