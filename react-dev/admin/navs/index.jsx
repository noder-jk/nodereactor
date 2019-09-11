import React, {Component} from "react";
import Spinner from "react-svg-spinner";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as FaIcons from '@fortawesome/free-solid-svg-icons';

import {ajax_request} from 'nodereactor/react';

import './style.scss';

let AdminMenus=false;
let CurrentNav=false;
let OpenedNavRoot='';
let OpenedNavSlug='';
let OpenedSubSlug='';

const getNavList=(cback)=>
{
    if(AdminMenus)
    {
        cback(AdminMenus, CurrentNav);
        return;
    }

    /* Get all admin menus and decide which component will be used to render admin page. */
    ajax_request('nr_get_admin_nav', (r, d, e)=>
    {
        if(e)
        {
            cback(false, CurrentNav);
            return;
        }

        let {nr_admin_navs=false}=r;

        if(nr_admin_navs)
        {
            AdminMenus= nr_admin_navs;

            let p=window.location.pathname;
            p=p.split('/').filter(item=>{return item!==''});

            /* Set default page if access to only /nr-admin */
            if(window.location.pathname=='/nr-admin' || window.location.pathname=='/nr-admin/')
            {
                p[1]='index';
                p[2]='dashboard';
            }

            if(p[2] && AdminMenus[p[1]])
            {
                if(AdminMenus[p[1]].main && AdminMenus[p[1]].main.slug==p[2])
                {
                    /* This block determine main active nav */
                    OpenedNavRoot=p[1];
                    CurrentNav=AdminMenus[p[1]].main;
                }
                else if(AdminMenus[p[1]].sub)
                {
                    /* This block determine active sub nav  */
                    OpenedNavRoot=p[1];
                    let s=AdminMenus[p[1]].sub.filter(item=>{return item.slug==p[2]});
                    
                    CurrentNav= s.length==1 ? s[0] : false;
                    
                    OpenedSubSlug=(CurrentNav && CurrentNav.slug) ? CurrentNav.slug : '';
                }

                OpenedNavSlug=(AdminMenus[p[1]].main && AdminMenus[p[1]].main.slug) ? AdminMenus[p[1]].main.slug : '';
            }
        }

        cback(AdminMenus, CurrentNav);
    });
}

class ProcessNav extends Component
{
    constructor(props)
    {
        super(props);

        this.state={
            left_offset:'', 
            top_offset:'',
            collapsed:false,
            cls:'fas fa-arrow-left'
        }
        
        this.showPopNav=this.showPopNav.bind(this);
        this.collapseExpand=this.collapseExpand.bind(this);
    }


    showPopNav(ttl)
    {
        /* Show sub floating sub nav on hover */
        if(this.li_tags[ttl])
        {
            let el=this.li_tags[ttl];

            let rect = el.getBoundingClientRect();
            
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            let top_o=rect.top + scrollTop;
            let left_o=el.offsetWidth;

            this.setState({'top_offset':top_o+'px', 'left_offset':left_o+'px'});
        }
    }

    collapseExpand(event)
    {
        /* Collapse/expand left navigation bar when click toggle button at the bottom. */
        event.preventDefault();

        this.setState({collapsed:!this.state.collapsed});
    }

    render()
    {
        this.li_tags={};

        let {navs}=this.props;

        return(
            <aside id="nav_aside" className={this.state.collapsed ? 'collapsed_asside' : ''}>
                <ul>
                    {Object.keys(navs).map(k=>
                    {
                        let title=navs[k].main.menu_title;
                        let icon=navs[k].main.menu_icon;
                        let slug=navs[k].main.slug;
                        
                        return(
                            <li key={title} onMouseOver={()=>this.showPopNav(title)} ref={el=>this.li_tags[title]=el} className={(OpenedNavSlug==slug && OpenedNavRoot==k) ? 'main-opened' : 'main-closed'}>
                                <a href={'/nr-admin/'+k+'/'+slug}>
                                    <span>
                                        {FaIcons[icon] ? <FontAwesomeIcon icon={FaIcons[icon]}/> : null}
                                    </span>
                                    <span>{title}</span>
                                </a>
                                <ul className="to_pop_up" style={{'left':this.state.left_offset, 'top':this.state.top_offset}}>
                                    {
                                        navs[k].sub.map(item=>{

                                            let stl={};

                                            if(!item.hide_if_not || window.location.pathname.indexOf(item.hide_if_not)===0)
                                            {
                                                
                                            }
                                            else
                                            {
                                                stl.display='none';
                                            } 

                                            return(
                                                <li key={item.slug} style={stl}>
                                                    <a href={'/nr-admin/'+k+'/'+item.slug} className={OpenedSubSlug==item.slug ? 'active_sub' : ''}>{item.menu_title}</a>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </li>
                        );
                    })}
                    <li className="main-closed">
                        <a href="/" onClick={this.collapseExpand}>
                            <span>
                                <FontAwesomeIcon icon={this.state.collapsed ? FaIcons.faArrowRight : FaIcons.faArrowLeft}/>
                            </span>
                            <span>Collapse</span>
                        </a>
                    </li>
                </ul>
            </aside>
        )
    }
}

class Navigation extends Component
{
    constructor(props)
    {
        super(props);

        this.state={content:<Spinner size="15px"/>}
    }

    componentDidMount()
    {
        getNavList(r=>
        {
            if(r)
            {
                this.setState({'content': <ProcessNav navs={r}/>});
            }
            else
            {
                this.setState({'content': <span className="text-danger">Loading Failed</span>});
            }
        });
    }

    render()
    {
        return(this.state.content)
    }
}

export {Navigation,getNavList}