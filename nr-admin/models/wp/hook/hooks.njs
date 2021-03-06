/* Start end request processing */
global.init=function($,callback)
{
	$.do_action('init',callback);
}

/* --------------post hooks-------------- */
global.use_meta_boxes=function($, callback)
{
	$.do_action('use_meta_boxes',callback);
}

global.register_meta_boxes=function($,callback)
{
	$.do_action('register_meta_boxes',callback); 
}

global.register_post_types=function($,callback)
{
	$.do_action('register_post_types',callback);
}

global.register_custom_templates=function($,callback)
{
	$.do_action('register_custom_templates',callback);
}

/* ----------------Core, themes, plugins related hooks---------------- */
global.admin_menu=function($,callback)
{
	$.do_action('admin_menu',callback);
}

global.widgets_init=function($,callback)
{
	$.do_action('widgets_init',callback);
}


global.delete_user=function($, user_id, callback)
{
	$.do_action('delete_user', user_id, callback);
}

global.register_nav_menus=function($, callback)
{
	$.do_action('register_nav_menus', callback);
}

/* Taxonomy */
global.register_taxonomies=function($, callback)
{
	$.do_action('register_taxonomies', callback);
}

global.use_taxonomies=function($, callback)
{
	$.do_action('use_taxonomies', callback);
}