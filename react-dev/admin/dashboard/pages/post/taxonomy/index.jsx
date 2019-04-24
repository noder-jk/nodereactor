import React, {Component} from "react";
import axios from 'axios';
import Spinner from "react-svg-spinner";
import Swal from 'sweetalert2';

import {ajax_url , get_hierarchy} from 'nodereactor/react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrashAlt, faEye} from '@fortawesome/free-solid-svg-icons';

import './style.scss';

class Editor extends Component
{
    constructor(props)
    {
        super(props);

        let {term={}}=this.props;

        this.state=
        {
            'term_id':term.term_id || 0,
            'loading':false,
            'parent':term.parent || 0,
            'name':term.name,
            'description':term.description,
            'slug':term.slug
        }

        this.saveTaxonomy=this.saveTaxonomy.bind(this);
        this.storeVals=this.storeVals.bind(this);
        this.clearValues=this.clearValues.bind(this);
    }

    storeVals(e)
    {
        let el=e.currentTarget;
        this.setState({[el.name]:el.value});
    }

    clearValues()
    {
        if(this.filed_container)
        {
            let el=this.filed_container;

            let clr=(el)=>
            {
                for(let i=0; i<el.length; i++)
                {
                    el[i].value='';
                }
            }

            clr(el.getElementsByTagName('input'));
            clr(el.getElementsByTagName('textarea'));
        }
    }
 
    saveTaxonomy()
    {
        let {closeEditor=false, taxonomy, fetchTaxonomies}=this.props;

        let values=this.state;
        values['taxonomy']=taxonomy;

        this.setState({'loading':true})
        axios({
            'method':'post',
            'url':ajax_url ,
            'data':{'action':'create_update_category', 'values':values}
        }).then(r=>
        {
            let set_ob={'loading':false};
            
            if(r.data.status=='done')
            {
                this.clearValues();
                closeEditor ? closeEditor(true) : Swal.fire('Success', 'Term Has Been Created', 'success');
                fetchTaxonomies();
            }
            else
            {
                Swal.fire('Error', (r.data.message ? r.data.message : 'Action Failed.'), 'error');
            }

            if(!closeEditor || r.data.status!=='done')
            {
                this.setState(set_ob);
            }

        }).catch(e=>
        {   
            this.setState({'loading':false})
            Swal.fire('Request Error');
        })
    }

