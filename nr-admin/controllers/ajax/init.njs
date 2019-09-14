module.exports.dispatch=function($)
{
    var usr={};

    var user=$.get_current_user() || {};

    usr.display_name=user.display_name;

    usr.gravatar=get_avatar_url(user.user_email, {s: '32', r: 'g', d: 'mm'});

	var z=$.get_option( 'time_zone', true);
    var zz=z || 'UTC';

    var resp=
    {
        'nr_configs':
        {
            'site_name'                 :   $.bloginfo('name'),
            'site_description'          :   $.bloginfo('description'),
            'active_nodes'              :   $.nr_active_nodes, 
            'max_upload_size_byte'      :   max_upload_size,
            'max_upload_size_readable'  :   node_modules.filesize(max_upload_size),
            'nr_includes_url'           :   nr_includes_url,
            'nr_home_url'               :   nr_home_url,
            'nr_installed'              :   nr_db_config,
            'component'                 :   'NodeReactorInstaller',
            'nr_installed'              :   nr_db_config ? true : false,
            'current_user'              :   usr,
            'time_zone'                 :   zz
        }
    }
    
    if(nr_db_config)
    {
        var pth=$._POST['pathname'] || '';

        if(pth.indexOf('/nr-admin')===0)
        {
            resp.nr_configs.component= $.is_user_logged_in() ? 'InitAdmin' : 'LoginRegistration';
        }
        else
        {
            resp.nr_configs.component='InitFrontend';
        }
    }

    $.exit(resp);
}