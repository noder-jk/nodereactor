import {Placeholder} from './helper/comp-placeholder';
import {parse_form} from './helper/form-parser';

import {get_url_parameter,Pagination,get_hierarchy} from './helper/utility';

import {LoginRegistration} from './tools/auth';
import {AdminBar} from './tools/admin-bar';
import {Editor} from './tools/editor';
import {Media} from './tools/media';

import {RenderMediaFile} from './helper/render-media';

import {array_pull_down, array_pull_up} from './helper/array';

import * as MenuHooks from './hooks/menu';
import * as PostHooks from './hooks/post';
import * as SidebarHooks from './hooks/sidebar';

const hooks=[PostHooks, SidebarHooks, MenuHooks];

const ajax_url      = '/admin-ajax';
const socket_url    = 'nr-socket-io-core-channel';

export  {
            ajax_url , 
            parse_form,
            get_hierarchy,
            get_url_parameter,
            array_pull_down,
            array_pull_up, 

            socket_url,

            LoginRegistration, 
            Placeholder,

            AdminBar,
            Editor,
            Media,
            
            RenderMediaFile,
            Pagination
        }

/* Export various hooks dynamically */
for(let i=0; i<hooks.length; i++)
{
    for(let k in hooks[i])
    {
        module.exports[k]=hooks[i][k];
    }
}