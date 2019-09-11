import React, {Component} from "react";
import Swal from 'sweetalert2';

import {ajax_request} from 'nodereactor/react';

import {Browser} from './browser';
import {Editor} from './editor';

import './style.scss';

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

        ajax_request('nr_get_taxonomy', {'taxonomy':taxonomy}, (r, d, e)=>
        {
            let ob={'loading':false};

            if(e)
            {
                ob.selected=[];
                this.setState(ob);
                Swal.fire('Request Error. Could Not Fetch Taxonomies.');
                return;
            }

            ob.taxonomies=r.taxonomies;
            ob.hierarchical=r.hierarchical;
            ob.taxonomy_title=r.taxonomy_title;

            this.setState(ob)
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