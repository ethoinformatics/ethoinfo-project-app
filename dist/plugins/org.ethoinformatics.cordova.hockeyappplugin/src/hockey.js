module.exports.configure = function(opt, cb) {
	function onSucess(){
		if (typeof cb == 'function') cb();
	}

	function onError(err){
		window.alert('error');
		if (typeof cb == 'function')
			cb(err);
		else 
			console.error(err);
	}


	if (!opt || !opt.appId){
		return onError(new Error('appId is required'));
	}

	cordova.exec(onSucess, onError, 'HockeyAppPlugin', 'configure', [opt.appId]);
};

