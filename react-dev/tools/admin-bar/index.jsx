import React, {Component} from "react";
import Logo from './logo.jpg';

import './style.scss';

class AdminBar extends Component
{
    render()
    {
        let {current_user={}}=window.nr_configs;
        let {display_name=false, gravatar=''}=current_user;
        let show_home=window.location.pathname.indexOf('/nr-admin')===0;

        return display_name ?
            <div id="admin_header">
                <div className="has_sub_content">
                    <img src={Logo} style={{"maxHeight":"100%","padding":"5px"}}/>
                    <div className="sub_content left">
                        {
                            show_home ? 
                            <a href="/" >Visit Home</a> : 
                            <a href="/nr-admin">Dashboard</a>
                        }
                        <a href="//NodeReactor.com" target="_blank">NR Documentation</a>
                    </div>
                </div>
                <div className="has_sub_content" style={{"float":"right"}}>
                    <span>{display_name}</span>
                    <img src={gravatar} style={{"maxHeight":"100%", "padding":"6px"}}/>
                    <div className="sub_content right">
                        <a href="/logout">Logout</a>
                        <a href="/logout/all">Logout From All</a>
                    </div>
                </div>
            </div> : null
    }
}

export {AdminBar}