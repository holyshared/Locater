/*
---
name: Locater.Adapter

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Object
  - Core/Class
  - Core/Options
  - Core/Events
  - Core/Function
  - Locater/Locater

provides: [Locater.Adapter, Locater.Geolocation, Locater.Adapter.CurrentPositionAdapter, Locater.Adapter.WatchPositionAdapter]

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
	}

};

Adapter.CurrentPositionAdapter = new Class({

	Implements: [Geolocation, Options],

	options: {
		currentHandler: null,
		errorHandler: null
	},

	initialize: function(options){
		this.setOptions(options);
	},

	start: function(){
		var gps = this._getGeolocation();
		if (!gps){
			throw new Error('Geolocation API is not supported.');
		}

		var opts = this.options;
		var watchOpts = Object.subset(opts, ['enableHighAccuracy', 'timeout', 'maximumAge']);
		if (opts.currentHandler == null) {
			throw new Error('Please specify either currentHandler.');
		}
		gps.getCurrentPosition(opts.currentHandler, opts.errorHandler, watchOpts);
		this._setWatchID(true);
	},

	stop: function(){
		this._setWatchID(null);
	}

});


Adapter.WatchPositionAdapter = new Class({

	Implements: [Geolocation, Options],

	options: {
		watchHandler: null,
		errorHandler: null
	},

	initialize: function(options){
		this.setOptions(options);
	},

	start: function(){
		var gps = this._getGeolocation();
		if (!gps){
			throw new Error('Geolocation API is not supported.');
		}

		var opts = this.options;
		var watchOpts = Object.subset(opts, ['enableHighAccuracy', 'timeout', 'maximumAge']);
		if (opts.watchHandler == null) {
			throw new Error('Please specify either watchHandler.');
		} else if (opts.watchHandler){
			this._setWatchID(gps.watchPosition(opts.watchHandler, opts.errorHandler));
		}
	},

	stop: function(){
		var gps = this._getGeolocation();
		gps.clearWatch(this._getWatchID());
		this._setWatchID(null);
	}

});

}(Locater));