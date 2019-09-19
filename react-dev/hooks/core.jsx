import React from 'react';

import {DoAction} from 'nodereactor/react';

const Init=()=>
{
    return <DoAction hook="init"/>
}

const InitAdmin=()=>
{
    return <DoAction hook="init_admin"/>
}

const InitTheme=()=>
{
    return <DoAction hook="init_theme"/>
}

export {Init, InitAdmin, InitTheme}