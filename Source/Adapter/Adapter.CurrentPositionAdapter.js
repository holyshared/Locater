/*
---
name: Locater.Adapter.CurrentPositionAdapter

description:

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Locater/Locater
  - Locater/Locater.Adapter

provides: [Locater.Adapter.CurrentPositionAdapter]

...
*/

(function(Locater, Adapter){

Adapter.CurrentPositionAdapter = new Class({

	Implements: [Locater.Geolocation, Options],

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
		}
		gps.getCurrentPosition(opts.watchHandler, opts.errorHandler, watchOpts);
		this._setWatchID(new Date().toString());
	},

	stop: function(){
		this._setWatchID(null);
	}

});

}(Locater, Locater.Adapter));