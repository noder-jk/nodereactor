import React, {Component} from "react";
import Spinner from 'react-svg-spinner';
import Swal from 'sweetalert2';

import {parse_input_value} from 'nodereactor/react';
import {ajax_request} from 'nodereactor/react';

import {Instruction} from '../post/taxonomy/instruction';

import './permalink.scss';

class PermalinkSetting extends Component
{
    constructor(props)
    {
        super(props);

        this.state=
        {
            'configs':{},
            'loading':false,
            'saving':false,
            'values':{}
        }

        this.saveData=this.saveData.bind(this);
        this.onChange=this.onChange.bind(this);
    }

    saveData()
    {
        let {values}=this.state;

        this.setState({saving:true});
        ajax_request('nr_save_general_settings', {values}, (r, d, e)=>
        {
            this.setState({saving:false});

            let {status='error'}=r;

            Swal.fire(status, (status=='success' ? 'Saved' : 'Action Failed'), status);
        });
    }

    onChange(e)
    {
        let {values}=this.state;

        values=parse_input_value(e.currentTarget, values);

        this.setState({values});
    }

    componentDidMount()
    {
        this.setState({'loading':true});

        ajax_request('nr_get_permalink_settings', r=>
        {
            this.setState({'loading':false, ...r});
        });
    }

    render()
    {
        let {
                configs={}, 
                loading, 
                saving, 
                values

            }=this.state;

        let {
                post_types={}, 
                taxonomies={}, 
                used_taxonomies={}

            }=configs;

        return loading ? <Spinner size="15px"/> 
        : 
        <div id="nr-settings-permalink-page">
            <div className="row mb-4">
                <div className="col-12">
                    <h4>Permalink Structure</h4>
                    <hr/>
                </div>
            </div>

            {
                Object.keys(post_types).map(pt=>
                {
                    let used_tx=Object.keys(taxonomies).filter(tx=>(used_taxonomies[pt] && used_taxonomies[pt].indexOf(tx)>-1));
                    let ptn=pt+'_post_permalink';
                    let ptxn=pt+'_post_taxonomy';

                    return <form key={pt} className="row mb-4">
                        <div className="col-12 col-sm-4 col-md-3 col-lg-2">{pt}</div>
                        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                            {
                                post_types[pt].hierarchical==true ? 
                                <label>
                                    <input 
                                        type="radio" 
                                        name={ptn} 
                                        onChange={this.onChange} 
                                        defaultChecked={true} 
                                        value="h"/> hierarchical~
                                </label>
                                :
                                <div>
                                    <label>
                                        <input 
                                            type="radio" 
                                            name={ptn} 
                                            onChange={this.onChange} 
                                            value="n" 
                                            defaultChecked={(used_tx.length==0 || values[ptn]=='n')}/> post-name
                                    </label>
                                    {
                                        used_tx.length>0 ?
                                        <div>
                                            <label>
                                                <input 
                                                    type="radio" 
                                                    name={ptn} 
                                                    onChange={this.onChange} 
                                                    value="tn" 
                                                    defaultChecked={values[ptn]=='tn'}/> terms~/post-name
                                            </label>
                                            <label>
                                                <input 
                                                    type="radio" 
                                                    name={ptn} 
                                                    onChange={this.onChange} 
                                                    value="ttn" 
                                                    defaultChecked={values[ptn]=='ttn'}/> taxonomy/terms~/post-name
                                            </label>
                                        </div> : null
                                    }
                                    
                                    <br/>
                                    {used_tx.length>0 ? <b>Permalink Taxonomy :</b> : null}
                                    {
                                        used_tx.map(tx=>
                                        {
                                            return <label key={tx}>
                                                <input 
                                                    type="radio" 
                                                    onChange={this.onChange} 
                                                    name={ptxn} value={tx}  
                                                    defaultChecked={values[ptxn]==tx}/> {tx}
                                            </label>
                                        })
                                    }
                                </div>
                            }
                        </div>
                    </form>
                })
            }

            <hr/>
            
            <form className="row mb-4">
                <div className="col-12 col-sm-4 col-md-3 col-lg-2">Terms</div>
                <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                    <label>
                        <input 
                            type="radio" 
                            name="term_permalink" 
                            value="t" 
                            onChange={this.onChange} 
                            defaultChecked={values.term_permalink=='t'}/> terms~
                    </label>

                    <label>
                        <input 
                            type="radio" 
                            name="term_permalink" 
                            value="tt" 
                            onChange={this.onChange} 
                            defaultChecked={values.term_permalink=='tt'}/> taxonomy/terms~
                    </label>
                </div>
            </form>

            <button disabled={loading || saving} className="btn btn-secondary" onClick={this.saveData}>
                {saving ? 'Saving' : 'Save'}

                {saving ? <span>&nbsp; <Spinner size="15px"/></span> : null}
            </button>

            <Instruction/>
        </div>
    }
}

export {PermalinkSetting}