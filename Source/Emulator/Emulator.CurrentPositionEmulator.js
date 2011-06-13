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
		value: null
	},

	initialize: function(options){
		this.setOptions(options);
		var values = Object.subset(this.options, ['value']);
		Object.each(values, function(value, key){
			this['set' + key.capitalize()](value);
			delete this.options[key];
		}, this);
	},

	setValue: function(value){
		this._value = value;
	},

	getValue: function(){
		return this._value;
	},

	start: function(){
		var opts = this.options;
		var value = this.getValue();
		if (!value){
			throw new TypeError('Please specify coordinates information for the verification or the error object.'); 
		} else if (value instanceof Error){
			opts.errorHandler(value);
		} else if (Type.isObject(value)) {
			opts.watchHandler(value);
		}
		this._setWatchID(new Date().toString());
	},

	stop: function(){
		this._setWatchID(null);
	}

});

}(Locater.Emulator));