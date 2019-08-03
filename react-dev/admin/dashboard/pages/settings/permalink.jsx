import React, {Component} from "react";
import Spinner from 'react-svg-spinner';

import Swal from 'sweetalert2';

import {ajaxRequest} from 'nodereactor/react';

class PSetting extends Component
{
    constructor(props)
    {
        super(props);

        let {ResponseData={}}=this.props;
        let {values={}}=ResponseData;

        this.state=
        {
            'configs':{},
            'loading':false,
            values
        }
    }

    componentDidMount()
    {
        this.setState({'loading':true});

        ajaxRequest('nr_get_permalink_settings', r=>
        {
            this.setState({'loading':false, configs:r});

        });
    }

    render()
    {
        let {onChange}=this.props;

        let {configs={}}=this.state;

        let {post_types={}, taxonomies={}, used_taxonomies={}}=configs;

        let values=this.state.values;

        return <div>
            <div className="row mb-4">
                <div className="col-12">
                    <h4>
                        Permalink Structure 
                        {this.state.loading ? <Spinner size="15px"/> : null}
                    </h4>
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
                                <div><input type="radio" name={ptn} onChange={onChange} defaultChecked={true} value="h"/> hierarchical</div> :
                                <div>
                                    <input type="radio" name={ptn} onChange={onChange} value="n" defaultChecked={(used_tx.length==0 || values[ptn]=='n')}/> post-name<br/>
                                    {
                                        used_tx.length>0 ?
                                        <div>
                                            <input type="radio" name={ptn} onChange={onChange} value="tn" defaultChecked={values[ptn]=='tn'}/> terms/post-name<br/>
                                            <input type="radio" name={ptn} onChange={onChange} value="ttn" defaultChecked={values[ptn]=='ttn'}/> taxonomy/terms/post-name
                                        </div> : null
                                    }
                                    
                                    <br/>
                                    {used_tx.length>0 ? <b>Permalink Taxonomy :</b> : null}
                                    {
                                        used_tx.map(tx=>
                                        {
                                            return <div key={tx}><input type="radio" onChange={onChange} name={ptxn} value={tx}  defaultChecked={values[ptxn]==tx}/> {tx}</div>
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
                    <div><input type="radio" name="term_permalink" value="t" onChange={onChange} defaultChecked={values.term_permalink=='t'}/> terms</div>
                    <div><input type="radio" name="term_permalink" value="tt" onChange={onChange} defaultChecked={values.term_permalink=='tt'}/> taxonomy/terms</div>
                </div>
            </form>
        </div>
    }
}

export {PSetting}