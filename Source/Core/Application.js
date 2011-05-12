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
  - Locater/Locater.Rules
  - Locater/Locater.Dispacher
  - Locater/Locater.Handler.Handler
  - Locater/Locater.Handler.Context

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

	_adapter: null,
	_dispacher: null,

	initialize: function(adapter, options){
		this.setOptions(options);
		this._adapter = adapter;
		this._dispacher = Locater.Dispacher();
	},

	addHandler: function(handler){
		this._dispacher.addHandler(handler);
	},

	addHandlers: function(handlers){
		this._dispacher.addHandlers(handlers);
	},

	onCurrentSuccess: function(position){
		var context = this.context = Locater.Handler.Context(position.coords);
		this._dispacher.dispach('initialized', context);
	},

	onWatchSuccess: function(position){
		var context = Locater.Handler.Context(position.coords);
		var self = this;
		Object.each(Locater.Rules, function(rule, key){
			if (rule.apply({}, [this.context, context])) {
				self.dispacher.dispach(key, context);
			}
		});
	},

	onError: function(error){
	},

	run: function(){
		this.start();
	},

	start: function(){
		this._adapter.setOptions({
			'currentHandler': this.onCurrentSuccess.bind(this),
			'watchHandler': this.onWatchSuccess.bind(this),
			'errorHandler': this.onError.bind(this)
		});
		this._adapter.start();
	},

	stop: function(){
		this._adapter.stop();
	}

});

}(document.id, Locater));