import React, {Component} from 'react';
import Spinner from 'react-svg-spinner';

import Swal from 'sweetalert2';

import {ajax_request , array_pull_down, array_pull_up} from 'nodereactor/react';

class MenuEditor extends Component
{
    constructor(props)
    {
        super(props);

        let {
                menus={}, 
                locations={},
                menu_name='Sample Menu Name'
            }=this.props;

        let {association=[], items=[], }=menus;

        /* Set already associated locations */
        Object.keys(locations).map(item=>
        {
            if(association.indexOf(item)>-1)
            {
                locations[item].checked=true;
            }
        });

        this.state=
        {
            'loading':false,
            'items':items,
            'menu_name':menu_name,
            'locations':locations,
            'active_index':'',
            'association':association,
            'show_keyboard_shortcut':false,
            'saved_menu':false
        }

        this.saveMenu=this.saveMenu.bind(this);
        this.renderItems=this.renderItems.bind(this);
        this.setIndex=this.setIndex.bind(this);
        this.setValState=this.setValState.bind(this);

        this.eventListener=this.eventListener.bind(this);

        this.processOrder=this.processOrder.bind(this);
        
        this.locationChecker=this.locationChecker.bind(this);
    }

    setIndex(e,ind)
    {
        e.stopPropagation();
        this.setState({'active_index':ind});
    }

    setValState(e, child, key)
    {
        window.nr_itm=this.state.items;
        
        if(e)
        {
            let el=e.currentTarget;
            window.nr_iv=el.value;

            child=child+'.'+key;
            window.eval('window.nr_itm'+child+' ? window.nr_itm'+child+'=window.nr_iv : null;');
        }

        this.alt_val_store=window.nr_itm;
    }

    processOrder(action)
    {
        window.nr_items=this.state.items;

        let cur_index=this.state.active_index;

        let ind_int_pos=cur_index.lastIndexOf('[')+1;

        let index=parseInt(cur_index.slice(ind_int_pos, -1)); // exclude [], parse int
        
        let child=this.state.active_index.slice(0, ind_int_pos-1);

        window.nr_m=[];

        window.nr_up=array_pull_up;
        window.nr_down=array_pull_down;

        switch(action)
        {
            case 'pull_up'  :   window.eval
                                ('\
                                    var r=window.nr_up(window.nr_items'+child+', '+index+', true);\
                                    window.nr_items'+child+'=r[0];\
                                    window.nr_ind=r[1];\
                                ');
                                break;

            case 'pull_down':   window.eval
                                ('\
                                    var r=window.nr_down(window.nr_items'+child+', '+index+', true);\
                                    window.nr_items'+child+'=r[0];\
                                    window.nr_ind=r[1];\
                                ');
                                break;

            case 'l_up'     :   var m_child=child.slice(0, child.lastIndexOf('[')); // remove ["children"]
                                var ind=m_child.slice(m_child.lastIndexOf('[')).replace('[', '').replace(']', ''); // pick the index
                                m_child=m_child.slice(0, m_child.lastIndexOf('[')); // remove index like [3]
                                
                                if(ind==''){return;}

                                window.eval
                                ('\
                                    window.nr_temp=window.nr_items'+child+'.splice('+index+', 1)[0];\
                                    window.nr_items'+m_child+'.splice('+ind+', 0, window.nr_temp);\
                                    window.nr_ind='+ind+';\
                                ');
                                child=m_child;
                                break;
                                
            case 'l_down'   :   window.nr_rettt=false;
                                window.eval
                                ('\
                                    if(window.nr_items'+child+'['+(index+1)+'])\
                                    {\
                                        window.nr_temp=window.nr_items'+child+'.splice('+index+', 1)[0];\
                                        if(!Array.isArray(window.nr_items'+child+'['+index+'].children))\
                                        {\
                                            window.nr_items'+child+'['+index+'].children=[];\
                                        }\
                                        window.nr_items'+child+'['+index+'].children.splice(0, 0, window.nr_temp);\
                                        window.nr_ind=0;\
                                    }\
                                    else{window.nr_rettt=true;}\
                                ');

                                if(window.nr_rettt==true){return;}

                                child+='['+index+']["children"]';

                                break;

            case 'delete'   :   window.eval
                                ('\
                                    window.nr_items'+child+'.splice('+index+',1);\
                                    window.nr_ind="";\
                                ');
                                break;
        }
        
        let ob={'items':window.nr_items};

        (!(window.nr_ind===false)) ? ob.active_index=child+'['+window.nr_ind+']' : 0;

        this.setState(ob);
    }

    locationChecker(e)
    {
        let el=e.currentTarget;

        let {locations={}}=this.state;

        if(locations[el.value])
        {
            locations[el.value].checked=el.checked;

            this.setState({'locations':locations}, this.setValState);
        }
    }

    saveMenu()
    {
        if(!this.alt_val_store){return;}

        let menu_name=this.state.menu_name.trim();
        if(/\S+/.test(menu_name)==false)
        {
            Swal.fire('Error', 'Menu name must not be empty.', 'error');
            return;
        }

        let association=this.state.locations;

        association=Object.keys(association).map(item=>association[item].checked ? item : false).filter(item=>typeof item=='string');

        let standalone_menu={[menu_name]:{'items':this.alt_val_store, 'association':association}};

        this.setState({'loading':true});

        ajax_request('nr_save_menu', {'menus':standalone_menu}, (r, d, e)=>
        {
            if(e)
            {
                this.setState({'loading':false});
                Swal.fire('Error', 'Menu Could Not Saved', 'error');
                return;
            }

            Swal.fire('Saved');
            this.setState({'loading':false, 'saved_menu':true});
        });
    }

