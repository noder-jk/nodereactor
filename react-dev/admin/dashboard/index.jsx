import React, {Component} from "react";
import Spinner from "react-svg-spinner";

import {getNavList} from '../navs';
import {FindComp} from 'nodereactor/react/helper/comp-finder';

import './style.css';

class DashboardContainer extends Component
{
    constructor(props)
    {
        super(props);
        this.state={'content':<Spinner size="15px"/>}
    }

    componentDidMount()
    {
        getNavList((r,c)=>{
            if(r)
            {
                this.setState({'content':<FindComp comp_props={c}/>})
            }
            else
            {
                this.setState({'content':<div>Something went wrong.</div>});
            }
        })
    }

    render()
    {
        return(
            <main id="dashboard_main">
                <div id="admin_panel_container" className="container-fluid">
                    {this.state.content}
                </div>
            </main>
        )
    }
}

export {DashboardContainer}