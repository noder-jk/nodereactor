/* This function get cookie name and data to enqueue. These will be transferred to browser at the end of response. */
global.set_cookie=function($, name, value, maxAge, path, domain, secure, samesite, httpOnly)
{
	var meta		= {};

	maxAge 			? meta.maxAge	= maxAge 	: 0;
	domain			? meta.domain	= domain	: 0;
	samesite		? meta.samesite	= samesite	: 0;
	httpOnly		? meta.httpOnly	= httpOnly	: 0;

	meta.path		= path || '/';
	meta.secure		= secure || false;
	
	$.nr_cookie_queue[name] = node_modules.cookie.serialize(name, value, meta);
	$._COOKIE[name]			= value;

	return $;
}

global.real_set_cookie=function($)
{
	/* Then collect queued cookies and send to browser. */
	var t=[];

	/* Keep only those cookie that still in both of cookie queue and variable */
	for(var k in $.nr_cookie_queue)
	{
		$._COOKIE[k] ? t.push($.nr_cookie_queue[k]) : 0;
	}
	
	/* Send cookie through socket if it is socket request */
	if($._SERVER['REQUEST_METHOD']=='IO')
	{
		if($.nr_socket && $.nr_socket.id)
		{
			nr_socket.to($.nr_socket.id).emit('nr_set_cookie_through_socket', t);
		}
	}
	else
	{
		t.length>0 ? $.nr_response.set('Set-Cookie', t) : 0;
	}
	
	return $;
}