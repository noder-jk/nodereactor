import React from 'react';

import {FindActionHook} from '../helper/hook-finder';

const Init=()=>
{
    return <FindActionHook hook="init" type="function"/>
}

const InitTheme=(props)=>
{
    return <FindActionHook hook="init_theme" type="function" properties={props.properties}/>
}

export {Init, InitTheme}