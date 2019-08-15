import React, {Component} from "react";
import ReactDOMServer from 'react-dom/server';
import Swal from 'sweetalert2';
import jQuery from 'jquery';
import Spinner from 'react-svg-spinner';

import {Media,RenderMediaFile} from 'nodereactor/react';

import tnn from 'nodereactor/nr-includes/tinymce-4.9.3/tinymce.min.js';


class Editor extends Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            'editor_id': Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), 
            'media':null,
            'loading':false,
            'media_open':false
        }

        
        this.openMedia=this.openMedia.bind(this);
        this.mediaClose=this.mediaClose.bind(this);
        this.getResult=this.getResult.bind(this);
    }

    componentDidMount()
    {
        if(typeof tnn=='function')
        {
            tnn(window.nr_configs.nr_home_url);
        }

        const {editor_id}=this.state;
        const {get_input_by=false}=this.props;

        let nr_tyni_fullscreen=false;
        
        this.setState({'loading':true});

        /* Initialize html editor when tinymce object is available. */
        
        window.tinyMCE.init
        ({
            /* replace textarea having class .tinymce with tinymce editor */
            selector:  '#'+editor_id,
            removed_menuitems: 'newdocument',
            media_live_embeds: true,
            convert_urls: false,
            branding: false,
            setup:(editor)=> 
            { 
                editor.on('change',()=>
                {
                    if(typeof get_input_by=='function')
                    {
                        get_input_by(editor.getContent())
                    }
                });
                
                editor.on('FullscreenStateChanged', ()=>
                {
                    if(nr_tyni_fullscreen==false)
                    {
                        jQuery('main').css('z-index',103);
                        nr_tyni_fullscreen=true;
                    }
                    else
                    {
                        jQuery('main').css('z-index',100);
                        nr_tyni_fullscreen=false;
                    }
                });

                editor.on('init', ()=>
                {
                    this.setState({'loading':false});
                });
            },
            
            init_instance_callback: (editor)=> 
            {
                editor.on('PastePreProcess',(e)=> 
                {
                    let pattern={};
                    pattern.youtube= /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
                    
                    let str=e.content.trim();
                    
                    let r = str.match(pattern.youtube);
                    if(r && r[1])
                    {
                        e.content = '<iframe width="560" height="315" src="https://www.youtube.com/embed/'+r[1]+'" frameborder="0" allowfullscreen></iframe>';
                    }
                });
            },
            
            /* width and height of the editor */
            width: "100%",
            height: 300,
            
            /* display statusbar */
            statubar: true,

            /* plugin */
            plugins: 
            [
                "advlist autolink link lists charmap hr anchor pagebreak code",
                "searchreplace visualblocks visualchars wordcount code fullscreen insertdatetime nonbreaking",
                "table contextmenu directionality template paste textcolor"
            ],

            /* toolbar */
            toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | fullpage | forecolor backcolor | code",


            /* style */
            style_formats: 
            [
                {
                    title: "Headers", items: 
                    [
                        {title: "Header 1", format: "h1"},
                        {title: "Header 2", format: "h2"},
                        {title: "Header 3", format: "h3"},
                        {title: "Header 4", format: "h4"},
                        {title: "Header 5", format: "h5"},
                        {title: "Header 6", format: "h6"}
                    ]
                },
                {
                    title: "Inline", items: 
                    [
                        {title: "Bold", icon: "bold", format: "bold"},
                        {title: "Italic", icon: "italic", format: "italic"},
                        {title: "Underline", icon: "underline", format: "underline"},
                        {title: "Strikethrough", icon: "strikethrough", format: "strikethrough"},
                        {title: "Superscript", icon: "superscript", format: "superscript"},
                        {title: "Subscript", icon: "subscript", format: "subscript"},
                        {title: "Code", icon: "code", format: "code"}
                    ]
                },
                {
                    title: "Blocks", items: 
                    [
                        {title: "Paragraph", format: "p"},
                        {title: "Blockquote", format: "blockquote"},
                        {title: "Div", format: "div"},
                        {title: "Pre", format: "pre"}
                    ]
                },
                {
                    title: "Alignment", items: 
                    [
                        {title: "Left", icon: "alignleft", format: "alignleft"},
                        {title: "Center", icon: "aligncenter", format: "aligncenter"},
                        {title: "Right", icon: "alignright", format: "alignright"},
                        {title: "Justify", icon: "alignjustify", format: "alignjustify"}
                    ]
                }
            ]
        });

        window.onbeforeunload=()=>
        {
            if(window.tinyMCE && window.tinyMCE.activeEditor && window.tinyMCE.activeEditor.isDirty())
            {
                return "Unsaved data may be lost. Sure to exit?";
            }
        }
    }

    getResult(results)
    {
        let media='';

        for(let i=0; i<results.length; i++)
        {
            let url=results[i].file_url;
            let ext=results[i].file_extension;
            let mime=results[i].mime_type;
            let attachment_id=results[i].post_id;
            
            media+=ReactDOMServer.renderToStaticMarkup(<RenderMediaFile url={url} mime={mime} extension={ext} attachmentId={attachment_id} linkIfNonMedia={true} style={{'maxWidth':'100%'}}/>);
        }

        let text_area=window.tinyMCE.get(this.state.editor_id);
        if(text_area)
        {
            text_area.execCommand('mceInsertContent', false, media);
        }
        else
        {
            Swal.fire('Something went wrong. Media file could not be inserted into editor. Cancel Media, and save the post. Then try again.');
        }
    }

    mediaClose()
    {
        this.setState({'media_open':false});
    }

    openMedia()
    {
        this.setState({'media_open':true});
    }

    render()
    {
        let {media_open, loading, editor_id}=this.state;

        let {defaultValue='', addMedia=true}=this.props;

        return(
            <div>
                {addMedia ? <button className="btn btn-secondary btn-sm mb-1" onClick={this.openMedia}>Add Media</button> : null}
                
                {(addMedia && media_open) ? <Media onClose={this.mediaClose} onResult={this.getResult} multiple={true}/> : null}
                
                {loading ? <span style={{'display':'inline-block', 'float':'right'}}><Spinner size="15px"/></span> : null}
                
                <textarea id={editor_id} className="form-control" defaultValue={defaultValue}></textarea>
            </div>
        )
    }
}

export {Editor}