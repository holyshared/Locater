/*
---
name: Locater.Application

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Object
  - Locater/Locater
  - Locater/Rules
  - Locater/Locater.Dispacher
  - Locater/Handler.Handler
  - Locater/Handler.Context

provides: [Locater.Application]

...
*/

(function($, Locater){

Locater.Application = new Class({

	Implements: [Options],

	options: {
		enableHighAccuracy: true,
		timeout: 10000,
		maximumAge: 0
	},

	initialize: function(options){
		this.setOptions(options);
		this.dispacher = Locater.Dispacher();
	},

	addHandler: function(handler){
		this.dispacher.addHandler(handler);
	},

	addHandlers: function(handlers){
		this.dispacher.addHandlers(handlers);
	},

	onCurrentSuccess: function(position){
		var context = this.context = Locater.Handler.Context(position.coords);
		this.dispacher.dispach('initialized', context);
	},

	onWatchSuccess: function(position){
		var context = Locater.Handler.Context(position.coords);
		var self = this;
		Object.each(Locater.Rules, function(rule, key){
			if (rule(context)) {
				self.dispacher.dispach(key, context);
			}
		});
	},

	onError: function(){
	},

	run: function(){
		this.gps = navigator.geolocation;
		if (this.gps) {
			var watchOpts = Object.subset(this.options, ['enableHighAccuracy', 'timeout', 'maximumAge']);
			this.gps.getCurrentPosition(this.onCurrentSuccess.bind(this), this.onError.bind(this));
			this.watchId = this.gps.watchPosition(this.onWatchSuccess.bind(this), this.onError.bind(this), watchOpts);
		} else {
			//error('not supported');
		}
	}

});

}(document.id, Locater));