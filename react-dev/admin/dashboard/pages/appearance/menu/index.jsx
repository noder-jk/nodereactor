import React, {Component} from 'react';
import Swal from 'sweetalert2';
import Spinner from 'react-svg-spinner';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons';

import {ajaxRequest} from 'nodereactor/react';

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
        this.closeMenuEditor=this.closeMenuEditor.bind(this);

        this.deleteMenu=this.deleteMenu.bind(this);

        this.openEditor=this.openEditor.bind(this);
    }
    
    openEditor(menu)
    {   
        let {lastOb=false}=this.props;

        let {locations, menus}=this.state;

        let ed=<MenuEditor lastOb={lastOb} locations={locations} menus={menus[menu]} menu_name={menu} closeMenuForm={this.closeMenuEditor}/>

        this.setState({'editor':{'name':menu, 'component':ed},'mode':false});
    }

    createNew()
    {
        this.setState({'mode':'create','editor':{}});
    }

    closeMenuEditor(saved)
    {
        this.setState({'editor':{}, 'mode':false});

        if(saved)
        {
            this.fetchMenuContents();
        }
    }

    deleteMenu(menu_name)
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
            ajaxRequest('nr_delete_menu', {menu_name}, (r, d, e)=>
            {
                this.setState({'loading':false}, this.fetchMenuContents);
                
                e ? Swal.fire('Request Error') : 0;
            });
        });
    }

    fetchMenuContents()
    {
        this.setState({'loading':true});

        ajaxRequest('nr_get_menu_items', r=>
        {
            let {locations={}, nr_menus={}}=r;

            let set_ob={'loading':false, locations, 'menus':nr_menus};

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
                set_ob.menus[k].items ? set_ob.menus[k].items=recurs(set_ob.menus[k].items) : 0;
            }

            this.setState(set_ob);
        });
    }

    componentDidMount()
    {
        this.fetchMenuContents();
    }

    render()
    {
        let {lastOb=false}=this.props;

        let {loading, locations, menus, mode, editor}=this.state;

        return  <div className="col-6 col-md-7">
            <h4>Menus {loading==true ? <Spinner size="15px"/> : null}</h4>
            {
                mode!=='create' ? 
                    <span onClick={this.createNew}>+ Create New</span> : 
                    <div className="menu-name-list">
                        <MenuEditor locations={locations} closeMenuForm={this.closeMenuEditor} lastOb={lastOb}/>
                    </div>
            }

            {Object.keys(menus).map(m=>
            {
                return  <div className="menu-name-list" key={m}>
                    {editor.name==m ? null : <b>{m}</b>}

                    {
                        editor.name==m ? null :
                        <span>
                            <FontAwesomeIcon icon={faEdit} onClick={()=>this.openEditor(m)}/> &nbsp;
                            <FontAwesomeIcon icon={faTrashAlt} onClick={()=>this.deleteMenu(m)}/>
                        </span>
                    }

                    {
                        editor.name==m ? 
                        <MenuEditor lastOb={lastOb} locations={locations} menus={menus[m]} menu_name={m} closeMenuForm={this.closeMenuEditor}/> : 
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
        let {current_tab}=this.state;

        let pst=
        {
            'action':'nr_get_nav_posts',
            'title_name':'post_title',
            'id_name':'post_id',
            'parent_name':'post_parent'
        }

        let txn=
        {
            'action':'nr_get_nav_terms',
            'title_name':'name',
            'id_name':'term_id',
            'parent_name':'parent'
        }

        
        return  <div className="col-6 col-md-5">
                    <h4>Contents</h4>

                    <ObjectContents properties={pst} opener={this.open} current_tab={current_tab} addHook={this.adder}/>

                    <ObjectContents properties={txn} opener={this.open} current_tab={current_tab} addHook={this.adder}/>

                    <div className="menu-content-type" onClick={()=>this.open('custom')}>
                        <b>Custom Link</b>
                        {current_tab=='custom' ? <CustomLink addHook={this.adder}/> : null}
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