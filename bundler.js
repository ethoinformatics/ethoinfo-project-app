var fs = require('fs'),
	browserify = require('browserify'),
	envify = require('envify');

var b = browserify();
b.transform(envify);

b.on('error', function(err){
	console.error(err);
});

var bundle = b.bundle();

b.add('./src/index.js');

bundle.on('error', function(err){ 
	console.log('there was an error while creating bundle.js');
	console.dir(err); 
});

bundle.pipe(fs.createWriteStream(__dirname+'/dist/www/bundle.js'));



