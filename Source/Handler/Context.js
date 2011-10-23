/*
---
name: Locater.Handler.Context

description: Context of event handler.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Object
  - Core/Function
  - Core/Type
  - Locater/Locater
  - Locater/Locater.Handler

provides: [Locater.Handler.Context]

...
*/

(function(Handler){

/**
 * Coordinates interface
 * @see: http://dev.w3.org/geo/api/spec-source.html
 */
var defaultContext = {
	latitude: 0, //double
	longitude: 0, //double
	altitude: 0, //double
	accuracy: 0, //double
	altitudeAccuracy: 0, //double
	heading: 0, //double
	speed: 0 //double
};

function __toGetterMethodName(name){
	var first = name.charAt(0).toUpperCase();
	var other = name.substr(1, name.length);
	var getter = 'get' + first + other;
	return getter;
}

Handler.Context = function(props){
	var params = {};
	var keys = Object.keys(defaultContext);
	var context = Object.subset(props, keys);
	Object.each(defaultContext, function(value, key){
		params[key] = context[key] || value;
	});
	for (var key in params){
		var getter = __toGetterMethodName(key);
		this[getter] = Function.from(params[key]);
	}
	return this;
};

Handler.Context.implement({

	toString: function(){
		var tokens = [];
		for (var key in defaultContext){
			var getter = __toGetterMethodName(key);
			var value = this[getter]();
			if (Type.isObject(value)) {
				if (Type.isFunction(value.toString)) {
					value = value.toString();
				} else {
					continue;
				}
			}
			tokens.push(key + '=' + value);
		}
		return tokens.join(' ');
	}

});

}(Locater.Handler));