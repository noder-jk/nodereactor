import React, {Component} from "react";
import axios from 'axios';
import Spinner from 'react-svg-spinner';
import Swal from 'sweetalert2';

import {ajax_url } from 'nodereactor/react';

import './style.scss';

class Users extends Component
{
    constructor(props)
    {
        super(props);

        this.state=
        {
            'users':[],
            'current_user_id':0,
            'user_action':'',
            'loading':false
        }

        this.selectUser=this.selectUser.bind(this);
        this.deleteUser=this.deleteUser.bind(this);
        this.userAction=this.userAction.bind(this);
        this.fetchUser=this.fetchUser.bind(this);
    }

    userAction(e)
    {
        let el=e.currentTarget;

        this.setState({'user_action':el.value});
    }

    selectUser(e, id)
    {
        let el=e.currentTarget;

        let st=this.state.users;
        for(let i=0; i<st.length; i++)
        {
            st[i].user_id==id ? st[i].user_selected=el.checked : null;
        }

        this.setState({'users':st});
    }

    deleteUser()
    {
        /* Get selected ids */
        let selected=[];
        let st=this.state.users;
        for(let i=0; i<st.length; i++)
        {
            st[i].user_selected ? selected.push(st[i].user_id) : null;
        }
        
        /* Check if deletable */
        if(selected.length==0 || this.state.user_action==''){return;}

        Swal.fire
        ({
            title: 'Sure to delete?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true
        }).then((result) => 
        {
            if(!result.value){return;}

            /* Now request to server to delete. */
            this.setState({'loading':true});
            axios({
                method:'post',
                data:{'action':'nr_delete_users', 'user_ids':selected, 'user_action':this.state.user_action},
                url:ajax_url 
            }).then(r=>
            {
                this.setState({'loading':true},this.fetchUser);
            }).catch(r=>
            {
                this.setState({'loading':false});
                
                Swal.fire('Request Error');   
            });
        });
    }

    fetchUser()
    {
        this.setState({'loading':true});

        axios({
            method:'post',
            url:ajax_url ,
            data:{'action':'nr_get_users'}
        }).then(r=>
        {
            let users=Array.isArray(r.data.users) ? r.data.users : [];
            let current_user_id=r.data.current_user_id;

            this.setState
            ({
                'users':users, 
                'current_user_id': current_user_id, 
                'loading':false
            });
        }).catch(r=>
        {
            this.setState({'loading':false});
        });
    }

    componentDidMount()
    {
        this.fetchUser();
    }

    render()
    {
        let current_user_id=this.state.current_user_id;
        let users=this.state.users;

        return(
            <div id="users_container">
                <h4>Registered Users {this.state.loading==true ? <Spinner size="15px"/> : null}</h4>
                
                {this.state.user_action=='abandon' ? <small>Everything of this user except username and email will be deleted. So, email and username will not be reusable.</small> : null}
                {this.state.user_action=='delete' ? <small>Everything will be deleted. Username and email will be reusable by someone else.</small> : null}
                <div>
                    <div className="d-inline-block form-group form-inline mr-2 mb-1">
                        <select className="form-control form-control-sm float-left" defaultValue={this.state.user_action} onChange={this.userAction}>
                            <option value="">Bulk Action</option>
                            <option value="abandon" title="All data except user name and email will be deleted permanently.">Abandon Permanently</option>
                            <option value="delete" title="Delete everything. The email and username associated with this account can be allocated again.">Delete Permanently</option>
                        </select>
                        <button className="btn btn-sm btn-outline-secondary" onClick={this.deleteUser} title="Click to apply action">Apply</button>
                    </div>
                </div>

                {
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Username</th>
                                <th>Display Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map(item=>
                                {
                                    return <tr key={item.user_id}>
                                        <td>
                                            {current_user_id==item.user_id ? null : <input type="checkbox" onClick={(e)=>this.selectUser(e, item.user_id)}/>}
                                        </td>
                                        <td>
                                            <span style={{'display':'inline-block', 'float':'left'}}>
                                                <img src={item.gravatar}/>
                                            </span> 
                                            <span style={{'display':'inline-block', 'float':'left', 'marginLeft':'5px'}}>
                                                {item.user_login}<br/>
                                                <a className="text-info" href={"/nr-admin/users/edit/"+item.user_id}>Edit</a>
                                            </span>
                                        </td>
                                        <td>{item.display_name}</td>
                                        <td>{item.user_email}</td>
                                        <td>{item.user_role}</td>
                                        <td>{item.user_status}</td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                }
            </div>
        )
    }
}

export {Users}