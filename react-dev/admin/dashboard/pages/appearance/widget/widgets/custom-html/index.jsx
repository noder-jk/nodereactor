import React, {Component} from "react";

const CustomHtmlInput=(props)=>
{
    let {properties={}}=props;

    return(
        <div>
			<textarea type="text" name="custom_code" placeholder="Enter Code" defaultValue={properties.custom_code} className="form-control"></textarea>
        </div>
    )
} 


const CustomHtmlOutput=(props)=>
{
    let {properties={}}=props;
    let {custom_code=''}=properties;

    return <div dangerouslySetInnerHTML={{__html:custom_code}}></div>
}

export {CustomHtmlInput, CustomHtmlOutput}