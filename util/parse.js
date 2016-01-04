function parse(auth,body){
	var base = "https://gist.github.com/";
	
	if( auth.user && auth.pass ) 
		base += auth.user + "/";
	else
		base += "anonymous" + "/";

	base += body.id;
	return base;
}

module.exports = parse;