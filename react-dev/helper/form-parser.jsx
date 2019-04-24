const ignore_value=(inp_el, ignore)=>
{
    let ignore_attr=inp_el.dataset ? inp_el.dataset.ignore : false;

    if(!inp_el.name || (ignore==true && (ignore_attr==true || ignore_attr=='true')))
    {
        return false;
    }

    return inp_el;
}

const parse_form=(elment, ignore)=>
{
    /* Store all the parsed values in values object */
    let values={}

    /* As because input type is various, so treat it separately. */
    let inp=elment.getElementsByTagName('INPUT');
    for(let nm=0; nm<inp.length; nm++)
    {
        let el=ignore_value(inp[nm],ignore);
        if(!el){continue;}

        let name=el.name;
        let value=el.value;
        let type=el.type;
        let checked=el.checked;

        switch(type)
        {
            case 'radio'    :   
            case 'checkbox' :   if(!checked){continue;}
                                
                                if(type=='radio' && !values[name])
                                {
                                    values[name]=value;
                                    continue;
                                }

                                if(!values[name])
                                {
                                    values[name]=[];
                                }
                                
                                if(Array.isArray(values[name]))
                                {
                                    values[name].push(value);
                                }
                                break;

            default         :   values[name]=value;
        }
    }


    /* Now parse other type of value such as text area, select */
    let get_val=(tag, ignore)=>
    {
        for(let n=0; n<tag.length; n++)
        {
            let t=ignore_value(tag[n], ignore);
            
            if(t && !values[t.name])
            {
                values[t.name]=t.value;
            }
        }
    }
    
    get_val(elment.getElementsByTagName('SELECT'), ignore);
    get_val(elment.getElementsByTagName('TEXTAREA'), ignore);

    return values;
}

export {parse_form}