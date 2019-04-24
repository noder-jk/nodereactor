import React, {Component} from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import Spinner from 'react-svg-spinner';

import {Placeholder, ajax_url } from 'nodereactor/react';

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
        let el=e.target;

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
        let vals=Object.assign({'action':'nr_save_general_settings'}, this.state);
        delete vals.components;
        delete vals.loading;

        this.setState({'loading':true});

        axios({
            method:'post',
            url:ajax_url ,
            data:vals
        }).then(r=>
        {
            this.setState({'loading':false});
        
            Swal.fire((r.data && r.data.status=='done') ? 'Saved' : 'Could not saved');

        }).catch(r=>
        {
            this.setState({'loading':false});
            Swal.fire('Error', 'Request Failed', 'error');
        })
    }

    render()
    {
        let {settingPage}=this.props;
        let {components}=this.state;

        let resp=this.props.ResponseData;

        let Comp=components[settingPage];

        return <div>
            <Comp onChange={this.storeVal} ResponseData={resp}/>
            <div className="row">
                <div className="col-12 col-sm-4 col-md-3 col-lg-2"></div>
                <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                    <button data-button="save" className="btn btn-secondary btn-sm" disabled={this.state.loading} onClick={this.saveOption}>Save</button> &nbsp;
                    
                    {this.state.loading ? <Spinner size="15px"/> : null}
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