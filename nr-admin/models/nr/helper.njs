global.nr_local_time=function($, dt, format)
{
	var z=$.get_option( 'time_zone', 0);

	var zone=z || 'UTC';
	
	return node_modules['moment-timezone'](dt).tz(zone).format(format ? format : 'YYYY-MM-DD HH:mma z');
}

global.nr_dom=function(content)
{
	str=new node_modules.jsdom('<!doctype html><html><body>'+content+'</body></html>');
	return node_modules.jquery(str.window);
}

global.get_args=function (func) 
{
	var funStr = func.toString();
    return funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^\s,]+)/g);
}

global.get_avatar_url=function(email, json)
{
	return node_modules.gravatar.url(email, (json ? json : {s: '100', r: 'g', d: 'mm'}));
}

/* ~~~~~~~~~~~~~~~~~~~~~Helper functions~~~~~~~~~~~~~~~~~~~~~ */
global.get_int=function(param, fallback)
{
	ret=false;
	
	if(param)
	{
		if(typeof param=='string')
		{
			param=param.trim();
			(param=='' || /\D+/.test(param)==true) ? 0 : ret=parseInt(param);
		}
		else if(typeof param=='number')
		{
			ret=parseInt(param);
		}
	}
	
	return ret==false ? (fallback ? fallback : ret) : ret;
}

global.get_array=function(param)
{
	var resp=[];

	if(param)
	{
		resp=Array.isArray(param) ? param : [param];
	}
	
	return resp.filter(item=>{return (typeof item!=='object' && !Array.isArray(item));});;
}

global.set_utility_configs=function(cb, post)
{
	var handle_opt=function(ob)
	{
		for(var k in ob)
		{
			switch(k)
			{
				case 'session_max_age'	:	
				case 'max_upload_size'	:	var nm=parseInt(ob[k]);
											(Number.isInteger(nm) && nm>(k=='session_max_age' ? 300 : 0)) ? global[k]=nm : 0;
											break;

				case 'max_db_connection':	var nm=parseInt(ob[k]);
											if(Number.isInteger(nm) && nm>5 && max_db_connection!==nm)
											{
												max_db_connection=nm;
												nr_db_pool.end(function(err)
												{
													nr_db_pool=get_pool();
												});
											}
											break;

				case 'track_file_request':	track_file_request=ob[k]=='yes';
											break;

				case 'hot_linking_pattern'	:
				case 'file_request_pattern'	:	global[k]=ob[k];
												break;
			}
		}

		typeof cb=='function' ? cb() : 0;
	}
	
	if(!post)
	{
		var tbl=nr_db_config.tb_prefix+'nodes';
		var q='SELECT * FROM '+tbl+' WHERE id=1';
		
		nr_db_pool.query(q, function(e,r)
		{
			try
			{
				r=JSON.parse(r[0].options);
				post=r ? r : {};
			}
			catch(e)
			{
			}
			handle_opt(post);
		});

		return;
	}

	handle_opt(post);
}

const nr_er_handler=(e)=>
{
	console.log('');
	console.log('\x1b[31m\x1b[4m', 'Fatal Error Occurred.', '\x1b[0m');
	console.log(e);
	console.log('\x1b[46m', 'Node Reactor has saved itself from unexpected termination.', '\x1b[0m');
	console.log('\x1b[42m', 'Next methods have been queued.', '\x1b[0m');
	console.log('');
}

