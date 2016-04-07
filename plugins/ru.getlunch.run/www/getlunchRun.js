/**
	ru.getlunch.run
	https://github.com/PavelDubrovskiy/ru.getlunch.run.git
	
	Cordova plugin for GetLunch.
*/

var exec = require('cordova/exec');

module.exports = {
	/** 
	 * Start Yandex Navigator
	 *
	 * @param {object} Coords
	 * @param {Function} completeCallback   The callback that is called when open Yandex Navigator
	 * @param {Function} errorCallback      The callback that is called when an error occurred when the program starts.
	 */
	yandexnavi: function(coords, completeCallback, errorCallback) {
		exec(completeCallback, errorCallback, "getlunchRun", "yandexnavi", [JSON.stringify(coords)])
	}
}
