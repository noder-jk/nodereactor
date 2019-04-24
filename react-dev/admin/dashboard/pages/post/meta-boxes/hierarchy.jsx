import React, {Component} from "react";
import axios from 'axios';
import Spinner from "react-svg-spinner";

import {ajax_url , get_hierarchy} from 'nodereactor/react';

class PostHierarchy extends Component
{
    constructor(props)
    {
        super(props);

        this.state=
        {
            'loading':false,
            'posts':[],
            'error':null
        }
    }

    componentDidMount()
    {
        let {post_type, post_id=false}=this.props;
        
        this.setState({'loading':true});
        
        axios({
            method:'post',
            url:ajax_url ,
            data:{'action':'nr_get_hierarchy', 'post_type':post_type, 'post_id':post_id}
        }).then(r=>
        {
            let psts=(r.data.posts && r.data.posts.length>0) ? r.data.posts : [];
            
            psts=get_hierarchy(psts, 'post_parent', 'post_id', post_id);
            
            let st={'loading':false, 'posts':psts}

            this.setState(st);

        }).catch(e=>
        {
            this.setState({'loading':false,'error':'Request Error'});
        })
    }

    render()
    {
        let {post_parent=0}=this.props;
        
        return  <div>
                    {this.state.loading ? <Spinner size="15px"/> : null}

                    {
                        <select className="form-control" name="nr_post_parent" defaultValue={post_parent}>
                            <option value="0">None</option>
                            {
                                this.state.posts.map(item=><option key={item.post_id} value={item.post_id} title={item.post_title}>{'-'.repeat(item.nest_level)+item.post_title}</option>)
                            }
                        </select>
                    }
                </div>
    }
}

export {PostHierarchy}