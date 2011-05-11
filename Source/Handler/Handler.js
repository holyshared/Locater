/*
---
name: Locater.Handler

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Locater/Locater

provides: [Locater.Handler, Locater.Handler.Handler]

...
*/

(function($, Locater){

Locater.Handler = {

	create: function(name, options){
		if (!this[name]) {
			throw new Error('not supported.');
		}
		return new this[name](options);
	}

};


Locater.Handler.Handler = new Class({

	Implements: [Options],

	initialize: function(options){
		this.setOptions(options);
	}

});

}(document.id, Locater));