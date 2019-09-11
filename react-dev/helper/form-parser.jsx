const parse_input_value=(el, values)=>
{
    let {name, type, checked, value}=el;

    switch(type)
    {
        case 'checkbox' :   !Array.isArray(values[name]) ? values[name]=[] : 0;
                            
                            let ind=values[name].indexOf(value);

                            if(checked==true)
                            {
                                // Add to value array if already not exist
                                ind==-1 ? values[name].push(value) : 0;
                            }
                            else
                            {
                                // Remove from value array if exist.
                                ind>-1 ? values[name].splice(ind, 1) : 0;
                            }
                            break;

        case 'radio'    :   checked==true ? values[name]=value : 0;
                            break;

        default         :   values[name]=value;
    }

    return values;
}

const parse_dom_form=(elment)=>
{
    /* Store all the parsed values in values object */
    let values={}
    
    let fields=['INPUT', 'SELECT', 'TEXTAREA'];
    fields.forEach(f=>
    {
        var inps=elment.getElementsByTagName(f);

        for(var i=0; i<inps.length; i++)
        {
            let inp=inps[i];

            let ignore_attr=inp.dataset ? inp.dataset.ignore : false;

            if(inp.name && ignore_attr!==true && ignore_attr!=='true')
            {
                values=parse_input_value(inp, values); 
            }
        }
    });

    return values;
}

export {parse_dom_form, parse_input_value}