var fs = require("fs");
var Q = require("q");
var path = require("path");
var readFile = Q.denodeify( fs.readFile );

function read( _path ){
	var deferred = Q.defer();
	fs.readFile( _path,"UTF-8",function(err,contents){
		if( err ) deferred.reject( err );
		else{
			var data = { };
			var filename = path.basename( _path );
			data[filename] = { };
			data[filename].content = contents;
			deferred.resolve( data );
		}
	});
	return deferred.promise;
}

function files( paths ){
	var promises = [ ];
	var allPromise;
	for( var i = 0; i < paths.length; i++ ){
		promises.push( read(paths[i]) );
	}
	allPromise = Q.all( promises );
	return allPromise;
}

module.exports = files;