module.exports=function(connection, nr_data)
{
	var default_core_options={"nr_nav_menus":{"Sample Menu Name":{"items":[{"post_id":"2","title":"Auto generated page","key":"v4zjhybyz7ffbgle3h8yw"},{"term_id":"1","title":"Programming","key":"a6nac3gyszqtmmsrq3l3","children":[{"term_id":"4","title":"Android","key":"9klfbg9x0ofs9a8w0rs6"},{"term_id":"3","title":"Web","key":"n8ckglaaxqf2w6h9nr797"}]},{"url":"https://web.facebook.com/NodeReactorCMS/","title":"FB","key":"5siluhvtpe509e9zi3d32qj"}],"association":["semp_nav_menu"]}},"post_post_permalink":"ttn","post_post_taxonomy":"category","term_permalink":"tt"};

	var default_theme_option={"area_widget_linking":{"right_side_panel_theme":[{"key":"0.5pzlws0ui4x","widget_id":"custom_html_widget_handler","properties":{"nr_widget_title":"Sample Widget","custom_code":"<iframe style=\"max-width:100%\" src=\"https://www.youtube.com/embed/rN6nlNC9WQA\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>"},"nr_package":true}]}};
	
	return	"\
	SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';\
	SET AUTOCOMMIT = 0;\
	START TRANSACTION;\
	SET time_zone = '+00:00';\
	SET foreign_key_checks = 0;\
	\
	DROP TABLE IF EXISTS `"+nr_data.tb_prefix+"users`;\
	CREATE TABLE IF NOT EXISTS `"+nr_data.tb_prefix+"users` (\
	  `user_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,\
	  `user_login` varchar(60) COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `user_pass` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `display_name` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `user_email` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `user_activation_key` varchar(100) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,\
	  `user_registered` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\
	  `user_status` varchar(100) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,\
	  `user_role` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'subscriber',\
	  `user_capabilities` longtext COLLATE utf8mb4_unicode_520_ci,\
	  PRIMARY KEY (`user_id`)\
	) ENGINE="+nr_data.db_engine+" DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;\
	\
	DROP TABLE IF EXISTS `"+nr_data.tb_prefix+"usermeta`;\
	CREATE TABLE IF NOT EXISTS `"+nr_data.tb_prefix+"usermeta` (\
	  `user_meta_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,\
	  `owner_user_id` bigint(20) UNSIGNED NOT NULL,\
	  `meta_key` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `meta_value` longtext COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  PRIMARY KEY (`user_meta_id`),\
	  FOREIGN KEY (`owner_user_id`) REFERENCES `"+nr_data.tb_prefix+"users` (`user_id`)\
	) ENGINE="+nr_data.db_engine+" DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;\
	\
	INSERT INTO `"+nr_data.tb_prefix+"users` (`user_login`, `user_pass`, `display_name`, `user_email`, `user_role`) VALUES\
	('"+nr_data.username+"', '"+nr_data.password+"', '"+nr_data.display_name+"', '"+nr_data.email+"', 'administrator');\
	\
	DROP TABLE IF EXISTS `"+nr_data.tb_prefix+"posts`;\
	CREATE TABLE IF NOT EXISTS `"+nr_data.tb_prefix+"posts` (\
	  `post_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,\
	  `owner_user_id` bigint(20) UNSIGNED NOT NULL,\
	  `post_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\
	  `post_title` text COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `post_content` longtext COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `post_excerpt` text COLLATE utf8mb4_unicode_520_ci,\
	  `post_status` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'publish',\
	  `comment_status` tinyint(1) NOT NULL DEFAULT '1',\
	  `post_name` varchar(200) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,\
		`post_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
	  `post_parent` bigint(20) UNSIGNED NOT NULL DEFAULT '0',\
	  `post_type` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `virtual_path` text COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,\
	  `real_path` text COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,\
	  `mime_type` varchar(255) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,\
	  PRIMARY KEY (`post_id`),\
	  UNIQUE KEY `post_name` (`post_name`),\
	  FOREIGN KEY (`owner_user_id`) REFERENCES `"+nr_data.tb_prefix+"users` (`user_id`)\
	) ENGINE="+nr_data.db_engine+" DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;\
	\
	DROP TABLE IF EXISTS `"+nr_data.tb_prefix+"postmeta`;\
	CREATE TABLE IF NOT EXISTS `"+nr_data.tb_prefix+"postmeta` (\
	  `post_meta_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,\
	  `owner_post_id` bigint(20) UNSIGNED NOT NULL,\
	  `meta_key` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `meta_value` longtext COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  PRIMARY KEY (`post_meta_id`),\
	  FOREIGN KEY (`owner_post_id`) REFERENCES `"+nr_data.tb_prefix+"posts` (`post_id`)\
	) ENGINE="+nr_data.db_engine+" DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;\
	\
	INSERT INTO `"+nr_data.tb_prefix+"posts` (`owner_user_id`, `post_date`, `post_content`, `post_title`, `post_excerpt`, `post_name`, `post_modified`, `post_type`) VALUES\
	(1, CURRENT_TIMESTAMP, 'Welcome. This is your first post.', 'Auto generated test post', 'Sample post', 'hello-world', CURRENT_TIMESTAMP, 'post'),\
	(1, CURRENT_TIMESTAMP, 'Welcome. This is your first sample page.', 'Auto generated page', 'Sample page', 'sample-page', CURRENT_TIMESTAMP, 'page');\
	\
	INSERT INTO `nr_postmeta` (`owner_post_id`, `meta_key`, `meta_value`) VALUES\
	(1, 'primary_term_id_of_category', '3');\
	\
	DROP TABLE IF EXISTS `"+nr_data.tb_prefix+"comments`;\
	CREATE TABLE IF NOT EXISTS `"+nr_data.tb_prefix+"comments` (\
	  `comment_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,\
	  `owner_post_id` bigint(20) UNSIGNED NOT NULL,\
	  `comment_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\
	  `comment_content` longtext COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `comment_approved` tinyint(1) NOT NULL DEFAULT '0',\
	  `comment_parent` bigint(20) UNSIGNED NOT NULL DEFAULT '0',\
	  `owner_user_id` bigint(20) UNSIGNED NOT NULL,\
	  PRIMARY KEY (`comment_id`),\
	  FOREIGN KEY (`owner_user_id`) REFERENCES `"+nr_data.tb_prefix+"users` (`user_id`),\
	  FOREIGN KEY (`owner_post_id`) REFERENCES `"+nr_data.tb_prefix+"posts` (`post_id`)\
	) ENGINE="+nr_data.db_engine+" DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;\
	\
	DROP TABLE IF EXISTS `"+nr_data.tb_prefix+"commentmeta`;\
	CREATE TABLE IF NOT EXISTS `"+nr_data.tb_prefix+"commentmeta` (\
	  `comment_meta_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,\
	  `owner_comment_id` bigint(20) UNSIGNED NOT NULL,\
	  `meta_key` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `meta_value` longtext COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  PRIMARY KEY (`comment_meta_id`),\
	  FOREIGN KEY (`owner_comment_id`) REFERENCES `"+nr_data.tb_prefix+"comments` (`comment_id`)\
	) ENGINE="+nr_data.db_engine+" DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;\
	\
	DROP TABLE IF EXISTS `"+nr_data.tb_prefix+"terms`;\
	CREATE TABLE IF NOT EXISTS `"+nr_data.tb_prefix+"terms` (\
	  `term_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,\
	  `name` varchar(200) COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `slug` varchar(200) COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `taxonomy` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `description` longtext COLLATE utf8mb4_unicode_520_ci,\
	  `parent` bigint(20) UNSIGNED NOT NULL DEFAULT '0',\
	  PRIMARY KEY (`term_id`)\
	) ENGINE="+nr_data.db_engine+" DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;\
	\
	DROP TABLE IF EXISTS `"+nr_data.tb_prefix+"termmeta`;\
	CREATE TABLE IF NOT EXISTS `"+nr_data.tb_prefix+"termmeta` (\
	  `term_meta_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,\
	  `owner_term_id` bigint(20) UNSIGNED NOT NULL,\
	  `meta_key` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `meta_value` longtext COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  PRIMARY KEY (`term_meta_id`),\
	  FOREIGN KEY (`owner_term_id`) REFERENCES `"+nr_data.tb_prefix+"terms` (`term_id`)\
	) ENGINE="+nr_data.db_engine+" DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;\
	\
	DROP TABLE IF EXISTS `"+nr_data.tb_prefix+"term_relationships`;\
	CREATE TABLE IF NOT EXISTS `"+nr_data.tb_prefix+"term_relationships` (\
	  `rel_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,\
	  `owner_post_id` bigint(20) UNSIGNED NOT NULL,\
	  `owner_term_id` bigint(20) UNSIGNED NOT NULL,\
	  PRIMARY KEY (`rel_id`),\
	  FOREIGN KEY (`owner_post_id`) REFERENCES `"+nr_data.tb_prefix+"posts` (`post_id`),\
	  FOREIGN KEY (`owner_term_id`) REFERENCES `"+nr_data.tb_prefix+"terms` (`term_id`)\
	) ENGINE="+nr_data.db_engine+" DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;\
	\
	INSERT INTO `"+nr_data.tb_prefix+"terms` (`term_id`, `name`, `slug`, `taxonomy`, `description`, `parent`) VALUES\
	(1, 'Programming', 'programming', 'category', '', 0),\
	(2, 'Hardware', 'hardware', 'category', '', 0),\
	(3, 'Web', 'web', 'category', '', 1),\
	(4, 'Android', 'android', 'category', '', 1);\
	\
	INSERT INTO `nr_term_relationships` (`rel_id`, `owner_post_id`, `owner_term_id`) VALUES\
	(1, 1, 3);\
	DROP TABLE IF EXISTS `"+nr_data.tb_prefix+"nodes`;\
	CREATE TABLE IF NOT EXISTS `"+nr_data.tb_prefix+"nodes` (\
	  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,\
	  `nr_package` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `type` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `options` longtext COLLATE utf8mb4_unicode_520_ci,\
	  `active` tinyint(1) NOT NULL DEFAULT '1',\
	  PRIMARY KEY (`id`)\
	) ENGINE="+nr_data.db_engine+" DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;\
	\
	INSERT INTO `"+nr_data.tb_prefix+"nodes` (`nr_package`, `type`, `options`, `active`) VALUES\
	('c', 'core', "+connection.escape(JSON.stringify(default_core_options))+", 1),\
	('semplicemente', 'theme', "+connection.escape(JSON.stringify(default_theme_option))+", 1);\
	\
	DROP TABLE IF EXISTS `"+nr_data.tb_prefix+"sessions`;\
	CREATE TABLE IF NOT EXISTS `"+nr_data.tb_prefix+"sessions` (\
	  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,\
	  `json_values` longtext COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `password` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,\
	  `user_id` bigint(20) UNSIGNED DEFAULT NULL,\
	  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\
	  PRIMARY KEY (`id`)\
	) ENGINE="+nr_data.db_engine+" DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;\
	\
	COMMIT;";
}