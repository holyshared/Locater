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

(function(Handler){

Handler.CurrentPositionHandler = new Class({

	Extends: Handler.Handler,

	options: {
		marker: null
	},

	//
	currentWatched: this._update,

	//
	positionChanged: this._update,

	_update: function(context){
		var marker = this.options.marker;
		var lat = context.getLatitude();
		var lng = context.getLongitude();
		var latlng = new google.maps.LatLng(lat, lng);
		marker.setPosition(latlng);
	}.protect()

});

}(Locater.Handler));