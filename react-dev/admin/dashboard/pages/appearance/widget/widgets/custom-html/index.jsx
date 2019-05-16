import React from "react";

import {do_shortcodes} from 'nodereactor/react';

const CustomHtmlInput=(props)=>
{
    let {custom_code=''}=props;

    return(
        <div>
			<textarea type="text" name="custom_code" placeholder="Enter Code" defaultValue={custom_code} className="form-control"></textarea>
            <small className="text-info"><i>This widget supports Shortcode</i></small>
        </div>
    )
} 


const CustomHtmlOutput=(props)=>
{
    let {custom_code=''}=props;

    return do_shortcodes(custom_code)
}

export {CustomHtmlInput, CustomHtmlOutput}