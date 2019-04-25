import React from "react";

const ArbitraryTextInput=(props)=>
{
    let {arbitrary_text=''}=props;

    return(
        <div>
			<textarea type="text" name="arbitrary_text" placeholder="Enter Texts" defaultValue={arbitrary_text} className="form-control"></textarea>
        </div>
    )
} 


const ArbitraryTextOutput=(props)=>
{
    let {arbitrary_text=''}=props;

    return <p>{arbitrary_text}</p>
}

export {ArbitraryTextInput, ArbitraryTextOutput}