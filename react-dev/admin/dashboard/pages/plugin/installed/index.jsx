import React, {Component} from "react";
import Swal from 'sweetalert2';

import {ajax_request, Placeholder, SpinIcon} from 'nodereactor/react';
import './style.scss';

class ProcessPlugins extends Component
{
    constructor(props)
    {
        super(props);

        let plugins=this.props.response;

        let ob={}
        for(let k in plugins)
        {
            ob[k]=plugins[k];
        }

        this.state=
        {
            'plugins':ob,
            'loading':false
        }

        this.activateDeactivate=this.activateDeactivate.bind(this);
    }

    activateDeactivate(e, pkg, t_do)
    {
        e.preventDefault();

        let dt=
        {  
            type:'plugin',
            to_do:t_do,
            node_package:pkg
        }

        this.setState({loading:pkg});
        ajax_request('nr_theme_plugin_action', dt, (r,d,e)=>
        {
            let ob={loading:false};
            
            if(e)
            {
                Swal.fire('Request Error');
            }
            else if(r.status!=='success')
            {
                Swal.fire('Action failed.'); 
            }
            else
            {
                let pl=this.state.plugins;
                pl[pkg].activated=dt.to_do=='activate';
                ob.plugins=pl;
            }
            
            this.setState(ob);
        });
    }

    render()
    {
        let plugins=this.props.response;

        return <div id="installed_plugins">
            <h3>Installed Plugins</h3>
            <small>Please reload page (for updated dashboard) after changing active statuses.</small>
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
                            let {name='', url=false}=author;

                            return <tr key={k} className={ind_p.activated ? 'activated_plugin' : 'deactivated_plugin'}>
                                <td>
                                    {k}

                                    <div className="mt-2">
                                        <a className="activate_plugin text-success" onClick={(e)=>this.activateDeactivate(e, k,'activate')}>Activate</a>
                                        <a className="deactivate_plugin text-danger" onClick={(e)=>this.activateDeactivate(e, k,'deactivate')}>Deactivate</a>
                                        <SpinIcon show={this.state.loading==k}/>
                                    </div>
                                </td>
                                <td>
                                    {!url ? name : <a href={url} target="_blank">{name}</a>}
                                </td>
                                <td>{plugins[k].description}</td>
                                <td>{plugins[k].version}</td>
                                <td>{plugins[k].license}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    }
}

const InstalledPlugins=()=>
{
    return <Placeholder action="nr_get_plugins" component={ProcessPlugins}/>
}

export {InstalledPlugins}