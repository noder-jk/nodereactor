import React, {Component} from "react";
import {ajax_url } from 'nodereactor/react';
import {Helmet} from 'react-helmet';
import axios from 'axios';
import Swal from 'sweetalert2';
import Spinner from 'react-svg-spinner';

import './style.css';

class LoginRegistration extends Component
{
    constructor(props)
    {
        super(props);

        this.state={
            user_username:'',
            user_password:'',
            'loading':false
        }

        this.handleChange=this.handleChange.bind(this);
        this.Login=this.Login.bind(this);
    }

    
    handleChange(event)
    {
        this.setState({[event.target.name]:event.target.value});
    }

    Login()
    {
        this.setState({'loading':true})
        axios({
            method:'post',
            url:ajax_url ,
            data:Object.assign({'action':'nr_login'}, this.state)
        }).then(r=>
        {
            if(r.data && r.data.status=='done' && r.data.go_to)
            {
                window.location.assign(r.data.go_to);
            }
            else
            {
                Swal.fire('Error', (r.data.message ?  r.data.message : 'Something went wrong. Could not login.'), 'error');
            }
            this.setState({'loading':false})
        }).catch(r=>
        {
            Swal.fire('Error', 'Something went wrong.', 'error');
            this.setState({'loading':false})
        })
    }

    render()
    {
        return(
            <div className="container-fluid">
                <Helmet>
                    <title>NodeReactor Login</title>
                </Helmet>
                
                <div className="container login_container">
                    <p className="text-right"><i>Login . . . </i> {this.state.loading ? <Spinner size="15px"/> : null}</p>
                    
                    <br/><b>Username or Email Address</b>
                    <input name="user_username" className="form-control" type="text" onChange={this.handleChange}/>
                    
                    <br/><b>Password</b>
                    <input name="user_password" className="form-control" type="text" onChange={this.handleChange}/>
                    
                    <br/>
                    <div className="right">
                        <button className="btn btn-secondary" onClick={this.Login}>Log In</button>
                    </div>
                </div>
            </div>
        )
    }
}

export {LoginRegistration}