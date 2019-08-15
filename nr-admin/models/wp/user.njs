/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~User/member related functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
global.is_user_logged_in=function($)
{
	return $.nr_current_user==false ? false : true;
}

global.nr_get_current_user=function($)
{
	return $.nr_current_user;
}

global.get_current_user_id=function($)
{
	return $.nr_current_user==false ? false : $.nr_current_user.user_id;
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
		if(is_numeric(reassign_id))
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
		if(is_numeric(reassign_id))
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