    render()
    {
        let {
                closeEditor=false, 
                cls='col-6 col-md-4 col-xl-3', 
                hierarchical, 
                taxonomies,
                taxonomy_title
            }=this.props;

        taxonomies=get_hierarchy(taxonomies, 'parent', 'term_id', (this.state.term_id>0 ? this.state.term_id : 'dddddd'));

        return <div className={cls}>
                {taxonomy_title!==false ? <h4>{this.state.term_id==0 ? 'Create New' : 'Edit'} {taxonomy_title}</h4> : null}
                <div ref={el=>this.filed_container=el}>
                    Name
                    <input type="text" name="name" className="form-control" onChange={this.storeVals} defaultValue={this.state.name}/><br/>

                    Slug
                    <input type="text" name="slug" className="form-control" onChange={this.storeVals} defaultValue={this.state.slug}/><br/>

                    
                    {
                        hierarchical ?   
                        <div>
                            Parent
                            <select name="parent" className="form-control" onChange={this.storeVals} defaultValue={this.state.parent}>
                                <option value="0">None</option>
                                {
                                    taxonomies.map(item=>
                                    {
                                        return item.term_id!==this.state.term_id ? <option key={item.term_id} value={item.term_id}>{'-'.repeat(item.nest_level)+item.name}</option> : null
                                    })
                                }
                            </select><br/>
                        </div> : null
                    }
                    

                    Description
                    <textarea name="description" className="form-control" onChange={this.storeVals} defaultValue={this.state.description}></textarea><br/>
                
                    {closeEditor ? <button onClick={closeEditor} className="btn btn-secondary btn-sm">Close</button> : null}
                    
                    &nbsp;

                    <button onClick={this.saveTaxonomy} className="btn btn-secondary btn-sm">{this.state.term_id>0 ? 'Update' : 'Create'}</button> 
                    
                    &nbsp;
                    
                    {this.state.loading ? <Spinner size="15px"/> : null}
                </div>
            </div>
    }
}

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
            axios({
                'method':'post',
                'url':ajax_url ,
                'data':{'action':'nr_delete_taxonomy', 'term_ids':term_id}
            }).then(r=>
            {
                if(r.data.status!=='done')
                {
                    Swal.fire('Error', 'Something Went Wrong', 'error');
                }
                this.setState({'loading':false});
                fetchTaxonomies();
            }).catch(e=>
            {
                this.setState({'loading':false});
                Swal.fire('Error', 'Request Failed or Server Error', 'error');
            })
        });
    }

    render()
    {
        let {taxonomies, taxonomy, taxonomy_title, hierarchical, fetchTaxonomies}=this.props;

        let pass_prop={taxonomies, taxonomy, hierarchical, fetchTaxonomies, taxonomy_title}

        
        taxonomies=get_hierarchy(taxonomies, 'parent', 'term_id'); // No need exclude current, cause it's the list, not edit
        
        return  <div className="col-6 col-md-8 col-xl-9">
                    <h4>{taxonomy_title} {this.state.loading ? <Spinner size="15px"/> : null}</h4>
                    
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
                                    return  [<tr key={item.term_id}>
                                        <td><input type="checkbox" name="taxonomy_inp_check" value={item.term_id} onChange={this.taxonomySelect}/></td>
                                        <td className="taxonomy-action">
                                            {'-'.repeat(item.nest_level)+item.name}<br/>
                                            
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
                                    </tr>,
                                    (
                                        this.state.editor==item.term_id ?
                                        <tr key={item.term_id+'_editor'}>
                                            <td colSpan="5">
                                                <Editor {...pass_prop} closeEditor={this.closeEditor} cls="container-fluid" term={item}/>
                                            </td>
                                        </tr> : null
                                    )]
                                })
                            }
                        </tbody>
                    </table>
                </div>
    }
}

class TaxonomyPage extends Component
{
    constructor(props)
    {
        super(props);
        
        this.state=
        {
            'taxonomies':[],
            'hierarchical':false,
            'taxonomy':'',
            'taxonomy_title':''
        }

        this.fetchTaxonomies=this.fetchTaxonomies.bind(this);
    }

    fetchTaxonomies()
    {
        /* Retrieve taxonomy name from url */
        let pth=window.location.pathname;
        pth=pth.slice(pth.lastIndexOf('/')+1);
        let taxonomy=pth.slice(pth.indexOf('_')+1);
        
        /* Now get taxonomies, taxonomy hierarchy etc. */
        this.setState({'loading':true, 'taxonomy':taxonomy});
        axios({
            'method':'post',
            'url':ajax_url ,
            'data':{'action':'nr_get_taxonomy', 'taxonomy':taxonomy}
        }).then(r=>
        {
            let set_ob=
            {
                'loading':false,
                'taxonomies':r.data.taxonomies,
                'hierarchical':r.data.hierarchical,
                'taxonomy_title':r.data.taxonomy_title
            };

            this.setState(set_ob)
        }).catch(e=>
        {  
            this.setState({'loading':false, 'selected':[]})
            Swal.fire('Request Error. Could Not Fetch Taxonomies.');
        });
    }

    componentDidMount()
    {
        this.fetchTaxonomies();
    }

    render()
    {
        let {taxonomies, taxonomy, hierarchical, taxonomy_title}=this.state;

        let pass_prop={taxonomies, taxonomy, hierarchical, taxonomy_title}

        pass_prop.fetchTaxonomies=this.fetchTaxonomies;

        return <div className="row taxonomy-admin-page">
            <Editor {...pass_prop}/>
            <Browser {...pass_prop}/>
        </div>
    }
}

export {TaxonomyPage, Editor}