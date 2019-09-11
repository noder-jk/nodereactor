global.file_get_contents=function(p, next)
{
    var p=normalize_path(p);

    node_modules.fs.readFile(p, 'utf8', (e, data)=>
    {
        next(!e ? data : null);
    });
}

global.file_put_contents=function(s_path, r_script, next)
{
    s_path=normalize_path(s_path);
    
    node_modules.fs.writeFile(s_path, r_script, er=>
    {
        next(er);
    });
}

global.file_get_contents_sync=function(p)
{
    var p=normalize_path(p);
    var exist=node_modules['fs'].existsSync(p);

	return exist ? node_modules.fs.readFileSync(p).toString() : null;
}

global.file_exists=function(path, next)
{
	node_modules.fs.lstat(normalize_path(path), (e, stats)=>
	{
        next(!e && stats.isFile());
	});
}