/////////////////////////////////
//
// ethoinfo-project-app/src/background-mode.js
//
// Enables backgroundMode plugin
//
/////////////////////////////////


function onDeviceReady(){
	console.log("background-mode onDeviceReady");
	cordova.plugins.backgroundMode.setDefaults({ text:'Ethoinformatics is still running'});
	cordova.plugins.backgroundMode.enable();
}

window.document.addEventListener("deviceready", onDeviceReady, false);
