import React, {Component} from "react";
import axios from 'axios';
import Spinner from "react-svg-spinner";
import Swal from 'sweetalert2';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';

import {ajax_url ,RenderMediaFile, Pagination, socket_channel} from 'nodereactor/react';

const FileDetails=(props)=>
{
    let {details_for=[], fileCount}=props;

    return <div className="media-sidebar visible">
        <div className="file_details"  className="attachment-details">	
            {
                (details_for==null || details_for.length==0) ? <span>{fileCount} files.</span> : null
            }

            {
                (details_for && details_for.length>1) ?
                <table className="table table-striped" style={{"background":"white"}}>
                    <tbody>
                        {
                            details_for.map(item=>
                            {
                                return (
                                    <tr key={item.post_name}>
                                        <td>
                                            <RenderMediaFile url={item.file_url} mime={item.mime_type} extension={item.file_extension} style={{'width':'40px'}}/>
                                        </td>
                                        <td>
                                            {item.post_title}{item.file_extension}
                                        </td>
                                    </tr>  
                                )
                            })
                        }
                    </tbody>
                </table> : null
            }

            {
                (details_for!==null && details_for[0]) ?
                <div className="attachment-info">
                    <p>
                        <b>{details_for[0].post_title}</b><br/>
                        <small>{details_for[0].post_date}</small><br/>
                        <small>Uploaded By {details_for[0].display_name}</small>
                    </p>
                
                    <p>{details_for[0].post_excerpt}</p>

                    <div dangerouslySetInnerHTML={{__html:details_for[0].post_content}}></div>
                    {details_for[0].file_size}
                    
                    <p>
                        <small>
                            <a href={details_for[0].edit_url} target="_blank">Edit Details</a> - <a href={details_for[0].file_url} target="_blank">Open in New Tab</a>
                        </small>
                    </p>
                </div> : null
            }
        </div>
    </div>
}

class Browser extends Component
{
    constructor(props)
    {
        super(props);

        let {multiple=false}=this.props;

        this.state=
        {
            'files':[], 
            'pagination':{}, 
            'selected':[], 
            'message':null, 
            'spinner':null, 
            'details_for':null, 
            'multiple':multiple,
            'keyword':'',
            'posts_per_page':30,
            'page':1
        }

        this.getMedia=this.getMedia.bind(this);

        this.fileClicked=this.fileClicked.bind(this);
        this.deleteFile=this.deleteFile.bind(this);
        this.handlePaginate=this.handlePaginate.bind(this);
        this.unSelectAll=this.unSelectAll.bind(this);
        this.storeFilterCriteria=this.storeFilterCriteria.bind(this);
    }

    unSelectAll()
    {
        this.setState({'selected':[], 'details_for':null});
    }

    fileClicked(e, index)
    {
        e.stopPropagation();

        let f= this.state.files[index] ? this.state.files[index] : null;

        let ob={};

        if(!e.ctrlKey || this.state.multiple==false)
        {
            /* If the click is without ctrl, then simply store the clicked file as selected */
            ob.selected=f ? [f] : [];
        }
        else
        {
            /* If it's ctrl clicked, then unselect if already selected. Or add to select if already not selected. */
            let s=this.state.selected;
            let new_s=[];

            let exist=false;

            for(let n=0; n<s.length; n++)
            {
                /* loops through already selected file and new array. if current loop file is the clicked then don't add to new array. If not found, then add to new array. */
                if(s[n].file_url!==f.file_url)
                {
                    new_s.push(s[n]);
                }
                else
                {
                    exist=true;
                }
            }

            if(!exist)
            {
                new_s.push(f);
            }

            ob.selected=new_s;
        }
        
        ob.details_for=ob.selected.length>0 ? ob.selected : null;

        this.setState(ob);

        let {onSelectChange=false}=this.props;
        if(typeof onSelectChange=='function')
        {
            onSelectChange(ob.selected);
        }
    }

    deleteFile()
    {
        let f=this.state.selected;
        if(f.length==0){return;}
        
        Swal.fire
        ({
            title: 'Sure to delete?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true
        }).then((result) => 
        {
            if(!result.value){return;}
            
            let post_ids=[];

            for(let i=0; i<f.length; i++)
            {
                post_ids.push(f[i].post_id);
            }

            axios({
                method:'post',
                url:ajax_url ,
                data:{'action':'nr_delete_media', 'post_id':post_ids}
            }).then(r=>
            {
                let files=this.state.selected;
                let new_ar=[];

                this.state.files.map(item=>
                {
                    let exist=false;
                    files.map(item2=>
                    {
                        if(item.post_id==item2.post_id)
                        {
                            exist=true;
                        }
                    })

                    if(!exist)
                    {
                        new_ar.push(item);
                    }
                })

                this.setState({'selected':[], 'files':new_ar});
                
            }).catch(r=>
            {
                Swal.fire('Request Error');
            })
        });
    }

