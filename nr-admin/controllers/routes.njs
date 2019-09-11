module.exports.run=function($, next)
{
	var routes=
	{
		'nr_ajax_nopriv_nr_get_init_component'    	:{'path':'init.njs',                      	'method':'dispatch'},
		'nr_ajax_nopriv_get_init_frontend'    		:{'path':'frontend/init.njs',               'method':'init'},
		
		'nr_ajax_nopriv_nr_install_check' 	    	:{'path':'installer/installer.njs',         'method':'run'},
		'nr_ajax_nr_get_admin_nav' 		        	:{'path':'admin/navs.njs',                  'method':'navs'},

		'nr_ajax_nr_get_gen_settings' 	    		:{'path':'admin/settings.njs',              'method':'gen'},
		'nr_ajax_nr_basic_settings_getter' 	    	:{'path':'admin/settings.njs',              'method':'basic_get'},
		'nr_ajax_nr_basic_settings_saver' 	    	:{'path':'admin/settings.njs',              'method':'basic_save'},
		'nr_ajax_nr_get_general_settings' 	    	:{'path':'admin/settings.njs',              'method':'get'},
		'nr_ajax_nr_save_general_settings'        	:{'path':'admin/settings.njs',              'method':'save'},
		'nr_ajax_nr_get_permalink_settings'        	:{'path':'admin/settings.njs',              'method':'permalink_page'},

		'nr_ajax_nr_get_installed_themes' 	    	:{'path':'admin/theme.njs',                 'method':'get'},
		'nr_ajax_nr_get_plugins' 			        :{'path':'admin/plugins.njs',               'method':'get'},
		'nr_ajax_nr_theme_plugin_action' 	        :{'path':'admin/theme-plugin-actions.njs',  'method':'run'},
		'nr_ajax_nopriv_nr_get_widget_list' 		:{'path':'admin/widget.njs',                'method':'get'},
		'nr_ajax_nr_widget_save' 			        :{'path':'admin/widget.njs',                'method':'save'},
		'nr_ajax_nr_media_upload' 			    	:{'path':'admin/media.njs',                 'method':'upload'},
		'nr_ajax_nr_get_gallery' 			        :{'path':'admin/media.njs',                 'method':'gallery'},

		'nr_ajax_nopriv_nr_login' 			    	:{'path':'admin/users.njs',                	'method':'login'},
		'nr_ajax_nr_get_users' 			       	 	:{'path':'admin/users.njs',                 'method':'get'},
		'nr_ajax_nr_get_edit_user' 			       	:{'path':'admin/users.njs',                 'method':'get_to_edit'},
		'nr_ajax_nr_create_user'					:{'path':'admin/users.njs', 				'method':'register'},		
		'nr_ajax_nr_update_user'					:{'path':'admin/users.njs', 				'method':'update'},		
		'nr_ajax_nr_delete_users'					:{'path':'admin/users.njs', 				'method':'delete'},		
	
		'nr_ajax_nr_get_featured_image' 	    	:{'path':'admin/post.njs', 					'method':'get_featured_image'},
		'nr_ajax_nr_get_post_create_edit' 	    	:{'path':'admin/post.njs', 					'method':'get'},
		'nr_ajax_nr_get_hierarchy' 	    			:{'path':'admin/post.njs', 					'method':'get_hierarchy'},
		'nr_ajax_nr_get_post_list' 		        	:{'path':'admin/post.njs', 					'method':'get_post_list'},
		'nr_ajax_nr_delete_posts' 			    	:{'path':'admin/post.njs', 					'method':'delete_posts'},
		'nr_ajax_nr_delete_media' 			    	:{'path':'admin/post.njs', 					'method':'delete_media'},
		'nr_ajax_nr_slug_check' 			        :{'path':'admin/post.njs', 					'method':'check_slug'},
		'nr_ajax_nr_save_post' 			        	:{'path':'admin/post.njs', 					'method':'save'},
		'nr_ajax_nr_get_nav_posts' 			        :{'path':'admin/post.njs', 					'method':'p_for_nav'},

		'nr_ajax_nr_create_update_category'			:{'path':'admin/taxonomy.njs', 				'method':'save'},
		'nr_ajax_nr_get_taxonomy'					:{'path':'admin/taxonomy.njs', 				'method':'get_taxonomy'},
		'nr_ajax_nr_delete_taxonomy'				:{'path':'admin/taxonomy.njs', 				'method':'delete'},
		'nr_ajax_nr_get_taxonomy_in_editor'			:{'path':'admin/taxonomy.njs', 				'method':'get_for_editor'},
		'nr_ajax_nr_save_post_editor_taxonomy'		:{'path':'admin/taxonomy.njs', 				'method':'save_from_editor'},
		'nr_ajax_nr_get_nav_terms'					:{'path':'admin/taxonomy.njs', 				'method':'t_for_nav'},

		'nr_ajax_nr_get_menu_items'					:{'path':'admin/menu.njs', 					'method':'get_for_admin'},
		'nr_ajax_nr_save_menu'						:{'path':'admin/menu.njs', 					'method':'save_menus'},
		'nr_ajax_nr_delete_menu'					:{'path':'admin/menu.njs', 					'method':'del_menu'},
		'nr_ajax_nopriv_nr_get_menu_for_visitor'	:{'path':'admin/menu.njs', 					'method':'get_menu_for_visitor'}
	};

	for(var k in routes)
	{
		$.add_action(k, ($, key, next)=>
		{
			routes[key] ? require(normalize_path(nr_controllers+'ajax/'+routes[key].path))[routes[key].method]($, next) : null;
		});
	}

    next($);
}