import React, {Component} from "react";
import Spinner from "react-svg-spinner";
import Swal from 'sweetalert2';

import {
        ajax_request,
        get_url_parameter, 
        Pagination,
        get_hierarchy
    } from 'nodereactor/react';

import {Action} from './action';
import {List} from './list';

import './style.scss';


// collect current post type and page

let pt=window.location.pathname;
pt=pt.slice(1);
pt=pt.split('/');

let type=pt[1] || '';
type=type.slice('post_type_'.length);

let pg=get_url_parameter('page');
let page=pg ? pg : 1;

const initial_query={'post_type':type, 'page':page};


class PostList extends Component
{
    constructor(props)
    {
        super(props);

        this.state=
        {
            'filter':{},
            'action':'',
            'posts':[], 
            'pagination':{},
            'taxonomies':[],
            'loading_icon':false, 
            'checked_posts':[]
        }

        this.getAction=this.getAction.bind(this);
        this.getFilter=this.getFilter.bind(this);

        this.deletePost=this.deletePost.bind(this);
        this.toggleCheck=this.toggleCheck.bind(this);
        this.fetchPosts=this.fetchPosts.bind(this);
    }

    getAction(action)
    {
        this.setState({action});
    }

    getFilter(value)
    {
        let {filter}=this.state;

        filter=Object.assign(filter, value);

        this.setState({filter});
    }

    toggleCheck(e, post_id)
    {
        let el=e.currentTarget;

        let checked=this.state.checked_posts;

        if(el.checked)
        {
            checked.indexOf(post_id)==-1 ? checked.push(post_id) : 0;
        }
        else if(checked.indexOf(post_id)>-1)
        {
            checked.splice(checked.indexOf(post_id), 1);
        }

        this.setState({'checked_posts':checked});
    }
    
    deletePost(e)
    {
        let el=e.currentTarget;
        let action=el.previousElementSibling.value;

        if(action!=='delete'){return;}
        
        let {checked_posts}=this.state;
        
        if(checked_posts.length==0){return;}

        /* Ask confirmation */
        Swal.fire
        ({
            title: 'Sure to delete permanently?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true
        }).then((result) => 
        {
            if(!result.value){return;}

            /* Request delete action */
            this.setState({loading_icon:true});

            ajax_request('nr_delete_posts', {'post_id':checked_posts}, r=>
            {
                this.setState({'loading_icon':false});  

                r.status=='success' ? this.fetchPosts() : Swal.fire('Error', 'Something went wrong.', 'error'); 
            });
        })
    }

    fetchPosts(e, page_num)
    {
        let {filter}=this.state;

        let form=Object.assign(initial_query, filter);

        if(page_num)
        {
            /* This block will be called when user click pagination buttons */
            e.preventDefault();

            let el=this.list_container.getElementsByClassName('nr_pagination_page_number')[0];
            el.value=page_num;
            form.page=page_num;
        }

        this.setState({loading_icon:true});
        ajax_request('nr_get_post_list', {'query':JSON.stringify(form)}, (r, d, e)=>
        {
            if(e)
            {
                return;
            }

            let {posts=false, pagination, taxonomies}=r;

            this.setState({posts, pagination, taxonomies, loading_icon:false});
        });
    }

    componentDidMount()
    {
        this.fetchPosts();
    }
    
    render()
    {
        let {taxonomies, posts, loading_icon, pagination}=this.state;
        
        posts=get_hierarchy(posts, 'post_parent', 'post_id');

        return <div id="post_list_container" ref={el=>this.list_container=el}>
            <h4>All Posts {loading_icon ? <Spinner size="15px"/> : null}</h4>
            
            <Action 
                post_type={initial_query.post_type}
                deletePost={this.deletePost} 
                onChange={this.getFilter} 
                getAction={this.getAction} 
                fetchPosts={this.fetchPosts}/>

            <List taxonomies={taxonomies} st_posts={posts} toggleCheck={this.toggleCheck}/>

            {Object.keys(posts).length==0 ? <span>No Post Found</span> : null}

            <div className="text-center">
                <Pagination 
                    pgn={pagination} 
                    activeClass="btn btn-outline-secondary btn-sm ml-1 mr-1" 
                    onClick={this.fetchPosts} 
                    inactiveClass="btn btn-secondary btn-sm ml-1 mr-1"/>
            </div>
        </div>
    }
}

export {PostList}