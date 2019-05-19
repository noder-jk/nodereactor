/* --------------Registrar functions that register hooks, filters and do action.-------------- */
module.exports.add_action=function(hook, callback)
{
	if(hook && (hook.indexOf('nr_ajax_')===0 || hook.indexOf('nr_socket_')===0))
	{
		this.nr_registered_ajax[hook]=callback;
		return;
	}
	
	!this.nr_hooks[hook] ? this.nr_hooks[hook]=[] : 0;
	
	this.nr_hooks[hook].push(callback);
}

module.exports.remove_action=function(hook)
{
	delete this.nr_hooks[hook];
}

module.exports.do_action=function(hook,params,callback)
{
	/* Determine callback and passable parameters */
	var next=!callback ? params : callback;
	var params=callback ? params : false;

	/* Check if the hook exist in registered array, and it has at least one function to invoke */
	if(this.nr_hooks[hook] && this.nr_hooks[hook].length>0)
	{
		var hks=[];

		/* Loop through all hooked function and store in the array */
		for(var i=0; i<this.nr_hooks[hook].length; i++)
		{
			var fnc=this.nr_hooks[hook][i];

			hks.push(params!==false ? [fnc, params] : fnc);
		}

		hks.push(next);
		
		/* Finally call all that in series mode */
		this.series_fire(hks);
	}
	else if(typeof next=='function')
	{
		next(this);
	}
}