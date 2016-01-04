var request = require("request");
var Q = require("q");
var login = require("./login.js");
var parse = require("./parse.js");

function update( username,password,gist,id ){
	var deferred = Q.defer();
	var auth = {  };
	var options = {  };  

	if( username && password ){
		auth.user = username;
		auth.pass = password;
		options.auth = auth;
	}else{
		deferred.reject( "Updating a gist needs login" );
		return;
	}
	
	if( !id ){
		deferred.reject( "Missing gist ID" );
		return;
	}

	options.headers = {
		"Accept" : "application/vnd.github.v3+json",
		"User-Agent" : "gist"
	};
	

	options.json  = gist;
	options.method = "PATCH"
	options.url = "https://api.github.com/gists/" + id;

	request(options,function onGistUpdated(err,res,body){
		if(err){
			deferred.reject( err );
		}else{
			if(res.statusCode == 200){
				deferred.resolve( parse(auth,body) );
			}else{
				deferred.reject( body );
			}
		}
	});

	return deferred.promise;
}

module.exports = function( payload ){
	return login().then(function(auth){
		return update(auth.username,auth.password,payload.gist,payload.id);
	});
}