var prompt = require("prompt");
var Q = require("q");

var schema = {
	properties : {
		username : {
			required : true
		},
		password : {
			required : true,
			hidden : true
		}
	}
};

function login(){
	var deferred = Q.defer();
	prompt.start();
	prompt.get( schema,function(err,result){
		if( err ) deferred.reject( err );
		deferred.resolve( result );
	});
	return deferred.promise;
}

module.exports = login;