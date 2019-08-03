import React from 'react';

const List=(props)=>
{
    let {taxonomies, st_posts, toggleCheck}=props;

    return <table className="table table-bordered">
        <thead>
            <tr>
                <th></th>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>

                {taxonomies.map(t=><th key={t}>{t}</th>)}

                <th>Posted</th>
            </tr>
        </thead>
        <tbody>
            {
                st_posts.map(item=>
                {
                    return(
                        <tr key={item.post_id}>
                            <td><input type="checkbox" defaultChecked={item.checked_input} onChange={(e)=>toggleCheck(e, item.post_id)}/></td>
                            <td>
                                <p>{'-'.repeat(item.nest_level)}{item.post_title}</p>
                                <a href={item.post_url} className="text-info">View</a> - <a className="text-info" href={item.post_edit_link}>Edit</a>
                            </td>
                            <td>{item.display_name}</td>
                            <td>{item.post_status}</td>
                            {
                                taxonomies.map(t=><td key={t}>{(item.terms && item.terms[t]) ? item.terms[t].join(', ') : null}</td>)
                            }
                            <td>{item.post_date}</td>
                        </tr>
                    )
                })
            }
        </tbody>
    </table>
}

export {List}