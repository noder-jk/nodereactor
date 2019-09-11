global.trim=function  (s, c) 
{
  	c === "]" ? c = "\\]" : 0;
	c === "\\" ? c = "\\\\" : 0;

	s=s ? s.toString() : '';

  	return s.replace(new RegExp("^[" + c + "]+|[" + c + "]+$", "g"), "");
}