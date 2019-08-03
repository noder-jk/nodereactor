import React, {Component} from "react";
import Spinner from "react-svg-spinner";

import {ajaxRequest} from 'nodereactor/react';

class Placeholder extends Component
{
    constructor(props)
    {
        super(props);

        let {spinnerCenter=false}=this.props;

        let ldr=<Spinner size="15px"/>
        
        this.state={content: spinnerCenter ? <div style={{'textAlign':'center'}}>{ldr}</div> : ldr}
    }
    
    componentDidMount()
    {
        let {Data={},Component}=this.props;

        var params=Object.assign({},this.props);
        delete params.Data;
        delete params.Component;

        let action=Data.action;
        delete Data.action;

        ajaxRequest(action, Data, (r, d, e)=>
        {
            let ob= e ? {content:<span className="text-danger">Request Error.</span>} : {content:<Component Response={d || {}} ResponseData={r} {...params}/>};

            this.setState(ob);
        });
    }

    componentDidCatch()
    {
        this.setState({content:<span className="text-danger">Component Crashed.</span>})
    }

    render()
    {
        return this.state.content
    }
}

export {Placeholder}