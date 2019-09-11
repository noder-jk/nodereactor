/* This function register included scripts, and include. */
global.include=function(path)
{
	/* If file extension is njs and file exists then require it. */
	var path=normalize_path(path);

	if(node_modules.path.extname(path.toLowerCase())=='.njs')
	{
		try
		{
			return require(path);
		}
		catch(e)
		{
			
		}
	}
}

global.uninclude=function(path, del_by_dir)
{
	/* Delete any module from cache. So it will be fully reloaded when applicable. */
	!Array.isArray(path) ? path=[path] : 0;
	
	for(pn=0; pn<path.length; pn++)
	{
		try
		{
			original_path=path[pn];

			/* Identify if it's core modules such as express. It means not from theme/plugin type of packages */
			core=(path[pn].indexOf('/')>-1 || path[pn].indexOf('\\')>-1) ? false : true;
			
			/* Firstly resolve the directory path of module */
			path[pn]= core==false ? normalize_path(path[pn]) : node_modules.resolve.sync(normalize_path(path[pn]));
			
			/* Delete the file from cache right from here if it is not deletion by directory. */
			if(!del_by_dir || core==true)
			{
				delete require.cache[path[pn]];
				path[pn]=false;
			}
		}
		catch(e)
		{
			
		}
	}
	
	if(del_by_dir==true)
	{
		for(cache_k in require.cache)
		{
			for(pn=0; pn<path.length; pn++)
			{
				if(path[pn]!==false && cache_k.indexOf(path[pn])===0)
				{
					delete require.cache[cache_k];
				}
			}
		}
	}
}