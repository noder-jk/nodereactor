import React from "react";

import {BasicSettings, Placeholder} from 'nodereactor/react';
import {PermalinkSetting} from './permalink';

let general_fields=
{
    name                : {title:'Site Title'},
    description         : {title:'Tagline'},
    time_zone           : {title:'Timezone', type:'select', values:[], default_value:'UTC'},
    max_upload_size     : {title:'Max Upload Size (Byte)'},
    max_db_connection   : {title:'Max DB Connection'},
    nr_session_cookie_name:{title:'Session Cookie Name Key', type:'text', hint:'All users will be logged out upon change.'},
    nr_session_cookie_pass:{title:'Session Cookie Pass Key', type:'text', hint:'All users will be logged out upon change.'},
    session_max_age     : {title:'Default Session Expiry (Seconds)', type:'number'},
    nr_cookie_expiry    : {title:'Default Cookie Expiry (Seconds)', type:'number'},
    nr_login_expiry     : {title:'Default Login Expiry (Seconds)', type:'number'},
    hot_linking_pattern : 
    {
        title:'Allowed Hot Linker Patterns (Regex)', 
        type:'textarea', 
        hint:'Separate multiple patterns by new line without delimiter. Only matched linkers will be allowed to embed contents.'
    }
}

let reading_fields=
{
    posts_per_page:{title:'Post Per Page Default', type:'number', min:1, default_value:10},
    media_per_page:{title:'Media per page in Media Dashboard', type:'number', min:1, default_value:30}
}

const GeneralSettingProcess=(props)=>
{
    let {response}=props;
    let {time_zones=[]}=response;

    general_fields.time_zone.values=time_zones;

    return <BasicSettings 
                title="General Settings"
                package_name={true}
                get_data_action="nr_get_general_settings"
                save_data_action="nr_save_general_settings"
                fields={general_fields}/>
}

const GeneralSetting=()=>
{
    return <Placeholder action="nr_get_gen_settings" component={GeneralSettingProcess}/>
}

const ReadingSetting=()=>
{
    return <BasicSettings 
                title="Reading Settings"
                package_name={true}
                fields={reading_fields}/>
}

export {GeneralSetting, PermalinkSetting, ReadingSetting}