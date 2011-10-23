/*
---
name: Locater.Emulator.CurrentPositionEmulator

description: Emulator of CurrentPositionAdapter.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/String
  - Core/Object
  - Core/Options
  - Locater/Locater
  - Locater/Locater.Emulator

provides: [Locater.Emulator.CurrentPositionEmulator]

...
*/

(function(Emulator){

Emulator.CurrentPositionEmulator = new Class({

	Implements: [Emulator, Options],

	options: {
		watchHandler: null,
		errorHandler: null,
		position: null
	},

	_position: null,

	initialize: function(options){
		this.setOptions(options);
		var values = Object.subset(this.options, ['position']);
		Object.each(values, function(value, key){
			if (value == null || value == undefined) {
				return;
			}
			this['set' + key.capitalize()](value);
			delete this.options[key];
		}, this);
	},

	setPosition: function(position){
		if (!(Type.isObject(position) || position instanceof Error)){
			throw new TypeError('Please specify an Error object as position from an object.');
		}
		this._position = position;
		return this;
	},

	getPosition: function(){
		return this._position;
	},

	start: function(){
		var opts = this.options;
		var position = this.getPosition();
		if (!position){
			throw new TypeError('Please specify coordinates information for the verification or the error object.'); 
		} else if (position instanceof Error){
			opts.errorHandler(position);
		} else if (Type.isObject(position)) {
			opts.watchHandler(position);
		}
		this._setWatchID(new Date().toString());
	},

	stop: function(){
		this._setWatchID(null);
	}

});

}(Locater.Emulator));