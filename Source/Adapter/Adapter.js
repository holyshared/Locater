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

provides: [Locater.Adapter, Locater.DefaultAdapter]

...
*/

(function(Locater){

Locater.Adapter = new Class({

	Implements: [Options, Events],

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

	options: {
		enableHighAccuracy: true,
		timeout: 10000,
		maximumAge: 0,
		currentHandler: null,
		watchHandler: null,
		errorHandler: null
	},

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
			if (opts.currentHandler == null && opts.watchPosition == null) {
				throw new Error('Please specify either watchPosition or currentHandler.');
			//getCurrentPosition
			} else if (opts.currentHandler){
				this._gps.getCurrentPosition(opts.currentHandler, opts.errorHandler, watchOpts);
			//watchPosition
			} else if (opts.watchPosition){
				this._setWatchID(this._gps.watchPosition(opts.watchPosition, opts.errorHandler));
			}
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
		return (this._getWatchID() != null);
	}

});

}(Locater));