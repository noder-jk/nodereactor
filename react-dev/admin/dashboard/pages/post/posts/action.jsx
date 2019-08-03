import React, {Component} from 'react';

class Action extends Component
{
    constructor(props)
    {
        super(props);

        this.passValue=this.passValue.bind(this);
    }

    passValue(e)
    {
        let {onChange}=this.props;

        let el=e.currentTarget;

        let ob={[el.name]:el.value}

        onChange(ob);
    }

    render()
    {
        let {
                post_type, 
                deletePost, 
                getAction, 
                fetchPosts
        }=this.props;

        return <div>
            <div className="d-inline-block form-group form-inline mr-2 mb-1">
                <select className="form-control form-control-sm float-left" onChange={(e)=>getAction(e.currentTarget.value)} defaultValue="">
                    <option value="">Bulk Actions</option>
                    <option value="delete">Delete Permanently</option>
                </select>
                <button className="btn btn-sm btn-outline-secondary" onClick={deletePost} title="Click to apply action">Apply</button>
            </div>
            <div className="d-inline-block form-group form-inline mb-1" ref={(el)=>this.filter_container=el}>
                <input type="hidden" name="post_type" defaultValue={post_type}/>
                <select className="form-control form-control-sm float-left" name="post_status" defaultValue="publish" title="Post Status" defaultValue="publish" onChange={this.passValue}>
                    <option value="publish">Publish</option>
                    <option value="draft">Draft</option>
                </select>
                <input name="keyword" type="text" placeholder="Search" className="form-control form-control-sm float-left" title="Search by keyword" onChange={this.passValue}/>
                <input name="page" type="number" min="1" defaultValue={1} placeholder="Page Number" className="form-control form-control-sm float-left" defaultValue={1} ref={el=>this.c_page=el} onChange={this.passValue}/>
                <input name="posts_per_page" type="number" min="1" defaultValue={30} placeholder="Posts Per Page" className="form-control form-control-sm float-left" onChange={this.passValue}/>
                <button className="btn btn-sm btn-outline-secondary" onClick={fetchPosts} title="Press to filter">Filter</button>
            </div>
        </div>
    }
}

export {Action}