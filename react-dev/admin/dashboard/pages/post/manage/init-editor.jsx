import React from 'react';
import {Placeholder} from 'nodereactor/react';
import {PostProcess} from './editor';

const InitPostEditor=(props)=>
{
    /* detect if it is create or edit. if edit parse post id */

    let pt=window.location.pathname;
    pt=pt.slice(1);
    pt=pt.split('/');

    let type=pt[1];
    type=type.slice('post_type_'.length);

    let c_or_e=pt[2];

    let p_id=pt[3] ? pt[3] : false;

    let ob={'action':'nr_get_post_create_edit', 'post_type':type, 'c_or_e':c_or_e}
    
    if(p_id)
    {
        ob.post_id=p_id;
    }
    else if(pt[2] && pt[2]=='edit')
    {
        window.location.replace('all');
        return;
    }

    return <Placeholder Data={ob} Component={PostProcess}/>
}

export {InitPostEditor}