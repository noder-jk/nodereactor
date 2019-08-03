import React, {Component} from "react";
import Spinner from "react-svg-spinner";

import {ajaxRequest ,Media} from 'nodereactor/react';

class FeaturedImage extends Component
{
    constructor(props)
    {
        super(props);

        let {post_meta={}}=this.props;
        let {featured_image=0}=post_meta;

        this.state=
        {
            'image_url':false, 
            'media_opened':false, 
            'image_post_id':featured_image, 
            'loading_icon':false
        }

        this.showMedia=this.showMedia.bind(this);
        this.closeMedia=this.closeMedia.bind(this);
        this.getFiles=this.getFiles.bind(this);
        this.removeImage=this.removeImage.bind(this);
    }
    
    closeMedia()
    {
        this.setState({'media_opened':false});
    }

    getFiles(f)
    {
        if(f)
        {
            this.setState({image_url:f.file_url, image_post_id:f.post_id});
        }
    }

    removeImage()
    {
        this.setState({'image_post_id':0, 'image_url':false});
    }

    showMedia()
    {
        this.setState({'media_opened':true})
    }

    componentDidMount()
    {
        let {image_post_id}=this.state;

        if(image_post_id==0){return;}
        
        this.setState({loading_icon:true});

        ajaxRequest('nr_get_featured_image', {'post_id':image_post_id}, (r, d, e)=>
        {
            let {url=false}=r;

            this.setState({loading_icon:false, image_url:url});
        });
    }

    render()
    {
        let {image_url}=this.state;

        return <div id="featured_image_container">
            {this.state.loading_icon ? <p><Spinner size="15px"/></p> : null}

            <input type="hidden" name="featured_image" value={this.state.image_post_id}/>

            {image_url ? <img src={this.state.image_url} style={{'width':'100%'}}/> : null}

            {image_url ? <span className="text-danger" onClick={this.removeImage}>- Remove Featured Image</span> : <span onClick={this.showMedia}>+ Add Featured Image</span>}

            <Media open={this.state.media_opened} onClose={this.closeMedia} onResult={this.getFiles} accept={['image/jpeg', 'image/png']}/>
        </div>
    }
}

export {FeaturedImage}