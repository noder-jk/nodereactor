
module.exports.get_pagination=function(pgn_condition, next)
{
	var pgnt=
	{
		'pages':[],
		'current':false, 
		'previous':false, 
		'next':false
	};
	
	typeof pgn_condition!=='object' ? pgn_condition={} : null;
	pgn_condition.paginator_call=true;
	
	this.get_posts(pgn_condition, function($, r)
	{
		if(typeof r!=='object' || !r.posts || !r.args || !r.args.posts_per_page)
		{
			next($, pgnt);
			return;
		}
		
		var posts	= r.posts;
		var args	= r.args;

		if(pgn_condition.pagination.is_singular)
		{
			// Set current
			pgnt.current=pgn_condition.current_post_id;

			// Loop through all posts
			for(var i=0; i<posts.length; i++)
			{
				var p=posts[i];
				
				// If current post matched with any post then generate pagination relatively
				if(p.post_id==pgn_condition.current_post_id)
				{
					var minus=i-1;
					var plus=i+1;

					// Set Previous and next
					posts[minus] ? pgnt.previous=posts[minus].post_id : 0;
					posts[plus] ? pgnt.next=posts[plus].post_id : 0;

					// Set multiple page
					var range=Math.floor(pgn_condition.pagination.total/2);

					// Calculate page range
					var start=i-range;
					start<0 ? start=0 : 0;
					var end=i+pgn_condition.pagination.total;

					// Get multiple post id using calculated range
					pgnt.pages=posts.slice(start, end).map((pt, ind)=>
					{
						return {url:pt.post_id, page:ind+start}
					});

					break;
				} 
			}

			// Parse values from pagination object to get permalink based on
			var all_ids=Object.keys(pgnt).map(key=>pgnt[key]).filter(id=>id!==false);
			var new_ar=[];
			for(var i=0; i<all_ids.length; i++)
			{
				var el=all_ids[i];
				Array.isArray(el) ? new_ar=new_ar.concat(el) : new_ar.push(el);
			}
			all_ids=new_ar.filter((v, i, self)=>self.indexOf(v) === i);

			// Now get permalink of all ids
			$.get_permalink('post_id', all_ids, function($, urls)
			{
				// Loop through all urls
				for(var u in urls)
				{
					// Loop through all pagination property like prev, next
					for(var k in pgnt)
					{
						(!Array.isArray(pgnt[k]) && pgnt[k]==u) ? pgnt[k]=urls[u] : 0;
					}
				}

				// Set url for multiple pages
				var pages=[];
				pgnt.pages.forEach(function(p)
				{
					var id=p.url;
					
					urls[id] ? pages.push({url:urls[id], page:p.page}) : 0;
				});
				pgnt.pages=pages;

				next($, pgnt);
			});
			
			return;
		}

		/* This call back function is really weird. Confused about algorithm. But it's working. Will check later. */
		var pages=node_modules['php-functions'].array_chunk(posts, args.posts_per_page);
		
		/* Set default current page */
		pgnt.current=args.current_page;

		/* Loop through all page chunks to get pages */
		for(var i=0; i<pages.length; i++)
		{
			var offs=args.page+i;
			pgnt.pages.push(offs);
			args.current_page==offs ? pgnt.current=offs : 0;
		}
		
		// Set previous page
		(pgnt.current && pgnt.current>1) ? pgnt.previous=pgnt.current-1 : 0;

		// Set next page
		(pgnt.current && pgnt.pages.indexOf(pgnt.current+1)>-1) ? pgnt.next=pgnt.current+1 : 0;
		
		next($, pgnt);
	});
}
