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
module.exports.get_post_meta=function(pst_id, meta_k, meta_v, next)
{
	var $=this;
	
	var post_id			= get_array(pst_id);

	var meta_key 	= typeof meta_k=='string' ? " AND meta_key="+nr_db_pool.escape(meta_k) : '';
	var meta_value	= typeof meta_v=='string' ? " AND meta_value="+nr_db_pool.escape(meta_v) : '';
	
	var q="SELECT * FROM "+nr_db_config.tb_prefix+"postmeta WHERE owner_post_id IN ("+post_id.join(',')+")" + meta_key + meta_value;
	
	nr_db_pool.query(q, function(e,r)
	{
		e ? r=[] : 0;

		if(!Array.isArray(pst_id))
		{
			if(Array.isArray(r))
			{
				r=r[0] || {};
			}
		}

		next($, r);
	});
}

module.exports.update_post_meta=function(post_id, meta_ob, next)
{
	var helper=require('./helper.njs');
	helper.meta_updater(this, 'postmeta', post_id, 'owner_post_id', meta_ob, next);
}

module.exports.delete_post_meta=function(post_id, meta_key, next)
{
	var $=this;

	var post_ids=get_array(post_id);
	
	var and_clause=typeof meta_key=='string' ? ' AND meta_key="'+meta_key+'"' : '';

	var q='DELETE FROM '+nr_db_config.tb_prefix+'postmeta WHERE owner_post_id IN ('+post_ids.join(',')+') '+and_clause;
	
	nr_db_pool.query(q, function(e, r)
	{
		typeof next=='function' ? next($) : 0;
	});
}