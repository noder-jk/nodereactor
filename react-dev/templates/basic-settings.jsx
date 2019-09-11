import React, {Component} from 'react';
import Spinner from 'react-svg-spinner';
import Swal from 'sweetalert2'; 

import {Input, ajax_request} from 'nodereactor/react';

class BasicSettings extends Component
{
    constructor(props)
    {
        super(props);

        this.state=
        {
            'fetching':true,
            'saving':false,
            'values':{}
        }

        this.onChange=this.onChange.bind(this);
        this.saveData=this.saveData.bind(this);
    }

    onChange(v)
    {
        let {values}=this.state;
        
        values=Object.assign(values, v);

        this.setState({values});
    }

    saveData()
    {
        let {
                save_data_action='nr_basic_settings_saver', 
                package_name, 
                fields
            }=this.props;

        let {values}=this.state;

        fields=Object.keys(fields);

        this.setState({saving:true});
        ajax_request(save_data_action, {values, fields, package_name}, (r, d, e)=>
        {
            let {status='error', message}=r;
            !message ? (message= status=='success' ? 'Saved' : 'Action Failed') : 0;

            status=status.toLowerCase();
            status=status.charAt(0).toUpperCase() + status.slice(1);

            this.setState({saving:false});
            Swal.fire(status, message, status.toLowerCase());
        });
    }

    componentDidMount()
    {
        let {
                get_data_action='nr_basic_settings_getter', 
                package_name, 
                fields
            }=this.props;

        fields=Object.keys(fields);

        ajax_request(get_data_action, {package_name, fields}, (r, d, e)=>
        {
            e ? alert('Something Went Wrong.') : 0;

            this.setState({fetching:false, values:{...r}});
        });
    }

    render()
    {
        let {fetching, saving, values}=this.state;

        let {
                fields={}, 
                onSave, 
                title,
                package_name,
                description
            
            }=this.props;

        return !package_name  ? 
        <div>
            <code>package_name</code> property is mandatory to use <code>BasicSettings</code> component.
        </div>
        :
        <div>
            {
                !title ? null : 
                <div>
                    <h4>{title}</h4>
                    {description ? <small>{description}</small> : null}
                    <hr/>
                </div>
            }
            
            {
                fetching ? <Spinner size="15px"/> :
                Object.keys(fields).map(name=>
                {
                    let f=fields[name];
                    let def=values[name] || f.default_value;

                    delete f.default_value;

                    return <Input
                                key={name} 
                                {...f}
                                set_values={values}
                                onChange={this.onChange}
                                name={name} 
                                default_value={def}/>
                })
            }

            <Input type="children">
                <button disabled={fetching || saving} className="btn btn-secondary btn-sm" onClick={onSave ? onSave() : this.saveData}>
                    {saving ? 'Saving' : 'Save'}
                    {saving ? <span>&nbsp; <Spinner size="15px"/></span> : null}
                </button>
            </Input>
        </div>
    }
}

export {BasicSettings}