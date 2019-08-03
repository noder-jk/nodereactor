import React, {Component} from "react";
import Helmet from 'react-helmet';
import Swal from 'sweetalert2';
import Spinner from 'react-svg-spinner';

import {ajaxRequest ,LoginRegistration} from 'nodereactor/react';

import './style.css';
import Banner from './banner.jpg';

class NodeReactorInstaller extends Component
{
    constructor(props)
    {
        super(props);

        this.state={
            active_tab:'db',
            db_name:'',
            db_username:'root',
            db_password:'',
            db_host:'localhost',
            db_engine:'InnoDB',
            tb_prefix:'nr_',
            user_display_name:'',
            user_username:'',
            user_email:'',
            user_password:'',
            loading:false
        }

        this.handleChange=this.handleChange.bind(this);
        this.goNext=this.goNext.bind(this);
        this.input=this.input.bind(this);
    }

    input(props)
    {
        let {title, name}=props;

        return(
            <div className="row">
                <div className="col-12 col-sm-5"><b>{title}</b></div>
                <div className="col-12 col-sm-7"><input onChange={this.handleChange} className="form-control" name={name} type="text" defaultValue={this.state[name]}/></div>
            </div>
        )
    }

    showHide(tab)
    {
        return this.state.active_tab==tab ? {} : {'display':'none'};
    }

    handleChange(event)
    {
        this.setState({[event.target.name]:event.target.value});
    }

    goNext(install_now)
    {
        let to_do = 'check_db';
        let next_tab='account';

        if(install_now==true)
        {
            if(!confirm('Existing table will be replaced. It can not be undone. Sure to continue?'))
            {
                return;
            }

            to_do='set_up';
            next_tab='login';
        }

        if(/\S+/.test(this.state.db_name)==false)
        {
            Swal.fire('Attention', 'Please enter database name', 'warning');
            return;
        }

        this.setState({'loading':true});

        ajaxRequest('nr_install_check', {to_do, ...this.state}, (r, d, e)=>
        {
            this.setState({'loading':false});

            if(e)
            {
                Swal.fire('Error', 'Could not connect server.', 'error');
                return;
            }

            let {status='failed', message='Could not process request. Please make sure configs are correct.'}=r;

            if(status!=='done')
            {
                Swal.fire('Error', message, 'error');
                return;
            }

            this.setState({active_tab:next_tab});
        });
    }

    render()
    {
        return(
            <main id="installer_main">
                <Helmet>
                    <title>NodeReactor Installation</title>
                </Helmet>

                <br/>
                <div className="text-center">
                    
                    
                </div>


                <div className="text-center installation_steps" id="get_config">
                    <img src={Banner} style={{'width':'100%'}}/>
                    <small>Created by <b>JK</b>. Inspired by <b>WordPress</b>.</small>
                </div>

                <div className="text-center">
                    {this.state.loading ? <Spinner size="15px"/> : null}
                </div>
                
                <div className="installation_steps" id="get_config" style={this.showHide('db')}>
				    <h4>Database Information</h4>
                    <hr/>
                    <p>
                        Enter database connection details.
                        <span style={{"color":"#aa0000"}}>
                            Please make sure MySQL database is running. And rememeber,
                            <b>existing table with same name will be replaced</b>.
                        </span>
                        Visit <a href="http://NodeReactor.com/getting-started/installation/" target="_blank">installation</a> tutorial for details and using existing tables.
                    </p>

                    <this.input title="Database Name" name="db_name"/>
                    <br/>

                    <this.input title="Database Username" name="db_username"/>
                    <br/>

                    <this.input title="Database Password" name="db_password"/>
                    <br/>

                    <this.input title="Database Host" name="db_host"/>
                    <br/>

                    <this.input title="Table Prefix" name="tb_prefix"/>
                    <br/>

                    <this.input title="Database Engine" name="db_engine"/>
                    <br/>

                    <div className="text-right">
                        <button data-button="submit" className="btn btn-secondary" onClick={this.goNext}>Next</button>
                    </div>
                </div>

                <div className="installation_steps" id="siteinfo" style={this.showHide('account')}>
                    <h4>Information needed</h4>
                    <hr/>

                    <p>Please provide the following information to create admin account. <br/><small>Don’t worry, you can always change these (except username) in setting page later.</small></p>

                    <this.input title="Display Name" name="user_display_name"/>
                    <br/>

                    <this.input title="Username" name="user_username"/>
                    <br/>

                    <this.input title="Password" name="user_password"/>
                    <br/>

                    <this.input title="Email" name="user_email"/>
                    <br/>

                    <div className="text-right">
                        <button className="btn btn-secondary" onClick={()=>{this.setState({'active_tab':'db'})}}>Back</button>
                        &nbsp;&nbsp;
                        <button className="btn btn-secondary" onClick={()=>this.goNext(true)}>Install</button>
                    </div>
                </div>

                <div className="installation_steps" id="login_hint" style={this.showHide('login')}>
                    <h2>Success!</h2>
                    <hr/>
                    <p>NodeReactor has been installed. Now you may login using account info you submitted during installation.</p>
                    <br/>
                    <LoginRegistration/>
                </div>
            </main>
        )
    }
}

export {NodeReactorInstaller}
