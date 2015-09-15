module.exports.configure = function(opt, cb) {
	function onSucess(){
		if (typeof cb == 'function') cb();
	}

	function onError(err){
		window.alert('hockey app plugin error');
		window.alert('error: ' + err.toString());
		console.error(err);

		if (typeof cb == 'function')
			cb(err);
	}


	if (!opt || !opt.appId){
		return onError(new Error('appId is required'));
	}

	cordova.exec(onSucess, onError, 'HockeyAppPlugin', 'configure', [opt.appId]);
};

