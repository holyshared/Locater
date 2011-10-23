/*
---
name: Locater.Emulator.WatchPositionAdapter

description: Emulator of WatchPositionAdapter.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/String
  - Core/Object
  - Core/Options
  - Locater/Locater
  - Locater/Locater.Emulator

provides: [Locater.Emulator.WatchPositionAdapter]

...
*/

(function(Emulator){

Emulator.WatchPositionAdapter = new Class({

	Implements: [Emulator, Options],

	options: {
		watchHandler: null,
		errorHandler: null,
		positions: null,
		interval: 1000
	},

	initialize: function(options){
		this.setOptions(options);
		var values = Object.subset(this.options, ['positions', 'interval']);
		Object.each(values, function(value, key){
			this['set' + key.capitalize()](value);
			delete this.options[key];
		}, this);
	},

	setPositions: function(positions){
		if (!Type.isArray(positions)){
			throw new TypeError('It is necessary to specify the coordinates position in array.');
		}
		this._positions = positions;
	},

	getPositions: function(){
		return this._positions;
	},

	_getNextPosition: function(){
		var next = this._current + 1;
		if (next >= this._positions.length) {
			clearTimeout(this._getWatchID());
			return false;
		}
		this._current = next;
		return this._positions[this._current];
	},

	_watchPosition: function(){
		var opts = this.options;
		var position = this._getNextPosition();
		if (position === false){
			return;
		} else if (position instanceof Error){
			opts.errorHandler(position);
		} else if (Type.isObject(position)) {
			opts.watchHandler(position);
		} else {
			throw new TypeError('Please specify coordinates information for the verification or the error object.'); 
		}
		this._watchPosition.delay(opts.interval);
	},

	start: function(){
		this._watchPosition();
		this._setWatchID(new Date().toString());
	},

	stop: function(){
		clearTimeout(this._getWatchID());
		this._setWatchID(null);
	}

});

}(Locater.Emulator));