function onDeviceReady(){
	cordova.plugins.backgroundMode.setDefaults({ text:'Ethoinformatics is still running'});
	cordova.plugins.backgroundMode.enable();

}

window.document.addEventListener("deviceready", onDeviceReady, false);