    componentDidUpdate()
    {
        let {lastOb=false}=this.props;
        let ind=this.state.active_index;
        
        if(!lastOb){return;}
        
        let {position}=lastOb;

        window.nr_add_m_i=this.state.items;
        
        window.nr_ad_i=lastOb.item;

        window.nr_ad_i=window.nr_ad_i.map(item=>
        {
            item.key=Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

            return item;
        })

        window.nr_ad_s=true;

        try
        {
            if(position=='append')
            {
                window.nr_ind_=ind;
                
                window.eval('!window.nr_add_m_i'+window.nr_ind_+'.children ? window.nr_add_m_i'+window.nr_ind_+'.children=[] : null;\
                window.nr_add_m_i'+window.nr_ind_+'.children=window.nr_add_m_i'+window.nr_ind_+'.children.concat(window.nr_ad_i);')
            }
            else
            {
                window.nr_ind_=ind.slice(0, ind.lastIndexOf('['));
                window.eval('window.nr_add_m_i'+window.nr_ind_+'=window.nr_add_m_i'+window.nr_ind_+'.concat(window.nr_ad_i);');
            }
        }
        catch(e)
        {
            window.nr_ad_s=false;
        };

        if(window.nr_ad_s==true)
        {
            this.setState({'items':window.nr_add_m_i}, this.setValState);
        }
    }

    eventListener(e)
    {
        let key_action=
        {
            '38'    :   'pull_up',
            '40'    :   'pull_down',
            '46'    :   'delete',
            '37'    :   'l_up',
            '39'    :   'l_down',
        }

        let cd=e.keyCode;
        cd=cd.toString();

        if(e.ctrlKey && key_action[cd])
        {
            this.processOrder(key_action[cd]);
            
            e.preventDefault();
        }
    }

    componentDidMount()
    {
        window.addEventListener('keydown', this.eventListener);
    }

    componentWillUnmount()
    {
        window.removeEventListener('keydown', this.eventListener)
    }

    renderItems()
    {
        let menus=this.state.items;

        let recurs=(ar, child)=>
        {
            if(Array.isArray(ar))
            {
                let ind=child;

                return ar.map((item, index)=>
                {                
                    let act_ind=ind+'['+index+']';

                    let act_st=
                    {
                        'border':'1px dashed red', 
                        'marginTop':'5px',
                        'marginBottom':'5px',
                        'paddingTop':'5px',
                        'paddingRight':'5px',
                        'paddingBottom':'5px'
                    }
                    
                    return typeof item=='object' ? 
                            <div key={item.key} className="recursive_menu_items" style={this.state.active_index==act_ind ? act_st : {}} onClick={(e)=>this.setIndex(e, act_ind)}>
                                <div className="actions-container">
                                    <input type="text" defaultValue={item.title} className="form-control" onChange={(e)=>this.setValState(e, act_ind, 'title')}/>
                                    {item.url ? <input type="text" defaultValue={item.url} className="form-control" onChange={(e)=>this.setValState(e, act_ind, 'url')}/> : null}
                                </div>

                                {Array.isArray(item.children) ? recurs(item.children, act_ind+'["children"]') : null}
                            </div> : null
                })
            }
        }

        return recurs(menus, '');
    }

    render()
    {
        let {closeMenuForm=()=>{}}=this.props;

        let {locations={}}=this.state;

        return  <div>
                    <input type="text" className="form-control" name="menu_name" defaultValue={this.state.menu_name} onChange={(e)=>this.setState({'menu_name':e.currentTarget.value})}/>
                    <small><i>Existing menu that matches this name will be replaced, if any.</i></small>
                    <br/>
                    <div>
                        <b>Menu Items</b>
                        {this.renderItems()}
                    </div>
                    <div>
                        <div className="text-right">
                            <i style={{'cursor':'pointer'}} onClick={()=>this.setState({'show_keyboard_shortcut':!this.state.show_keyboard_shortcut})}>
                                {this.state.show_keyboard_shortcut ? 'Hide' : 'Show'} Keyboard Shortcut
                            </i>
                        </div>
                        
                        {
                            !this.state.show_keyboard_shortcut ? null :
                            <div>
                                Firstly select specific menu, then
                                <ul>
                                    <li><kbd>Ctrl + ↑</kbd> Move up</li>
                                    <li><kbd>Ctrl + ↓</kbd> Move down</li>
                                    <li><kbd>Ctrl + →</kbd> Append to next one.</li>
                                    <li><kbd>Ctrl + ←</kbd> Level up.</li>
                                    <li><kbd>Delete</kbd> Remove</li>
                                </ul>
                            </div>
                        }
                    </div>
                    <br/>
                    <div>
                        <b>Associate To Locations</b>
                        <hr/>
                        {
                            Object.keys(locations).length==0 ? <span>No Locations Registered</span> :
                            Object.keys(locations).map(item=>
                            {
                                return <p key={item}>
                                            <input type="checkbox" name="locations_checker" value={item} defaultChecked={this.state.association.indexOf(item)>-1} onChange={this.locationChecker}/> {locations[item].title} <br/>
                                            <small>{locations[item].description}</small>
                                        </p>
                            })
                        }
                    </div>
                    <div className="text-right">
                        {this.state.loading ? <Spinner size="15px"/> : null} &nbsp;
                        <button className="btn btn-secondary btn-sm" onClick={()=>closeMenuForm(this.state.saved_menu)}>Close</button> &nbsp;
                        <button className="btn btn-secondary btn-sm" onClick={this.saveMenu}>Save</button>
                    </div>
                </div>
    }
}

export {MenuEditor}