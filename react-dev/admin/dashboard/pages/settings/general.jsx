import React from "react";

const GSetting=(props)=>
{
    let {onChange, ResponseData}=props;

    let {values={},time_zones=[]}=ResponseData;

    const {name='', description='', time_zone=''}=values;

    return <div>
        <div className="row mb-4">
            <div className="col-12">
                <h3>General Settings</h3>
            </div>
        </div>

        <div className="row mb-4">
            <div className="col-12 col-sm-4 col-md-3 col-lg-2">Site Title</div>
            <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                <input name="name" type="text" className="form-control" defaultValue={name}  onChange={onChange}/>
            </div>
        </div>

        <div className="row mb-4">
            <div className="col-12 col-sm-4 col-md-3 col-lg-2">Tagline</div>
            <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                <input name="description" type="text" className="form-control" defaultValue={description}  onChange={onChange}/>
                <small><i>In a few words, explain what this site is about.</i></small>
            </div>
        </div>
        
        <div className="row mb-4">
            <div className="col-12 col-sm-4 col-md-3 col-lg-2">Timezone</div>
            <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                <select name="time_zone" className="form-control"  onChange={onChange} defaultValue={time_zone}>
                    {
                        time_zones.map(item=>
                        {
                            return (<option key={item.zone} value={item.zone}>{item.name}</option>)
                        })
                    }
                </select>
            </div> 
        </div>
    </div>
    
}

export {GSetting}