import React, {Component} from "react";
import axios from 'axios';
import Spinner from "react-svg-spinner";

import {ajax_url ,Media} from 'nodereactor/react';

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
        if(this.state.image_post_id>0)
        {
            this.setState({loading_icon:true});

            axios({
                method:'post',
                data:{'action':'nr_get_featured_image', 'post_id':this.state.image_post_id},
                url:ajax_url 
            }).then(r=>
            {
                let ob={loading_icon:false};

                if(r.data && r.data.url)
                {
                    ob.image_url=r.data.url;
                }

                this.setState(ob);
            }).catch(r=>
            {
                this.setState({loading_icon:false});
            })
        }
    }

    render()
    {
        return(
            <div id="featured_image_container">
                {this.state.loading_icon ? <p><Spinner size="15px"/></p> : null}

                <input type="hidden" name="featured_image" value={this.state.image_post_id}/>

                {
                    this.state.image_url ? <img src={this.state.image_url} style={{'width':'100%'}}/> : null
                }
                {
                    this.state.image_url ? <span className="text-danger" onClick={this.removeImage}>- Remove Featured Image</span> : <span onClick={this.showMedia}>+ Add Featured Image</span>
                }

                <Media open={this.state.media_opened} onClose={this.closeMedia} onResult={this.getFiles} accept={['image/jpeg', 'image/png']}/>
            </div>
        )
    }
}

export {FeaturedImage}