
global.meta_processor=function ($, mets, result, next)
{
	/* This function simply assign meta to post using post id. */
	for(var i=0; i<mets.length; i++)
	{
		for(var n=0; n<result.length; n++)
		{
			(mets[i].owner_post_id==result[n].post_id) ? result[n].post_meta[mets[i].meta_key]=mets[i].meta_value : 0;
		}
	}
	
	next($, result);
}

module.exports.use_meta_box=function(ob)
{
	if(!ob.post_type || !ob.module){return;}

	var mb=get_array(ob.module);
	var pt=get_array(ob.post_type); 

	/* Loop through all provided post types */
	for(var n=0; n<pt.length; n++)
	{
		/* Create array in register list if not exist already. */
		if(!this.registered_meta_box_to_post[pt[n]])
		{
			this.registered_meta_box_to_post[pt[n]]=[];
		}

		/* Loop through all meta box id */
		for(var i=0; i<mb.length; i++)
		{
			var a=mb[i];

			/* Insert the meta box id if already not inserted by other plugin or theme. */
			if(this.registered_meta_box_to_post[pt[n]].indexOf(a)==-1)
			{
				this.registered_meta_box_to_post[pt[n]].push(a);
			}
		}
	}
}

module.exports.register_meta_box=function(meta_ob)
{
	if(meta_ob.id && meta_ob.title && meta_ob.component && !this.nr_registered_meta_boxes[meta_ob.id])
	{
		if(meta_ob.package!==undefined)
		{
			var n_type=parse_node_type(meta_ob.package);
			delete meta_ob.package;
			
			if(!n_type){return;}

			meta_ob.nr_package=n_type.nr_package;
		}

		this.nr_registered_meta_boxes[meta_ob.id]=meta_ob;
	}
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~Post meta, pagination related functions~~~~~~~~~~~~~~~~~~~~~~~~~ */
global.get_post_meta=function($, post_id, meta_k, meta_v, next)
{
	post_id			= get_array(post_id);

	var meta_key 	= meta_k 	? " AND meta_key="+nr_db_pool.escape(meta_k) : '';
	var meta_value	= meta_v	? " AND meta_value="+nr_db_pool.escape(meta_v) : "";
	
	var q="SELECT * FROM "+nr_db_config.tb_prefix+"postmeta WHERE owner_post_id IN ("+post_id.join(',')+")" + meta_key + meta_value;
	
	nr_db_pool.query(q, function(e,r)
	{
		e ? r=[] : null;
		
		next($, r);
	});
}

global.update_post_meta=function($, post_id, meta_ob, next)
{
	var meta=nr_db_config.tb_prefix+'postmeta';

	/* delete existing */
	var del_first=($, next)=>
	{
		var meta_key=Object.keys(meta_ob).map(key=>nr_db_pool.escape(key)).join(',');

		var q='DELETE FROM '+meta+' WHERE owner_post_id='+post_id+' AND meta_key IN ('+meta_key+')';

		nr_db_pool.query(q, function()
		{
			next($);
		});
	}

	var insert_now=($, next)=>
	{
		var insert=Object.keys(meta_ob).map(key=>
		{
			var k=nr_db_pool.escape(key);
			var v=meta_ob[key];

			typeof v=='object' ? v=JSON.stringify(v) : null;
			v=nr_db_pool.escape(v.toString());

			return '('+post_id+', '+k+', '+v+')';
		});


		var q='INSERT INTO '+meta+' (owner_post_id, meta_key, meta_value) VALUES '+insert.join(',');

		nr_db_pool.query(q, function(e,r)
		{
			next($);
		});
	}

	$.series_fire( [del_first, insert_now, next]);
}


global.delete_post_meta=function($, post_id, meta_key, next)
{
	var post_ids=get_array(post_id);
	
	var and_clause=(meta_key && typeof meta_key=='string') ? ' AND meta_key="'+meta_key+'"' : '';

	var q='DELETE FROM '+nr_db_config.tb_prefix+'postmeta WHERE owner_post_id IN ('+post_ids.join(',')+') '+and_clause;
	
	nr_db_pool.query(q, function(e, r)
	{
		typeof next=='function' ? next($) : 0;
	});
}