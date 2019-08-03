import axios from 'axios';

import {nr_ajax_url} from 'nodereactor/react';

const ajaxRequest=(action, data, callback, u_progress)=>
{
    if(typeof data!=='object')
    {
        u_progress=callback;
        callback=data;
        data={};
    }

    let form_data=data instanceof FormData;

    let ind=action.indexOf('?');

    let search=ind>-1 ? action.slice(ind) : '';
    ind>-1 ? action=action.slice(0, ind) : 0;

    form_data ? data.append('action', action) : data['action']=action;

    let req_ob=
    {
        method:'post',
        url:nr_ajax_url+search,
        data:data
    }
    
    form_data ? req_ob.headers={'Content-Type':'multipart/form-data'} : 0;
    u_progress ? req_ob.onUploadProgress=u_progress : 0;

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

export {ajaxRequest}