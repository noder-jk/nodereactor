import React, {Component} from 'react';
import Swal from 'sweetalert2';


import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowCircleRight, faArrowAltCircleDown} from '@fortawesome/free-solid-svg-icons';


class CustomLink extends Component
{
    constructor(props)
    {
        super(props);

        this.state=
        {
            'url':'',
            'title':''
        }

        this.storeVals=this.storeVals.bind(this);
        this.addTo=this.addTo.bind(this);
    }

    storeVals(e)
    {
        let el=e.currentTarget;

        this.setState({[el.name]:el.value});
    }

    addTo(position)
    {
        let {addHook}=this.props;

        let url=this.state.url.trim();
        let title=this.state.title.trim();

        if(/\S+/.test(url) && /\S+/.test(title))
        {
            let item=[{url, title}];

            addHook({item, position});
        }
        else
        {
            Swal.fire('Input fields must not be empty.');
        }
    }

    render()
    {
        return <div className="bg-white p-2">
                <input type="text" className="form-control" placeholder="Title" name="title" onChange={this.storeVals}/><br/>
                <input type="text" className="form-control" placeholder="URL" name="url" onChange={this.storeVals}/><br/>
                
                <div className="text-right">
                    <button onClick={()=>this.addTo('append')} className="btn btn-secondary btn-sm" title="Append to Selected"><FontAwesomeIcon icon={faArrowCircleRight}/></button> &nbsp;
                    <button onClick={()=>this.addTo('after')} className="btn btn-secondary btn-sm" title="Add After Selected"><FontAwesomeIcon icon={faArrowAltCircleDown}/></button>
                </div>
            </div>
    }
}

export {CustomLink}