/*
---
name: Locater.Handler.CurrentPositionHandler

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Locater/Locater
  - Locater/Locater.Handler

provides: [Locater.Handler.CurrentPositionHandler]

...
*/

(function($, Handler){

Handler.CurrentPositionHandler = new Class({

	Extends: Handler.Handler,

	options: {
		marker: null
	},

	initialized: this._update,
	positionChanged: this._update,

	_update: function(context){
		this.options.marker.setPosition(google.maps.LatLng({

		}));
	}.protect()

});

}(Locater.Handler));