import React, {Component} from "react";

import {Browser} from './browser';
import {Uploader} from './uploader';

import './wp-style.css';
import './style.scss';

class Media extends Component
{
    constructor(props)
    {
        super(props);

        this.state=
        {
            'active_tab':'uploader', 
            'selected_files':[]
        }

        this.navigate=this.navigate.bind(this);
        this.closeThisMedia=this.closeThisMedia.bind(this);
        this.getSelected=this.getSelected.bind(this);
        this.insertEvent=this.insertEvent.bind(this);
    }

    getSelected(files)
    {
        this.setState({selected_files:files});
    }

    navigate(e,tab)
    {
        e.preventDefault();
        this.setState({'active_tab':tab});
    }

    insertEvent()
    {
        let {onResult=false, multiple=false}=this.props;

        if(typeof onResult=='function')
        {
            let f=multiple==true ? this.state.selected_files : this.state.selected_files[0];
            
            onResult(f);
        }

        this.closeThisMedia();
    }

    closeThisMedia()
    {
        let {onClose=()=>{}}=this.props;
        onClose();
    }

    render()
    {
        let {adminCall=false, insertText="Insert", cancelText="Cancel", multiple=false}=this.props;

        let cls="media-modal wp-core-ui fixed-media";

        if(adminCall==true)
        {
            cls+=' dedicated-media';
        }

        let insert_disable=this.state.selected_files.length>0 ? false : true;

        let {accept=[]}=this.props;
        
        return <div className="nr-media-uploader-explorer">	
            <div className={cls}>	
                <div className="media-modal-content">	
                    <div className="media-frame mode-select wp-core-ui" id="__wp-uploader-id-0">	
                        <div className="media-frame-title">	
                            <h1>File Manager</h1>
                        </div>
                        <div className="media-frame-router">	
                            <div className="media-router">	
                                <a href="#" className={"media-menu-item"+(this.state.active_tab=='uploader' ? ' active' : '')} onClick={(e)=>this.navigate(e, 'uploader')}>
                                    Upload Files
                                </a>
                                <a href="#" data-current_offset="1" className={"media-menu-item"+(this.state.active_tab=='explorer' ? ' active' : '')} onClick={(e)=>this.navigate(e, 'explorer')}>
                                    Media Library
                                </a>
                            </div>
                        </div>
                        <div className="media-frame-content" data-columns="6">	
                            {
                                this.state.active_tab=='explorer' ? <Browser onSelectChange={this.getSelected} multiple={multiple} accept={accept}/> : <Uploader/>
                            }	
                        </div>
                        {
                            adminCall ? null : 
                            <div className="media-frame-toolbar">	
                                <div className="media-toolbar">	
                                    <div className="media-toolbar-secondary">	
                                        <div className="media-selection">
                                            
                                        </div>
                                    </div>
                                    <div className="media-toolbar-primary search-form mr-3">	
                                        <button className="btn btn-outline-secondary btn-sm mr-1 mt-3" onClick={this.closeThisMedia}>{cancelText}</button>
                                        <button className="btn btn-outline-secondary btn-sm mt-3" disabled={insert_disable} onClick={this.insertEvent}>{insertText}</button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="media-modal-backdrop">
                
            </div>
        </div>
    }
}

export {Media}