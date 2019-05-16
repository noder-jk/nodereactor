import React from 'react';

import {FindComp} from 'nodereactor/react/helper/comp-finder';

function trim (s, c) {
    if (c === "]") c = "\\]";
    if (c === "\\") c = "\\\\";
    return s.replace(new RegExp(
      "^[" + c + "]+|[" + c + "]+$", "g"
    ), "");
  }
  
const do_shortcode=(str)=>
{
    let pack='';
    let properties={};
    let comp_name='';

    /* Parse properties */
    let ind=str.indexOf(' ');
    ind=ind>-1 ? ind : str.indexOf(']');

    comp_name=str.slice(1, ind);

    let props=str.indexOf('properties=');
    if(props>-1)
    {
        try
        {
            let prp=str.slice(props+'properties='.length, str.lastIndexOf('}')+1);
            prp=prp.trim();
            properties=JSON.parse(prp);
        }
        catch(e)
        {
            
        }
    }
    
    /* Parse package name */
    pack=str.split('package=')[1] || '';
    pack=pack.split(' ').filter(item=>/\S+/.test(item)==true);
    pack=pack[0] || '';
    pack=trim(pack, ']');

    let comp_props=
    {
        'component':comp_name, 
        'nr_package':pack,
        'fallback_content':<span>{str}</span>
    }

    return <FindComp comp_props={comp_props} {...properties} />
}

const do_shortcodes=(value_p)=>
{
    let resps=[];

    let s_codes=value_p.match(/\[([a-z0-9_])+(\s.*?)?\]/ig);

    if(!Array.isArray(s_codes) || s_codes.length==0)
    {
        resps=<div className="nr-dangerous-html" key={'danger_'} dangerouslySetInnerHTML={{__html:value_p}}></div>
    }
    else
    {
        s_codes.forEach((c,i)=>
        {
            let v=value_p.split(c);

            let raw=<div className="nr-dangerous-html" key={'danger_'+i} dangerouslySetInnerHTML={{__html:(v[0] || '')}}></div>
            resps.push(raw);
            resps.push(<div className="nr-shortcode-container" key={'shortcode_'+i}>{do_shortcode(c)}</div>);


            v=v.slice(1);
            value_p=v.join(c);
        });
    }

    return [resps];
}

export {do_shortcode, do_shortcodes}