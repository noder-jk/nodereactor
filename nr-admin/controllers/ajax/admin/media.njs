function move_to_uploads($, oldpath, new_path, fname, real_pth, m_callback)
{
	node_modules.fs.rename(oldpath, new_path, function(e)
    {
        if(e)
        {
            m_callback($);
            return;
        }
        
        get_available_slug($, {post_name:fname.toLowerCase()}, function($, got_slug)
        {
            var ttl =fname.trim();
            ttl =ttl.charAt(0).toUpperCase() + ttl.slice(1);
            
            var media_post=
            {
                action		: 'create',
                user_id		: get_current_user_id($),
                post_title	: ttl,
                post_name	: got_slug,
                post_type	: 'attachment',
                real_path	: real_pth,
                mime_type	: node_modules['mime-types'].lookup(node_modules.path.extname(real_pth))
            }
            
            nr_insert_post($, media_post, function($, attachment_id)
            {
                m_callback($, attachment_id);
            })
        });
    });
}

module.exports.upload=function($)
{
    if(!$._FILES.nr_media_file){exit($); return;}
    
    /* Firstly create year+month based directory if already not exist. */
    var d=new Date();
    var y=d.getFullYear()+'/';
    var m=d.getMonth()+1+'/';

    var only_dir=y+m;
    var file_dir=nr_uploads+only_dir;

    node_modules.fs.mkdir(file_dir, {recursive:true}, (err) => 
    {
        if(err)
        {
            exit($); 
            return;
        }

        var file=$._FILES.nr_media_file;
        
        var oldpath=file.path;
        
        /* Replace whiteSpace with hyphen. And get real file name with both of extension and name. */
        var filename=file.name.replace(/\s/g,'-');
        
        /* Get file extension. */
        var f=filename.split('.');
        var ext=f[f.length-1];
        
        /* Get file name without extension to check if already exist. */
        f.pop();
        var without_ext = f.join('.');

        var millisecond = new Date().getTime();
        var randomize=millisecond+'_'+node_modules.randomstring.generate({length: 6,charset: 'alphabetic'});
        
        var new_path    = file_dir+without_ext+'_'+randomize+'.'+ext;
        var fname       = without_ext;
        var real_pth    = only_dir+without_ext+'_'+randomize+'.'+ext;
        
        move_to_uploads($, oldpath, new_path,  fname, real_pth, function($, id)
        {
            exit($, {'insertId':id});
        });
    });
}


module.exports.gallery=function($)
{
    var extension=[];
    var mimes=[];
    
    /* Process if acceptable media type defined */
    if($._POST.accept)
    {
        try
        {
            var a=JSON.parse($._POST.accept);

            if(Array.isArray(a))
            {
                for(var i=0; i<a.length; i++)
                {
                    if(typeof a[i]=='string')
                    {
                        a[i].indexOf('/')>-1 ? mimes.push(a[i]) : extension.push('%'+a[i]);
                    }
                }
            }
        }
        catch(e)
        {

        }
    }
    
    
    var query_param=
    {
        'intersect'	    :   
        {
            'post_type':'attachment', 
            'real_path':
            {
                'values':extension,
                'operator':'LIKE'
            },
        }, 

        'unite'         :   {'mime_type':mimes},
        'posts_per_page':   $._POST['posts_per_page'] || 30, 
        'page'		    :   $._POST['page'] || 1,
        'keyword'       :   $._POST['keyword'] || ''
    }

    get_posts($, query_param, function($, r)
    {
        get_pagination($,query_param, function($, pgn)
        {
            var to_get=node_modules.deepcopy(r);
            
            var not_found=[];

            var media_files=r;

            /* Set general file data that doesn't need file access */
            for(var i=0; i<media_files.length; i++)
            {
                var f=media_files[i].real_path;
                f=f.split('/');
                f=f[f.length-1];
                
                media_files[i].file_name        = f;
                media_files[i].file_url         = nr_uploads_url+media_files[i].real_path;
                media_files[i].file_extension   = node_modules.path.extname(media_files[i].real_path);
                media_files[i].edit_url         = '/nr-admin/post/edit?id='+media_files[i].post_id;
                media_files[i].post_date        = nr_local_time($, r[i].post_date);
            }
            
            /* Now get files stats in asynchronous mode */
            var get_file_stats=($, next)=>
            {
                if(to_get.length==0)
                {
                    next($, next);
                    return;
                }

                var rpath       = to_get.shift();
                var real_path   = normalize_path(nr_uploads+rpath.real_path);

                node_modules.fs.stat(real_path, (e, stat)=>
                {
                    if(!e && stat.size)
                    {
                        media_files.map((item,index)=>
                        {
                            var pid=item.post_id;
                            pid==rpath.post_id ? media_files[index].file_size=node_modules.filesize(stat.size) : null;
                        });
                    }
                    else
                    {
                        not_found.push(rpath.post_id);
                    }

                    get_file_stats($, next)
                });
            }

            get_file_stats($, ()=>
            {
                var resp={'pagination':pgn, 'files':media_files};

                $=echo($, resp);
                
                exit($);
            });
        });
    });
}