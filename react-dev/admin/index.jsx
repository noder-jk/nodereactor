import React, {Component} from "react";

import {AdminBar} from 'nodereactor/react';

import {Navigation} from './navs';
import {DashboardContainer} from './dashboard';
import {InitAdmin as AdminHook} from '../hooks/core';

class InitAdmin extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return <div>
                <AdminHook/>
                <AdminBar/>
                <Navigation/>
                <DashboardContainer/>
            </div>
    }
}

export {InitAdmin}