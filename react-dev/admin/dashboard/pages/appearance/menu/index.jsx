import React, {Component} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Spinner from 'react-svg-spinner';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons';

import {ajax_url } from 'nodereactor/react';

import {ObjectContents} from './objects';
import {CustomLink} from './custom';
import {MenuEditor} from './menu-editor'

import './style.scss';

class Menus extends Component
{
    constructor(props)
    {
        super(props);


        this.state=
        {
            'mode':false,
            'loading':false,
            'locations':{},
            'menus':{},
            'editor':{}
        }

        this.fetchMenuContents=this.fetchMenuContents.bind(this);

        this.createNew=this.createNew.bind(this);
        this.closeNew=this.closeNew.bind(this);

        this.deleteMenu=this.deleteMenu.bind(this);

        this.openEditor=this.openEditor.bind(this);
    }
    
    openEditor(menu)
    {   
        let {lastOb=false}=this.props;

        let ed=<MenuEditor lastOb={lastOb} locations={this.state.locations} menus={this.state.menus[menu]} menu_name={menu} closeMenuForm={()=>{this.setState({'editor':{}})}}/>

        this.setState({'editor':{'name':menu, 'component':ed},'mode':false});
    }

    createNew()
    {
        this.setState({'mode':'create','editor':{}});
    }

    closeNew()
    {
        this.setState({'mode':false});
    }

    deleteMenu(m)
    {
        Swal.fire
        ({
            title: 'Sure to delete?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true
        }).then((result) => 
        {
            if(!result.value){return;}

            /* Now request to server to delete. */
            this.setState({'loading':true});
            axios({
                method:'post',
                data:{'action':'nr_delete_menu', 'menu_name':m},
                url:ajax_url 
            }).then(r=>
            {
                this.setState({'loading':true}, this.fetchMenuContents);
            }).catch(r=>
            {
                this.setState({'loading':false});
                
                Swal.fire('Request Error');   
            });
        });
    }

    fetchMenuContents()
    {
        this.setState({'loading':true});

        axios({
            'method':'post',
            'url':ajax_url ,
            'data':{'action':'nr_get_menu_items'}
        }).then(r=>
        {
            let set_ob={'loading':false}

            if(r.data)
            {
                set_ob.locations=r.data.locations;
                set_ob.menus=r.data.nr_menus;

                let recurs=(ar)=>
                {
                    return Array.isArray(ar) ? ar.map(item=>
                    {
                        if(Array.isArray(item.children))
                        {
                            item.children=recurs(item.children);
                        } 

                        return item;
                    }) : [];
                }

                for(let k in set_ob.menus)
                {
                    if(set_ob.menus[k].items)
                    {
                        set_ob.menus[k].items=recurs(set_ob.menus[k].items);
                    }
                }

                set_ob.menus=set_ob.menus;
            }

            this.setState(set_ob);
        })
    }

    componentDidMount()
    {
        this.fetchMenuContents();
    }

    render()
    {
        let {lastOb=false}=this.props;

        return  <div className="col-6 col-md-7">
            <h4>Menus {this.state.loading==true ? <Spinner size="15px"/> : null}</h4>
            {
                this.state.mode!=='create' ? 
                    <span onClick={this.createNew}>+ Create New Menu</span> : 
                    <div className="menu-name-list">
                        <MenuEditor locations={this.state.locations} closeMenuForm={this.closeNew} lastOb={lastOb}/>
                    </div>
            }

            {Object.keys(this.state.menus).map(m=>
            {
                return  <div className="menu-name-list" key={m}>
                    {this.state.editor.name==m ? null : <b>{m}</b>}

                    {
                        this.state.editor.name==m ? null :
                        <span>
                            <FontAwesomeIcon icon={faEdit} onClick={()=>this.openEditor(m)}/> &nbsp;
                            <FontAwesomeIcon icon={faTrashAlt} onClick={()=>this.deleteMenu(m)}/>
                        </span>
                    }

                    {
                        this.state.editor.name==m ? 
                        <MenuEditor lastOb={lastOb} locations={this.state.locations} menus={this.state.menus[m]} menu_name={m} closeMenuForm={()=>{this.setState({'editor':{}})}}/> : 
                        null
                    }
                </div>
            })}
        </div>
    }
}


class Contents extends Component
{
    constructor(props)
    {
        super(props);

        this.state=
        {
            'current_tab':''
        }

        this.adder=this.adder.bind(this);
        this.open=this.open.bind(this);
    }

    open(key)
    {
        this.setState({'current_tab': key});
    }

    adder(ob)
    {
        this.props.pingParent(ob);
    }

    render()
    {
        let pst=
        {
            'action':'nr_get_nav_posts',
            'title_name':'post_title',
            'id_name':'post_id'
        }

        let txn=
        {
            'action':'nr_get_nav_terms',
            'title_name':'name',
            'id_name':'term_id'
        }

        return  <div className="col-6 col-md-5">
                    <h4>Contents</h4>

                    <ObjectContents properties={pst} opener={this.open} current_tab={this.state.current_tab} addHook={this.adder}/>

                    <ObjectContents properties={txn} opener={this.open} current_tab={this.state.current_tab} addHook={this.adder}/>

                    <div className="menu-content-type" onClick={()=>this.open('custom')}>
                        <b>Custom Link</b>
                        {this.state.current_tab=='custom' ? <CustomLink addHook={this.adder}/> : null}
                    </div>
                </div>
    }
}

class MenuPage extends Component
{
    constructor(props)
    {
        super(props);

        this.state={'last_ob':false}

        this.getOb=this.getOb.bind(this);
    }

    getOb(ob)
    {
        this.setState({'last_ob':ob}, ()=>this.setState({'last_ob':false}));
    }

    render()
    {
        return  <div className="row admin-menu-page">
                    <Contents pingParent={this.getOb}/>
                    <Menus lastOb={this.state.last_ob}/>
                </div>
    }
}

export {MenuPage}