const bl_print=require('./defaults/blueprint-object.njs');
const nr_funcs=require('./defaults/methods.njs');

function get_object()
{
    return Object.assign(node_modules.deepcopy(bl_print), nr_funcs);
}

module.exports.get_nr_blueprint=function(request, response)
{
	var url_data			= node_modules.url.parse(request.url,true);
		
	var $					= get_object();
	
    $._GET					= url_data.query;
    
    var ckk                 = request.headers.cookie==undefined ? {} : node_modules.cookie.parse(request.headers.cookie);
    $._COOKIE_ORIGINAL		= node_modules.deepcopy(ckk);
    $._COOKIE				= node_modules.deepcopy(ckk);
    
    
	$._SERVER				= {
								'SERVER_PORT'		: nr_port,
								'REQUEST_METHOD'	: request.method,
								'HTTP_HOST'			: request.get('host'),
								'SERVER_PROTOCOL'	: request.protocol,
								'HTTP_REFERER'		: request.headers.referer,
								'QUERY_STRING'		: decodeURIComponent(request.originalUrl),
                                'REQUEST_HEADERS'	: request.headers,
                                'HTTP_USER_AGENT'   : request.headers['user-agent'],
                                'REMOTE_ADDR'       : request.connection.remoteAddress,
								'CURRENT_URL'		: request.protocol + '://' + request.get('host') + decodeURIComponent(request.originalUrl),
							  };
								
	$.nr_request			= request;
	$.nr_response			= response;
	
    $.nr_pathname			= url_data.pathname;
    
    $._POST                 = {};
    $._FILES                = {};
    $._IO                   = {};
    
    $.nr_unix_timestamp		= node_modules['moment-timezone'].tz('UTC').unix();
	
	return $;
}

module.exports.get_socket_blueprint=function(socket)
{
    var request             = socket.request;

    url_data				= node_modules.url.parse(request.url, true);
    
	var $					= get_object();

    $.nr_socket             = socket;

    var ckk                 = node_modules.cookie.parse(request.headers.cookie);
    $._COOKIE_ORIGINAL		= node_modules.deepcopy(ckk);
    $._COOKIE				= node_modules.deepcopy(ckk);
    
	$._SERVER				= {
                                'SERVER_PORT'	    : nr_port,
                                'REQUEST_METHOD'    : 'IO',
                                'HTTP_HOST'         : request.headers.host,
                                'REQUEST_HEADERS'   : request.headers,
                                'HTTP_REFERER'      : request.headers.referer,
                                'HTTP_USER_AGENT'   : request.headers['user-agent']
                              };
                              
    $._POST                 = {};
    $._FILES                = {};
    $._IO                   = {};
    
	$.nr_unix_timestamp		= node_modules['moment-timezone'].tz('UTC').unix();
	
	return $;
}