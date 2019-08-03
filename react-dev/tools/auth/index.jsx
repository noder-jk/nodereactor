import React, {Component} from "react";
import {Helmet} from 'react-helmet';
import Swal from 'sweetalert2';
import Spinner from 'react-svg-spinner';

import {ajaxRequest} from 'nodereactor/react';

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
        this.setState({'loading':true});

        ajaxRequest('nr_login', {...this.state}, (r, d, e)=>
        {
            this.setState({'loading':false});

            if(e)
            {
                Swal.fire('Error', 'Something went wrong.', 'error');
                return;
            }

            let {message='Something went wrong. Could not login.', status='failed', go_to=false}=r;

            if(status=='done' && go_to)
            {
                window.location.assign(go_to);
                return;
            }
            
            Swal.fire('Error', message, 'error');
        });
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