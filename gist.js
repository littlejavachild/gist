var minimist = require("minimist");
var chalk = require("chalk");
var Q = require("q");

var globby = require("./util/globby.js");
var readFiles = require("./util/files.js");
var create = require("./util/create.js");
var stdin = require("./util/stdin.js");
var update = require("./util/update.js");

var FLAG_LOGIN = "L";
var FLAG_FILE  = "f";
var FLAG_DESCRIPTION = "d";
var FLAG_PRIVATE = "p";
var FLAG_PASTE = "P";
var FLAG_NAME = "n";
var FLAG_STDIN = "s"
var FLAG_VERSION = "V";
var FLAG_UPDATE = "u";

var minimistOpts = {
	boolean : [
		FLAG_LOGIN, 
		FLAG_FILE, 
		FLAG_PRIVATE,
		FLAG_PASTE,
		FLAG_STDIN, 
		FLAG_VERSION
	],
	string : [
		FLAG_DESCRIPTION, 
		FLAG_NAME,
		FLAG_UPDATE
	]
};

var argv = minimist( process.argv.slice(2),minimistOpts );

//------------------------------------------------------------------------------
if( argv[FLAG_VERSION] ){
	// gist -V
	prSuccess( "gist version " + require("./package.json").version );
}else if( argv[FLAG_STDIN] ){
	// gist -n file.txt < ~/somefile.txt
	stdin()
	.then( saveToArgv,prError )
	.then( getContentObject, prError )
	.then( addContentToGistObject,prError )
	.then( addDescription,prError )
	.then( makePrivate,prError )
	.then( preCreate,prError )
	.then( createOrUpdate,prError )
	.then( prSuccess,prError )
	.done()
}else if( argv[FLAG_FILE] ){
	// gist file1.txt file2.txt *.html
	globby( argv._ )
	.then( flatten,prError )
	.then( readFiles,prError )
	.then( addFilesToGistObject, prError )
	.then( addDescription, prError )
	.then( makePrivate,prError )
	.then( preCreate,prError )
	.then( createOrUpdate,prError )
	.then( prSuccess,prError )
	.done();
}else{
	// gist -n file1.txt -d description this is some text for the gist
	Q.fcall( getContentObject )
	.then( addContentToGistObject,prError )
	.then( addDescription,prError )
	.then( makePrivate,prError )
	.then( preCreate,prError )
	.then( createOrUpdate,prError )
	.then( prSuccess,prError )
	.done()
}
//------------------------------------------------------------------------------
function saveToArgv( data ){
	argv._ = [ data ];
}
//------------------------------------------------------------------------------
function prSuccess( success ){
	console.log( chalk.green( success ) );
}
//------------------------------------------------------------------------------
function prError( err ){
	var string;
	// filtering out errors
	string =
		err instanceof String ? err : err.message ? err.message : JSON.stringify(err);
	console.log( err ? chalk.red(string) : chalk.red("Something went wrong!") );
	process.exit( 1 );
}
//------------------------------------------------------------------------------
// http://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
function flatten( array ){
	return [].concat.apply([],array);
}
//------------------------------------------------------------------------------
function getContentObject(){
	var content = { };
	content.filename = argv[FLAG_NAME];
	content.content = argv._.join(" ");
	return content;
}
//------------------------------------------------------------------------------
function addContentToGistObject( content ){
	var gist = { };
	gist.files = { };
	var filename = content.filename;
	gist.files[filename] = { };
	gist.files[filename].content = content.content;
	return gist;
}
//------------------------------------------------------------------------------
function addFilesToGistObject( files ){
	var gist = { };
	gist.files = { };
	for( var i = 0; i < files.length; i++ ){
		var file = files[i];
		for( var filename in file ){
			gist.files[ filename ] = file[ filename ];
		}
	}
	return gist;
}
//------------------------------------------------------------------------------
function addDescription( gist ){
	if( argv[FLAG_DESCRIPTION] )
		gist.description = argv[FLAG_DESCRIPTION];
	return gist;
}
//------------------------------------------------------------------------------
function makePrivate( gist ){
	gist.public = argv[FLAG_PRIVATE] ? false : true;
	return gist;
}
//------------------------------------------------------------------------------
function preCreate( gist ){
	var payload = { };
	payload.gist = gist;
	payload.login = argv[FLAG_LOGIN];
	return payload;
}
//------------------------------------------------------------------------------
function createOrUpdate( payload ){
	if( argv[FLAG_UPDATE] ){
		payload.id = argv[FLAG_UPDATE];
		return update( payload );
	}else{
		return create( payload );
	}
}
//------------------------------------------------------------------------------