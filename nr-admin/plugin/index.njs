module.exports.run=function($, next)
{
	var meta_box_file	= require(nr_admin+'plugin/plugin-modules/post_modules.njs').run;
	var widget_file		= require(nr_admin+'plugin/plugin-modules/widgets.njs').run;
	var post_type		= require(nr_admin+'plugin/plugin-modules/post_type.njs').run;
	var taxonomy		= require(nr_admin+'plugin/plugin-modules/taxonomy.njs').run;
	
	var methods=[meta_box_file, widget_file, post_type, taxonomy, next];

	$.series_fire( methods);
}