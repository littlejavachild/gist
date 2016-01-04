var Q = require("q");
var stdin = process.stdin;
var inputchunks = [ ];

stdin.setEncoding("UTF-8");

function read(  ){
	var deferred = Q.defer();
	
	stdin.on("data",function(chunk){
		inputchunks.push( chunk );
	});

	stdin.on("end",function(){
		deferred.resolve( inputchunks.join(" ") );
	});

	return deferred.promise;
}

module.exports = read;