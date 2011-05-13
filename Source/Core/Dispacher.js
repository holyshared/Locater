/*
---
name: Locater.Dispacher

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Type
  - Locater/Locater

provides: [Locater.Dispacher]

...
*/

(function(Locater){

Locater.Dispacher = new Class({

	_handlers: [],

	addHandler: function(handler){
		this._handlers.push(handler);
		return this;
	},

	addHandlers: function(handlers){
		var self = this;
		handlers.each(function(handler){
			self.addHandler(handler);
		});
		return this;
	},

	dispatch: function(eventName, context){
		this._handlers.each(function(handler){
			if (Type.isFunction(handler[eventName])) {
				handler[eventName](context);
			};
		});
	}

});

}(Locater));