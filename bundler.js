var fs = require('fs'),
	resolve = require('resolve'),
	mkdirp = require('mkdirp'),
	path = require('path'),
	browserify = require('browserify'),
	lessify = require('node-lessify'),
	vashify = require('vashify');

mkdirp.sync(__dirname + '/ionic/www/bundles');

resolve('ethoinfo-framework', function(err, loc){
	if (err) throw err;

	var appBundleLocation = path.join(path.dirname(loc), 'ionic', 'www', 'bundles', 'app.js');
	var b = browserify();
	b.transform(lessify); // builds and applies css from .less files
	b.transform(vashify); // compiles .vash files in to js template functions


	b.require('./index.js', {expose: 'app'});
	var bundle = b.bundle();
	
		
	bundle.on('error', function(err){ console.dir(err); });
	bundle.pipe(fs.createWriteStream(appBundleLocation));
});



