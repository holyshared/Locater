/*
---
name: Locater.Rules.RadiusRule

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Locater/Locater.Rules

provides: [Locater.Rules.RadiusRule]

...
*/

(function(Rules){

function RadiusRule(radius) {
	this._radius = radius;
	this._watch = null;
}

RadiusRule.prototype.invoke = function(current, watch){
	if (!(this._compute(watch) > this._radius)) {
		return false;
	}
	this._watch = watch;
	return true;
}

RadiusRule.prototype._compute = function(point){
	if (!point) return 0; //diff is 0km
	return 100;
}

/*
Rules.define('fiveHundredOverd', new RadiusRule(500));
Rules.define('fourHundredOverd', new RadiusRule(400));
Rules.define('threeHundredOverd', new RadiusRule(300));
Rules.define('twoHundredOverd', new RadiusRule(200));
Rules.define('oneHundredOverd', new RadiusRule(100));
*/

}(Locater.Rules));