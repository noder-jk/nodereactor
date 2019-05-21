const install_nr=function($, nr_fields, nr_data)
{
	var pool=node_modules.mysql2.createPool
	({
		host				: nr_data.db_host,
		user				: nr_data.db_username,
		password			: nr_data.db_password,
		database			: nr_data.db_name,
		connectionLimit		: 5,
		multipleStatements	: true
	});

	pool.getConnection(function(e, connection) 
	{
		if(nr_fields.to_do=='check_db')
		{
			pool.end();

			exit($, !e ? {'status':'done'} : {'status':'failed','message':'Could not Connect. Make sure configs are correct and database is running.'});
			
			return;
		}
		
		var sql=require('./nr_sql_str.njs')(connection, nr_data);
		
		connection.query(sql, function(e,r)
		{
			pool.end();

			if(e)
			{
				exit($, {'status':'error', 'message':'Database Import Error.'});
				return;
			}

			/* Replace global database config container variable with new working db */
			nr_db_config=
			{
				db_name		: nr_data.db_name,
				db_host		: nr_data.db_host,
				db_user		: nr_data.db_username,
				db_pass		: nr_data.db_password,
				tb_prefix	: nr_data.tb_prefix
			}
					
			/* Put the config in config file. */
			var nr_cstr='module.exports='+JSON.stringify(nr_db_config);
			
			/* Store the file in nr-content directory that resides in users project root. */
			node_modules.fs.writeFile(normalize_path(nr_configs+'database.njs'), nr_cstr, function(e)
			{
				if(e)
				{
					exit($, {'status':'failed','message':'Installed, But Error in creating config file.'});
					return;
				}
				
				uninclude(nr_admin+'plugin/ajax/installer/', true);
				
				/* So, everything okay. Now load new pool. */
				nr_pool=get_pool();

				exit($, {'status':'done'});
			});
		});
	});
}

module.exports.run=function($)
{
	var nr_fields=$._POST;
	
	password_hash($, nr_fields.user_password, ($, hash)=>
	{
		var nr_data			= {};
		nr_data.db_name		= nr_fields.db_name;
		nr_data.db_username	= nr_fields.db_username;
		nr_data.db_password	= nr_fields.db_password;
		nr_data.db_host		= nr_fields.db_host;
		nr_data.db_engine	= nr_fields.db_engine;
		nr_data.tb_prefix	= nr_fields.tb_prefix;
		
		nr_data.display_name= nr_fields.user_display_name;
		nr_data.email		= nr_fields.user_email;
		nr_data.username	= nr_fields.user_username;
		nr_data.password	= hash;
		
		install_nr($,nr_fields,nr_data);
	});
}