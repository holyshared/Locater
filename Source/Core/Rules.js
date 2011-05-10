/*
---
name: Locater.Rules

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Locater/Locater

provides: [Locater.Rules]

...
*/

(function($, Locater){

Locater.Rules = {

	'positionChanged': function(context){
		return this.context.getLatitude() == context.getLatitude()
			|| this.context.getLongitude() == context.getLongitude();
	},

	'latitudeChanged': function(context){
		return this.context.getLatitude() == context.getLatitude();
	},

	'longitudeChanged': function(context){
		return this.context.getLongitude() == context.getLongitude();
	},

	'altitudeChanged': function(context){
		return this.context.getAltitude() == context.getAltitude();
	},

	'accuracyChanged': function(context){
		return this.context.getAccuracy() == context.getAccuracy();
	},

	'altitudeAccuracyChanged': function(context){
		return this.context.getAltitudeAccuracy() == context.getAltitudeAccuracy();
	},

	'headingChanged': function(context){
		return this.context.getHeading() == context.getHeading();
	},

	'speedChanged': function(context){
		return this.context.getSpeed() == context.getSpeed();
	}

};

}(document.id, Locater));