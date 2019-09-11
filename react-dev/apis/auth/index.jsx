import React, {Component} from "react";
import Swal from 'sweetalert2';
import Spinner from 'react-svg-spinner';

import {ajax_request, login, parse_dom_form, SpinIcon} from 'nodereactor/react';

import './style.css';

class LoginRegistration extends Component
{
    constructor(props)
    {
        super(props);

        this.state=
        {
            'loading':false
        }

        this.Login=this.Login.bind(this);
    }

    Login()
    {
        this.setState({'loading':true});

        let form=parse_dom_form(this.auth_form);

        console.log(form);

        ajax_request('nr_login', form, (r, d, e)=>
        {
            this.setState({'loading':false});

            if(e)
            {
                Swal.fire('Error', 'Request Failed. Something Went Wrong.', 'error');
                return;
            }

            let {message='Login Unsuccessful.', status='error', go_to=false}=r;

            if(status=='success' && go_to)
            {
                window.location.assign(go_to);
                return;
            }
            
            Swal.fire('Error', message, 'error');
        });
    }

    render()
    {
        return <div className="container-fluid">
            <div className="container login_container" ref={el=>this.auth_form=el}>
                <br/><b>Username or Email Address</b>
                <input name="username" className="form-control" type="text"/>
                
                <br/><b>Password</b>
                <input name="password" className="form-control" type="text"/>
                
                {login()}

                <br/>
                <div className="text-right">
                    <button className="btn btn-secondary" onClick={this.Login}>
                        Log In
                        <SpinIcon show={this.state.loading}/>
                    </button>
                </div>
            </div>
        </div>
    }
}

export {LoginRegistration}