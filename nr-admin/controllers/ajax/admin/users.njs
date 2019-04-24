module.exports.get=function($)
{
	var q='SELECT * FROM '+nr_db_config.tb_prefix+'users';
	
	$.nr_db.query(q, function(e,r,f)
	{
		for(var i=0; i<r.length; i++)
		{
			r[i].gravatar=get_avatar_url(r[i].user_email,{s: '32', r: 'g', d: 'mm'});
		}

		var resp=
		{
			'current_user_id':get_current_user_id($), 
			'users':r
		}

		$=echo($, resp);
		
		exit($);
	});
}

module.exports.get_to_edit=function($)
{
	var user_id=$._POST.user_id===true ? get_current_user_id($) : $._POST.user_id;
	
	$.nr_db.query
	(
		'SELECT * FROM '+nr_db_config.tb_prefix+'users WHERE user_id='+user_id,
		function(e,r)
		{
			var resp=(e || r.length==0) ? {'status':'failed', 'message':'User not found'} : {'status':'done', 'user':r[0]};
			 
			exit($, resp);
		}
	);
}

module.exports.login=function($)
{
	var fields		= $._POST;
	var email		= fields.user_username;
	var pass		= fields.user_password;
	var user_login	= fields.user_username;
	
	var q='SELECT * FROM '+nr_db_config.tb_prefix+'users WHERE user_email='+$.nr_db.escape(email)+' OR user_login='+$.nr_db.escape(user_login)+' LIMIT 1';
	
	$.nr_db.query(q, function(err, result)
	{
		if(err)
		{
			exit($,{'status':'failed','message':'Database Error.'}); 
			return; 
		}

		var resp={'status':'failed','message':'Invalid email or password.'};

		if(result.length==0)
		{
			exit($, resp);
			return;
		}
		
		password_verify($, pass, result[0].user_pass, ($, valid)=>
		{
			if(valid==true)
			{
				$.nr_current_user=result[0];
				$=set_session($,'user_id', result[0].user_id, nr_login_expiry);
				$=set_session($,'user_login', result[0].user_login, nr_login_expiry);
				
				resp={'status':'done','go_to':'/nr-admin'};
			}

			exit($, resp);
		});
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
        exit($,{'status':'Error','message':err_text});
        return;
    }

	var q='SELECT * FROM '+nr_db_config.tb_prefix+'users WHERE user_login='+$.nr_db.escape(fields.user_username)+' OR user_email='+$.nr_db.escape(fields.user_email);
	
	$.nr_db.query(q, function(e,r)
	{
		if(e)
		{	
			exit($,{'status':'Error','message':'Error in fetching from db'});
			return;
		}
		
		if(r.length>0)
		{
			var str=[];
			r[0].user_login		==fields.user_username 	? str.push('Username')	: 0;
			r[0].user_email		==fields.user_email 	? str.push('Email') 	: 0;
			
			var resp=str.join(' and ')+' already exist';
			
			exit($,{'status':'Error','message':resp});
			return;
		}
		
		password_hash($, fields.user_password, ($, hash)=>
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
				val.push($.nr_db.escape(values[k]));
			}
			
			$.nr_db.query
			(
				'INSERT INTO '+nr_db_config.tb_prefix+'users ('+key.join(',')+') VALUES ('+val.join(',')+')',
				function(e,r)
				{
					var resp=e ? {'status':'Error','message':'Error in when insert/update user.'} : {'status':'Success','message':'Registered successfully','user_id':r.insertId}
					exit($,resp);
				}
			);
		});
	});
}

module.exports.update=function($)
{
	var fields=$._POST.values;

	var need_hash=fields.user_password || '';

	password_hash($, need_hash, ($, hash)=>
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
			set_val.push(k+'='+$.nr_db.escape(values[k]));
		}

		$.nr_db.query
		(
			'UPDATE '+nr_db_config.tb_prefix+'users SET '+set_val.join(', ')+' WHERE user_id="'+fields.user_id+'"',
			function(e)
			{
				var resp = e ? {'status':'failed','message':'Could not update'} : {'status':'done','message':'Updated successfully'};
				exit($, resp);
			}
		);
	})	

	
}

module.exports.delete=function($)
{
	var terminate=($)=>
	{
		exit($);
	}

	nr_delete_user($, $._POST.user_ids, $._POST.user_action, false, terminate);
}