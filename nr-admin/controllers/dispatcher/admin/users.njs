module.exports.get=function($)
{
	var q='SELECT * FROM '+nr_db_config.tb_prefix+'users';
	
	nr_db_pool.query(q, function(e,r,f)
	{
		for(var i=0; i<r.length; i++)
		{
			r[i].gravatar=get_avatar_url(r[i].user_email,{s: '32', r: 'g', d: 'mm'});
		}

		var resp=
		{
			'current_user_id':$.get_current_user_id(), 
			'users':r
		}

		$.echo(resp);
		
		$.exit();
	});
}

module.exports.get_to_edit=function($)
{
	var user_id=$._POST.user_id===true ? $.get_current_user_id() : $._POST.user_id;
	
	nr_db_pool.query
	(
		'SELECT * FROM '+nr_db_config.tb_prefix+'users WHERE user_id='+user_id,
		function(e,r)
		{
			var resp=(e || r.length==0) ? {'status':'error', 'message':'User not found'} : {'status':'success', 'user':r[0]};
			 
			$.exit( resp);
		}
	);
}

module.exports.login=function($)
{
	nr_login($, $._POST, function($)
	{
		$.exit();
	});
}

module.exports.register=function($)
{
    var fields	=$._POST.values;
	
	var err_text=false;
	
	var nr_regex = 
	{
		'url':/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
		'non_english':/[^A-Za-z0-9!@=\-_)(\]\[}{\/\\><\.,?\'":|\+\*&^%$#`~;\s]/,
		'email':/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		'alphanumeric':/^[a-zA-Z0-9]+$/,
		'alpha':/^[a-zA-Z]+$/
	 }

    for(var k in fields)
    {
        var value=fields[k];

        switch(k)
        {
			case 'display_name'	:	!/\S+/.test(value) ? err_text='Invalid Display Name' : 0;
                                    break;
                                    
			case 'user_username':	!nr_regex.alphanumeric.test(value) ? err_text='User Name should be only alphanumeric' : 0;
                                    break;

			case 'user_email'	:	!nr_regex.email.test(value) ? err_text='Invalid Email' : 0;
                                    break;

            case 'user_password':	(value.length<8 || value.length>20) ? err_text='Invalid Password Length' : null;
                                    break;
        }
    }

    if(err_text)
    {
        $.exit({'status':'Error','message':err_text});
        return;
    }

	var q='SELECT * FROM '+nr_db_config.tb_prefix+'users WHERE user_login='+nr_db_pool.escape(fields.user_username)+' OR user_email='+nr_db_pool.escape(fields.user_email);
	
	nr_db_pool.query(q, function(e,r)
	{
		if(e)
		{	
			$.exit({'status':'Error','message':'Error in fetching from db'});
			return;
		}
		
		if(r.length>0)
		{
			var str=[];
			r[0].user_login		==fields.user_username 	? str.push('Username')	: 0;
			r[0].user_email		==fields.user_email 	? str.push('Email') 	: 0;
			
			var resp=str.join(' and ')+' already exist';
			
			$.exit({'status':'Error','message':resp});
			return;
		}
		
		password_hash(fields.user_password, function(hash)
		{
			var values=	
			{
				user_login	:	fields.user_username,
				user_pass	:	hash,
				display_name:	fields.display_name,
				user_email	:	fields.user_email,
				user_role	:   'administrator'
			};
			
			var key=[];
			var val=[];
			
			for(var k in values)
			{
				key.push(k);
				val.push(nr_db_pool.escape(values[k]));
			}
			
			nr_db_pool.query
			(
				'INSERT INTO '+nr_db_config.tb_prefix+'users ('+key.join(',')+') VALUES ('+val.join(',')+')',
				function(e,r)
				{
					var resp=e ? {'status':'Error','message':'Error in when insert/update user.'} : {'status':'Success','message':'Registered successfully','user_id':r.insertId}
					$.exit(resp);
				}
			);
		});
	});
}

module.exports.update=function($)
{
	var fields=$._POST.values;

	var need_hash=fields.user_password || '';

	password_hash(need_hash, function(hash)
	{
		var values=	
		{
			display_name		:	fields.display_name,
			user_email			:	fields.user_email,
			user_role			:	'administrator',
			user_capabilities	:	fields.user_capabilities
		};

		fields.change_pass ? values.user_pass = hash : 0;

		var set_val=[];
		for(var k in values)
		{
			set_val.push(k+'='+nr_db_pool.escape(values[k]));
		}

		nr_db_pool.query
		(
			'UPDATE '+nr_db_config.tb_prefix+'users SET '+set_val.join(', ')+' WHERE user_id="'+fields.user_id+'"',
			function(e)
			{
				var resp = e ? {'status':'error','message':'Could not update'} : {'status':'success','message':'Updated successfully'};
				$.exit( resp);
			}
		);
	})	

	
}

module.exports.delete=function($)
{
	var terminate=($)=>
	{
		$.exit();
	}

	nr_delete_user($, $._POST.user_ids, $._POST.user_action, false, terminate);
}