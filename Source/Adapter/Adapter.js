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

	initialize: function(options){
		this.setOptions(options);
	},

	//abstract method
	run: function(){}

});


Locater.DefaultAdapter = new Class({

	Extends: Locater.Adapter,

	run: function(){
		this.gps = navigator.geolocation;
		if (this.gps) {
			var watchOpts = Object.subset(this.options, ['enableHighAccuracy', 'timeout', 'maximumAge']);
			this.gps.getCurrentPosition(this.options.currentHandler, this.options.errorHandler);
			this.gps.watchPosition(this.options.watchHandler, this.options.errorHandler);
		} else {
			//error('not supported');
		}
	}

});


}(document.id, Locater));