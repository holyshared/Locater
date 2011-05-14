/*
---
name: Locater.Handler

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Class
  - Core/Options
  - Locater/Locater

provides: [Locater.Handler, Locater.Handler.Handler]

...
*/

(function(Locater){

var Handler = Locater.Handler = {

	create: function(name, options){
		if (!this[name]){
			throw new Error('It tries to make an invalid handler.');
		}
		return new this[name](options);
	}

};


Handler.Handler = new Class({

	Implements: [Options],

	initialize: function(options){
		this.setOptions(options);
	}

});

}(Locater));