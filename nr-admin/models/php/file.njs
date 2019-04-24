global.file_get_contents=function($, p, next)
{
    var p=normalize_path(p);

    node_modules.fs.readFile(p, 'utf8', (e, data)=>
    {
        next($, (!e ? data : false));
    });
}

global.file_get_contents_sync=function(p)
{
    var p=normalize_path(p);
	return file_exists_sync(p) ? node_modules.fs.readFileSync(p).toString() : '';
}

global.file_exists=function($, path, next)
{
	node_modules.fs.lstat(normalize_path(path), (e,stats)=>
	{
        next($, (!e && stats.isFile()));
	});
}

global.file_exists_sync=function(p)
{
    var p=normalize_path(p);
    return node_modules['fs'].existsSync(p);
}