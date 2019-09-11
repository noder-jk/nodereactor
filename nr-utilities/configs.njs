const one_day=86400;

// Default configs for start up
module.exports=
{
	max_db_connection		: 50,
	max_upload_size			: ((1024*1) * 1024 * 1024), // 1 GB
	session_max_age			: one_day, 					// One Day
    
	hot_linking_pattern		: '.*',
    
    refresh_utility_config	: true,
    project_mode_dev		: process.argv.indexOf('mode=development')>-1,
    
    nr_session_cookie_name  : 'f8376410e97a1357a406',
    nr_session_cookie_pass  : 'c0ae6e2891174443aeb2',
    
    nr_cookie_expiry        : one_day,
    nr_login_expiry         : one_day
}