import React, {Component} from "react";

import {AdminBar} from 'nodereactor/react';

import {Navigation} from './navs';
import {DashboardContainer} from './dashboard';

class InitAdmin extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return <div>
                <AdminBar/>
                <Navigation/>
                <DashboardContainer/>
            </div>
    }
}

export {InitAdmin}