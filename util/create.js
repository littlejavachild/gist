var request = require("request");
var Q = require("q");
var login = require("./login.js");
var parse = require("./parse.js");

function create( username,password,gist ){
	var deferred = Q.defer();
	var auth = {  };
	var options = {  };  

	if( username && password ){
		auth.user = username;
		auth.pass = password;
		options.auth = auth;
	}
	
	options.headers = {
		"Accept" : "application/vnd.github.v3+json",
		"User-Agent" : "gist"
	};
	
	options.json  = gist;
	options.method = "POST"
	options.url = "https://api.github.com/gists";

	request(options,function onGistCreated(err,res,body){
		if(err){
			deferred.reject( err );
		}else{
			if(res.statusCode == 201){
				deferred.resolve( parse(auth,body) );
			}else{
				deferred.reject(body);
			}
		}
	});

	return deferred.promise;
}

module.exports = function( payload ){
	if( payload.login ){
		return login().then(function(auth){
			return create(auth.username,auth.password,payload.gist);
		});
	}else{
		return create(null,null,payload.gist);
	}
}