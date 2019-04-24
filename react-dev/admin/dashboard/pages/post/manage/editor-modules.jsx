import React, {Component} from 'react';
import Spinner from 'react-svg-spinner';
import axios from 'axios';
import Swal from 'sweetalert2';

import {ajax_url } from 'nodereactor/react';

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
        let value=el.value;

        let {sendSlug}=this.props;

        this.setState({'loading_icon':true});
        axios({
            method:'post',
            url:ajax_url ,
            data:{'action':'nr_slug_check', 'post_name':value}
        }).then(r=>
        {
            let ob={slug_edit_mode:false, loading_icon:false}

            /* Process if slug was sent from server */
            if(r.data && r.data.post_name)
            {
                /* Store to the object to store in state */
                ob.slug=r.data.post_name;
                
                /* Pass to the root editor component */
                sendSlug(r.data.post_name);
            }

            /* Now set the slug in state */
            this.setState(ob);
        }).catch(e=>
        {
            this.setState({slug_edit_mode:false, loading_icon:false});

            Swal.fire('Slug Generate Request Error.');
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
                    <FindComp comp_props={{'component':item.component, 'node_type':item.node_type, 'nr_package':item.nr_package}} {...params} meta_box_id={item.id}/>
                </div>
            </div> 
        }
        
        return null
    })   
}


export {Title, Comment, Excerpt, LoadMetaBox}