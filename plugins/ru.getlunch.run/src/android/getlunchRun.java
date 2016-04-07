/**
	ru.getlunch.run
	https://github.com/PavelDubrovskiy/ru.getlunch.run
	
	Cordova plugin for GetLunch).
	bug tracker: https://github.com/PavelDubrovskiy/ru.getlunch.run/issues
*/
package ru.getlunch.run;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import android.content.Context;
import android.content.Intent;
import android.content.ComponentName;
import android.content.pm.PackageManager;
import java.util.Iterator;
import android.net.Uri;
public class getlunchRun extends CordovaPlugin {

    /**
     * Constructor.
     */
    public getlunchRun() { }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArray of arguments for the plugin.
     * @param callbackContext   The callback context used when calling back into JavaScript.
     * @return                  True when the action was valid, false otherwise.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		if(action.equals("yandexnavi")) {
			this.yandexnavi(args.getString(0), callbackContext);
		}
		
		return true;
    }

	public void yandexnavi(String coords, CallbackContext callback) {
		try {
			JSONObject coordsJson = new JSONObject(coords);
			Intent yIntent = new Intent("ru.yandex.yandexnavi.action.BUILD_ROUTE_ON_MAP");
			yIntent.setPackage("ru.yandex.yandexnavi");
			
			PackageManager pm = this.cordova.getActivity().getApplicationContext().getPackageManager();
			
			// Проверяем, установлен ли Яндекс.Навигатор
			if (pm.queryIntentActivities(yIntent, 0) == null || pm.queryIntentActivities(yIntent, 0).size() == 0) {
				// Если нет - будем открывать страничку Навигатора в Google Play
				yIntent = new Intent("android.intent.action.ACTION_VIEW");
				yIntent.setData(Uri.parse("market://details?id=ru.yandex.yandexnavi"));
			} else {
				yIntent.putExtra("lat_from", (Double)coordsJson.get("lat_from"));
				yIntent.putExtra("lon_from", (Double)coordsJson.get("lon_from"));
				yIntent.putExtra("lat_to", (Double)coordsJson.get("lat_to"));
				yIntent.putExtra("lon_to", (Double)coordsJson.get("lon_to"));
			}
			this.cordova.getActivity().startActivity(yIntent);
			callback.success();
		} catch (Exception e) {
			callback.error(e.toString());
		}
	}

}