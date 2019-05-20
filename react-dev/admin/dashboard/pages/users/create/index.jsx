import React, {Component} from "react";
import axios from 'axios';
import Spinner from "react-svg-spinner";
import Swal from 'sweetalert2';

import {ajax_url } from 'nodereactor/react';

const InputFields=(props)=>
{
    let {title, name, default_value, val_colletor, children=null}=props;

    return <div className="row mb-4">
                <div className="col-12 col-sm-4 col-md-3 col-lg-2">{title}</div>
                <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                    <input name={name} type="text" className="form-control" defaultValue={default_value} onChange={val_colletor}/>
                    {children}
                </div>
            </div>
}

class UserCreate extends Component
{
    constructor(props)
    {
        super(props);

        this.state={
            display_name:'',
            user_username:'',
            user_email:'',
			user_password:'',
			'message':null,
			loading:false
		}
		
		this.storeVal=this.storeVal.bind(this);
		this.createUser=this.createUser.bind(this);
    }

	storeVal(e)
	{
		let el=e.currentTarget;
		this.setState({[el.name]:el.value});
	}

	createUser()
	{
		this.setState({'message' : null, 'loading':true});

		let vals=this.state;
		delete vals.submitable;

		let send_data={'action':'nr_create_user', 'values':vals}

		axios({
			method:'post',
			url:ajax_url ,
			data:send_data
		}).then(r=>
		{
            Swal.fire(r.data.status, r.data.message, r.data.status.toLowerCase());
            this.setState({'loading':false });
            
		}).catch(e=>
		{
            Swal.fire('Error', 'Request Failed', 'error');
			this.setState({'loading':false});
		});
	}

    render()
    {
        return(
			<div>
                <div className="row mb-4">
                    <div className="col-12">
                        <h3>Add New User</h3>
						<small>
							Only administrator user role available for now.
							<br/>More user roles and role based capabilities will be added in future versions.
						</small>
                    </div>
                </div>

                <InputFields title="Display Name" name="display_name" default_value={this.state.display_name} val_colletor={this.storeVal}>
                    <small>Visible everywhere</small>
                </InputFields>

                <InputFields title="Username" name="user_username" default_value={this.state.user_username} val_colletor={this.storeVal}>
                    <small>
                        Profile slug. e.g. <b><i>example.com/username</i></b>. <br/>
                        It can not be changed later. <br/>
                        [Only Alphanumeric letter allowed.]
                    </small>
                </InputFields>

                <InputFields title="Email Address" name="user_email" default_value={this.state.user_email} val_colletor={this.storeVal}/>

                <InputFields title="Password" name="user_password" default_value={this.state.user_password} val_colletor={this.storeVal}>
                    <small>Min. 8, Max. 20 characters.</small>
                </InputFields>

                <div className="row mb-4">
                    <div className="col-12 col-sm-4 col-md-3 col-lg-2">User Role</div>
                    <div className="col-12 col-sm-8 col-md-6 col-lg-4">
						<select className="form-control" disabled="disabled" defaultValue="administrator">
							<option value="administrator">administrator</option>
						</select>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-12 col-sm-4 col-md-3 col-lg-2"></div>
                    <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                        <button className="btn btn-secondary btn-sm" onClick={this.createUser}>Create</button> &nbsp;&nbsp; 
                        {this.state.loading ? <Spinner size="15px"/> : null}
                    </div>
                </div>
				<div>
					{
						this.state.message
					}
				</div>
			</div>
        )
    }
}


export {UserCreate}