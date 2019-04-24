import React, {Component} from "react";
import axios from 'axios';
import Spinner from "react-svg-spinner";

import {ajax_url } from 'nodereactor/react';

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

        axios({
            method:'post',
            url:ajax_url ,
            data:Data
        }).then(r=>
        {
            this.setState({content:<Component Response={r || {}} ResponseData={(r && r.data) ? r.data : {}} {...params}/>});
        }).catch(r=>
        {
            this.setState({content:<span className="text-danger">Request Error.</span>})
        })
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