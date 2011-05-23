/*
---
name: Locater.Handler

description: Event handler of application.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Type
  - Core/Class
  - Core/Options
  - Locater/Locater

provides: [Locater.Handler, Locater.Handler.Handler, Locater.Handler.SimpleHandler]

...
*/

(function(Locater){

var Handler = Locater.Handler = {

	create: function(name, options){
		if (!this[name]){
			throw new Error('It tries to make an invalid handler.');
		}
		return new this[name](options);
	},

	isHandler: function(target){
		var name = 'Application';
		var result = (Type.isFunction(target['set' + name])
			&& Type.isFunction(target['get' + name]));
		return result;
	}

};

Handler.Handler = new Class({

	setApplication: function(app){
		var proxy = {
			start: app.start,
			stop: app.stop,
			isWatching: app.isWatching
		};
		this.app = proxy;
	},

	getApplication: function(){
		return this.app;
	}

});

Handler.SimpleHandler = function(handler){
	return Object.merge(this, handler);
};
Handler.SimpleHandler.implement(new Handler.Handler());

}(Locater));