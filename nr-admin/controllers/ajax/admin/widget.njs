module.exports.get=function($) 
{
    widgets_init
    (
        $,
        function($)
        {
            var resp={}
            
            resp.widgets=$.nr_widgets_runtime;
            resp.sidebars=$.nr_registered_sidebar;
            resp.widget_in_sidebar=$.nr_widget_linked_to_sidebar;

            $.echo(resp);
            exit($);
        }
    );
}

module.exports.save=function($)
{
    var fields=$._POST;

    if(typeof fields.widget_and_areas=='object')
    {
        var w=fields.widget_and_areas;

        $.add_option({'area_widget_linking':w}, $.nr_active_theme);
    }
    
    exit($);
}