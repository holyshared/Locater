/*
---
name: Locater.Application

description: The application and two or more handlers are executed.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Object
  - Core/Class
  - Core/Options
  - Locater/Locater
  - Locater/Locater.Rules
  - Locater/Locater.Dispacher
  - Locater/Locater.Adapter
  - Locater/Locater.Handler
  - Locater/Locater.Handler.SimpleHandler
  - Locater/Locater.Handler.Context

provides: [Locater.Application]

...
*/

(function(Locater, Handler){

Locater.Application = new Class({

	Implements: [Options],

	options: {
//		enableHighAccuracy: true,
//		timeout: 10000,
//		maximumAge: 0
	},

	_adapter: null,
	_dispacher: null,

	initialize: function(adapter, options){
		this.setOptions(options);
		this._adapter = adapter;
		this._dispacher = new Locater.Dispacher();
	},

	addHandler: function(handler){
		var appHandler = (!Handler.isHandler(handler)) ? new Handler.SimpleHandler(handler) : handler;
		appHandler.setApplication(this);
		this._dispacher.addHandler(appHandler);
		return this;
	},

	addHandlers: function(handlers){
		this._dispacher.addHandlers(handlers);
		return this;
	},

	onWatchSuccess: function(position){
		var context = new Locater.Handler.Context(position.coords);
		var self = this;
		var rules = Locater.Rules.getRules();
		Object.each(rules, function(rule, key){
			if (rule.apply(rule, [this.context, context])) {
				self._dispacher.dispatch(key, context);
			}
		});
		this.context = context;
	},

	onError: function(error){
		this._dispacher.dispatch('error', error);
	},

	run: function(){
		this.start();
	},

	start: function(){
		this._dispacher.dispatch('start');
		this._adapter.setOptions({
			'watchHandler': this.onWatchSuccess.bind(this),
			'errorHandler': this.onError.bind(this)
		});
		this._adapter.start();
	},

	stop: function(){
		this._adapter.stop();
		this._dispacher.dispatch('stop');
	}

});

}(Locater, Locater.Handler));