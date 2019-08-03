import React, {Component} from "react";
import Swal from 'sweetalert2';

import {ajaxRequest} from 'nodereactor/react';


class Uploader extends Component
{
    constructor(props)
    {
        super(props);

        this.state={'button_disabled':false, 'upload_details': <span>Select Files to Start Upload.</span>};
        
        this.startUpload=this.startUpload.bind(this);
        this.progressHandler=this.progressHandler.bind(this);
        this.callbackHandler=this.callbackHandler.bind(this);
    }

    progressHandler(progressEvent, files_to_upload_total, files_to_upload) 
    {
        let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );

        let d=<span>Upload in Progress: 
            {
                (files_to_upload_total-files_to_upload.length) +'/'+ files_to_upload_total + ' ('+ percentCompleted +')%'
            }
        </span>

        this.setState({upload_details:d})
    }

    callbackHandler(r, d, e, files_to_upload, upload_loop)
    {
        let ob=
        {
            button_disabled:false, 
            upload_details:<span>Upload has been completed.</span>
        };

        if(e)
        {
            ob.upload_details=<span>Upload Request Failed.</span>;
        }
        else if(!r.insertId)
        {
            ob.upload_details=<span>Upload Failed.</span>;
        }
        else if(files_to_upload.length>0)
        {
            upload_loop();
        }
        
        this.setState(ob);
    }

    startUpload(e)
    {
        let input=e.currentTarget;

        let files_to_upload=[];
        for(let i=0; i<input.files.length; i++)
        {
            if(input.files[i].size>window.nr_configs.max_upload_size_byte)
            {
                Swal.fire('Action failed. '+input.files[i].name+' exceeds size limit '+window.nr_configs.max_upload_size_readable+'.');
                return;
            }

            files_to_upload.push(input.files[i]);
        }
        
        let files_to_upload_total=files_to_upload.length;
				
		let upload_loop=()=>
        {
            if(files_to_upload.length==0)
            {
                this.setState({button_disabled:false});
                return;
            }

            !this.state.button_disabled ? this.setState({button_disabled:true}) : 0;

            // process file
            let f=files_to_upload.shift();
            let formData = new FormData();
            formData.append('nr_media_file', f, f.name);
            formData.append('to_do','upload');
            
            // start upload single file
            ajaxRequest
            (
                'nr_media_upload', 
                formData, 
                (r, d, e)=>this.callbackHandler(r, d, e, files_to_upload, upload_loop), 
                (p)=>this.progressHandler(p, files_to_upload_total, files_to_upload)
            );
        }

		upload_loop();
    }

    render()
    {
        let {button_disabled, upload_details}=this.state;

        return(
            <div id="attachment_uploader" className="uploader-inline">	
                <div className="uploader-inline-content no-upload-message">	
                    <div className="upload-ui">	
                        <button disabled={button_disabled} type="button" className="btn btn-outline-secondary btn-lg" onClick={(e)=>e.currentTarget.nextElementSibling.click()}>Select Files</button>
                        <input type="file" style={{'display':'none'}} onChange={this.startUpload} multiple="multiple"/>
                    </div>
                    <div className="upload-inline-status">		
                        {upload_details}
                    </div>
                    <div className="post-upload-ui">	
                        <p className="max-upload-size">Individual File Size Limit {window.nr_configs.max_upload_size_readable}.</p>
                    </div>
                </div>
            </div>
        )
    }
}

export {Uploader}