module.exports.series_fire=function(functions)
{
	var $=this;

	if(!Array.isArray(functions)){return;}
	
	var num=0;
	var nr_series_func_generate=()=>
	{
		/* As you know nodejs is a event driven system, so pass every hooked function as a callback to another function. */
		var ret='';
		num++;

		var new_num=num-1;
			
		if(functions[new_num]==undefined){return ret;}
		
		/* Next queued function */
		var next_params=[];
		var cb_next_params=[];
		if(functions[num])
		{
			/* If the next func param array, then set first one as function and other elements as parameter for that function. */
			var func=Array.isArray(functions[num]) ? functions[num][0] : functions[num];
			if(typeof func=='function')
			{
				var args=get_args(func);
				if(args)
				{
					args.pop();
					args.shift();
					
					next_params=args;

					cb_next_params=next_params.map(v=>'null');
				}
			}
		}
		next_params= next_params.length>0 ? ','+next_params.join(',') : '';
		cb_next_params= cb_next_params.length>0 ? ','+cb_next_params.join(',') : '';

		// generate error handler
		var catch_block='nr_er_handler(e); (($'+next_params+')=>cb($'+next_params+'))($'+cb_next_params+');';
		
		/* Currently processing function */
		var cur_params=[];
		var func=Array.isArray(functions[new_num]) ? functions[new_num][0] : functions[new_num];
		if(typeof func=='function')
		{
			var args=get_args(func);
			if(args)
			{
				args.pop();
				args.shift();
				cur_params=args;
			}
		}
		
		if(Array.isArray(functions[new_num]))
		{
			/* This block means the function accept external parameter from function array */
			var explicit_length=0;
			var explicit_param=[];
			for(var i=1; i<functions[new_num].length; i++)
			{
				explicit_param.push('functions['+(new_num)+']['+i+']');
			}
			explicit_length=explicit_param.length;
			explicit_param 	= explicit_param.length>0 ? explicit_param.join(',')+',' : '';
		
			cur_params=cur_params.slice(0, cur_params.length-explicit_length);
			cur_params= cur_params.length>0 ? cur_params.join(',')+',' : '';
			
			/* It means parameter passed to series function. Only one (any type) parameter can be pass. */
			if(functions[new_num][0])
			{
				ret = 'var cb=($'+next_params+')=>{'+nr_series_func_generate()+'};\
						try{functions['+(new_num)+'][0]($,'+cur_params+explicit_param+' cb);}catch(e){'+catch_block+'}';
			}
		}
		else
		{
			cur_params= cur_params.length>0 ? cur_params.join(',')+',' : '';

			/* It means no parameter is passing to series function */
			ret = 'var cb=($'+next_params+')=>{'+nr_series_func_generate()+'};\
					try{functions['+(new_num)+']($,'+cur_params+' cb);}catch(e){'+catch_block+'}';
		}
		
		return ret;
	}
	
	eval(nr_series_func_generate());
}

global.fl_up=function(string) 
{
    return typeof string=='string' ? string.charAt(0).toUpperCase() + string.slice(1) : string;
}

global.csv_to_array=function(csv)
{

	var lines=csv.split("\n");
  
	var result = [];
  
	var headers=lines[0].split(",");
  
	for(var i=1;i<lines.length;i++)
	{
		var obj = {};
		var currentline=lines[i].split(",");
  
		for(var j=0;j<headers.length;j++)
		{
			obj[headers[j]] = currentline[j];
		}
  
		result.push(obj);
	}
  
	return result;
}

const get_sql_operator=function(conditions)
{
	if(typeof conditions=='object' && !Array.isArray(conditions))
    {
        /* If it is object (not array), then get it's operator, or set default operator (IN or LIKE). */
        typeof conditions.operator=='string' ? conditions.operator=conditions.operator.trim().toUpperCase() : 0;
        
        var opr=conditions.operator;
        (opr!=='LIKE' && opr!=='COMPARE') ? conditions.operator='IN' : 0;    // set operator
        conditions.values	=conditions.values ? get_array(conditions.values) : []; // set values
    }
    else
    {
        conditions={'operator':'IN', 'values':get_array(conditions)};
    }
    
	return conditions;
}

global.get_sql_clauses=function(column, key, column_name, table)
{
	var w_clause=[];

	column=get_sql_operator(column);

    if(column.values.length>0)
    {
        /* At first append and prepend double quotes as it is string. */
        if(column.operator!=='COMPARE')
        {
            for(var i=0; i<column.values.length; i++)
            {
                column.values[i]='"'+trim(column.values[i],'"')+'"';
            }
        }
        
        var join_by=key=='unite' ? ' OR ' : ' AND ';
        
        /* Now add values to corresponding key. */
        if(column.operator=='IN')
        {
            /* If it is IN operator */
            w_clause.push(table+'.'+column_name+' '+(key=='exclude' ? 'NOT' : '')+' IN ('+column.values.join(',')+')');
        }
        else if(column.operator=='LIKE')
        {
            var likes=[];
            for(var num=0; num<column.values.length; num++)
            {
                likes.push(table+'.'+column_name+' '+(key=='exclude' ? 'NOT' : '')+' LIKE '+column.values[num]);
            }
            
            likes.length>0 ? w_clause.push(likes.join(join_by)) : null;
        }
        else if(column.operator=='COMPARE')
        {
            var comp=[];
            for(var num=0; num<column.values.length; num++)
            {
                var v=column.values[num];
                comp.push(table+'.'+column_name+v);
            }
            comp.length>0 ? w_clause.push(comp.join(join_by)) : null;
        }
	}
	
	return {'column':column, 'clause':w_clause}
}
