import {Placeholder} from './helper/comp-placeholder';
import {get_url_parameter,Pagination,get_hierarchy,SpinIcon} from './helper/utility';


import {LoginRegistration} from './apis/auth';
import {AdminBar} from './apis/admin-bar';
import {Editor} from './apis/editor';
import {Media} from './apis/media';
import {FileChooser} from './templates/file-chooser';

import {array_pull_down, array_pull_up} from './helper/array';
import {ajax_request} from './helper/ajax';

import {Input} from './templates/input/input-field';
import {BasicSettings} from './templates/basic-settings';

import * as Parser from './helper/form-parser';
import * as Cookies from './helper/cookie';

import * as Auth from './hooks/auth';
import * as PartsHooks from './hooks/parts';
import * as PostHooks from './hooks/post';

import * as ScodeHooks from './templates/shortcode';
import * as MenuHooks from './templates/menu';
import * as SidebarHooks from './templates/sidebar';

const bulk_export=
[
    Auth,
    Parser,
    PartsHooks,
    PostHooks, 
    SidebarHooks, 
    MenuHooks,
    ScodeHooks,
    Cookies
];


const ajax_url       = '/admin-ajax';
const socket_event   = 'nr-socket-io-core-channel';


export  {
    ajax_url ,
    ajax_request, 

    socket_event,

    get_hierarchy,
    get_url_parameter,
    SpinIcon,
    array_pull_down,
    array_pull_up, 

    LoginRegistration, 
    Placeholder,

    AdminBar,
    Editor,
    Media,
    FileChooser,

    Pagination,
    
    Input,
    BasicSettings
}

for(let i=0; i<bulk_export.length; i++)
{
    for(let k in bulk_export[i])
    {
        module.exports[k]=bulk_export[i][k];
    }
}