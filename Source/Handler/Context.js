/*
---
name: Locater.Handler.Context

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Object
  - Core/Function
  - Locater/Locater
  - Locater/Locater.Handler

provides: [Locater.Handler.Context]

...
*/

(function(handler){

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

handler.Context = function(props){
	var params = Object.merge(defaultContext, props);
	var context = {};
	for (var key in params){
		var first = key.charAt(0).toUpperCase();
		var other = key.substr(1, key.length);
		var getter = 'get' + first + other;
		context[getter] = Function.from(params[key]);
	}
	return context;
};

}(Locater.Handler));