/*
---
name: Locater.Adapter

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Object
  - Locater/Locater

provides: [Locater.Adapter, Locater.DefaultAdapter]

...
*/

(function($, Locater){

Locater.Adapter = new Class({

	Implements: [Options, Events],

	options: {
		enableHighAccuracy: true,
		timeout: 10000,
		maximumAge: 0,
		currentHandler: null,
		watchHandler: null,
		errorHandler: null
	},

	//protected properties
	_watchID: null,

	initialize: function(options){
		this.setOptions(options);
	},

	//abstract methods
	start: function(){},
	stop: function(){},
	getWatchID: function(){},
	isWatching: function(){}

});


Locater.DefaultAdapter = new Class({

	Extends: Locater.Adapter,

	//protected properties
	_gps: null,

	initialize: function(options){
		this.parent(options);
		this._gps = navigator.geolocation;
	},

	start: function(){
		if (this._gps) {
			var opts = this.options;
			var watchOpts = Object.subset(opts, ['enableHighAccuracy', 'timeout', 'maximumAge']);
			this._gps.getCurrentPosition(opts.currentHandler, opts.errorHandler);
			this._setWatchID(this._gps.watchPosition(opts.watchHandler, opts.errorHandler));
		} else {
			//error('not supported');
		}
	},

	stop: function(){
		this._gps.clearWatch(this._getWatchID());
	},

	_getWatchID: function(){
		return this._watchID;
	}.protect(),

	_setWatchID: function(){
		return this._watchID;
	}.protect(),

	isWatching: function(){
		return (this._getWatchID() == null);
	}

});

}(document.id, Locater));