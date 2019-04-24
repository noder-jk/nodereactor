import React, {Component} from "react";
import axios from 'axios';
import Spinner from 'react-svg-spinner';

import {ajax_url } from 'nodereactor/react';

class RSetting extends Component
{
    constructor(props)
    {
        super(props);

        let {values={}}=this.props.ResponseData;
        let {home_page_shows='lp'}=values;

        this.state=
        {
            'loading':false,
            'posts':[],
            'homepage':home_page_shows
        }

        this.changHandle=this.changHandle.bind(this);
    }

    changHandle(e)
    {
        let {onChange}=this.props;
        onChange(e);

        let el=e.currentTarget;
        
        if(el.checked)
        {
            this.setState({'homepage':el.value});
        }
    }

    componentDidMount()
    {
        /* this.setState({'loading':true});
        axios({
            'method':'post',
            'url':ajax_url ,
            'data':{'action':'get_posts_to_show_in_home'}
        }).then(r=>
        {
            let set_ob={'loading':false};
            
            if(r.data && r.data.posts)
            {
                set_ob.posts=r.data.posts;
            }

            this.setState(set_ob);
        }).catch(e=>
        {
            this.setState({'loading':false});
            
        }) */
    }

    render()
    {
        let {onChange}=this.props;

        let {values={}}=this.props.ResponseData;

        let {posts_per_page=15}=values;

        return <div>
            <div className="row mb-4">
                <div className="col-12">
                    <h3>Reading Settings {this.state.loading ? <Spinner size="15px"/> : null}</h3>
                </div>
            </div>
            
            <div className="row mb-4">
                <div className="col-12 col-sm-4 col-md-3 col-lg-2">Default Post Limit</div>
                <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                    <input className="form-control" type="number" min="1" name="posts_per_page" defaultValue={posts_per_page} onChange={onChange}/>
                    <small><i>Applicable only if limit is not defined explicitly in query.</i></small>
                </div> 
            </div>
        </div>
    }
}

export {RSetting}