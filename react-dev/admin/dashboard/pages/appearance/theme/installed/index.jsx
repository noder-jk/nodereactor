import React, {Component} from "react";
import axios from 'axios';
import {ajax_url ,Loading,Placeholder} from 'nodereactor/react';

import './style.scss';

class ProcessTheme extends Component
{
    constructor(props)
    {
        super(props);
        
        let ob={}
        for(let k in this.props.ResponseData)
        {
            ob[k]={'activated':this.props.ResponseData[k].activated}
        }

        this.state={'themes':ob};

        this.activateTheme=this.activateTheme.bind(this);
    }
    
    activateTheme()
    {

    }

    render()
    {
        const themes=this.props.ResponseData;

        return(
            <div className="row" id="theme_list_cont">
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
                                        <span style={{"float":"left","padding":"6px 0px"}}>{k}</span>
                                        <span className="theme_action">
                                            <button className="btn btn-info btn-sm" onClick={this.activateTheme}>Activate</button>
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

const InstalledThemes=()=>
{
    return <Placeholder Data={{'action':'nr_get_installed_themes'}} Component={ProcessTheme}/>
}

export {InstalledThemes}