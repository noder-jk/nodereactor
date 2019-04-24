import React, {Component} from "react";
import axios from 'axios';
import Swal from 'sweetalert2';

import {ajax_url ,Loading,Placeholder} from 'nodereactor/react';
import './style.scss';

class ProcessPlugins extends Component
{
    constructor(props)
    {
        super(props);

        let plugins=this.props.ResponseData;

        let ob={}
        for(let k in plugins)
        {
            ob[k]=plugins[k];
        }

        this.state={'plugins':ob}

        this.activateDeactivate=this.activateDeactivate.bind(this);
    }

    activateDeactivate(e, pkg, t_do)
    {
        e.preventDefault();

        let dt={  
            type:'plugin',
            action:'nr_theme_plugin_action',
            to_do:t_do,
            node_package:pkg
        }

        axios({
            method:'post',
            url:ajax_url ,
            data:dt
        }).then(r=>
        {
            if(r.data && r.data.status=='done')
            {
                let pl=this.state.plugins;

                pl[pkg].activated=dt.to_do=='activate' ? true : false;

                this.setState({'plugins':pl});
            }
            else
            {
                Swal.fire('Action failed.');
            }
        }).catch(r=>
        {
            Swal.fire('Request Error');
        })
    }

    render()
    {
        let plugins=this.props.ResponseData;

        return(
            <div id="installed_plugins">
                <h3>Installed Plugins</h3>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Author</th>
                            <th>Description</th>
                            <th>Version</th>
                            <th>License</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(plugins).map(k=>
                            {
                                let ind_p=this.state.plugins[k] || {};
                               
                                let {author={}}=plugins[k];
                                let {name='', url=''}=author;

                                return(
                                    <tr key={k} className={ind_p.activated ? 'activated_plugin' : 'deactivated_plugin'}>
                                        <td>
                                            {k}

                                            <div className="mt-4">
                                                <a className="activate_plugin text-success" onClick={(e)=>this.activateDeactivate(e, k,'activate')}>Activate</a>
                                                <a className="deactivate_plugin text-danger" onClick={(e)=>this.activateDeactivate(e, k,'deactivate')}>Deactivate</a>
                                            </div>
                                        </td>
                                        <td><a href={url} target="_blank">{name}</a></td>
                                        <td>{plugins[k].description}</td>
                                        <td>{plugins[k].version}</td>
                                        <td>{plugins[k].license}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

const InstalledPlugins=()=>
{
    return <Placeholder Data={{'action':'nr_get_plugins'}} Component={ProcessPlugins}/>
}

export {InstalledPlugins}