import React, {Component} from "react";
import Spinner from "react-svg-spinner";
import Swal from 'sweetalert2';

import {Editor, ajax_request , parse_dom_form} from 'nodereactor/react';
import {Title, Comment, Excerpt, LoadMetaBox} from './editor-modules';

import './style.scss';

class PostProcess extends Component
{
    constructor(props)
    {
        super(props);

        let {meta_boxes=[], post={}, post_type, permalink}=this.props.response;

        if(typeof post!=='object')
        {
            post={}
        } 

        meta_boxes=meta_boxes.map(item=>
        {
            item.key=Math.random().toString(36); 
            return item;
        });

        this.state=
        {
            'slug':post.post_name || '', 
            'slug_edit_mode':false, 
            'mime_type':post.mime_type, 
            'post_id':post.post_id || 0,
            'loading_icon':false,
            'permalink':permalink,
            'post_updated':false,
            'meta_boxes':meta_boxes
        }

        this.store_vals=
        {
            'post_type':post_type,
            'post_id':post.post_id,
            'post_title':post.post_title,
            'post_excerpt':post.post_excerpt,
            'post_status':post.post_status,
            'comment_status':post.comment_status,
            'post_content':post.post_content
        };
        
        this.saveContent=this.saveContent.bind(this);
        this.getValues=this.getValues.bind(this);
        this.getSlug=this.getSlug.bind(this);
    }

    getSlug(slug)
    {
        this.setState({'slug':slug});
    }

    getValues(e_or_v,post_content)
    {
        if(post_content==true)
        {
            this.store_vals['post_content']=e_or_v;
        }
        else
        {
            let el=e_or_v.currentTarget;

            this.store_vals[el.name]=el.value;
        }
    }

    saveContent(e)
    {
        if(!this.editor_container){return;}
        
        let post=this.store_vals;
        post.post_name=this.state.slug;

        /* Now collect post meta from all meta box. */
        let el=this.editor_container.getElementsByClassName('nr_custom_meta_boxes');
        let post_meta={}
        for(let num=0; num<el.length; num++)
        {
            post_meta=Object.assign(post_meta, parse_dom_form(el[num], true));
        }

        /* Store meta in post object */
        post.post_meta=post_meta;

        /* Now request to server to save */
        this.setState({'loading_icon':true});
        ajax_request('nr_save_post', {post}, (r, d, e)=>
        {
            let ob={loading_icon:false};

            if(e)
            {
                Swal.fire('Error', 'Request Failed', 'error');
                this.setState(ob);
                return;
            }

            let {
                    status='error', 
                    message='Action Failed', 
                    post_id=false,
                    permalink=''
                }=r;

            if(status=='success' && post_id)
            {

                ob.permalink            = permalink;
                ob.post_updated         = true;
                ob.post_id              = post_id;

                this.store_vals.post_id = post_id;
            }
            
            this.setState(ob, ()=>this.setState({'post_updated':false}));
            
            Swal.fire(status, message, status);
        });
    }

    render()
    {
        let {
                loading_icon,
                post_id

            }=this.state;

        let {
                post={},
                post_modules=[], 
                post_type, 
                custom_templates={}
            
            }=this.props.response;
            
        let {post_meta={}, post_parent=0}=post;
       
        let meta_props              = {};
        meta_props.post_id          = this.state.post_id;
        meta_props.post_meta        = post_meta;
        meta_props.post_type        = post_type;
        meta_props.post_parent      = post_parent;
        meta_props.custom_templates = custom_templates;
        meta_props.meta_boxes       = this.state.meta_boxes;
        meta_props.post_updated     = this.state.post_updated;
        
        return post=='not_found' ? 
        <span className="text-danger">Post Not Found</span> 
        : 
        <div className="row" id="post-editor-container" ref={el=>{this.editor_container=el}}>
            <div className="col-12">
                <h4>
                    {post_id ? <span>Edit</span> : <span>Create</span>}
                    &nbsp;
                    {loading_icon==true ? <Spinner size="15px"/> : null}
                </h4>

            </div>
            <div className="col-12 col-sm-6 col-md-7 col-lg-8 col-xl-9">
                {
                    post_modules.indexOf('title')>-1 ? 
                    <Title 
                        defaultValue={this.store_vals.post_title} 
                        onChange={this.getValues} 
                        sendSlug={this.getSlug} 
                        defaultSlug={this.state.slug}/> 
                    : null
                }
                
                {
                    !this.state.permalink ? null :
                    <p>
                        <small>
                            <b>Post URL: </b>
                            <a href={this.state.permalink} target="_blank">
                                {this.state.permalink}
                            </a>
                        </small>
                    </p>
                }
                
                {
                    post_modules.indexOf('editor')>-1 ? 
                    <Editor 
                        onChange={(content)=>this.getValues(content,true)} 
                        defaultValue={this.store_vals.post_content} 
                        addMedia={post_modules.indexOf('media')>-1}/> : null
                }
                
                {post_modules.indexOf('excerpt')>-1 ? <Excerpt onChange={this.getValues} defaultValue={this.store_vals.post_excerpt}/> : null}

                <LoadMetaBox position="left" {...meta_props}/>
            </div>
            <div className="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
                <div className="nr_meta_box" id="publish_box">
                    <h4>Action</h4>
                    <div>	
                        <p>
                            <b>Status: </b> 
                            <select name="post_status" name="post_status" defaultValue={this.store_vals.post_status} onChange={this.getValues} className="form-control">
                                <option value="draft">Draft</option>
                                <option value="publish">Publish</option>
                            </select>
                            <small>Only logged in administrators can see draft post.</small>
                        </p>
                        
                        {post_modules.indexOf('comment')>-1 ? <Comment defaultValue={this.store_vals.comment_status} onChange={this.getValues}/> : null}
                        
                        <p className="text-right">
                            {loading_icon ? <Spinner size="15px"/> : null} &nbsp;
                            
                            <button className="btn btn-secondary btn-sm" onClick={this.saveContent} disabled={loading_icon}>
                                {post_id ? 'Update' : 'Create'}
                            </button>
                        </p>
                    </div>
                </div>
                <LoadMetaBox position="right" {...meta_props}/>
            </div>
        </div>
    }
}

export {PostProcess}