import React from 'react';
import Spinner from 'react-svg-spinner';

const get_url_parameter=(name)=>
{
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};


const Pagination=(props)=>
{
    let {pgn={}, wrapperId='', activeClass='', inactiveClass='', onClick=false}=props;

    if(!pgn.pages || !Array.isArray(pgn.pages) || pgn.pages.length==0)
    {
        return null;
    }
    
    return(
        <div id={wrapperId}>
            {
                pgn.pages.length==0 ? null :
                pgn.pages.map(item=>
                {
                    let attr=
                    {
                        'href'          :   '?page='+item,
                        'data-offset'   :   item,
                        'key'           :   'offset_'+item,
                        'className'     :   item==pgn.current ? activeClass : inactiveClass
                    }

                    onClick ? attr.onClick=(e)=>onClick(e, item) : 0;

                    return <a {...attr}>{item}</a>
                })
            }
        </div>
    )
}


const get_hierarchy=function(arg, parent, id, not_parent)
{
    if(!Array.isArray(arg))
    {
        return arg;
    }

	let id_key=id;
	let parent_key=parent;
	not_parent=not_parent || 'sttt';

	let ar=[];

	/* Generate nested feelings in flat list */
	let get_space=(parent, base)=>
	{
		arg.map(item=>
		{
			if(item[parent_key]==parent && item[id_key]!==not_parent)
			{
				item.nest_level=base;

				ar.push(item);

				get_space(item[id_key], base+1);
			}
		});
	}

	get_space(0, 0);

	return ar;
}

const SpinIcon=(props)=>
{
    let {show, space=true, size="15px"}=props;

    let Sp=<Spinner size={size}/>

    return show ? (space ? <span>&nbsp; {Sp}</span> : Sp) : null
}

export {get_url_parameter, Pagination, SpinIcon, get_hierarchy}