import React, {Component} from "react";
import Spinner from "react-svg-spinner";
import Swal from 'sweetalert2';

import {get_hierarchy, ajax_request, FileChooser} from 'nodereactor/react';
import {Instruction} from './instruction';

class Editor extends Component
{
    constructor(props)
    {
        super(props);

        let {term={}}=this.props;

        this.state=
        {
            'values':
            {
                'term_id'       : term.term_id || 0,
                'parent'        : term.parent || 0,
                'name'          : term.name,
                'description'   : term.description,
                'slug'          : term.slug,
                'featured_image': ''
            },

            'loading'           : false,
            'container_key'     : Math.random().toString(36).substring(7),
            'media_opened'      : false,
            'feat_image'        : term.featured_image
        }

        this.saveTaxonomy=this.saveTaxonomy.bind(this);
        this.storeVals=this.storeVals.bind(this);
        this.clearValues=this.clearValues.bind(this);
    }

    storeVals(e, ob)
    {
        let {values}=this.state;

        if(ob)
        {
            values=Object.assign(values, ob);
        }
        else
        {
            let el=e.currentTarget;
            values[el.name]=el.value;
        }

        this.setState({values});
    }

    clearValues()
    {
        this.setState({container_key:Math.random().toString(36).substring(7)});

        // clear state
        let {values}=this.state;
        for(let k in values)
        {
            switch(k)
            {
                case 'term_id'  :
                case 'parent'   :   values[k]=0;
                                    break;

                default         :   values[k]=undefined;
            }
        }

        // Clear input values
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
 
    saveTaxonomy()
    {
        let {closeEditor=false, taxonomy, fetchTaxonomies}=this.props;

        let {values}=this.state;
        values.taxonomy=taxonomy;

        this.setState({'loading':true});
        ajax_request('nr_create_update_category', {values}, r=>
        {
            let set_ob={'loading':false};

            if(r.status=='success')
            {
                this.clearValues();
                closeEditor ? closeEditor(true) : Swal.fire('Success', 'Term Has Been Created', 'success');
                fetchTaxonomies();
            }
            else
            {
                Swal.fire('Error', (r.message ? r.message : 'Action Failed.'), 'error');
            }

            if(!closeEditor || r.status!=='success')
            {
                this.setState(set_ob);
            }
        });
    }

    render()
    {
        let {values, container_key, feat_image}=this.state;

        let {
                closeEditor=false, 
                cls='col-6 col-md-4 col-xl-3', 
                hierarchical, 
                taxonomies,
                taxonomy_title
            }=this.props;

        taxonomies=get_hierarchy(taxonomies, 'parent', 'term_id', (values.term_id>0 ? values.term_id : 'dddddd'));

        return <div className={cls}>
                {taxonomy_title!==false ? <h4>{values.term_id==0 ? 'Create New' : 'Edit'} {taxonomy_title}</h4> : null}
                <div ref={el=>this.filed_container=el}>
                    Name
                    <input type="text" name="name" className="form-control" onChange={this.storeVals} defaultValue={values.name}/><br/>

                    Slug
                    <input type="text" name="slug" className="form-control" onChange={this.storeVals} defaultValue={values.slug}/><br/>

                    
                    {
                        hierarchical ?   
                        <div>
                            Parent
                            <select name="parent" className="form-control" onChange={this.storeVals} defaultValue={values.parent}>
                                <option value="0">None</option>
                                {
                                    taxonomies.map(item=>
                                    {
                                        return item.term_id!==values.term_id ? <option key={item.term_id} value={item.term_id}>{'-'.repeat(item.nest_level)+item.name}</option> : null
                                    })
                                }
                            </select><br/>
                        </div> : null
                    }
                    
                    Description
                    <textarea name="description" className="form-control" onChange={this.storeVals} defaultValue={values.description}></textarea><br/>
                
                    Featured Image
                    <FileChooser 
                            key={container_key}
                            onChange={(f)=>this.storeVals(false, {featured_image:f.post_id})}
                            multiple={false}
                            accept={['image/jpeg', 'image/png']}/>
                    
                    {
                        (values.featured_image || !feat_image) ? null :
                        <img src={feat_image} style={{'maxHeight':'140px', 'display':'block'}}/>
                    }

                    <br/>

                    {closeEditor ? <button onClick={closeEditor} className="btn btn-secondary btn-sm">Close</button> : null}
                    
                    &nbsp;

                    <button onClick={this.saveTaxonomy} className="btn btn-secondary btn-sm">
                        {values.term_id>0 ? 'Update' : 'Create'}
                    </button> 
                    
                    &nbsp;
                    
                    {this.state.loading ? <Spinner size="15px"/> : null}
                </div>
                <Instruction/>
            </div>
    }
}

export {Editor}