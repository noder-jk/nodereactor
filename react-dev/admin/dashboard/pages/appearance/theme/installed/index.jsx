import React, {Component} from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import Spinner from 'react-svg-spinner';

import {ajax_url} from 'nodereactor/react';

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
        axios({
            'method':'post',
            'url':ajax_url,
            'data':{'action':'nr_get_installed_themes'}
        }).then(r=>
        {
            let ob={'loading':false};

            if(r.data.themes)
            {
                ob.themes=r.data.themes;
            }

            this.setState(ob);

        }).catch(e=>
        {
            this.setState({'loading':false});
        })
    }

    activateTheme(pkg)
    {
        let dt=
        {
            type:'theme',
            action:'nr_theme_plugin_action',
            to_do:'activate',
            node_package:pkg
        }

        this.setState({'loading':true});
        axios({
            'method':'post',
            'url':ajax_url,
            'data':dt
        }).then(r=>
        {
            this.fetchThemes();
        }).catch(e=>
        {
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
        let {themes}=this.state;

        return(
            <div className="row" id="theme_list_cont">
                <div className="col-12">
                    <h3>Installed Themes {this.state.loading ? <Spinner size="15px"/> : null}</h3>
                </div>
                {
                    Object.keys(themes).map(k=>
                    {
                        let item=themes[k];
                        let ind_theme=this.state.themes[k] ? this.state.themes[k] : {};

                        return (
                            <div key={k} className={"data_el col-12 col-md-6 col-xl-3 mb-4"+ (ind_theme.activated ? ' activated_theme' : '')}>
                                <div className="theme_thumb_cont">
                                    <div className="background_thumb" style={{'backgroundImage':'url('+item.thumbnail+')'}}></div>

                                    <div className="details_overlay">
                                        <div className="theme_detail_btn">
                                            <div>
                                                <span>Theme Details</span>
                                                <br/><br/>
                                            </div>
                                        </div>
                                    </div>
                                        
                                    <div className="button_container">
                                        <span style={{"float":"left","padding":"6px 0px"}}>{k}&nbsp;</span>
                                        <span className="theme_action">
                                            <button className="btn btn-info btn-sm float-right" onClick={()=>this.activateTheme(k)}>
                                                Activate &nbsp;
                                                {this.state.loading ? <Spinner size="15px"/> : null}
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export {InstalledThemes}