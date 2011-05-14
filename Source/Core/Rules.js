/*
---
name: Locater.Rules

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Object
  - Core/Type
  - Locater/Locater

provides: [Locater.Rules]

...
*/

(function(locater){

var rules = locater.Rules = {};

Object.append(rules, {

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

});

/**
	paturn1:

	Locater.Rules.define('foo', function(current, wacth){
		//Distinction processing of event ignition
	});

	paturn2:

	var custumRule = {
		invoke; function(current, wacth){
			//Distinction processing of event ignition
		}
	};

	Locater.Rules.define('foo', custumRule);
 */
rules.define = function(name, rule){

	if (!Type.isFunction(rule.invoke) || !Type.isFunction(rule)){
		throw new Error('The rule is an object or it is not a function.');
	}

	switch(typeOf(rule)){
		case 'object':
			rules[name] = rule.invoke;
			break;
		case 'function':
			rules[name] = rule;
			break;
	}

};

}(Locater));