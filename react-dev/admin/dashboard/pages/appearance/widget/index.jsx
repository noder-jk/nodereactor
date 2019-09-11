import React, {Component} from "react";
import Swal from 'sweetalert2';
import Spinner from 'react-svg-spinner';

import {FindComp} from 'nodereactor/react/helper/comp-finder';

import {ajax_request , Placeholder, parse_dom_form, array_pull_down, array_pull_up} from 'nodereactor/react';

import './style.scss';

const array_chunk=(arr, chunkLen)=>
{
    var chunkList = []
    var chunkCount = Math.ceil(arr.length/chunkLen)
    for(var i = 0; i < chunkCount; i++)
	{
        chunkList.push(arr.splice(0, chunkLen));
    }
    return chunkList;
}


const LoadInputComponent=(props)=>
{
    const {area=false, widgets=[], linking={}, widget_action}=props;
    
    let ret=[];

    if(area && linking[area])
    {
        /* Loop through all widgets in a single area. */
        for(let i=0; i<linking[area].length; i++)
        {
            let l=linking[area][i];

            /* Loop through all widget to match current widget using nr_package and node type. */
            for(let n=0; n<widgets.length; n++)
            {
                if(widgets[n].nr_package==l.nr_package && widgets[n].id==l.widget_id)
                {
                    let component=widgets[n].input_component;
                    
                    ret.push(
                        <div key={l.key} className="widget_form mb-4" data-widget_id={l.widget_id} data-nr_package={l.nr_package}>
                            <b>
                                <span style={{"float":"left"}}>{widgets[n].title}</span>
                                <i className="widget_action_i fa fa-trash" onClick={()=>widget_action('delete', area, i)}></i>
                                <i className="widget_action_i fa fa-arrow-up" onClick={()=>widget_action('up', area, i)}></i>
                                <i className="widget_action_i fa fa-arrow-down" onClick={()=>widget_action('down', area, i)}></i>
                            </b>
                            <div>
                                <form>
                                    Widget Title
                                    <input name="nr_widget_title" className="form-control mb-3" defaultValue={l.properties.nr_widget_title || widgets[n].title}/>
                                    <FindComp comp_props={{'component':component, 'nr_package':widgets[n].nr_package}} {...l.properties}/>
                                </form>
                            </div>
                        </div>
                    )
                    break;
                }
            }
        }
    }

    return ret;
}

class WidgetProcess extends Component
{
    constructor(props)
    {
        super(props);

        const {widgets={}, sidebars={}, widget_in_sidebar={}}=this.props.response;
        
        Object.keys(widget_in_sidebar).forEach(k=>
        {
            if(Array.isArray(widget_in_sidebar[k]))
            {
                widget_in_sidebar[k].forEach((it,i)=>
                {
                    widget_in_sidebar[k][i].key=Math.random().toString(36);
                });
            }
        })

        const ob={widgets, sidebars, widget_in_sidebar}
        ob.loading=false;

        this.state=ob;

        this.saveWidgets=this.saveWidgets.bind(this);
        this.addWidget=this.addWidget.bind(this);
        this.widgetAction=this.widgetAction.bind(this);
    }
    
    saveWidgets()
    {
        if(!this.widget_container)
        {
            Swal.fire('Something went wrong.');
            return;
        }

        const widget_in_sidebar={};

        /* Loop through every widget are to gather individual widget values */
        let area=this.widget_container.getElementsByClassName('.indiv_area_container');
        for(let i=0; i<area.length; i++)
        {
            let area_id=area[i].dataset.area_id;

            let widget_value_array=[];

            /* Loop through every widget in certain area. */
            let widget=area[i].getElementsByClassName('widget_form');
            for(let n=0; n<widget.length; n++)
            {
                let widget_id=widget[n].dataset.widget_id;

                let pkg=widget[n].dataset.nr_package; 
                pkg=pkg=='true' ? true : pkg;

                let properties=parse_dom_form(widget[n])

                widget_value_array.push
                ({
                    'key':Math.random().toString(36), 
                    'widget_id':widget_id, 
                    'properties':properties, 
                    'nr_package':pkg
                });
            }

            widget_in_sidebar[area_id]=widget_value_array;
        }

        this.setState({'loading':true});
        ajax_request('nr_widget_save', {'widget_and_areas':widget_in_sidebar}, (r, d, e)=>
        {
            this.setState({'loading':false});
            Swal.fire(!e ? 'Changes Saved.' : 'Request Error');
        });
    }

