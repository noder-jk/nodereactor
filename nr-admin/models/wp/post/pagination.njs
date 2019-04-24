
global.get_pagination=function($, pgn_condition, next)
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
	
	get_posts($, pgn_condition, function($, r)
	{
		var posts	= r.posts;
		var args	= r.args;

		if(args.posts_per_page>=0)
		{
			/* This call back function is really weird. Confused about algorithm. But it's working. Will check later. */
			var pages=array_chunk(posts, args.posts_per_page);
			
			/* Set default current page */
			pgnt.current=args.current_page;

			/* Loop through all page chunks to get pages */
			for(var i=0; i<pages.length; i++)
			{
				var offs=args.page+i;

				pgnt.pages.push(offs);

				args.current_page==offs ? pgnt.current=offs : 0;
			}
			
			(pgnt.current && pgnt.current>1) ? pgnt.previous=pgnt.current-1 : 0;
			(pgnt.current && pgnt.pages.indexOf(pgnt.current+1)>-1) ? pgnt.next=pgnt.current+1 : 0;
		}
		
		next($, pgnt);
	});
}
