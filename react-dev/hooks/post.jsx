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

// Pagination related functions
const pager_helper=(key)=>
{
    var resp='';

    if(!isNaN(key))
    {
        // It is multiple post in pages, like term category page
        let q=window.location.search;
        q=q.slice(1);
        q=q.split('&').map(item=>item.split('=')).map(item=>item[0]=='page' ? false : item.join('=')).filter(item=>item!==false);
        q.push('page='+key);
        resp='?'+q.filter(item=>(typeof item=='string' && /\S+/.test(item))).join('&');
    }
    else
    {
        // It's individual post
        resp=key;
    }

    return resp;
}
const the_next_url=(pagination, key)=>
{
    key = !key ? 'next' : key;
    return (typeof pagination=='object' && pagination[key]) ? pager_helper(pagination[key]) : false;
}

const the_previous_url=(pagination)=>
{
    return the_next_url(pagination, 'previous');
}

const PaginateLinks=(props)=>
{
    let {pagination={}, wrapper, hide_single=true, class_name='', active_class='current'}=props;

    let {pages=[], current=false}=pagination || {};

    let Wrapper = wrapper;

    return (pages.length<=1 && hide_single) ? null :
    pages.map(content=>
    {
        // Get url and page number
        let url=pager_helper(content.url || content);
        let page=typeof content=='object' ? content.page+1 : content;

        // Generate class name
        let className=class_name+' '+(current==(content.url || content) ? active_class : '');

        var anchor=<a key={url} href={url} className={className} {...props}>{page}</a>

        return Wrapper ? <Wrapper>{anchor}</Wrapper> : anchor
    });
}

export {
    the_title, 
    the_content, 
    the_author, 
    the_date,
    the_permalink,
    the_excerpt,
    
    the_next_url,
    the_previous_url,
    PaginateLinks
}