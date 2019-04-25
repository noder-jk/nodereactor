import React, {Component} from 'react';
import axios from 'axios';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowCircleRight, faArrowAltCircleDown} from '@fortawesome/free-solid-svg-icons';

import {ajax_url, get_hierarchy} from 'nodereactor/react';

class ObjectContents extends Component
{
    constructor(props)
    {
        super(props);

        this.state=
        {
            'checked':[],
            'items':{}
        }

        this.adder=this.adder.bind(this);
        this.checker=this.checker.bind(this);
    }

    checker(e)
    {
        let el=e.currentTarget;

        let checked=this.state.checked;

        if(el.checked)
        {
            if(checked.indexOf(el.value)==-1)
            {
                checked.push(el.value);
            }
        }
        else
        {
            checked.splice(checked.indexOf(el.value), 1);
        }

        this.setState({'checked':checked});
    }

    adder(pos)
    {
        let {id_name, title_name}=this.props.properties;

        let {checked}=this.state;

        if(checked.length==0){return;}

        let ret=[];

        /* Loop through all checked elements and add to menu */
        checked.map(id=>
        {
            Object.keys(this.state.items).map(itm=>
            {
                this.state.items[itm].map(obj=>
                {
                    if(id==obj[id_name])
                    {
                        ret.push
                        ({
                            [id_name]:id, 
                            'title':obj[title_name],
                        });
                    }
                })
            });
        });

        if(ret.length>0)
        {
            let {addHook}=this.props;

            addHook({'item':ret, 'position':pos});
        }
    }

    componentDidMount()
    {
        let {action}=this.props.properties;

        axios({
            'method':'post',
            'url':ajax_url ,
            'data':{'action':action}
        }).then(r=>
        {
            if(r.data.objects)
            {
                this.setState({'items':r.data.objects});
            }
        }).catch(e=>
        {
            
        })
    }

    render()
    {
        let {opener, current_tab}=this.props;

        let {title_name, id_name, parent_name}=this.props.properties;

        let {items={}}=this.state;

        for(let k in items)
        {
            items[k]=get_hierarchy(items[k], parent_name, id_name);
        }

        return  Object.keys(items).map(item=>
        {
            let tab_ttl=item.charAt(0).toUpperCase()+item.slice(1);

            return  <div className="menu-content-type" key={item} onClick={()=>opener(item)} style={{'overflowY':'auto', 'maxHeight':'300px'}}>
                        <b>{tab_ttl} </b>
                        {
                            current_tab==item ? 
                            <div className="bg-white p-2">
                                {
                                    items[item].length==0 ? <i>No {tab_ttl}</i> : 
                                    items[item].map(post=>
                                    {
                                        console.log(post.nest_level);

                                        return  <p key={post[id_name]} className="item-single-post" style={{'paddingLeft':(post.nest_level*10)+'px'}}>
                                                <input type="checkbox" name={"nv_"+id_name} value={post[id_name]} onChange={this.checker}/> {post[title_name]}
                                            </p>
                                    })
                                }
                                <div className="text-right">
                                    <button onClick={()=>this.adder('append')} className="btn btn-secondary btn-sm" title="Append to Selected"><FontAwesomeIcon icon={faArrowCircleRight}/></button> &nbsp;
                                    <button onClick={()=>this.adder('after')} className="btn btn-secondary btn-sm" title="Add After Selected"><FontAwesomeIcon icon={faArrowAltCircleDown}/></button>
                                </div>
                            </div> : null
                        }
                    </div>
        })
    }
}

export {ObjectContents}