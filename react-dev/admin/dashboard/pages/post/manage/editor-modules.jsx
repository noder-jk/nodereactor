import React, {Component} from 'react';
import Spinner from 'react-svg-spinner';
import Swal from 'sweetalert2';

import {ajax_request} from 'nodereactor/react';

import {FindComp} from 'nodereactor/react/helper/comp-finder';

class Title extends Component
{
    constructor(props)
    {
        super(props);

        let {defaultSlug=''}=this.props;

        this.state=
        {
            'slug':defaultSlug, 
            'slug_edit_mode':false,
            'loading_icon':false
        }

        this.slugCheck=this.slugCheck.bind(this);
        this.enableSlugEdit=this.enableSlugEdit.bind(this);
    }
    
    slugCheck(e,element)
    {
        if(!element && this.state.slug!=='')
        {
            return;
        }

        let el=element ? element : e.currentTarget;
        let post_name=el.value;

        let {sendSlug}=this.props;

        this.setState({'loading_icon':true});
        ajax_request('nr_slug_check', {post_name}, (r, d, e)=>
        {
            let ob={slug_edit_mode:false, loading_icon:false}
            if(e)
            {
                this.setState(ob);
                Swal.fire('Slug Generate Request Error.');
                return;
            }
            
            let {post_name=''}=r;

            ob.slug=post_name;
            sendSlug(post_name);

            this.setState(ob);
        });
    }

    enableSlugEdit()
    {
        this.setState({slug_edit_mode:true});
    }

    render()
    {
        let {defaultValue='', onChange}=this.props;

        return <div className="editor_module">
            <input type="text" className="form-control mb-1" placeholder="Title" name="post_title" defaultValue={defaultValue} onBlur={(e)=>this.slugCheck(e)} onChange={onChange}/>
            
            {this.state.loading_icon ? <Spinner size="15px"/> : null}

            {
                this.state.slug_edit_mode==true ? <p className="form-inline">
                    <input type="text" className="form-control form-control-sm" style={{'width':'170px'}} placeholder="Post Slug" defaultValue={this.state.slug}/>
                    <button className="btn btn-outline-secondary btn-sm ml-1" onClick={(e)=>{this.slugCheck(e, e.currentTarget.previousElementSibling)}} disabled={this.state.loading_icon}>Ok</button>
                </p> : 
                
                <p>
                    <small>
                        <b>Post Slug: </b> <u>{this.state.slug} </u>
                        <button className="btn btn-outline-secondary btn-sm ml-1" onClick={this.enableSlugEdit} disabled={this.state.loading_icon}>Edit</button>
                    </small>
                </p>
            }
        </div>
    }
}

const Comment=(props)=>
{
    let {defaultValue, onChange}=props;

    return  <p>
                <b>Comments: </b>&nbsp;
                <select name="comment_status" defaultValue={defaultValue} onChange={onChange} className="form-control">
                    <option value="1">Allowed</option>
                    <option value="0">Disallowed</option>
                </select>
                <small>Commenting is not available yet. But you may specify for later versions.</small>
            </p>
}

const Excerpt=(props)=>
{
    let {onChange, defaultValue=''}=props;

    return  <div className="nr_meta_box editor_module">
                <h4>Excerpt</h4>
                <div>	
                    <textarea className="form-control" defaultValue={defaultValue} name="post_excerpt" onChange={onChange}></textarea>
                </div>
            </div>
}


const LoadMetaBox=(props)=>
{
    const {meta_boxes=[], position='right'}=props;

    
    var params=Object.assign({},props);
    delete params.meta_boxes;
    delete params.position;

    return meta_boxes.map(item=>
    {
        if(item.position==position)
        {
            return <div key={item.key} className="nr_meta_box nr_custom_meta_boxes">
                <h4>{item.title}</h4>
                <div>	
                    <FindComp comp_props={{'component':item.component, 'nr_package':item.nr_package}} {...params} meta_box_id={item.id}/>
                </div>
            </div> 
        }
        
        return null
    })   
}


export {Title, Comment, Excerpt, LoadMetaBox}