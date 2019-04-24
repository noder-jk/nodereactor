global.get_pool=function()
{
	var c = typeof nr_db_config=='object' ? nr_db_config : {};

	var db=
	{
		host			: c.db_host || '',
		user			: c.db_user || '',
		password		: c.db_pass || '',
		database		: c.db_name || '',
		connectionLimit	: 100
	}
	
	return node_modules.mysql2.createPool(db);
}