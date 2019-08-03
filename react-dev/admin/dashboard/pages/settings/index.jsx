import React, {Component} from "react";
import Swal from 'sweetalert2';
import Spinner from 'react-svg-spinner';

import {Placeholder, ajaxRequest} from 'nodereactor/react';

import {GSetting} from './general';
import {PSetting} from './permalink';
import {RSetting} from './reading';

class FormProcess extends Component
{
    constructor(props)
    {
        super(props);

        this.state=
        {
            'components':
            {
                'GeneralSetting':GSetting,
                'PermalinkSetting':PSetting,
                'ReadingSetting':RSetting
            },
            'loading':false
        }

        this.saveOption=this.saveOption.bind(this);
        this.storeVal=this.storeVal.bind(this);
    }

    storeVal(e)
    {
        let el=e.currentTarget;

        let state={};

        if(el.type=='radio' && !el.checked)
        {
            return;
        }

        state[el.name]=el.value;
            
        this.setState(state);
    }

    saveOption()
    {
        let vals=Object.assign({}, this.state);
        delete vals.components;
        delete vals.loading;

        this.setState({'loading':true});
        ajaxRequest('nr_save_general_settings', {...vals}, (r, d, e)=>
        {
            this.setState({'loading':false});

            let {status='failed'}=r;
        
            Swal.fire(status=='done' ? 'Saved' : 'Could not saved');
        });
    }

    render()
    {
        let {settingPage, ResponseData}=this.props;
        let {components, loading}=this.state;

        let Comp=components[settingPage];

        return <div>
            <Comp onChange={this.storeVal} ResponseData={ResponseData}/>
            <div className="row">
                <div className="col-12 col-sm-4 col-md-3 col-lg-2"></div>
                <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                    <button data-button="save" className="btn btn-secondary btn-sm" disabled={loading} onClick={this.saveOption}>
                        Save {loading ? <span>&nbsp;<Spinner size="15px" color="white"/></span> : null}
                    </button>
                </div>
            </div>
        </div>
    }
}

const GeneralSetting=()=>
{
    return <Placeholder Data={{'action':'nr_get_general_settings'}} Component={FormProcess} settingPage="GeneralSetting"/>
}

const PermalinkSetting=()=>
{
    return <Placeholder Data={{'action':'nr_get_general_settings'}} Component={FormProcess} settingPage="PermalinkSetting"/>
}

const ReadingSetting=()=>
{
    return <Placeholder Data={{'action':'nr_get_general_settings'}} Component={FormProcess} settingPage="ReadingSetting"/>
}

export {GeneralSetting, PermalinkSetting, ReadingSetting}