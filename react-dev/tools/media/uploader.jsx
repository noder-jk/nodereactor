import React, {Component} from "react";
import axios from 'axios';
import Swal from 'sweetalert2';

import {ajax_url } from 'nodereactor/react';


class Uploader extends Component
{
    constructor(props)
    {
        super(props);

        this.state={'button_disabled':false, 'upload_details': <span>Select Files to Start Upload.</span>};
        
        this.startUpload=this.startUpload.bind(this);
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

            if(!this.state.button_disabled)
            {
                this.setState({button_disabled:true});
            } 

            let f=files_to_upload.shift();

            let formData = new FormData();
            formData.append('nr_media_file', f, f.name);
            formData.append('to_do','upload');
            formData.append('action','nr_media_upload');
            
            axios({
                method:'post',
                url:ajax_url ,
                data:formData,
                headers:{'Content-Type':'multipart/form-data'},
                onUploadProgress:(progressEvent)=> 
                {
                    let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );

                    let d=<span>Upload in Progress: 
                        {
                            (files_to_upload_total-files_to_upload.length) +'/'+ files_to_upload_total + ' ('+ percentCompleted +')%'
                        }
                    </span>

                    this.setState({upload_details:d})
                }
            }).then(r=>
            {
                if(!r.data || !r.data.insertId)
                {
                    this.setState({button_disabled:false, upload_details:<span>Upload Error. Probably server error or no internet, or you are logged out.</span>});
                }
                else
                {
                    if(files_to_upload.length>0)
                    {
                        upload_loop();
                    }
                    else
                    {
                        this.setState({button_disabled:false, upload_details:<span>Upload has been completed.</span>});
                    }
                }
            }).catch(r=>
            {
                this.setState({button_disabled:false, upload_details:<span>Upload Error.</span>});
            });
        }

		upload_loop();
    }

    render()
    {
        return(
            <div id="attachment_uploader" className="uploader-inline">	
                <div className="uploader-inline-content no-upload-message">	
                    <div className="upload-ui">	
                        <button disabled={this.state.button_disabled} type="button" className="btn btn-outline-secondary btn-lg" onClick={(e)=>e.currentTarget.nextElementSibling.click()}>Select Files</button>
                        <input type="file" style={{'display':'none'}} onChange={this.startUpload} multiple="multiple"/>
                    </div>
                    <div className="upload-inline-status">		
                        {
                            this.state.upload_details
                        }
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