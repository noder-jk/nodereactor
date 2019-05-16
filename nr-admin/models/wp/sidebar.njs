/* ~~~~~~~~~~~~~~~~~~~~~~Widget and sidebar related functions.~~~~~~~~~~~~~~~~~~~~~~ */
module.exports.register_sidebar=function(sidebar)
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
			var ob=	
			{
				'title':sidebar.title,
				'id':sidebar.id
			}

			this.nr_registered_sidebar[sidebar.id]=ob;
		}
	}
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

module.exports.register_widget=function(widget)
{
	if(widget.id && widget.title)
	{
		var type=parse_node_type(widget.package);

		
		if(!type)
		{
			return;
		}

		widget.nr_package=type.nr_package;
		widget.unique_key=unique_key();
		delete widget.package;
		
		this.nr_widgets_runtime.push(widget);
	}
}
