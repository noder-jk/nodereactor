const nr_n_menus=
{
    'index':
    {
        'main':
        {
            'page_title':'Dashboard',
            'menu_title':'Dashboard',
            'menu_icon':'faPager',
            'slug':'dashboard',
            'component':'MainDashboard',
            'nr_package':true
        },
        'sub':[]
    },
    'files':
    {
        'main':
        {
            'page_title':'Media Files',
            'menu_title':'Media',
            'menu_icon':'faFileImage',
            'slug':'explorer',
            'component':'MediaPage',
            'nr_package':true
        },
        'sub':[]
    },
    'appearance':
    {
        'main':
        {
            'page_title':'Appearance',
            'menu_title':'Appearance',
            'menu_icon':'faPaintBrush',
            'slug':'themes',
            'component':'InstalledThemes',
            'nr_package':true
        },
        'sub':
        [
            {
                'page_title':'Explore themes at Theme Directory',
                'menu_title':'Theme Directory',
                'slug':'theme-directory',
                'component':'ThemeDirectory',
                'nr_package':true
            },
            {
                'page_title':'Widgets',
                'menu_title':'Widgets',
                'slug':'widgets',
                'component':'AdminWidget',
                'nr_package':true
            },
            {
                'page_title':'Menus',
                'menu_title':'Menus',
                'slug':'menus',
                'component':'MenuPage',
                'nr_package':true
            }
        ]
    },
    'plugins':
    {
        'main':
        {
            'page_title':'Plugins',
            'menu_title':'Plugins',
            'menu_icon':'faPlug',
            'slug':'all',
            'component':'InstalledPlugins',
            'nr_package':true
        },
        'sub':
        [
            {
                'page_title':'Explore plugins at Theme Directory',
                'menu_title':'Plugin Directory',
                'slug':'plugin-directory',
                'component':'PluginDirectory',
                'nr_package':true
            }
        ]
    },
    'users':
    {
        'main':
        {
            'page_title':'Users',
            'menu_title':'All Users',
            'menu_icon':'faUser',
            'slug':'all',
            'component':'Users',
            'nr_package':true
        },
        'sub':
        [
            {
                'page_title':'Create User',
                'menu_title':'Create User',
                'slug':'create',
                'component':'UserCreate',
                'nr_package':true
            },
            {
                'page_title':'Edit User',
                'menu_title':'Edit User',
                'slug':'edit',
                'hide_if_not':'/nr-admin/users/edit',
                'component':'EditUser',
                'nr_package':true
            },
            {
                'page_title':'My Profile',
                'menu_title':'My Profile',
                'slug':'my-profile',
                'component':'MyProfile',
                'nr_package':true
            }
        ]
    },
    'settings':
    {
        'main':
        {
            'page_title':'Settings',
            'menu_title':'Settings',
            'menu_icon':'faCog',
            'slug':'general',
            'component':'GeneralSetting',
            'nr_package':true
        },
        'sub':
        [
            {
                'page_title':'Permalink Setting',
                'menu_title':'Permalink',
                'slug':'permalink',
                'component':'PermalinkSetting',
                'nr_package':true
            },
            {
                'page_title':'Reading Setting',
                'menu_title':'Reading',
                'slug':'reading',
                'component':'ReadingSetting',
                'nr_package':true
            }
        ]
    }
}

var NodeReactor_blue_print=
{
	_GET						: {},
	_POST						: {},
	_FILES						: {},
	_SESSION					: {},
	_COOKIE_ORIGINAL			: {},
	_COOKIE						: {},
	_SERVER						: {},
								
	nr_request					: {},
	nr_response					: {},
	nr_response_queue			: {},
	nr_file_to_transfer			: false,
	
	nr_pathname					: '',
	
	nr_session_queue			: {},
	nr_cookie_queue			    : {},
	nr_set_option_queue			: {'plugin':{},'theme':{},'core':{'c':{}}},
	
	nr_send_headers				: {},
		
	nr_pagination				: [],
	nr_queued_post				: '',
	nr_current_user				: false,
	nr_response_code			: 200,
	
	nr_active_theme				: '',
	nr_active_plugins			: [],
	
    nr_admin_menus_runtime		: node_modules.deepcopy(nr_n_menus),
    nr_admin_submenus_runtime   : [],
	nr_registered_menu			: {},
	
	nr_hooks					: {},
	nr_filters					: {},
	nr_widgets_runtime			: [],
	nr_registered_sidebar		: {},
	nr_widget_linked_to_sidebar	: {},
	
	nr_registered_ajax			: {},
    
    nr_active_nodes             : {},
    
	nr_registered_meta_boxes 	: {},
    registered_meta_box_to_post : {},

    registered_post_types		: {},
    
    nr_custom_templates         : {},

    nr_menu_locations           : {},

    nr_registered_taxonomies    : {},
    
    registered_taxonomies_to_post:{}
}


var mods=
[
    'wp/hook.njs',
    'wp/taxonomy/terms.njs',
    'wp/dashboard.njs',
    'wp/sidebar.njs',
    'wp/menu.njs',
    'php/cookie.njs',
    'php/session.njs',
    'wp/post/meta.njs',
    'wp/option.njs',
    'php/response.njs',
    'wp/post/post.njs',
    'wp/post/helper.njs',
    'wp/taxonomy/terms.njs',
    'wp/post/permalink.njs',
    'nr/helper.njs',
];

var nr_funcs={};
mods.forEach(element => 
{
    var m=require(normalize_path(nr_models+element));

    for(k in m)
    {
        if(typeof m[k]=='function')
        {
            nr_funcs[k]=m[k];
        }
    }
});


function gob()
{
    var $                   = node_modules.deepcopy(NodeReactor_blue_print);
    
    return Object.assign($, nr_funcs);
}

module.exports.get_nr_blueprint=function(request, response, max_s)
{
	var url_data			= node_modules.url.parse(request.url,true);
		
	var $					= gob();
	
	$.nr_max_upload_size	= max_s;
	
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

module.exports.get_socket_blueprint=function(request, socket)
{
    url_data				= node_modules.url.parse(request.url, true);
    
	var $					= gob();

    $.nr_socket             = socket;

    var ckk                 = request.headers.cookie==undefined ? {} : node_modules.cookie.parse(request.headers.cookie);
    $._COOKIE_ORIGINAL		= node_modules.deepcopy(ckk);
    $._COOKIE				= node_modules.deepcopy(ckk);
    
	$._SERVER				= {
                                'SERVER_PORT'	: nr_port,
                                'REQUEST_METHOD': 'IO'
                              };
                              
    $._POST                 = {};
    $._FILES                = {};
    $._IO                   = {};
    
	$.nr_unix_timestamp		= node_modules['moment-timezone'].tz('UTC').unix();
	
	return $;
}