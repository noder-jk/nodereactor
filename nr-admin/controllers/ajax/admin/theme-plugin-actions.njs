function insert_theme_plugin($, nr_package, call_back)
{
	$.nr_db.query
	(
		'INSERT INTO '+nr_db_config.tb_prefix+'nodes (nr_package,type,active) VALUES ("'+nr_package+'","'+$.node_type+'",1)',
		function(e,r)
		{
			e ? exit($, {'status':'failed','message':'Error in inserting.'}) : call_back($, r.insertId);
		}
	);
}

function deactivate_other_node($, node_package)
{
	var q=false;
	
	if($.node_type=='theme')
	{
		q='UPDATE '+nr_db_config.tb_prefix+'nodes SET active=0 WHERE type="'+$.node_type+'" AND nr_package!="'+node_package+'"';
	}
	else if($.node_type=='plugin')
	{
		q='UPDATE '+nr_db_config.tb_prefix+'nodes SET active=0 WHERE type="'+$.node_type+'" AND nr_package="'+node_package+'"'
	}
	
	if(q)
	{
		$.nr_db.query
		(
			q,
			function(e,r)
			{
				exit($, (e ? {'status':'failed','message':'Error in deactivating.'} : {'status':'done'}));
			}
		);
	}
	else
	{
		exit($,{'status':'failed','message':'Unknown error'});
	}
}

function check_if_node_exist_in_db($, nr_package,call_back)
{
	$.nr_db.query
	(
		'SELECT * FROM '+nr_db_config.tb_prefix+'nodes WHERE type="'+$.node_type+'" AND nr_package="'+nr_package+'"',
		function(e,r)
		{
			e ? exit($,{'status':'failed','message':'Error in checking if '+$.node_type+' exist.'}) : call_back($, (r.length>0 ? true : false));
		}
	);
}

function activate_existing($, nr_package,call_back)
{
	$.nr_db.query
	(
		'UPDATE '+nr_db_config.tb_prefix+'nodes SET active=1 WHERE type="'+$.node_type+'" AND nr_package="'+nr_package+'"',
		function(e,r)
		{
			e ? exit($,{'status':'failed','message':'Error in updating/activating'}) : call_back($, true);
		}
	);
}

function activation_deactivation_hook($, activation, nr_package)
{
	/* Run the activation/deactivation hook */
	var event= activation ? 'on_activation' : 'on_deactivation';

	try
	{
		var hook_file=require(nr_package+'/'+'index.njs');

		typeof hook_file[event]=='function' ? hook_file[event]($) : 0;
	}
	catch(e)
	{

	}
	
	!activation ? uninclude(nr_package) : null;
}

module.exports.run=function($)
{
	var node_package=$._POST.node_package;

	$.node_type	= $._POST.type=='plugin' ? 'plugin' 		: 'theme';
	
	if(node_package && ($.node_type=='theme' || $.node_type=='plugin'))
	{
		if($._POST.type=='plugin' && $._POST.to_do=='deactivate')
		{
			/* If this is to deactivate any plugin. */
			/* (Theme can not be deactivate in this manner. Theme get deactivated only when another one gets activated. So it will be handled in third 'else if' block.) */
			deactivate_other_node($,node_package);
			
			/* Invoke deactivation hook for this plugin */
			activation_deactivation_hook($, false, node_package);
			return;
		}
		else if($._POST.to_do=='activate')
		{
			/* Firstly check whether already the theme/plugin inserted into database or not. */
			check_if_node_exist_in_db
			(
				$,
				node_package, 
				function($,result)
				{
					if(result==true)
					{
						/* It means theme/plugin already inserted into db. So simply activate it. */
						activate_existing
						(
							$,
							node_package,
							function($,result)
							{
								$.node_type=='plugin' ? exit($, {'status':'done'}) : deactivate_other_node($,node_package);
							}
						);
					}
					else
					{
						/* It means the theme/plugin has not been inserted into db yet. So insert now. */
						insert_theme_plugin
						(
							$,
							node_package,
							function($,ins_id)
							{
								$.node_type=='plugin' ? exit($, {'status':'done'}) : deactivate_other_node($,node_package);
							}
						);
					}
					
					activation_deactivation_hook($, true, node_package);

					$.node_type=='theme' ? activation_deactivation_hook($, false, $.nr_active_theme) : 0;
				}
			);
		}
	}
}