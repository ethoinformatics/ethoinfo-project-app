function onDeviceReady(){
	window.hockeyApp.configure({
		appId: process.env.HOCKEY_APP_ID
	});
}

window.document.addEventListener("deviceready", onDeviceReady, false);
