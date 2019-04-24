import React, {Component} from "react";

class CustomTemplate extends Component
{
    constructor(props)
    {
        super(props);

        let {custom_templates={}, post_meta={}}=this.props;
        let {custom_template="0"}=post_meta;

        this.state=
        {
            'page_templates':custom_templates,
            'default':custom_template
        }
    }

    render()
    {
        let templates=this.state.page_templates;

        return  <div>
                    {
                        Object.keys(templates).length>0 ? 
                        <select name="custom_template" className="form-control" defaultValue={this.state.default}>
                            <option key="0" value="0">None</option>
                            {
                                Object.keys(templates).map(comp=>
                                {
                                    return <option key={comp} value={comp}>{templates[comp]}</option>
                                })
                            }
                        </select> : 
                        <span>No Template Set</span>
                    }
                </div>
    }
}

export {CustomTemplate}