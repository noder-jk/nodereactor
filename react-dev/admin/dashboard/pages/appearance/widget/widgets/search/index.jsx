import React from "react";

const SearchWidgetInput=()=>
{
    return <div></div>
}

const SearchWidgetOutput=()=>
{
    return <form method="get" action="/">
            <label>
                <input type="search" name="search" placeholder="Search . . ." />
            </label>
            <button type="submit">Search</button>
        </form>
}

export {SearchWidgetInput, SearchWidgetOutput}