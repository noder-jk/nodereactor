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
                txt=false,
                style={},
                min
            }=props;

    return <div className="row mb-4">
        <div className="col-12 col-sm-4 col-md-3 col-lg-2">{title}</div>
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            {inp ? <input name={name} type={type} min={min} className="form-control" defaultValue={def}  onChange={change}/> : null}

            {txt ? <textarea style={style} name={name} type={type} className="form-control" defaultValue={def}  onChange={change}></textarea> : null}
            
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
            name                : values.name, 
            description         : values.description,
            time_zone           : values.time_zone, 
            max_upload_size     : values.max_upload_size     || ((1024*1) * 1024 * 1024),
            max_db_connection   : values.max_db_connection   || 50,
            session_max_age     : values.session_max_age     || 86400,
            track_file_request  : values.track_file_request  || 'no',
            file_request_pattern: values.file_request_pattern,
            hot_linking_pattern : values.hot_linking_pattern
        }

        this.getVal=this.getVal.bind(this);
    }

    getVal(e)
    {
        let {onChange}=this.props;

        let el=e.currentTarget;

        if(el.type=='radio' && el.checked==true)
        {
            this.setState({[el.name]:el.value});
        }
        
        onChange(e);
    }

    render()
    {
        let {ResponseData}=this.props;

        let {time_zones=[]}=ResponseData;

        return <div>
            <div className="row mb-4">
                <div className="col-12">
                    <h3>General Settings</h3>
                </div>
            </div>

            <Input title="Site Title" name="name" change={this.getVal} def={this.state.name}/>

            <Input title="Tagline" name="description" change={this.getVal} def={this.state.description}>
                <small><i>In a few words, explain what this site is about.</i></small>
            </Input>

            <Input title="Timezone" inp={false}>
                <select name="time_zone" className="form-control"  onChange={this.getVal} defaultValue={this.state.time_zone}>
                    {
                        time_zones.map(item=>
                        {
                            return (<option key={item.zone} value={item.zone}>{item.name}</option>)
                        })
                    }
                </select>
            </Input>
            
            <Input title="Max Upload Size (Byte)" type="number" min={1} name="max_upload_size" change={this.getVal} def={this.state.max_upload_size}/>

            <Input title="Max DB Connection" name="max_db_connection" type="number" min={5} change={this.getVal} def={this.state.max_db_connection}>
                <small><i>Firstly make sure how many concurrent connection your Database supports</i></small>
            </Input>

            <Input title="Session Max Age (Seconds)" name="session_max_age" change={this.getVal} def={this.state.session_max_age}>
                <small><i>Explicit expiry will override this.</i></small>
            </Input>

            <div className="row mb-4">
                <div className="col-12 col-sm-4 col-md-3 col-lg-2">
                    Track File Request
                </div>
                <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                    <input type="radio" name="track_file_request" value="yes" defaultChecked={this.state.track_file_request=='yes'} onChange={this.getVal}/> Yes &nbsp;&nbsp;
                    <input type="radio" name="track_file_request" value="no" defaultChecked={this.state.track_file_request=='no'} onChange={this.getVal}/> No<br/>
                    <small><i>Hooks, functions {this.state.track_file_request=='no' ? 'won\'t' : 'will'} be able to manipulate file requests.</i></small>
                </div>
            </div>

            {
                this.state.track_file_request=='yes' ? 
                <Input title="File URL Pattern (Regex)" name="file_request_pattern" change={this.getVal} def={this.state.file_request_pattern} txt={true} inp={false} style={{'overflow':'auto','whiteSpace':'nowrap'}}>
                    <small><i>Multiple pattern allowed. Separate by new line without delimiter. At least one matched pattern will be tracked. Only relative path matchable, not domain.</i><br/>
                    <i>Tracking every file request will slow down webpage loading.</i></small>
                </Input> : null
            }

            <Input title="Allowed Hot Linker (Regex)" name="hot_linking_pattern" change={this.getVal} def={this.state.hot_linking_pattern} txt={true} inp={false} style={{'overflow':'auto','whiteSpace':'nowrap'}}>
                <small>
                    <i>Enter allowed referrer patterns that can embed image, scripts etc.</i><br/>
                    <i>Multiple pattern allowed. Separate by new line without delimiter.</i>
                </small>
            </Input>
        </div>
    }
}

export {GSetting}