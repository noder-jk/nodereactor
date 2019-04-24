import React from "react";
import {FindActionHook} from '../helper/hook-finder';

import moment from 'moment-timezone';

const the_title=(item)=>
{
    return <FindActionHook hook="the_title" value={item.post_title} properties={{'post':item}}/>
}

const the_content=(item)=>
{
    return <FindActionHook hook="the_content" value={item.post_content} danger={true} properties={{'post':item}}/>
}

const the_author=(item)=>
{
    return <FindActionHook hook="the_author" value={item.display_name} properties={{'post':item}}/>
}

const the_next_url=(pagination, key)=>
{
    let resp=false;

    key = !key ? 'next' : key;

    if(typeof pagination=='object' && pagination[key])
    {
        let q=window.location.search;
        q=q.slice(1);
        q=q.split('&').map(item=>item.split('=')).map(item=>item[0]=='page' ? false : item.join('=')).filter(item=>item!==false);
        q.push('page='+pagination[key]);

        resp='?'+q.filter(item=>(typeof item=='string' && /\S+/.test(item))).join('&');
    } 

    return resp;
}

const the_previous_url=(pagination)=>
{
    return the_next_url(pagination, 'previous');
}

const the_date=(item, format)=>
{
    let date = moment(item.post_date).tz(window.nr_configs.time_zone).format(format ? format : 'YYYY-MM-DD HH:mma z');

    return <FindActionHook hook="the_date" value={date} properties={{'post':item}}/>
}

const the_excerpt=(item)=>
{
    return <FindActionHook hook="the_excerpt" value={item.post_excerpt} properties={{'post':item}}/>
}

const the_permalink=(item)=>
{
    return item.post_permalink;
}

export {
            the_title, 
            the_content, 
            the_author, 
            the_date,
            the_permalink,
            the_excerpt,
            
            the_next_url,
            the_previous_url
        }