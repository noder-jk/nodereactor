import React, {Component} from "react";
import Spinner from "react-svg-spinner";
import Swal from 'sweetalert2';

import {get_hierarchy, ajax_request} from 'nodereactor/react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrashAlt, faEye} from '@fortawesome/free-solid-svg-icons';

import {Editor} from './editor';

class Browser extends Component
{
    constructor(props)
    {
        super(props);

        this.state=
        {
            'loading':false,
            'selected':[],
            'editor':false
        }

        this.openEditor=this.openEditor.bind(this);
        this.closeEditor=this.closeEditor.bind(this);
        this.deleteTaxonomy=this.deleteTaxonomy.bind(this);
        this.taxonomySelect=this.taxonomySelect.bind(this);
    }

    openEditor(id)
    {
        this.setState({'editor':id});
    }

    closeEditor(update)
    {
        this.setState({'editor':false});
        
        let {fetchTaxonomies}=this.props;

        if(update===true)
        {
            fetchTaxonomies();
        }
    }

    taxonomySelect(e)
    {
        let el=e.currentTarget;

        let term_id=el.value;

        let selected=this.state.selected;
        
        if(el.checked)
        {
            if(selected.indexOf(term_id)==-1){ selected.push(term_id); }
        }
        else if(selected.indexOf(term_id)>-1)
        {
            selected.splice(selected.indexOf(term_id), 1);
        }
        
        this.setState({'selected':selected});
    }

    deleteTaxonomy(e, term_id)
    {
        let {fetchTaxonomies}=this.props;

        if(!term_id){term_id=this.state.selected;}

        if(!Array.isArray(term_id)){term_id=[term_id];}

        if(term_id.length==0){return;}

        Swal.fire
        ({
            title: 'Sure to delete?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true
        }).then((result) => 
        {
            if(!result.value){return;}

            this.setState({'loading':true});

            ajax_request('nr_delete_taxonomy', {'term_ids':term_id}, r=>
            {
                this.setState({'loading':false});

                if(r.status!=='success')
                {
                    Swal.fire('Error', 'Something Went Wrong', 'error');
                    return;
                }

                fetchTaxonomies();
            });
        });
    }

    render()
    {
        let {taxonomies, taxonomy, taxonomy_title, hierarchical, fetchTaxonomies}=this.props;

        let pass_prop={taxonomies, taxonomy, hierarchical, fetchTaxonomies, taxonomy_title}

        
        taxonomies=get_hierarchy(taxonomies, 'parent', 'term_id'); // No need exclude current, cause it's the list, not edit
        
        return  <div className="col-6 col-md-8 col-xl-9">
                    <h4>
                        {taxonomy_title} 
                        {this.state.loading ? <Spinner size="15px"/> : null}
                    </h4>
                    <hr/>
                    <div className="mb-2 text-right">
                        {this.state.selected.length>0 ? <button className="btn btn-outline-secondary btn-sm" onClick={this.deleteTaxonomy}>Delete</button> : null}
                    </div>

                    <table style={{'background':'white'}} className="table table-bordered">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Description</th>
                                <th>Posts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                taxonomies.map(item=>
                                {
                                    var key=item.term_id;
                                    if(this.state.editor==item.term_id)
                                    {
                                        return <tr key={key}>
                                            <td colSpan="5">
                                                <Editor {...pass_prop} closeEditor={this.closeEditor} cls="container-fluid" term={item}/>
                                            </td>
                                        </tr>
                                    }

                                    return  <tr key={key+'_ed'}>
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                name="taxonomy_inp_check" 
                                                value={item.term_id} 
                                                onChange={this.taxonomySelect}/>
                                        </td>
                                        <td className="taxonomy-action">
                                            {'→'.repeat(item.nest_level)+item.name}<br/>
                                            
                                            {
                                                this.state.editor==item.term_id ? null : 
                                                <a className="text-warning" onClick={()=>this.openEditor(item.term_id)}>
                                                    <FontAwesomeIcon icon={faEdit}/>
                                                </a>
                                            } &nbsp;
                                            
                                            <a className="text-info">
                                                <FontAwesomeIcon icon={faEye}/>
                                            </a> &nbsp;
                                            
                                            <a className="text-danger" onClick={(e)=>this.deleteTaxonomy(e,item.term_id)}>
                                                <FontAwesomeIcon icon={faTrashAlt}/>
                                            </a>
                                        </td>
                                        <td>{item.slug}</td>
                                        <td>{item.description}</td>
                                        <td>{item.post_count}</td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
    }
}

export {Browser}