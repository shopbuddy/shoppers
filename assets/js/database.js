/**
 * [DB interation with localstorage in more abstracted way]
 */
var DB = function() {};

DB.prototype.get = function (key) {
	return JSON.parse(localStorage.getItem(key));
}

DB.prototype.set = function (key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

DB.prototype.remove = function (key) {
	localStorage.removeItem(key);
}