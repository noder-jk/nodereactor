const mods=
[
    'wp/hook/manager.njs',
    'wp/dashboard.njs',
    'wp/sidebar.njs',
    'wp/menu.njs',
    'php/cookie.njs',
    'php/session.njs',
    'wp/option.njs',
    'wp/user.njs',
    'php/response.njs',
    'wp/taxonomy/terms.njs',
    'nr/helper.njs',

    'wp/post/permalink.njs',
    'wp/post/post.njs',
    'wp/post/media.njs',
    'wp/post/meta.njs',
    'wp/post/pagination.njs',
];

var nr_funcs={};

// Loop through all files and collect methods
mods.forEach(element => 
{
    var m=require(normalize_path(nr_models+element));

    for(var k in m)
    {
        typeof m[k]=='function' ? nr_funcs[k]=m[k] : 0;
    }
});

module.exports=nr_funcs;