import React from 'react';

import {FindActionHook} from '../helper/hook-finder';

const login=()=>
{
    return <FindActionHook hook="login"/>
}

export {login}