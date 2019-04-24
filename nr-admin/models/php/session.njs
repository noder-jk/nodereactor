/* Retrieve user sessions by session code */
global.get_user_sessions=function($, call_backk)
{
	$.nr_call_real_set_session=true;
	
	/* Now Retrieve and store all cookies of current access. */
	if($._COOKIE[nr_session_cookie_name] && $._COOKIE[nr_session_cookie_pass])
	{
		/* If session code exist, retrieve sessions. */
		var q='SELECT * FROM '+nr_db_config.tb_prefix+'sessions WHERE id='+$._COOKIE[nr_session_cookie_name];

		$.nr_db.query(q, function(e,r)
		{
			if(e)
			{
				call_backk($);
				return;
			}
			
			var psd=(r[0] && r[0].password) ? r[0].password : '';

			password_verify($, $._COOKIE[nr_session_cookie_pass], psd, ($, valid)=>
			{
				/* Verify session password (retrieved from cookie) */
				if(r.length>0 && valid==true)
				{
					var json=JSON.parse(r[0].json_values);
					for(var k in json)
					{
						if($.nr_unix_timestamp > json[k].expiry)
						{
							delete json[k];
						}
						else
						{
							/* Set the sessions to session variable */
							$=set_session($, k, json[k].value);
						}
					}

					/* Set the sessions to queue */
					$.nr_session_queue=json;
				}
				else
				{
					/* Delete session cookies if session password not match */
					delete $._COOKIE[nr_session_cookie_name];
					delete $._COOKIE[nr_session_cookie_pass];
				}

				call_backk($);
			});
		});

		return;
	}
	call_backk($);
}

/* Enqueue sessions to be saved in database. */
global.set_session=function($, key, value, expiry)
{
	var ex=$.nr_unix_timestamp+(expiry ? expiry : nr_session_expiry);
	
	$.nr_session_queue[key]={'value':value,'expiry':ex};
	
	$._SESSION[key]=value;
	
	return $;
}

/* now at the end of response, save sessions in database. */
global.real_set_session=function($, call_back)
{
	if(!$.nr_call_real_set_session)
	{
		call_back($);
		return;
	}
	
	
	/* Keep only those session that still are in both of queue and variable */
	for(var k in $.nr_session_queue)
	{
		!$._SESSION[k] ? (delete $.nr_session_queue[k]) : 0;
	}
	
	var jsn=JSON.stringify($.nr_session_queue);
	
	
	if($._COOKIE[nr_session_cookie_name])
	{
		/* This block means already this user has a session cookie in browser and database. So just updated in database. */
		var user_id = is_user_logged_in($) ? ', user_id='+get_current_user_id($) : '';
		
		var q='UPDATE '+nr_db_config.tb_prefix+'sessions SET json_values='+$.nr_db.escape(jsn)+user_id+' WHERE id='+$._COOKIE[nr_session_cookie_name];

		$.nr_db.query(q, function(e)
		{
			call_back($);
		});
	}
	else if(Object.keys($.nr_session_queue).length>0)
	{
		/* This block means no session found in browser but now it has some new session to store, so create a new session and pass session cookie. */

		var p=node_modules.randomstring.generate();

		password_hash($, p, ($, hash)=>
		{
			var q='INSERT INTO '+nr_db_config.tb_prefix+'sessions (json_values,user_id,password) VALUES ('+$.nr_db.escape(jsn)+', '+(get_current_user_id($)==false ? 'NULL' : get_current_user_id($))+',\''+hash+'\')';
			
			$.nr_db.query(q, function(e,r)
			{
				if(!e)
				{
					$=set_cookie($, nr_session_cookie_name, r.insertId, nr_cookie_expiry);
					$=set_cookie($, nr_session_cookie_pass, p, nr_cookie_expiry);
				}
				
				call_back($);
			});
		});
	}
	else
	{
		/* This block means no old session, and nothing store newly, so just invoke next function. */
		call_back($);
	}
}


global.session_destroy=function($, call_back)
{
	/* Delete all session of current session cookie and current user. */
	var q=[];
	
	$._COOKIE[nr_session_cookie_name] ? q.push('id='+$._COOKIE[nr_session_cookie_name]) : 0;
	
	get_current_user_id($)!==false ? q.push('user_id='+get_current_user_id($)) : 0;

	$._SESSION={};
	
	if(q.length>0)
	{
		var q='DELETE FROM '+nr_db_config.tb_prefix+'sessions WHERE '+q.join(' OR ');
		
		$.nr_db.query(q,function()
		{
			call_back ? call_back($) : 0;
		});
		
		return;
	}

	call_back($);
}