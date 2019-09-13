import React, {Component} from "react";
import {Helmet} from 'react-helmet';

import {getNavList} from '../navs';
import {FindComp} from 'nodereactor/react/helper/comp-finder';
import {SpinIcon} from 'nodereactor/react';

import './style.css';

class DashboardContainer extends Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            'page_title':'',
            'content':<SpinIcon show={true} space={false}/>
        }
    }

    componentDidMount()
    {
        getNavList((r, c)=>
        {
            let {page_title=''}=c;

            this.setState
            ({
                'content':r ? <FindComp comp_props={c}/> : <div>Something went wrong.</div>,
                page_title
            });
        });
    }

    render()
    {
        let {page_title}=this.state;

        return <main id="dashboard_main">
            <Helmet>
                <title>{page_title}</title>
            </Helmet>

            <div id="admin_panel_container" className="container-fluid">
                {this.state.content}
            </div>
        </main>
    }
}

export {DashboardContainer}