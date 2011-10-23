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
  - Locater/Locater.Handler
  - Locater/Locater.Dispacher
  - Locater/Locater.Adapter
  - Locater/Locater.Handler.SimpleHandler
  - Locater/Locater.Handler.Context

provides: [Locater.Application]

...
*/

(function(Locater, Adapter, Handler){

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
		if (!(Type.isFunction(adapter.start) && Type.isFunction(adapter.stop))) {
			throw new Error('It is not an adaptor.');
		}
		this.setOptions(options);
		this._adapter = adapter;
		this._adapter.setOptions({
			'watchHandler': this.onWatchSuccess.bind(this),
			'errorHandler': this.onError.bind(this)
		});
		this._dispacher = new Locater.Dispacher();
	},

	addHandler: function(handler){
		if (!Handler.isHandler(handler)) {
			throw new Error('It is not a handler.');
		}
		handler.setApplication(this);
		this._dispacher.addHandler(handler);
		return this;
	},

	addHandlers: function(handlers){
		var self = this;
		handlers.each(function(handler, key){
			self.addHandler(handler);
		});
		return this;
	},

	removeHandler: function(handler){
		this._dispacher.removeHandler(handler);
		return this;
	},

	removeHandlers: function(handlers){
		this._dispacher.removeHandlers(handlers);
		return this;
	},

	onWatchSuccess: function(position){
		var context = new Locater.Handler.Context(position.coords);
		var self = this;
		var rules = Locater.Rules.getRules();
		Object.each(rules, function(rule, key){
			if (rule.apply(rule, [self.context, context])) {
				self._dispacher.dispatch(key, context);
			}
		});
		this.context = context;
	},

	onError: function(error){
		this._dispacher.dispatch('error', error);
	},

	run: function(){
		if (this.isWatching()) return;
		try {
			this._adapter.start();
		} catch(e){
			this._dispacher.dispatch('error', e);
		}
		this._dispacher.dispatch('start');
	},

	isWatching: function(){
		return this._adapter.isWatching();
	},

	start: function(){
		this.run();
	},

	stop: function(){
		if (!this.isWatching()) return;
		this._adapter.stop();
		this._dispacher.dispatch('stop');
	}

});

}(Locater, Locater.Adapter, Locater.Handler));