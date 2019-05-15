/* ~~~~~~~~~~~Dashboard menu page~~~~~~~~~~~ */
module.exports.add_submenu_page=function(params)
{ 
	this.nr_admin_submenus_runtime.push(params);
}

module.exports.add_menu_page=function(params,parent_slug)
{
	typeof params!=='object' ? params={} : 0;
	
	var req_key=['page_title', 'menu_title', 'slug', 'component', 'package'];
	
	for(var i=0; i<req_key.length; i++)
	{
		if(!params[req_key[i]])
		{
			return;
		}
	}
	
	var ntype=parse_node_type(params.package);

	params.node_type=ntype.node_type;
	params.nr_package=ntype.nr_package;
	delete params.package;

	if(parent_slug && this.nr_admin_menus_runtime[parent_slug])
	{
		if(!this.nr_admin_menus_runtime[parent_slug].sub)
		{
			this.nr_admin_menus_runtime[parent_slug].sub=[];
		}

		this.nr_admin_menus_runtime[parent_slug].sub.push(params);
	}
	else
	{
		this.nr_admin_menus_runtime[params.slug]={'main':params, 'sub':[]}
	}
}