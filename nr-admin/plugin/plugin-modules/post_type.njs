module.exports.run=function($,next)
{
    function reg_p_type($, next)
    {
        $.register_post_type
        ({
            'id':'post',
            "title":"Post",
            'show_in_feed':true,
            'icon':'faClipboardList'
        });

        $.register_post_type
        ({
            'id':'page',
            "title":"Page",
            'icon':'faBook',
            'hierarchical':true
        });

        $.register_post_type
        ({
            'id':'attachment',
            "title":"Attachment"
        });

        next($);
    }
    

    $.add_action('register_post_types', reg_p_type);
    
    next($);
}