import React, {Component} from "react";
import Swal from 'sweetalert2';

import {ajax_request, SpinIcon} from 'nodereactor/react';

import './style.scss';

class InstalledThemes extends Component
{
    constructor(props)
    {
        super(props);
        
        this.state=
        {
            'themes':{},
            'loading':false
        };

        this.activateTheme=this.activateTheme.bind(this);
        this.fetchThemes=this.fetchThemes.bind(this);
    }
    
    fetchThemes()
    {
        this.setState({'loading':true});

        ajax_request('nr_get_installed_themes', r=>
        {
            let ob={'loading':false};

            r.themes ? ob.themes=r.themes : 0;

            this.setState(ob);
        });
    }

    activateTheme(pkg)
    {
        let dt=
        {
            type:'theme',
            to_do:'activate',
            node_package:pkg
        }

        this.setState({'loading':true});

        ajax_request('nr_theme_plugin_action', dt, (r,d,e)=>
        {
            if(!e)
            {
                this.fetchThemes();
                return;
            }

            this.setState({'loading':false});
            Swal.fire('Error', 'Request Failed. Something went wrong.', 'error');
        });
    }

    componentDidMount()
    {
        this.fetchThemes();
    }

    render()
    {
        let {themes, loading}=this.state;

        return <div className="row" id="theme_list_cont">
            <div className="col-12">
                <h3>
                    Installed Themes
                    <SpinIcon show={loading}/>
                </h3>
            </div>

            <table className="bg-white table table-bordered">
                <thead>
                    <tr>
                        <th>Thumbnail</th>
                        <th>Package</th>
                        <th>Description</th>
                        <th>Version</th>
                        <th>Author</th>
                        <th>License</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(themes).map(k=>
                        {
                            let ind_theme=themes[k] ? themes[k] : {};

                            let {
                                    thumbnail, 
                                    activated,
                                    description,
                                    author,
                                    version,
                                    license
                                }=ind_theme;

                            let {name='', url=false}=author;

                            let btn_cls='btn btn-'+(activated ? 'secondary' : 'info')+' btn-sm';

                            return <tr key={k} className="data_el col-12 col-md-6 col-xl-3 mb-4">
                                <td>
                                    <img src={thumbnail}/>

                                    <button className={btn_cls} disabled={activated} onClick={activated ? _=>{} : _=>this.activateTheme(k)}>
                                        {activated ? 'Activated' : 'Activate'}
                                        
                                        <SpinIcon show={loading}/>
                                    </button>
                                </td>
                                <td>
                                    {k}
                                </td>
                                <td>
                                    {description}
                                </td>
                                <td>
                                    {version}
                                </td>
                                <td>
                                    {!url ? name : <a href={url} target="_blank">{name}</a>}
                                </td>
                                <td>
                                    {license}
                                </td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    }
}

export {InstalledThemes}