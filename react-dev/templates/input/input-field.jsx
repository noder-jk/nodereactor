import React, {Component} from 'react';

import {RenderMediaFile} from '../../helper/render-media';
import {parse_input_value, Media} from 'nodereactor/react';

import './style.scss';

const field_classes=
{
    textarea:'form-control',
    text:'form-control',
    number:'form-control',
    select:'form-control',
    radio:'',
    checkbox:''
};

const RenderURL=(props)=>
{
    let {url}=props;

    let ext=url.split('.');
    ext=ext[ext.length-1] || '';

    return <div>
        <div>
            <RenderMediaFile url={url} extension={ext}/>
        </div>
        {url}
    </div>
}

class Input extends Component
{
    constructor(props)
    {
        super(props);

        this.state=
        {
            'media_opened':false
        }

        this.getVal=this.getVal.bind(this);
    }

    getVal(e, ob)
    {
        let {set_values={}, onChange}=this.props;

        if(ob)
        {
            // No need parse, it is value directly
            set_values=Object.assign(set_values, ob);
        }
        else
        {
            // It is non linear value like text, number
            let parse=parse_input_value(e.currentTarget, set_values);
            set_values=Object.assign(set_values, parse);
        }
        
        onChange(set_values);
    }

    render()
    {
        let {media_opened}=this.state;

        let {
            name, 
            title, 
            
            type="text",
            children,

            // For number input
            min=null,
            max=null,
            step=null,

            // Media input
            multiple=false,
            accept=[],

            hint,
            required=false,
            values=[],
            default_value='',

            // Classes
            container_class='row mb-4',
            first_column_class='col-12 col-sm-5 col-md-4 col-lg-3',
            second_column_class='col-12 col-sm-7 col-md-6 col-lg-5',
            input_class

        }=this.props;

        !Array.isArray(hint) ? hint=[hint] : 0;
        input_class=input_class || field_classes[type];

        return <div className={container_class+' nr-core-input-component'}>
            <div className={first_column_class}>
                {
                    !title ? null : 
                    <b>
                        {title} {required ? '*' : null}
                    </b> 
                }
            </div>
            <div className={second_column_class}>
                <div>
                    {type=='textarea' ? <textarea name={name} onChange={this.getVal} defaultValue={default_value} className={input_class}></textarea> : null}

                    {type=='text' ? <input name={name} type="text" onChange={this.getVal} defaultValue={default_value}  className={input_class}/> : null}
                    
                    {type=='number' ? <input name={name} type="number" min={min} max={max} step={step} onChange={this.getVal} defaultValue={default_value}  className={input_class}/> : null}

                    {
                        type!=='select' ? null : 
                        <select name={name} className={input_class} defaultValue={default_value} onChange={this.getVal}>
                            {
                                values.map(v=>
                                {
                                    let {title, value}=typeof v=='object' ? v : {value:v, title:v};
                                    
                                    return <option key={value} value={value}>
                                        {title}
                                    </option>
                                })
                            }
                        </select>
                    }

                    {
                        (type!=='radio' && type!=='checkbox') ? null :
                        <form>
                            {
                                !Array.isArray(values) ? null :
                                values.map(item=>
                                {
                                    // if it is array rather than key value paired object
                                    let {title, value}=typeof item=='object' ? item : {value:item, title:item};

                                    !Array.isArray(default_value) ? default_value=[default_value] : 0;
                                
                                    return <label key={value}>
                                        <input 
                                            type={type}
                                            name={name} 
                                            value={value}
                                            defaultChecked={default_value.indexOf(value)>-1}
                                            onChange={this.getVal}
                                            className={input_class}/> {title}
                                    </label>
                                })
                            }
                        </form>
                    }

                    {
                        type!=='media' ? null : 
                        <div>
                            {
                                default_value ? <RenderURL url={default_value}/> : null
                            }

                            <button className="btn btn-outline-secondary btn-sm" onClick={()=>this.setState({media_opened:true})}>
                                {default_value ? 'Change' : 'Choose'}
                            </button>
                            
                            {
                                !media_opened ? null : 
                                <Media
                                    onClose={()=>this.setState({media_opened:false})}
                                    onResult={(f)=>this.getVal(false, {[name]:f.file_url})}
                                    multiple={multiple}
                                    accept={accept}/>
                            }
                        </div>
                    }

                    {children}
                </div>
                {
                    hint.map(h=><small key={h}><i dangerouslySetInnerHTML={{__html:h}}></i></small>)
                }
            </div>
        </div>
    }
}

export {Input}