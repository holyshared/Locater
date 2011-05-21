/*
---
name: Locater.Handler.DebugHandler

description: Present location is displayed in the debugging console. 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Array
  - Core/Function
  - Core/Class
  - Core/Options
  - Locater/Locater
  - Locater/Locater.Handler
  - Locater/Locater.Handler.Handler

provides: [Locater.Handler.DebugHandler]

...
*/

(function(Handler){

Handler.DebugHandler = new Class({

	Implements: [Options, Handler.Handler],

	options: {
		events: ['currentWatched']
	},

	initialize: function(options){
		this.setOptions(options);
		this._setup();
	},

	write: function(context){
		if (!window.console) return;
		if (!context) return;
		window.console.log(context.toString());
	},

	//protected methods
	_setup: function(){
		var self = this;
		var events = this.options.events;
		events.each(function(key, value){
			self[key] = self.write;
		});
	}.protect()

});

}(Locater.Handler));