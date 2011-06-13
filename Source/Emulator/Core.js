/*
---
name: Locater.Emulator

description:

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Locater/Locater

provides: [Locater.Emulator]

...
*/

(function(Locater){

var Emulator = Locater.Emulator = new Class({

	options: {
//		enableHighAccuracy: true,
//		timeout: 10000,
//		maximumAge: 0
	},

	_getWatchID: function(){
		return this._watchID;
	}.protect(),

	_setWatchID: function(watchID){
		this._watchID = watchID;
	}.protect(),

	isWatching: function(){
		return (this._getWatchID() != null);
	}

});

}(Locater));