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

function RadiusRule(radius){
	this._radius = radius;
}

function radians(value){
	return (2 * Math.PI) * value / 360;
}

function invoke(current, watch) {
	if (!this.getCurrent()) this.setCurrent(watch);
	if (!(this.distance(this.getCurrent(), watch) > this.getRadius())) {
		return false;
	} else {
		this.setCurrent(watch);
		return true;
	}
}

function getRate(){
	return this._rate;
}

function getRadius(){
	return this._radius;
}

function getCurrent(){
	return this._watch;
}

function setCurrent(watch){
	this._watch = watch;
}

//@see http://code.google.com/intl/ja/apis/maps/articles/phpsqlsearch.html
function distance(current, watch){

	var oldlat = this.radians(current.getLatitude());
	var oldlng = this.radians(current.getLongitude());

	var newlat = this.radians(watch.getLatitude());
	var newlng = this.radians(watch.getLongitude());

	var distance = this.getRate() * Math.acos(
        Math.cos(oldlat)
        *
        Math.cos(newlat)
        *
        Math.cos(newlng - oldlng)
        +
        Math.sin(oldlat)
        *
        Math.sin(newlat)
    );
	return distance;
}

RadiusRule.implement({
	_watch: null,
	_rate: 0,
	radians: radians.protect(),
	invoke: invoke,
	distance: distance,
	getRate: getRate.protect(),
	getRadius: getRadius.protect(),
	getCurrent: getCurrent.protect(),
	setCurrent: setCurrent.protect()
});

Rules.RadiusRule = RadiusRule;

}(Locater.Rules));