import React from 'react';

import {DoAction} from 'nodereactor/react';

const nr_head=()=>
{
    return <DoAction hook="nr_head"/>
}

const nr_footer=()=>
{
    return <DoAction hook="nr_footer"/>
}

export {nr_head, nr_footer}