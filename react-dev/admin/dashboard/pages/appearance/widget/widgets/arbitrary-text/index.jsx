import React, {Component} from "react";

const ArbitraryTextInput=(props)=>
{
    let {properties={}}=props;

    return(
        <div>
			<textarea type="text" name="arbitrary_text" placeholder="Enter Texts" defaultValue={properties.arbitrary_text} className="form-control"></textarea>
        </div>
    )
} 


const ArbitraryTextOutput=(props)=>
{
    let {properties={}}=props;
    let {arbitrary_text=''}=properties;

    return <p>{arbitrary_text}</p>
}

export {ArbitraryTextInput, ArbitraryTextOutput}