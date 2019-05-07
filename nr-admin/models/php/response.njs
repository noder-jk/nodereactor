global.echo=function($, str)
{
	if(typeof str=='object' && !Array.isArray(str))
	{
		$.nr_response_queue=Object.assign($.nr_response_queue, str);
	}
	
	return $;
}


global.header=function($, hd, resp_code)
{
	hd=hd.split(':');
	
	if(hd.length>=2)
	{
		var k=hd.shift().trim();
		var v=hd.join(':').trim();
		
		resp_code ? $ = http_response_code($, resp_code) : 0;
		
		(k.toLowerCase()=='location' && !resp_code) ? $=http_response_code($, 302) : 0;
		
		$.nr_send_headers[k]=v;
	}
	
	return $;
}

global.readfile=function ($, path)
{
	$.nr_file_to_transfer= normalize_path(path);
	return $;
}


global.http_response_code=function($, code)
{
	$.nr_response_code=code;
	return $;
}


/* This function remove temporary scripts from cache. */
global.exit=function ($,resp)
{
	resp ? $=echo($, resp) : 0;
	
	/* It's impossible to save session and option and session if NR is not installed yet. */
	if(!nr_db_config)
	{
		$.nr_call_real_set_option=false;
		$.nr_call_real_set_session=false;
	}

	var send_resp_now=($)=>
	{
		/* Release the database connection as it is last step */
		$.nr_db ? nr_pool.releaseConnection($.nr_db) : null;

		/* Convert cookies to response header */
		$=real_set_cookie($);
		
		/* No need response for socket request */
		if($._SERVER['REQUEST_METHOD']=='IO')
		{
			return;
		}

		/* Convert all the header array to response header */
		for(var k in $.nr_send_headers)
		{
			$.nr_response.set(k, $.nr_send_headers[k]);
		}
		
		/* Access control should be disabled later / or have control */
		var dev=process.argv.indexOf('mode=development')>-1;
		dev ? $.nr_response.set('Access-Control-Allow-Origin', '*') : 0;
		
		/* Detect what type of response should be sent */

		if($.nr_file_to_transfer!==false)
		{
			/* Send file */
			$.nr_response.sendFile($.nr_file_to_transfer);
			return;
		}
		
		/* Send json response */
		$.nr_response.set('Content-Type', 'application/json');

		$.nr_response.status($.nr_response_code).end(JSON.stringify($.nr_response_queue));
	};

	series_fire($, [real_set_option, real_set_session, send_resp_now]);
}
