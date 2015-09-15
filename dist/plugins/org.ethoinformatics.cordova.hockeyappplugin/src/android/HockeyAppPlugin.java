package org.ethoinformatics.cordova.hockeyappplugin;

import net.hockeyapp.android.CrashManager;
import net.hockeyapp.android.UpdateManager;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import android.util.Log;

public class HockeyAppPlugin extends CordovaPlugin {
	protected static final String LOG_TAG = "HockeyAppPlugin";
	String _hockeyAppId = "HOCKEY_APP_KEY";

	@Override
	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		super.initialize(cordova, webView);
		Log.d(LOG_TAG, "HockeyApp Plugin initialized");
	}
	
	@Override
	public void onResume(boolean multitasking) {
		Log.d(LOG_TAG, "HockeyApp Plugin resuming");
	  _checkForUpdates();
		super.onResume(multitasking);
	}
	
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		if (action.equalsIgnoreCase("configure")){
			_hockeyAppId = args.getString(0);

		 	_checkForCrashes();
		 	_checkForUpdates(); 

		 	return true;
		}

		callbackContext.error(LOG_TAG + " hello ERROR: invalid action (" + action + ")");
		return false;
	}
		
	@Override
	public void onDestroy() {
		Log.d(LOG_TAG, "HockeyApp Plugin destroying");
		super.onDestroy();
	}

	@Override
	public void onReset() {
		Log.d(LOG_TAG, "HockeyApp Plugin onReset--WebView has navigated to new page or refreshed.");
		super.onReset();
	}

	private boolean _isAppIdSet(){
		return _hockeyAppId!=null && !_hockeyAppId.equals("") && !_hockeyAppId.contains("HOCKEY_APP_KEY");
	}
	
	protected void _checkForCrashes() {
		Log.d(LOG_TAG, "HockeyApp Plugin checking for crashes");
		
		if(_isAppIdSet()){
			CrashManager.register(cordova.getActivity(), _hockeyAppId);
		}
	}

	protected void _checkForUpdates() {
		// Remove this for store builds!
		//__HOCKEY_APP_UPDATE_ACTIVE_START__
		Log.d(LOG_TAG, "HockeyApp Plugin checking for updates");
		if(_isAppIdSet()){
			UpdateManager.register(cordova.getActivity(), _hockeyAppId);
		}
		//__HOCKEY_APP_UPDATE_ACTIVE_END__
	}
}