    addWidget(e, area_id)
    {
        let el=e.currentTarget;

        if(el && el.value!=='0')
        {
            let id=el.value;
            
            let {widgets, widget_in_sidebar}=this.state;

            for(let i=0; i<widgets.length; i++)
            {
                if(widgets[i].unique_key==id)
                {
                    if(!widget_in_sidebar[area_id])
                    {
                        widget_in_sidebar[area_id]=[]
                    }

                    widget_in_sidebar[area_id].push
                    ({
                        'key':Math.random().toString(36), 
                        'widget_id':widgets[i].id, 
                        'properties':{}, 
                        'nr_package': widgets[i].nr_package
                    });

                    this.setState({'widget_in_sidebar':widget_in_sidebar});
                    
                    break;
                }
            }

            el.value='0';
        }
    }

    widgetAction(action, area, n)
    {
        let lnk=this.state.widget_in_sidebar

        if(!lnk[area] || !lnk[area][n])
        {
            Swal.fire('Error', 'Something Went Wrong. Page Reload May Resolve the Issue.', 'error');
            return;
        }

        switch(action)
        {
            case 'delete'   :   if(!confirm('Sure to remove ?'))
                                {
                                    return;
                                }
                                lnk[area].splice(n, 1);
                                break;

            case 'up'       :   lnk[area]=array_pull_up(lnk[area], n);
                                break;

            case 'down'     :   lnk[area]=array_pull_down(lnk[area], n);
        }
        
        this.setState({'widget_in_sidebar':lnk});
    }

    render()
    {
        const {widgets=[], sidebars={}, widget_in_sidebar={}}=this.state;

        let ob=Object.keys(sidebars).map(k=>
        {
            return sidebars[k];
        })
        
        let ch_length=Math.floor(ob.length/3);
        ch_length=ch_length<1 ? 1 : ch_length;

        let chunk=ob.length>0 ? array_chunk(ob, (ch_length)) : [];

        return(
            <div id="widget_area_page" className="row" ref={el=>{this.widget_container=el}}>
                <div className="col-12 mb-4">
                    <h4>
                        Widget & Areas &nbsp;
                        <button className="btn btn-secondary btn-sm" onClick={this.saveWidgets}>Save All</button>
                        {this.state.loading ? <Spinner size="15px"/> : null}
                    </h4>
                    <hr/>
                </div>
                {
                    chunk.map((item,ind)=>
                    {
                        return(
                            <div key={'area_'+ind} className="col-12 col-md-6 col-xl-4">
                                {
                                    item.map(s_bar=>
                                    {
                                        return(
                                            <div key={s_bar.id} data-area_container="" className=".indiv_area_container" data-area_id={s_bar.id}>
                                                <h5 className="area-head">{s_bar.title}</h5>
                                                <div data-area="">
                                                    <LoadInputComponent area={s_bar.id} widgets={widgets} linking={widget_in_sidebar} widget_action={this.widgetAction}/>
                                                </div>
                                                <div className="text-center adder_select">
                                                    <hr/>
                                                    <select className="form-control d-inline-block" style={{'width':'160px'}} defaultValue="0" onChange={(e)=>this.addWidget(e, s_bar.id)}>
                                                        <option value="0">Select Widget</option>
                                                        {
                                                            widgets.map(item=>
                                                            {
                                                                return (<option key={item.unique_key} value={item.unique_key}>{item.title}</option>)
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

const AdminWidget=(props)=>
{
    return <Placeholder action="nr_get_widget_list" component={WidgetProcess}/>
}

export {AdminWidget} 