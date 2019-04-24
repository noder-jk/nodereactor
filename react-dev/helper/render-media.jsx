import React, {Component} from 'react';

import zip from './img/zip.ico';
import pdf from './img/pdf.png';
import unsupported from './img/default.png';

const files_icons=
{
    '.zip':zip,
    '.pdf':pdf,
    'unsupported':unsupported
}

class RenderMediaFile extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        let {url, mime, style={}, attachmentId='', extension='unsupported', linkIfNonMedia=false}=this.props;

        extension=extension.toLowerCase();
        
        let imgs=['.jpg','.png','.bmp','.ico','.svg'];
        let vids=['.mp4', '.3gp', '.avi'];
        let auds=['.mp3', '.wav'];

        let resp=null;

        if(imgs.indexOf(extension)>-1)
        {
            resp=<img data-attachment_id={attachmentId} src={url} style={style}/>
        }
        else if(vids.indexOf(extension)>-1)
        {
            resp=<video controls="controls" style={style}>
                    <source data-attachment_id={attachmentId} src={url} type={mime}/>
                    Unsupported Media
                </video>
        }
        else if(auds.indexOf(extension)>-1)
        {
            resp=<audio controls="controls" style={style}>
                    <source data-attachment_id={attachmentId} src={url} type={mime}/>
                    Unsupported Media
                </audio>
        }
        else
        {
            if(linkIfNonMedia==true)
            {
                resp=<a data-attachment_id={attachmentId} href={url}>{url}</a>
            }
            else
            {
                let icon=files_icons[extension] ? files_icons[extension] : files_icons.unsupported;
                resp=<img data-attachment_id={attachmentId} src={icon} style={style}/>
            }
        }


        return resp
    }
}

export {RenderMediaFile}