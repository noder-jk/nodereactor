module.exports.get=function($)
{
	var plug_data={};
	
	for(var k in nr_plugins)
	{
		var p			= nr_plugins[k].package;

		var dt			= {};

		dt.author		= p.author || {};
		typeof dt.author=='string' ? dt.author={'name':dt.author, 'url':false} : 0;

		dt.description	= p.description || '';
		dt.license		= p.license || '';
		dt.tags			= p.tags || '';
		dt.version		= p.version;
		dt.dependents	= nr_plugins[k].dependents;
		dt.dependencies	= nr_plugins[k].dependencies;

		dt.activated	= $.nr_active_plugins.indexOf(k)>-1;

		plug_data[k]=dt;
	}
	
	$.exit( plug_data);
}