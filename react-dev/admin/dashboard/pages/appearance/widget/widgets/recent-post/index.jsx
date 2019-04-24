import React, {Component} from "react";

const RecentPostInput=(props)=>
{
    const {properties}=props;

    return(
        <div>
			<textarea type="text" name="arbitrary_text" placeholder="Enter Texts" className="form-control"></textarea>
        </div>
    )
} 


const RecentPostOutput=()=>
{
    return(
        <p>This is recent</p>
    )
}

export {RecentPostInput, RecentPostOutput}