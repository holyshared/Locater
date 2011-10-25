/*
---
name: Locater.Adapter.WatchPositionAdapter

description: The adapter for applications which uses the present position information periodically

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Locater/Locater
  - Locater/Locater.Adapter

provides: [Locater.Adapter.WatchPositionAdapter]

...
*/

(function(Locater, Adapter){

Adapter.WatchPositionAdapter = new Class({

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
		};
		this._setWatchID(gps.watchPosition(opts.watchHandler, opts.errorHandler, watchOpts));
	},

	stop: function(){
		var gps = this._getGeolocation();
		gps.clearWatch(this._getWatchID());
		this._setWatchID(null);
	}

});

}(Locater, Locater.Adapter));