    storeFilterCriteria(e)
    {
        let el=e.currentTarget;

        this.setState({[el.name]:el.value});
    }

    getMedia(page_num)
    {
        let {page, posts_per_page, keyword}=this.state;
        
        if(page_num)
        {
            page=page_num;

            if(this.page_number)
            {
                this.page_number.value=page;
            }
        }

        this.setState({'spinner':<Spinner size="15px"/>});

        let {accept=[]}=this.props;

        axios({
            method:'post',
            data:{'action':'nr_get_gallery', 'accept':JSON.stringify(accept), page, posts_per_page, keyword},
            url:ajax_url 
        }).then(r=>
        {
            let ob={}

            if(r.data && r.data.files && Array.isArray(r.data.files) && r.data.files.length>0)
            {
                ob.message=null;
                ob.files=r.data.files;
                ob.pagination=r.data.pagination;
            }
            else
            {
                ob.message=<span>No file</span>
                
            }
            ob.spinner=null;

            this.setState(ob);
            
        }).catch(r=>
        {
            this.setState({'spinner':null, 'message':<span>Request Error</span>});
        })
    }

    handlePaginate(e, page)
    {
        e.preventDefault();
        this.getMedia(page);
    }

    componentDidMount()
    {
        window.nr_socket_client.on('my_own_handler', (msg)=>
        {   
            
        });

        window.nr_socket_client.emit(socket_channel, {'action':'nr_test_socket', 'hi':'some dt'});

        this.getMedia();
    }


    render()
    {
        let flength=this.state.files ? this.state.files.length : 0;
        let cls='form-control form-control-sm float-left';
        let json={'right':'267px'}

        return <div className="attachment_browser" className="attachments-browser">
            <div className="attachments" style={json}>	
                <div style={json} className="file_option">
                    
                    <div className="d-inline-block form-group form-inline float-left mb-0" ref={(el)=>this.filter_container=el}>
                        <input name="keyword" type="text" placeholder="Search" onChange={this.storeFilterCriteria} defaultValue={this.state.keyword} className={cls} title="Keyword"/>
                        <input name="page" type="number" min="1" placeholder="Page Number" onChange={this.storeFilterCriteria} defaultValue={this.state.page} className={cls} ref={el=>this.page_number=el} title="Specific Page"/>
                        <input name="posts_per_page" type="number" min="1" placeholder="Files Per Page" onChange={this.storeFilterCriteria} defaultValue={this.state.posts_per_page} className={cls} title="File limit per page"/>
                        <button className="btn btn-sm btn-outline-secondary" title="Press to filter" onClick={()=>this.getMedia()}>Filter</button>
                    </div>

                    <span>
                        {this.state.selected.length>0 ? <FontAwesomeIcon icon={faTrash} onClick={this.deleteFile}/> : null}
                    </span>
                </div>
                <div className="attachment_gallery">
                    <div data-block="media" onClick={this.unSelectAll}>
                        {
                            this.state.files.map((item,index)=>
                            {
                                let s=this.state.selected;

                                let cls='';

                                for(let n=0; n<s.length; n++)
                                {
                                    if(s[n].file_url==item.file_url)
                                    {
                                        cls='data_file_selected';
                                        break;
                                    }
                                }
                                
                                return(
                                    <span key={item.real_path} data-element="file" onClick={(e)=>this.fileClicked(e, index)} className={cls}>
                                        <RenderMediaFile url={item.file_url} extension={item.file_extension} mime={item.mime_type} style={{"height":"140px"}}/>
                                        <small>{item.post_title}</small>
                                    </span>
                                )
                            })
                        }
                    </div>
                    
                    {this.state.spinner}

                    {this.state.message}
                </div>
                <div className="text-center mt-1 mb-1">
                    <Pagination pgn={this.state.pagination} activeClass="btn btn-outline-secondary btn-sm ml-1 mr-1" inactiveClass="btn btn-secondary btn-sm ml-1 mr-1" clickEvent={this.handlePaginate}/>
                </div>
            </div>
            <FileDetails details_for={this.state.details_for} fileCount={flength}/>
        </div>
    }
}

export {Browser}