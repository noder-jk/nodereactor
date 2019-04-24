global.array_chunk=function (arr, chunkLen)
{
    var chunkList = []
    var chunkCount = Math.ceil(arr.length/chunkLen)
    for(var i = 0; i < chunkCount; i++)
	{
        chunkList.push(arr.splice(0, chunkLen));
    }
    return chunkList;
}