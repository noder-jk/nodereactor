import React, {Component} from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Spinner from "react-svg-spinner";
import Socket from 'socket.io-client/dist/socket.io.js';

import {InitAdmin} from 'nodereactor/react/admin';
import {InitFrontEnd} from 'nodereactor/react/frontend';
import {NodeReactorInstaller} from 'nodereactor/react/installer';

import {LoginRegistration, ajax_url} from 'nodereactor/react';

import 'bootstrap/dist/css/bootstrap.min.css';

//do_not_delete_or_modify_this_comment

window.nr_vendor_comps=vendor_components;

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
            'action':'nr_get_init_component',
            'pathname':window.location.pathname,
            'search':window.location.search
        };
        
        axios({
            method: 'post',
            url: ajax_url ,
            data: req_v
        }).then(r=>
        {
            /* Store configs in easy variable */
            let configs=r.data.nr_configs;

            /* Delete deactivated theme/plugin from vendor components object */
            let new_vendors={'themes':[], 'plugins':[]};
            if(r.data && typeof configs.active_nodes=='object')
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

            this.setState({'content':<Comps.component {...r.data}/>});
        }).catch(r=>
        {
            this.setState({'content':<p className="text-center text-danger">Request Failed.</p>});
        });
    }

    render()
    {
        return  this.state.content
    }
}

const App = () => 
(
    <BrowserRouter>
        <Switch>
            <Route component={InitApp}/>
        </Switch>
    </BrowserRouter>
);

export default App;