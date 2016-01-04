var Q = require("q");
var glob = require("glob");

function filesFromGlob( pattern ){
	var deferred = Q.defer();
	glob(pattern,{},function(err,files){
		if( err ) deferred.reject( err );
		else deferred.resolve( files );
	});
	return deferred.promise;
}

function filesFromPatterns( patterns ){
	var promises = [ ];
	var allPromise;
	for( var i = 0; i < patterns.length; i++ ){
		promises.push( filesFromGlob( patterns[i] ) );
	}
	allPromise = Q.all( promises );
	return allPromise;
}

module.exports = filesFromPatterns;