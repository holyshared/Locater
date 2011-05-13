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

(function(Locater){

Locater.Rules = {

	'positionChanged': function(current, wacth){
		return !(current.getLatitude() == wacth.getLatitude()
			&& current.getLongitude() == wacth.getLongitude());
	},

	'latitudeChanged': function(current, wacth){
		return current.getLatitude() != wacth.getLatitude();
	},

	'longitudeChanged': function(current, wacth){
		return current.getLongitude() != wacth.getLongitude();
	},

	'altitudeChanged': function(current, wacth){
		return current.getAltitude() != wacth.getAltitude();
	},

	'accuracyChanged': function(current, wacth){
		return current.getAccuracy() != wacth.getAccuracy();
	},

	'altitudeAccuracyChanged': function(current, wacth){
		return current.getAltitudeAccuracy() != wacth.getAltitudeAccuracy();
	},

	'headingChanged': function(current, wacth){
		return current.getHeading() != wacth.getHeading();
	},

	'speedChanged': function(current, wacth){
		return current.getSpeed() != wacth.getSpeed();
	}

};

}(Locater));