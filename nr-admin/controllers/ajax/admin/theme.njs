module.exports.get=function($)
{
	var theme_data={};
	
	for(var k in nr_themes)
	{
		var p			= nr_themes[k].package;

		var dt			= {};

		dt.author		= p.author || {};
		dt.description	= p.description || '';
		dt.license		= p.license || '';
		dt.tags			= p.tags || '';
		dt.version		= p.version;
		
		dt.activated	= $.nr_active_theme==k;
		dt.thumbnail	= '/theme/'+k+'/screenshot.jpg';
		
		theme_data[k]=dt;
	}
	
	exit($, {'themes':theme_data});
}