/*
---
name: Locater.Handler.CurrentPositionHandler

description: The coordinates position is observed, and the present place is displayed in Google Maps as a marker.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Type
  - Core/Function
  - Core/Class
  - Locater/Locater
  - Locater/Locater.Handler
  - Locater/Locater.Handler.Handler

provides: [Locater.Handler.CurrentPositionHandler]

...
*/

(function(Handler){

Handler.CurrentPositionHandler = new Class({

	Implements: [Options, Handler.Handler],

	options: {
		currentMapSync: true
	},

	initialize: function(marker, options){
		this.setOptions(options);
		if (!Type.isFunction(marker.setPosition)){
			throw new Error('The setPosition method is not mounted.');
		}
		this._marker = marker;
	},

	currentWatched: function(context){
		this._update(context);
	},

	positionChanged: function(context){
		this._update(context);
	},

	_update: function(context){
		var lat = context.getLatitude();
		var lng = context.getLongitude();
		var latlng = new google.maps.LatLng(lat, lng);
		this._marker.setPosition(latlng);
		if (this._marker.getMap() && this.options.currentMapSync){
			var map = this._marker.getMap();
			map.setCenter(latlng);
		};
	}.protect()

});

}(Locater.Handler));