global.trim=function  (s, c) 
{
  	if (c === "]") c = "\\]";
		if (c === "\\") c = "\\\\";

		s=s.toString();

  	return s.replace(new RegExp("^[" + c + "]+|[" + c + "]+$", "g"), "");
}

global.is_numeric=function(obj) 
{
	var type = typeof obj;
	return ( type === "number" || type === "string" ) && !isNaN( obj - parseFloat( obj ) );
};