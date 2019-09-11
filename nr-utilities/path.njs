const nr_path_mod=require('path');

module.exports=function(nodes, rel_dir)
{
    var resp={};

    // Loop though every package
	for(var item in nodes)
	{
		try
		{
            // Get predefined directory and package object
            var pt=nodes[item].dir;
            var pk=nodes[item].package;

            // If directory is not predefined then try to collect
            // It might be undefined in case of 'semplicemente' default theme.
            if(!pt || !pk)
            {
                // Try if rel path is provided
                var rp=nodes[item].rel_path;
                if(rp)
                {
                    // If it is local install, get directory based on parent dependency root and it's relative path
                    if(rp.indexOf('file:')===0)
                    {
                        rp=rp.slice('file:'.length);
                        rp=nr_path_mod.resolve(rel_dir, rp);
                    }
                }

                // get the absolute directory path and package object
                var pkg_name=rp || item;
                
                // decide package path
                // Slash in 'pkg_name' means it is file path rather than package name. 
                pkg_name=(pkg_name.indexOf('/')>-1 || pkg_name.indexOf('\\')>-1) ? pkg_name : rel_dir+'/node_modules/'+item; 

                // 'semplicemente' is exceptional since it gets installed along with NodeReactor.
                item=='semplicemente' ? pkg_name='semplicemente' : 0;

                pt=nr_path_mod.dirname(require.resolve(pkg_name+'/package.json')); 

                pk=require(nr_path_mod.normalize(pt+'/package.json'));
            }
            
            if(pk.nr_configs && (pk.nr_configs.type=='theme' || pk.nr_configs.type=='plugin'))
            {                
                // Store it in done module object
                resp[item]=
                {
                    'dir':pt, 
                    'package':pk,
                    'type':pk.nr_configs.type
                }
            }
		}
        catch(e)
        {
            
        }
    }
    
    return resp;
}