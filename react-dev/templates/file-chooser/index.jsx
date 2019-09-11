import React, {Component} from 'react';

import {RenderMediaFile} from '../../helper/render-media';
import {Media} from 'nodereactor/react';

import './style.scss';

class FileChooser extends Component
{
    constructor(props)
    {
        super(props);

        this.state=
        {
            media_opened:false,
            file:{},
        }

        this.getFile=this.getFile.bind(this);
    }

    getFile(file)
    {
        let {onChange}=this.props;
        onChange(file);

        this.setState({file});
    }

    render()
    {
        let {media_opened, file={}}=this.state;

        let {multiple, render=true, accept}=this.props;

        let url=file.file_url;
        let extension=file.file_extension;
        let mime=file.mime_type;        

        return <div className="nr-file-chooser-container">
            <button className="btn btn-outline-secondary btn-sm" onClick={()=>this.setState({media_opened:true})}>
                {url ? 'Change' : 'Choose'}
            </button>

            {
                (!render || !url) ? null : 
                <RenderMediaFile {...{url, mime, extension}}/>
            }
                            
            {
                !media_opened ? null : 
                <Media
                    onClose={()=>this.setState({media_opened:false})}
                    onResult={this.getFile}
                    multiple={multiple}
                    accept={accept}/>
            }
        </div>
    }
}

export {FileChooser}