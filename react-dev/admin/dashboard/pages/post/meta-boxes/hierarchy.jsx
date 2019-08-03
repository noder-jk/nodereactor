import React, {Component} from "react";
import Spinner from "react-svg-spinner";

import {ajaxRequest , get_hierarchy} from 'nodereactor/react';

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
        
        ajaxRequest('nr_get_hierarchy', {post_type, post_id}, (r, d, e)=>
        {
            let psts=(r.posts && r.posts.length>0) ? r.posts : [];
            
            psts=get_hierarchy(psts, 'post_parent', 'post_id', post_id);
            
            let st={'loading':false, 'posts':psts}

            this.setState(st);
        });
    }

    render()
    {
        let {loading, posts}=this.state;
        let {post_parent=0}=this.props;
        
        return  <div>

            {loading ? <Spinner size="15px"/> : null}

            {
                <select className="form-control" name="nr_post_parent" defaultValue={post_parent}>
                    <option value="0">None</option>
                    {
                        posts.map(item=>
                        {
                            return <option key={item.post_id} value={item.post_id} title={item.post_title}>
                                {'-'.repeat(item.nest_level)+item.post_title}
                            </option>
                        })
                    }
                </select>
            }
        </div>
    }
}

export {PostHierarchy}