import React, {Component} from "react";

const Input=(props)=>
{
    const   {
                title='',
                name='',
                type='text',
                def='',
                change,
                children,
                inp=true,
                txt=false
            }=props;

    return <div className="row mb-4">
        <div className="col-12 col-sm-4 col-md-3 col-lg-2">{title}</div>
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            {inp ? <input name={name} type={type} className="form-control" defaultValue={def}  onChange={change}/> : null}

            {txt ? <textarea name={name} type={type} className="form-control" defaultValue={def}  onChange={change}></textarea> : null}
            
            {children}
        </div>
    </div>
}

class GSetting extends Component
{
    constructor(props)
    {
        super(props);

        let {ResponseData}=this.props;

        let {values={}}=ResponseData;

        this.state=
        {
            name                = values.name, 
            description         = values.description,
            time_zone           = values.time_zone, 
            max_upload_size     = values.max_upload_size     || ((1024*1) * 1024 * 1024),
            max_db_connection   = values.max_db_connection   || 50,
            session_max_age     = values.session_max_age     || 86400,
            track_file_request  = values.track_file_request  || 'no',
            file_request_pattern= values.file_request_pattern
        }
    }

    getVal(e)
    {
        let {onChange}=this.props;

        onchange(e);
    }

    render()
    {
        let {time_zones=[]}=ResponseData;

        return <div>
            <div className="row mb-4">
                <div className="col-12">
                    <h3>General Settings</h3>
                </div>
            </div>

            <Input title="Site Title" name="name" change={getVal} def={this.state.name}/>

            <Input title="Tagline" name="description" change={getVal} def={this.state.description}>
                <i>In a few words, explain what this site is about.</i>
            </Input>

            <Input title="Timezone">
                <select name="time_zone" className="form-control"  onChange={getVal} defaultValue={this.state.time_zone}>
                    {
                        time_zones.map(item=>
                        {
                            return (<option key={item.zone} value={item.zone}>{item.name}</option>)
                        })
                    }
                </select>
            </Input>
            
            <Input title="Max Upload Size (Byte)" name="max_upload_size" change={getVal} def={this.state.max_upload_size}/>

            <Input title="Max DB Connection" name="max_db_connection" change={getVal} def={this.state.max_db_connection}>
                <i>Firstly make sure how many concurrent connection your Database supports</i>
            </Input>

            <Input title="Session Max Age (Seconds)" name="session_max_age" change={getVal} def={this.state.session_max_age}>
                <i>Explicit expiry will override this.</i>
            </Input>

            <div className="row mb-4">
                <div className="col-12 col-sm-4 col-md-3 col-lg-2">
                    Track File Request
                </div>
                <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                    <input type="radio" name="track_file_request" value="yes" defaultChecked={track_file_request=='yes'}/> Yes &nbsp;&nbsp;
                    <input type="radio" name="track_file_request" value="no" defaultChecked={track_file_request=='no'}/> No<br/>
                    <i>Hooks, functions will {track_file_request=='no' ? 'not' : ''} be able to manipulate file requests.</i>
                </div>
            </div>

            {
                track_file_request ? 
                <Input title="File URL Pattern (Regex)" name="file_request_pattern" change={getVal} def={this.state.file_request_pattern}>
                    <i>Multiple pattern allowed. Separate by new line without delimiter.</i><br/>
                    <i>Tracking every file request will slow down webpage loading.</i>
                </Input> : null
            }
        </div>
    }
}

export {GSetting}