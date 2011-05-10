/*
---
name: Locater.Handler.Context

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Locater/Locater
  - Locater/Locater.Handler

provides: [Locater.Handler.Context]

...
*/

(function($, Locater){

Locater.Handler.Context = new Class({

	initialize: function(props){
	    for (var key in values){
	        var first = key.charAt(0).toUpperCase();
	        var other = key.substr(1, key.length);
	        var getter = 'get' + first + other;
	        this[getter] = function(){
	            return values[key];
	        };
	    }
	}

});

}(document.id, Locater));