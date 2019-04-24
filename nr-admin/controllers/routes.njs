module.exports.run=function($, next)
{
	var routes=
	{
		'nr_ajax_nopriv_nr_get_init_component'    	:{'path':'ajax/init.njs',                      		'method':'dispatch'},
		
		'nr_ajax_nopriv_get_init_frontend'    		:{'path':'ajax/frontend/init.njs',                  'method':'init'},
		
		'nr_ajax_nopriv_nr_install_check' 	    	:{'path':'ajax/installer/installer.njs',         	'method':'run'},
		'nr_ajax_nr_get_admin_nav' 		        	:{'path':'ajax/admin/navs.njs',                  	'method':'navs'},

		'nr_ajax_nr_get_general_settings' 	    	:{'path':'ajax/admin/settings.njs',              	'method':'get'},
		'nr_ajax_nr_save_general_settings'        	:{'path':'ajax/admin/settings.njs',              	'method':'save'},
		'nr_ajax_nr_get_permalink_settings'        	:{'path':'ajax/admin/settings.njs',              	'method':'permalink_page'},

		'nr_ajax_nr_get_installed_themes' 	    	:{'path':'ajax/admin/theme.njs',                 	'method':'get'},
		'nr_ajax_nr_get_plugins' 			        :{'path':'ajax/admin/plugins.njs',               	'method':'get'},
		'nr_ajax_nr_theme_plugin_action' 	        :{'path':'ajax/admin/theme-plugin-actions.njs',  	'method':'run'},
		'nr_ajax_nopriv_nr_get_widget_list' 		:{'path':'ajax/admin/widget.njs',                	'method':'get'},
		'nr_ajax_nr_widget_save' 			        :{'path':'ajax/admin/widget.njs',                	'method':'save'},
		'nr_ajax_nr_media_upload' 			    	:{'path':'ajax/admin/media.njs',                 	'method':'upload'},
		'nr_ajax_nr_get_gallery' 			        :{'path':'ajax/admin/media.njs',                 	'method':'gallery'},

		'nr_ajax_nopriv_nr_login' 			    	:{'path':'ajax/admin/users.njs',                	'method':'login'},
		'nr_ajax_nr_get_users' 			       	 	:{'path':'ajax/admin/users.njs',                 	'method':'get'},
		'nr_ajax_nr_get_edit_user' 			       	:{'path':'ajax/admin/users.njs',                 	'method':'get_to_edit'},
		'nr_ajax_nr_create_user'					:{'path':'ajax/admin/users.njs', 					'method':'register'},		
		'nr_ajax_nr_update_user'					:{'path':'ajax/admin/users.njs', 					'method':'update'},		
		'nr_ajax_nr_delete_users'					:{'path':'ajax/admin/users.njs', 					'method':'delete'},		
	
		'nr_ajax_nr_get_featured_image' 	    	:{'path':'ajax/admin/post.njs', 					'method':'get_featured_image'},
		'nr_ajax_nr_get_post_create_edit' 	    	:{'path':'ajax/admin/post.njs', 					'method':'get'},
		'nr_ajax_nr_get_hierarchy' 	    			:{'path':'ajax/admin/post.njs', 					'method':'get_hierarchy'},
		'nr_ajax_nr_get_post_list' 		        	:{'path':'ajax/admin/post.njs', 					'method':'get_post_list'},
		'nr_ajax_nr_delete_posts' 			    	:{'path':'ajax/admin/post.njs', 					'method':'delete_posts'},
		'nr_ajax_nr_delete_media' 			    	:{'path':'ajax/admin/post.njs', 					'method':'delete_media'},
		'nr_ajax_nr_slug_check' 			        :{'path':'ajax/admin/post.njs', 					'method':'check_slug'},
		'nr_ajax_nr_save_post' 			        	:{'path':'ajax/admin/post.njs', 					'method':'save'},
		'nr_ajax_nr_get_nav_posts' 			        :{'path':'ajax/admin/post.njs', 					'method':'p_for_nav'},

		'nr_ajax_create_update_category'			:{'path':'ajax/admin/taxonomy.njs', 				'method':'save'},
		'nr_ajax_nr_get_taxonomy'					:{'path':'ajax/admin/taxonomy.njs', 				'method':'get_taxonomy'},
		'nr_ajax_nr_delete_taxonomy'				:{'path':'ajax/admin/taxonomy.njs', 				'method':'delete'},
		'nr_ajax_nr_get_taxonomy_in_editor'			:{'path':'ajax/admin/taxonomy.njs', 				'method':'get_for_editor'},
		'nr_ajax_nr_save_post_editor_taxonomy'		:{'path':'ajax/admin/taxonomy.njs', 				'method':'save_from_editor'},
		'nr_ajax_nr_get_nav_terms'					:{'path':'ajax/admin/taxonomy.njs', 				'method':'t_for_nav'},

		'nr_ajax_nr_get_menu_items'					:{'path':'ajax/admin/menu.njs', 					'method':'get_for_admin'},
		'nr_ajax_nr_save_menu'						:{'path':'ajax/admin/menu.njs', 					'method':'save_menus'},
		'nr_ajax_nr_delete_menu'					:{'path':'ajax/admin/menu.njs', 					'method':'del_menu'},
		'nr_ajax_nopriv_nr_get_menu_for_visitor'	:{'path':'ajax/admin/menu.njs', 					'method':'get_menu_for_visitor'},


		'nr_socket_nopriv_nr_test_socket'			:{'path':'ajax/admin/socket.njs', 					'method':'test_socket'}
	};

	for(var k in routes)
	{
		$=add_action($, k, ($, key, next)=>
		{
			routes[key] ? require(normalize_path(nr_controllers+ routes[key].path))[routes[key].method]($, next) : null;
		});
	}

    next($);
}