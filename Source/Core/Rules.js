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

(function(Locater){

var Rules = Locater.Rules = {

	_rules: {},

	getRule: function(name){
		return this._rules[name];
	},

	getRules: function(){
		return this._rules;
	},

	/**
	 * if (Locater.Rules.isDefined('initialized')){
	 *		//Rule is defined
	 * }
	 */
	isDefined: function(name){
		return (this._rules[name]) ? true : false;
	},

	/**
	 * [paturn1:]
	 *		Locater.Rules.define('foo', function(current, wacth){
	 *			//Distinction processing of event ignition
	 *		});
	 * 
	 * [paturn2:]
	 *  	var custumRule = {
	 * 			invoke; function(current, wacth){
	 * 				//Distinction processing of event ignition
	 *			}
	 * 		};
	 *		Locater.Rules.define('foo', custumRule);
	 */
	define: function(name, rule){
		if (!(Type.isFunction(rule.invoke) || Type.isFunction(rule))){
			throw new Error('The rule is an object or it is not a function.');
		}

		switch(typeOf(rule)){
			case 'object':
				this._rules[name] = rule.invoke;
				break;
			case 'function':
				this._rules[name] = rule;
				break;
		}
	}

};

var defaultRules = {

	'initialized': function(current, wacth){
		return (current == null);
	},

	'positionChanged': function(current, wacth){
		if (current == null) return false;
		return !(current.getLatitude() == wacth.getLatitude()
			&& current.getLongitude() == wacth.getLongitude());
	},

	'latitudeChanged': function(current, wacth){
		if (current == null) return false;
		return current.getLatitude() != wacth.getLatitude();
	},

	'longitudeChanged': function(current, wacth){
		if (current == null) return false;
		return current.getLongitude() != wacth.getLongitude();
	},

	'altitudeChanged': function(current, wacth){
		if (current == null) return false;
		return current.getAltitude() != wacth.getAltitude();
	},

	'accuracyChanged': function(current, wacth){
		if (current == null) return false;
		return current.getAccuracy() != wacth.getAccuracy();
	},

	'altitudeAccuracyChanged': function(current, wacth){
		if (current == null) return false;
		return current.getAltitudeAccuracy() != wacth.getAltitudeAccuracy();
	},

	'headingChanged': function(current, wacth){
		if (current == null) return false;
		return current.getHeading() != wacth.getHeading();
	},

	'speedChanged': function(current, wacth){
		if (current == null) return false;
		return current.getSpeed() != wacth.getSpeed();
	}

};

for (key in defaultRules) {
	Rules.define(key, defaultRules[key]);
};

}(Locater));