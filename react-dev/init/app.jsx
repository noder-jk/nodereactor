import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import {InitApp} from './init';

const App = () =>
(
    <BrowserRouter>
        <Switch>
            <Route path="/*" component={InitApp}/>
        </Switch>
    </BrowserRouter>
)

export {App}