module.exports.echo=function(str)
{
	if(typeof str=='object' && !Array.isArray(str))
	{
		this.nr_response_queue=Object.assign(this.nr_response_queue, str);
	}
}

module.exports.header=function(hd)
{
	for(var k in hd)
	{
		this.nr_send_headers[k]=hd[k];
	}
}

global.readfile=function ($, path)
{
	$.nr_file_to_transfer= normalize_path(path);
	return $;
}

module.exports.http_response_code=function(code)
{
	this.nr_response_code=code;
}

/* This function remove temporary scripts from cache. */
module.exports.exit=function(resp)
{
	terminate(this, function($)
	{
		var send_str=false;

		if(resp)
		{
			typeof resp=='string' ? send_str=resp : $.echo(resp);
		}
		
		var send_resp_now=($, bummer)=>
		{
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
			project_mode_dev ? $.nr_response.set('Access-Control-Allow-Origin', '*') : 0;
			
			/* Detect what type of response should be sent */

			if($.nr_file_to_transfer!==false)
			{
				/* Send file */
				$.nr_response.sendFile($.nr_file_to_transfer);
				return;
			}
			
			var c_type	=	send_str ? 'text/html' : 'application/json';
			var rsp_t	=	send_str || JSON.stringify($.nr_response_queue);


			/* Send json response */
			$.nr_response.set('Content-Type', c_type);

			$.nr_response.status($.nr_response_code).end(rsp_t);
		};

		$.series_fire( [real_set_option, real_set_session, send_resp_now]);
	});
}
