require('./nr-utilities/console-info.njs');

const path_finder		= require('./nr-utilities/path.njs');
const utility_configs	= require('./nr-utilities/configs.njs');

module.exports.app=function(project_root)
{
	var ini_errors=[];

	/* Server configs */
	var pack=require(project_root+'/package.json');
	
	// Check homepage, proxy for react build
	pack.homepage!=='/' 		? ini_errors.push('You must set homepage:"/"') : null;
	!pack.proxy			 		? ini_errors.push('You must set proxy for React dev server.') : null;

	// Check config object for NR server
	!pack.nr_configs 			? ini_errors.push('NodeReactor configs not found.') 	: null;
	!pack.nr_configs 			? pack.nr_configs={} : null;

	// Check port
	!pack.nr_configs.port 		? ini_errors.push('Port is required.') : null;
	!pack.nr_configs.url 		? ini_errors.push('Home URL is required.') : null;

	
	if(ini_errors.length>0)
	{
		ini_errors.forEach(item=>console.log(item+'\n'));

		console.log('\x1b[7m', '-> NodeReactor has been terminated', '\x1b[0m');
		
		process.exit(1);
	}

	// Set other configs
	for(var k in utility_configs)
	{
		global[k]=utility_configs[k];
	}

	/* Init configs of theme, plugins etc */
	var data_ob=
	{
		nr_port			: pack.nr_configs.port,
		nr_home_url		: pack.nr_configs.url,
		nr_project_root	: project_root
	}

	global.nrg						= {};
	global.nr_port					= data_ob.nr_port;

	global.nr_home_url				= data_ob.nr_home_url; // including trailing slash

	global.node_modules				= {path:require('path')};

	global.nr_project_root			= data_ob.nr_project_root;
	global.nr_package_root			= __dirname;


	/* Define some necessary directories */
	global.nr_admin			= nr_package_root+'/nr-admin/';
	global.nr_controllers	= nr_package_root+'/nr-admin/controllers/';
	global.nr_models		= nr_package_root+'/nr-admin/models/';
	global.nr_modules		= nr_package_root+'/nr-admin/modules/';

	global.nr_configs		= data_ob.nr_project_root+'/nr-content/configs/';

	global.nr_contents		= data_ob.nr_project_root+'/nr-content/';
	global.nr_uploads		= data_ob.nr_project_root+'/nr-content/uploads/';
	
	global.nr_includes		= nr_package_root+'/nr-includes/';

	global.nr_uploads_url	= nr_home_url+'nr-content/uploads/';
	global.nr_includes_url	= nr_home_url+'nr-includes/';

	// NR dependency keeper
	global.nr_themes		= {};
	global.nr_plugins		= {};

	// get NR dependencies from project root 
	var pr_d={};
	var nrp_deps=pack.nr_configs.dependencies || [];
	
	// Loop through all NR dependencies
	nrp_deps.forEach(function(d)
	{
		// Check if the add-on is really installed.
		// Check if exists in either core dependency or devDependency object. 
		var deps=pack.dependencies || {};

		// It would be relative file path in case of local install,  otherwise version number if installed from npm.
		var packg=deps[d]; 

		// Put it in temporary dependency keeper object 'pr_d';
		packg ? pr_d[d]={rel_path:packg} : 0;
	});

	// Get NR dependencies recursively using 'path_finder' function.
	var ad_deps				= Object.assign(path_finder({'semplicemente':{}}, nr_project_root), path_finder(pr_d, nr_project_root));
	
	// Loop through all dependencies and put in global objects accordingly
	for(var k in ad_deps)
	{
		ad_deps[k].type=='theme' ? nr_themes[k]=ad_deps[k] : 0;
		ad_deps[k].type=='plugin' ? nr_plugins[k]=ad_deps[k] : 0;
	}
	// console.log(Object.keys(nr_themes));
	// console.log(Object.keys(nr_plugins));


	/* Load server modules and initialize */
	return require('express')();
}

module.exports.init=function(nr_app)
{
	/* Process app dependencies */
	var deps=require(node_modules.path.normalize(nr_models+'nr/dependencies.njs'));
	deps.deploy_vendor_scripts();
	deps.deploy_custom_scripts();
	deps.deploy_src();
	deps.deploy_db();

	var blues=require(node_modules.path.normalize(nr_models+'nr/blueprint.njs'));

	var nr_server 			= node_modules.http.Server(nr_app);

	global.nr_socket 		= node_modules['socket.io']();

	nr_socket.attach(nr_server);

	global.nr_db_pool			= get_pool();

	// All the post request here
	nr_app.all('/*', function(request, response) 
	{
		var $=blues.get_nr_blueprint(request, response);
		
		deps.handle_route($);
	});

	// All the socket request here
	nr_socket.on('connection', function(socket)
	{
		var $=blues.get_socket_blueprint(socket);
		deps.handle_route($, true, 'connected');

		socket.on('nr-socket-io-core-channel', function(data)
		{
			// Get new blueprint.
			var $=blues.get_socket_blueprint(socket);
			$._IO=data;
			deps.handle_route($, true, 'message');

		}).on('disconnect', function()
		{
			// Get new blueprint.
			var $=blues.get_socket_blueprint(socket);
			deps.handle_route($, true, 'disconnected');
		});
	});
	
	/* Now finally start listening. */
	nr_server.listen(nr_port,function()
	{
		console.log('');
		console.log('-> Node Reactor is listening on '+nr_server.address().port);
		console.log('-> Defined home url is '+nr_home_url);
		console.log('-> React dev server url will be different.');
		console.log('');
	});
}