const nr_path_mod=require('path');
const get_nodes_path=function(nodes)
{
    var resp={};

	nodes.forEach(item=>
	{
		try
		{
			var pt=require.resolve(item+'/package.json'); 

			var pk=require(item+'/package.json');

            resp[item]=
            {
                'dir':nr_path_mod.dirname(pt), 
                'package':pk
            }
		}
        catch(e){}

    });
    
    return resp;
}

module.exports=function(project_root, extensions)
{
	console.log('');
	console.log('-> Package Source');
	console.log('https://github.com/noder-jk/nodereactor');
	console.log('https://www.npmjs.com/package/nodereactor');
	console.log('');
	console.log('-> Documentations');
	console.log('https://NodeReactor.com');
	console.log('');
	console.log('-> Add-ons');
	console.log('https://nodereactor.com/add-ons/themes/');
	console.log('https://nodereactor.com/add-ons/plugins/');
	console.log('');
	console.log('-> Communities');
	console.log('https://facebook.com/NodeReactorCMS');
	console.log('https://facebook.com/groups/NodeReactorDevs');
	console.log('');
	console.log('');

	var ini_errors=[];

	/* Server configs */
	var pack=require(project_root+'/package.json');
	
	pack.homepage!=='/' 		? ini_errors.push('You must add homepage:"/" in package.json located in project root.') : null;
	!pack.nr_configs 			? ini_errors.push('Configs for NodeReactor not found in package.json') 	: null;

	!pack.nr_configs 			? pack.nr_configs={} : null;

	pack.nr_configs.port 		= process.env.PORT || pack.nr_configs.port;
	!pack.nr_configs.port 		? ini_errors.push('Dynamic port is not available. Explicit one also omitted.') : null;

	!pack.nr_configs.url 		? ini_errors.push('Home URL is required.') : null;

	/* Utility configs */
	global.max_db_connection	= 50;
	global.max_upload_size		= ((1024*1) * 1024 * 1024); // 1 GB
	global.session_max_age		= 86400; // One Day
	global.track_file_request	= false;
	global.file_request_pattern	= '';
	global.hot_linking_pattern	= '.*';
	global.refresh_utility_config=true;
	global.project_mode_dev		= process.argv.indexOf('mode=development')>-1;


	if(ini_errors.length>0)
	{
		ini_errors.forEach(item=>console.log(item+'\n'));

		console.log('\x1b[41m', '-> NodeReactor has been terminated', '\x1b[0m');
		
		process.exit(1);
	}

	/* Init configs of theme, plugins etc */
	var data_ob=
	{
		nr_port			: pack.nr_configs.port,
		nr_home_url		: pack.nr_configs.url,
		nr_project_root	: project_root,
		nr_plugins		: [],
		nr_themes		: ['semplicemente']
	}

	global.nrg						= {};
	global.nr_port					= data_ob.nr_port;

	global.nr_home_url				= data_ob.nr_home_url; // including trailing slash

	global.nr_session_cookie_name	= 'f8376410e97a1357a406';
	global.nr_session_cookie_pass	= 'c0ae6e2891174443aeb2';

	global.nr_cookie_expiry			= data_ob.nr_cookie_expiry ? data_ob.nr_cookie_expiry : (60*60*24); // Second
	global.nr_login_expiry			= data_ob.nr_login_expiry ? data_ob.nr_login_expiry : (60*60*24); // Second

	global.default_gallery_limit	= 25;
	global.default_pagination		= 7;
	
	global.node_modules				= {path:require('path')};

	global.nr_project_root			= data_ob.nr_project_root;
	global.nr_package_root			= __dirname;


	/* Define some necessary directories */
	global.nr_admin			= nr_package_root+'/nr-admin/';
	global.nr_controllers	= nr_package_root+'/nr-admin/controllers/';
	global.nr_models		= nr_package_root+'/nr-admin/models/';
	global.nr_modules		= nr_package_root+'/nr-admin/modules/';

	global.nr_configs		= data_ob.nr_project_root+'/nr-content/configs/';
	
	global.nr_themes		= Object.assign(extensions.themes, get_nodes_path(data_ob.nr_themes));
	global.nr_plugins		= Object.assign(extensions.plugins, get_nodes_path(data_ob.nr_plugins)) ;

	global.nr_contents		= data_ob.nr_project_root+'/nr-content/';
	global.nr_uploads		= data_ob.nr_project_root+'/nr-content/uploads/';
	
	global.nr_includes		= nr_package_root+'/nr-includes/';

	global.nr_uploads_url	= nr_home_url+'nr-content/uploads/';
	global.nr_includes_url	= nr_home_url+'nr-includes/';

	/* Process dependencies */
	var deps=require(node_modules.path.normalize(nr_models+'nr/dependencies.njs'));
	deps.deploy_vendor_scripts();
	deps.deploy_custom_scripts();
	deps.deploy_src(data_ob);
	deps.deploy_db();
	
	var blues=require(node_modules.path.normalize(nr_models+'nr/blueprint.njs'));

	/* Load server modules and initialize */
	var nr_app				= node_modules.express();
	var nr_server 			= node_modules.http.Server(nr_app);

	global.nr_socket 		= node_modules['socket.io']();

	nr_socket.attach(nr_server);

	global.nr_db_pool			= get_pool();

	nr_app.all('/*', function(request, response) 
	{
		var $=blues.get_nr_blueprint(request, response);
		
		deps.handle_route($);
	});

	/* Set router for all the socket activity.  */
	nr_socket.on('connection', function(socket)
	{
		var $=blues.get_socket_blueprint(socket.request, socket);

		$.socket_event='connected';
		
		$.set_cookie( 'socketCookie', 'socket cookie value', 3600);

		deps.handle_route($);

		socket.on('nr-socket-io-core-channel', function(data)
		{

			$.socket_event=false;
			
			$._IO=data;

			deps.handle_route($);
		}).on('disconnect', function()
		{
			$.socket_event='disconnected';

			deps.handle_route($);
		});
	});
	

	/* Now finally start listening. */
	nr_server.listen(nr_port,function()
	{
		console.log('');
		console.log('-> NodeReactor listening '+nr_server.address().port);
		console.log('-> Defined home url is '+nr_home_url);
		console.log('');
	});
}