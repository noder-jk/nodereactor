global.nr_local_time=function($, dt, format)
{
	var zone=$.get_option( 'time_zone', true) || 'UTC';
	
	return node_modules['moment-timezone'](dt).tz(zone).format(format ? format : 'YYYY-MM-DD HH:mma z');
}

global.nr_dom=function(content)
{
	var str=new node_modules.jsdom('<!doctype html><html><body>'+content+'</body></html>');
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
	var ret=false;
	
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
				case 'nr_cookie_expiry'	:	
				case 'nr_login_expiry'	:	
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

				case 'nr_session_cookie_name': 
				case 'nr_session_cookie_pass': 
				case 'hot_linking_pattern'	:	global[k]=ob[k];
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
	console.log('\x1b[31m\x1b[7m', 'Fatal Error Occurred.', '\x1b[0m');
	console.log('');
	console.log(e);
	console.log('');
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