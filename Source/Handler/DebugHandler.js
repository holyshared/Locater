/*
---
name: Locater.Handler.DebugHandler

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Locater/Locater
  - Locater/Locater.Handler

provides: [Locater.Handler.DebugHandler]

...
*/

(function($, Locater){

Locater.Handler.DebugHandler = new Class({

	Extends: Locater.Handler.Handler,

	initialized: function(context){
		console.log(context);
	}

});

}(document.id, Locater));