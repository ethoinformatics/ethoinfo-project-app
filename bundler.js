var fs = require('fs'),
	browserify = require('browserify');

var b = browserify();

b.on('error', function(err){
	console.error(err);
});

b.add('./index.js');
var bundle = b.bundle();

	
bundle.on('error', function(err){ console.dir(err); });
bundle.pipe(fs.createWriteStream('bundle.js'));



