const nr_n_menus=require('./admin-menus.njs');

module.exports=
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
