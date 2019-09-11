/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~User/member related functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
module.exports.is_user_logged_in=function()
{
	return this.nr_current_user!==false;
}

module.exports.get_current_user=function()
{
	return this.nr_current_user || null;
}

module.exports.get_current_user_id=function()
{
	return !this.nr_current_user ? null : this.nr_current_user.user_id;
}

global.get_edit_user_link=function(id)
{
	return nr_home_url+'nr-admin/users/?node=edit&user='+id;
}

global.nr_get_user=function($, call_back)
{
	if($._SESSION['user_id'] && $._SESSION['user_login'])
	{
		nr_db_pool.query
		(
			'SELECT * FROM '+nr_db_config.tb_prefix+'users WHERE user_id='+nr_db_pool.escape($._SESSION['user_id'])+' AND user_login='+nr_db_pool.escape($._SESSION['user_login'])+' LIMIT 1',
			function(e,r)
			{
				(!e && r.length>0) ? $.nr_current_user=r[0] : 0;
				call_back($);
			}
		);
	}
	else
	{
		call_back($);
	}
}

global.nr_delete_user=function($, user_ids, del_mode, reassign_id, next)
{
	var user_ids=get_array(user_ids);

	/* Assign the new user to all the posts */
	var reassignment=($, next)=>
	{
		if(!isNaN(reassign_id))
		{
			var q='UPDATE '+nr_db_config.tb_prefix+'posts SET owner_user_id='+reassign_id+' WHERE owner_user_id IN ('+user_ids.join(',')+')';
			
			nr_db_pool.query(q,()=>next($));
			
			return;
		}
		
		next($);
	}

	/* Delete all posts of the user if no reassignment */
	var del_posts=($, next)=>
	{
		/* If reassign is yes, then no need to delete post. Simply go to next function. */
		if(!isNaN(reassign_id))
		{
			next($);
			return;
		}

		var q='SELECT post_id, post_type FROM '+nr_db_config.tb_prefix+'posts WHERE owner_user_id IN ('+user_ids.join(',')+')';

		nr_db_pool.query(q, function(e,r)
		{
			(e || !Array.isArray(r)) ? r=[] : 0;

			var attachments=[];
			var post_ids=[];

			/* Separate post id and attachment id */
			r.forEach(item => 
			{
				item.post_type=='attachment' ? attachments.push(item.post_id) : post_ids.push(item.post_id);
			});
			

			/* Firstly delete files and associated attachment posts */
			$.delete_attachment(attachments, ($)=>
			{
				/* Secondly delete typical post posts */
				$.delete_post(post_ids, next);
			});
		});
	}

	/* Delete users */
	var del_users=($, next)=>
	{
		var del='DELETE FROM '+nr_db_config.tb_prefix+'users WHERE user_id IN ('+user_ids.join(',')+')';

		var upd='UPDATE '+nr_db_config.tb_prefix+'users SET user_status="abandoned" WHERE user_id IN ('+user_ids.join(',')+')';

		var q=del_mode=='delete' ? del : upd;

		nr_db_pool.query(q,(e)=>
		{
			next($);
		});
	}

	/* call delete_user hook */
	var call_hook=($, user_ids, next)=>
	{
		delete_user($, user_ids, next);
	}

	var funcs=
	[
		reassignment,
		[delete_user_meta,	user_ids, false],
		del_posts,
		del_users,
		[call_hook,			user_ids],
		next
	];

	$.series_fire( funcs);
}

global.delete_user_meta=function($, user_id, meta_key, next)
{
	var users=get_array(user_id);

	var and_clause=(meta_key && typeof meta_key=='string') ? ' AND meta_key="'+meta_key+'"' : '';

	var q='DELETE FROM '+nr_db_config.tb_prefix+'usermeta WHERE owner_user_id IN ('+users.join(',')+')'+and_clause;

	nr_db_pool.query(q, (e,r)=>next($));
}

global.nr_login=function($, fields, next)
{
	$.do_action('nr_before_login', fields, function($)
	{
		var user_login	= nr_db_pool.escape(fields.username);
		var pass		= fields.password;
		
		var q='SELECT * FROM '+nr_db_config.tb_prefix+'users WHERE user_email='+user_login+' OR user_login='+user_login+' LIMIT 1';
		
		nr_db_pool.query(q, function(err, result)
		{
			if(err)
			{
				next($, {'status':'error', 'message':'Database Error.'});
				return; 
			}

			var resp={'status':'error', 'message':'Invalid credentials.'};

			if(result.length==0)
			{
				$.do_action('nr_login_failed', fields, function($)
				{
					next($, resp);
				});
				return;
			}
			
			password_verify(pass, result[0].user_pass, function(valid)
			{
				if(valid==true)
				{
					// Credentials matched and logged in
					$.nr_current_user=result[0];
					$.set_session('user_id', result[0].user_id, nr_login_expiry);
					$.set_session('user_login', result[0].user_login, nr_login_expiry);
					
					resp={'status':'success', 'go_to':'/nr-admin'};

					$.echo(resp);

					$.do_action('nr_login', $.get_current_user_id(), function($)
					{
						next($, resp);
					});
				}
				else
				{
					$.echo(resp);
					
					$.do_action('nr_login_failed', fields, function($)
					{
						next($, resp);
					});
				}
			});
		});
	});
}

global.nr_logout=function($, next)
{
	delete $._SESSION['user_login'];
	delete $._SESSION['user_id'];

	var user_id=$.get_current_user_id();

	$.do_action('nr_logout', user_id, function($, user_id, bummer)
	{
		next($);
	});
}

global.nr_logout_all=function($, lg_next)
{
	// Gather data
	var sess_tbl	= nr_db_config.tb_prefix+'sessions';
	var user_id		= $.get_current_user_id();

	// Get existing sessions of this user
	var q='SELECT id, json_values FROM '+sess_tbl+' WHERE user_id='+user_id;
	nr_db_pool.query(q, function(e, r)
	{
		!Array.isArray(r) ? r=[] : 0;

		var funcs=[];

		// Loop through all session of this user
		r.forEach(js_ob=>
		{
			// Parse data
			var id=js_ob.id;
			var json={};
			try{json=JSON.parse(js_ob.json_values)}catch(e){}

			// Create updater/deleter function
			var fnc=function($, json, id, loop_next)
			{
				// Delete user_id and user_login. These two are used to determine login status.
				// No need to delete other data. Might be necessary those are.
				delete json.user_id;
				delete json.user_login;

				// If there is no session data then delete. Otherwise update.
				var q=Object.keys(json).length>0 ? 
						'UPDATE '+sess_tbl+' SET json_values='+nr_db_pool.escape(JSON.stringify(json))+', user_id=NULL WHERE id='+id :
						'DELETE FROM '+sess_tbl+' WHERE id='+id;

				nr_db_pool.query(q, function()
				{
					loop_next($);
				});
			}
			
			funcs.push([fnc, json, id]);
		});

		funcs.push(function($)
		{
			$.do_action('nr_logout_all', user_id, function($, user_id, bummer)
			{
				lg_next($);
			});
		});

		$.series_fire(funcs);
	});
}