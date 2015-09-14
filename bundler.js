var fs = require('fs'),
	browserify = require('browserify');

var b = browserify();

b.on('error', function(err){
	console.error(err);
});

b.add('./src/index.js');
var bundle = b.bundle();

bundle.on('error', function(err){ 
	console.log('there was an error while creating bundle.js');
	console.dir(err); 
});

bundle.pipe(fs.createWriteStream(__dirname+'/dist/www/bundle.js'));



