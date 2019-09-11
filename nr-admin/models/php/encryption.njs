global.password_hash=function(pass_str, ps_next)
{
	node_modules.bcryptjs.genSalt(10, function(err, salt) 
	{
		node_modules.bcryptjs.hash(pass_str, salt, function(err, hash) 
		{
			ps_next(hash);
		});
	});
}

global.password_verify= function(pass, hash, c_next)
{
	node_modules.bcryptjs.compare(pass, hash, (e,r)=>
	{
		c_next(r);
	});
}