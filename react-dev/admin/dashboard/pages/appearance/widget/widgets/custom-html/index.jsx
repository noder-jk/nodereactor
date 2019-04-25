import React from "react";

const CustomHtmlInput=(props)=>
{
    let {custom_code=''}=props;

    return(
        <div>
			<textarea type="text" name="custom_code" placeholder="Enter Code" defaultValue={custom_code} className="form-control"></textarea>
        </div>
    )
} 


const CustomHtmlOutput=(props)=>
{
    let {custom_code=''}=props;

    return <div dangerouslySetInnerHTML={{__html:custom_code}}></div>
}

export {CustomHtmlInput, CustomHtmlOutput}