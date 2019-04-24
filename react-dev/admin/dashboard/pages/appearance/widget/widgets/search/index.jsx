import React, {Component} from "react";
import axios from 'axios';
import {ajax_url ,Loading,Placeholder} from 'nodereactor/react';


class SearchWidgetInput extends Component
{
    render()
    {
        return(<div></div>)
    }
}

class SearchWidgetOutput extends Component
{
    render()
    {
        return(
            <form method="get">
                <label>
                    <input type="search" placeholder="Search …" />
                </label>
                <input type="submit"/>
            </form>
        )
    }
}

export {SearchWidgetInput, SearchWidgetOutput}