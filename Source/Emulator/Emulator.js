/*
---
name: Locater.Emulator

description:

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Locater/Locater.Adapter

provides: [Locater.Adapter]

...
*/

(function(Locater){

var Emulator = Locater.Emulator = new Class({

	options: {
//		enableHighAccuracy: true,
//		timeout: 10000,
//		maximumAge: 0
	},

	_getWatchID: function(){
		return this._watchID;
	}.protect(),

	_setWatchID: function(watchID){
		this._watchID = watchID;
	}.protect(),

	isWatching: function(){
		return (this._getWatchID() != null);
	}

});


Emulator.CurrentPositionEmulator = new Class({

	Implements: [Emulator, Options],

	options: {
		watchHandler: null,
		errorHandler: null,
		position: null
	},

	initialize: function(options){
		this.setOptions(options);
	},

	start: function(){
		var opts = this.options;
		if (opts.position instanceof Error){
			opts.errorHandler(opts.position);
		} else if (Type.isObject(value)) {
			opts.watchHandler(opts.position);
		}
		this._setWatchID(new Date().toString());
	},

	stop: function(){
		this._setWatchID(null);
	}

});

}(Locater));