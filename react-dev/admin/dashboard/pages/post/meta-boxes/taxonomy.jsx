import React, {Component} from "react";
import Spinner from "react-svg-spinner";

import Swal from 'sweetalert2';

import {ajax_request, get_hierarchy} from 'nodereactor/react';
import {Editor as TaxonomyManager} from '../taxonomy/index';

class PostTaxonomy extends Component
{
    constructor(props)
    {
        super(props);

        let {meta_box_id='', post_meta={}}=this.props;

        let primary_term_key='primary_term_id_of_'+meta_box_id;
        
        this.state=
        {
            'all_terms':[],
            'current_terms':[],
            'loading':false,
            'hierarchical':false,
            'create':false,
            'primary_term_key':primary_term_key,
            'primary_term':post_meta[primary_term_key] || false
        }

        this.fetchTaxonomy=this.fetchTaxonomy.bind(this);
        this.toggleEditor=this.toggleEditor.bind(this);
        this.saveTaxonomy=this.saveTaxonomy.bind(this);
        this.toggleCurrentTerms=this.toggleCurrentTerms.bind(this);
        this.setPrimaryTerm=this.setPrimaryTerm.bind(this);
    }

    fetchTaxonomy()
    {
        this.setState({'loading':true});

        let {post_id, meta_box_id}=this.props;
        
        ajax_request('nr_get_taxonomy_in_editor', {'taxonomy':meta_box_id, post_id}, (r, d, e)=>
        {
            if(e)
            {
                this.setState({'loading':false});
                Swal.fire('Error', 'Request Error In Taxonomy Parse', 'error');
                return;
            }

            let taxonomies=r.all_terms || [];
            let current_terms=r.current_terms || [];
            let hierarchical=r.hierarchical || false;
            let multiple=r.multiple==true;

            current_terms=current_terms.map(item=>parseInt(item)).filter(item=>Number.isInteger(item));

            this.setState
            ({
                'loading':false, 
                'all_terms':get_hierarchy(taxonomies, 'parent', 'term_id'),
                current_terms,
                hierarchical,
                multiple
            });
        });
    }

    setPrimaryTerm(e)
    {
        let el=e.currentTarget;

        if(el.checked)
        {
            this.setState({[el.name]:el.value});
        }
    }

    toggleCurrentTerms(e)
    {
        let el=e.currentTarget;

        let val=parseInt(el.value);

        let ct=this.state.current_terms;

        if(el.checked==true)
        {
            if(ct.indexOf(val)==-1)
            {
                ct.push(val);
            }
        }
        else
        {
            if(ct.indexOf(val)>-1)
            {
                ct.splice(ct.indexOf(val), 1);
            }
        }

        /* Keeps only one if it is radio button. It means the taxonomy accepts only single */
        if(el.type=='radio' && ct.length>0)
        {
            ct=[ct[ct.length-1]];
        }

        this.setState({'current_terms':ct});
    }

    toggleEditor(a,b)
    {
        this.setState({'create':b==true});
    }

    componentDidUpdate()
    {
        let {post_updated=false}=this.props;

        if(post_updated)
        {
            this.saveTaxonomy();
        }
    }

    saveTaxonomy()
    {
        let {post_id, meta_box_id}=this.props;

        let current_terms=this.state.current_terms;

        let req_ob=
        {
            'post_id'           :   post_id, 
            'current_terms'     :   current_terms,
            'taxonomy'          :   meta_box_id
        }

        this.setState({'loading':true});

        ajax_request('nr_save_post_editor_taxonomy', req_ob, r=>
        {
            this.setState({'loading':false});
        });
    }

    componentDidMount()
    {
        this.fetchTaxonomy();
    }

    render()
    {
        let {meta_box_id}=this.props;

        let {
                hierarchical, 
                all_terms=[], 
                current_terms=[],
                loading,
                multiple,
                primary_term_key,
                primary_term,
                create
            
            }=this.state;

        let pass_prop=
        {
            'taxonomy':meta_box_id, 
            'hierarchical':hierarchical, 
            'taxonomy_title':false,
            'taxonomies':all_terms
        }

        return <div id="nr_taxonomy_metabox">
            
            {
                loading ? <Spinner size="15px"/> : null
            }

            {
                all_terms.length>0 ? <i><small>Don't forget to select primary term.</small></i> : null
            }

            <form onSubmit={(e)=>e.preventDefault()} style={{'maxHeight':'500px', 'overflow':'auto'}}>
                <table style={{'width':'100%'}}>
                    <tbody>
                        {
                            all_terms.map(item=>
                            {
                                return <tr key={item.term_id}>
                                    <td>
                                        <div style={{'paddingLeft':(item.nest_level*12)+'px'}}>
                                            <label className="label-pointer mb-0">
                                                <input
                                                    type={multiple==true ? "checkbox" : "radio"}
                                                    data-ignore={true} 
                                                    name={"taxonomy_"+meta_box_id} 
                                                    value={item.term_id} 
                                                    defaultChecked={current_terms.indexOf(item.term_id)>-1}
                                                    onChange={this.toggleCurrentTerms}/> {item.name} 
                                            </label>
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        {
                                            current_terms.indexOf(item.term_id)==-1 ? null :
                                            <input 
                                                type="radio" 
                                                title="Select Primary Term" 
                                                name={primary_term_key} 
                                                value={item.term_id} 
                                                defaultChecked={primary_term==item.term_id} 
                                                onChange={this.setPrimaryTerm}/> 
                                        }
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </form>

            {
                create ? 
                <div className="mt-2">
                    <TaxonomyManager {...pass_prop} fetchTaxonomies={this.fetchTaxonomy} closeEditor={this.toggleEditor} cls="container-fluid"/>
                </div> : 
                <div className="text-right mt-2">
                    <span className="text-info pointer" onClick={()=>this.toggleEditor(true, true)} style={{'cursor':'pointer'}}>Create</span>
                </div>}
        </div>
    }
}

export {PostTaxonomy}