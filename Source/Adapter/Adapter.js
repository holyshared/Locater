/*
---
name: Locater.Adapter

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Object
  - Core/Function
  - Core/Class
  - Core/Options
  - Locater/Locater

provides: [Locater.Adapter, Locater.Geolocation]

...
*/

(function(Locater){

var Geolocation = Locater.Geolocation = new Class({

	options: {
		enableHighAccuracy: true,
		timeout: 10000,
		maximumAge: 0
	},

	_getWatchID: function(){
		return this._watchID;
	}.protect(),

	_setWatchID: function(watchID){
		this._watchID = watchID;
	}.protect(),

	_getGeolocation: function(){
		return navigator.geolocation;
	}.protect(),

	isWatching: function(){
		return (this._getWatchID() != null);
	}

});


var Adapter = Locater.Adapter = {

	create: function(name, options){
		if (!this[name]) throw new Error('It tries to make an invalid adaptor.');
		return new this[name](options);
	} //,

//	isAdapter: function(adapter){
//		return (Type.isFunction(adapter.start) && Type.isFunction(adapter.stop));
//	}

};

}(Locater));