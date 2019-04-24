
const array_pull_up=(ar, n, ret_ind)=>
{
    let new_ind=false;

    if(n>0)
    {
        let new_ar=[];

        new_ar=new_ar.concat(ar.slice(0, n-1));
        
        new_ar.push(ar[n]); // queue argument index

        new_ind=new_ar.length-1;

        new_ar.push(ar[n-1]);
        
        if(ar[n+1])
        {
            new_ar=new_ar.concat(ar.slice(n+1));
        }

        ar=new_ar;
    }
    
    return ret_ind ? [ar, new_ind] : ar;
}

const array_pull_down=(ar, n, ret)=>
{
    let new_ind=false;

    if(ar[n+1])
    {
        let new_ar=[];

        new_ar=new_ar.concat(ar.slice(0, n));
        
        new_ar.push(ar[n+1]);
        new_ar.push(ar[n]); // queue argument index
        
        new_ind=new_ar.length-1;

        if(ar[n+2])
        {
            new_ar=new_ar.concat(ar.slice(n+2));
        }

        ar=new_ar;
    }

    return ret ? [ar, new_ind] : ar;
}

export {array_pull_down, array_pull_up}