/*
---
name: Locater.Dispatcher

description: The execution of the event handler of the application can be controlled.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Array
  - Core/Type
  - Core/Class
  - Locater/Locater
  - Locater/Locater.Handler

provides: [Locater.Dispatcher]

...
*/

(function(Locater, Handler){

Locater.Dispatcher = new Class({

	_handlers: [],

	addHandler: function(handler){
		if (!Handler.isHandler(handler)) {
			throw new Error('It is not a handler.');
		}
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

	removeHandler: function(handler){
		if (!this.hasHandler(handler)){
			return this;
		}
		this._handlers.erase(handler);
		return this;
	},

	removeHandlers: function(handlers){
		var self = this;
		handlers.each(function(handler){
			self.removeHandler(handler);
		});
		return this;
	},

	hasHandler: function(handler){
		return this._handlers.contains(handler);
	},

	dispatch: function(eventName, context){
		this._handlers.each(function(handler){
			if (Type.isFunction(handler[eventName])) {
				handler[eventName].apply(handler, [context]);
			};
		});
	}

});

}(Locater, Locater.Handler));