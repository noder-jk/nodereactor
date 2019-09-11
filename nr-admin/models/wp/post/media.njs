module.exports.get_attachment_url=function(post_id, next)
{
	var ob={'intersect':{'post_id':post_id}};

	this.get_posts(ob, function($, r)
	{
		var urls={};
		
		// Loop through all attachment post and generate file url.
		r.forEach(item=>
		{
			urls[item.post_id]=nr_uploads_url+item.real_path;
		});

		// pass only url if it is single argument
		!Array.isArray(post_id) ? urls=urls[post_id] : 0;

		next($, urls);
	});
}

module.exports.include_post_media=function(content, call_back)
{
	var $=this;

	var content_copy=node_modules.deepcopy(content);
	
	var attachments	=[];

	/* At first retrieve all the attachments id from posts */
	for(var i=0; i<content.length; i++)
	{
		content[i].post_content=nr_dom(content[i].post_content);
		content[i].post_content('[data-attachment_id]').each(function()
		{
			attachments.push(content[i].post_content(this).attr('data-attachment_id'));
		});
	}
	
	/* Send copied content if no attachment retrieval is necessary */
	if(attachments.length==0)
	{
		call_back($, content_copy); 
		return;
	}

	/* Fetch posts by attachment id */
	var q='SELECT post_id, post_title, real_path FROM '+nr_db_config.tb_prefix+'posts WHERE post_id IN ('+attachments.join(',')+') AND post_type="attachment"';
	nr_db_pool.query(q,function(e,r)
	{
		/* Loop through all fetched attachment post and match id */
		for(var n=0; n<r.length; n++)
		{
			/* Loop through all the DOM post */
			for(var i=0; i<content.length; i++)
			{
				content[i].post_content('[data-attachment_id="'+r[n].post_id+'"]').each(function()
				{
					/* Loop through specified html tag name */
					switch(content[i].post_content(this).get(0).tagName.toUpperCase())
					{
						case 'SOURCE':	content[i].post_content(this).attr('src', nr_uploads_url+r[n].real_path); 
										break;
										
						case 'IMG'	:	content[i].post_content(this).attr('src', nr_uploads_url+r[n].real_path).attr('title', r[n].post_title).attr('alt',r[n].post_title); 
										break;
										
						case 'A'	:	content[i].post_content(this).attr('href', nr_uploads_url+r[n].real_path).attr('title', r[n].post_title); 
										break;
					}
				});
			}
		}

		/* Now convert all the DOM to plain html code */
		for(var i=0; i<content.length; i++)
		{
			content[i].post_content=content[i].post_content('body').html();
		}

		call_back($, content);
	});
}

module.exports.exclude_post_media=function(content, post_type)
{
	if(content.indexOf('data-attachment_id="')>-1 || content.indexOf('href="'+nr_home_url))
	{
		var d=nr_dom(content);

		post_type=='attachment' ? 
		d('[data-attachment_id]').remove() : // Otherwise media will be duplicated
		d('[data-attachment_id]').each(function()
		{
			d(this).removeAttr('src').removeAttr('alt').removeAttr('title');
		});
		
		return d('body').html();
	}

	return content;
}


module.exports.delete_attachment=function(post_ids, next)
{
	var post_id=get_array(post_ids);

	var q='SELECT real_path FROM '+nr_db_config.tb_prefix+'posts WHERE post_id IN ('+post_id.join(',')+')';
	
	var $=this;

	nr_db_pool.query(q, function(e, r)
	{
		/* firstly delete files from file system. */
		if(!e && r.length>0)
		{
			for(var i=0; i<r.length; i++)
			{
				node_modules.fs.unlink(normalize_path(nr_uploads+r[i].real_path), function(){});
			}
		}

		$.delete_attachment_post_too=true;

		$.delete_post(post_id, next);
	});
}


global.nr_render_attachment=function(post)
{
	var content=post.post_content;

	if(post.mime_type.indexOf('image')===0)
	{
		content='<p><img data-attachment_id="'+post.post_id+'"/></p>'+content;
	}
	else if(post.mime_type.indexOf('video')===0)
	{
		content='<p><video controls="controls"><source data-attachment_id="'+post.post_id+'"></source></video></p>'+content;
	}
	else if(post.mime_type.indexOf('audio')===0)
	{
		content='<p><audio controls="controls"><source data-attachment_id="'+post.post_id+'"></source></audio></p>'+content;
	}
	
	return content;
}