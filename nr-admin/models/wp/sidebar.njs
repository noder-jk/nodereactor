/* ~~~~~~~~~~~~~~~~~~~~~~Widget and sidebar related functions.~~~~~~~~~~~~~~~~~~~~~~ */
global.register_sidebar=function($,sidebar)
{
	if(typeof sidebar=='object')
	{
		/* Ensure case insensitive */
		for(var k in sidebar)
		{
			var v=sidebar[k];
			delete sidebar[k];

			sidebar[k.toLowerCase()]=v;
		}

		/* Keep Only Necessary Properties */
		if(sidebar.title && sidebar.id)
		{
			ob=	{
					'title':sidebar.title,
					'id':sidebar.id
				}

			$.nr_registered_sidebar[sidebar.id]=ob;
		}
	}
	
	return $;
}


function unique_key() 
{
	text = "";
	possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
	for (i=0; i<10; i++)
	{
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
  
	return text;
}

global.register_widget=function($, widget)
{
	if(widget.id && widget.title)
	{
		var type=parse_node_type(widget.package);

		
		if(!type)
		{
			return $;
		}

		widget.node_type=type.node_type;
		widget.nr_package=type.nr_package;
		widget.unique_key=unique_key();
		delete widget.package;
		
		$.nr_widgets_runtime.push(widget);
	}
	
	return $;
}
