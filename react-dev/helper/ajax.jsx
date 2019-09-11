import axios from 'axios';

import {ajax_url} from 'nodereactor/react';

const ajax_request=(action, data, callback, u_progress)=>
{
    // Manage if data object is not provided
    if(typeof data!=='object')
    {
        u_progress=callback;
        callback=data;
        data={};
    }

    // Create data object to send to server
    let form_data=data instanceof FormData;

    let ind=action.indexOf('?');

    let search=ind>-1 ? action.slice(ind) : '';
    ind>-1 ? action=action.slice(0, ind) : 0;

    form_data ? data.append('action', action) : data['action']=action;

    let req_ob=
    {
        method:'post',
        url:ajax_url+search,
        timeout:30000,
        data:data
    }
    
    // Set headers and progress event handler
    form_data ? req_ob.headers={'Content-Type':'multipart/form-data'} : 0;
    u_progress ? req_ob.onUploadProgress=u_progress : 0;

    // Finally start ajax
    axios(req_ob).then(r=>
    {
        typeof r!=='object' ? r={} : 0;
        
        let {data={}}=r;

        callback ? callback(data, r, null) : 0;
    }).catch(e=>
    {
        callback ? callback({}, {}, e) : 0;
    });
}

export {ajax_request}