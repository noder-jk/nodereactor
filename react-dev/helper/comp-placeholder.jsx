import React, {Component} from "react";
import Spinner from "react-svg-spinner";

import {ajax_request} from 'nodereactor/react';

class Placeholder extends Component
{
    constructor(props)
    {
        super(props);

        let {spinnerCenter=false}=this.props;

        let ldr=<Spinner size="15px"/>
        
        this.state=
        {
            content: spinnerCenter ? <div style={{'textAlign':'center'}}>{ldr}</div> : ldr
        }
    }
    
    componentDidMount()
    {
        let {
                action, 
                data={}, 
                component, 
                properties={}
            }=this.props;
            
        let Comp=component;

        ajax_request(action, data, (r, d, e)=>
        {
            let content= <Comp response={r} responseData={d} error={e} properties={properties}/>
                            
            this.setState({content});
        });
    }

    componentDidCatch()
    {
        let {action}=this.props;

        this.setState({content:<span className="text-danger">Placeholder Crashed. Action: {action}</span>});
    }

    render()
    {
        return this.state.content
    }
}

export {Placeholder}