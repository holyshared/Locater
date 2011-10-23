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

provides: [Locater.Emulator.WatchPositionEmulator]

...
*/

(function(Emulator){

Emulator.WatchPositionEmulator = new Class({

	Implements: [Emulator, Options],

	options: {
		watchHandler: null,
		errorHandler: null,
		positions: null,
		interval: 1000
	},

	_current: 0,
	_positions: [],
	_interval: 1000,

	initialize: function(options){
		this.setOptions(options);
		var values = Object.subset(this.options, ['positions', 'interval']);
		Object.each(values, function(value, key){
			if (value == null || value == undefined) {
				return;
			}
			this['set' + key.capitalize()](value);
			delete this.options[key];
		}, this);
	},

	setPositions: function(positions){
		if (!Type.isArray(positions)){
			throw new TypeError('Please specify the coordinates position in array.');
		}
		this._positions = positions;
		return this;
	},

	getPositions: function(){
		return this._positions;
	},

	setInterval: function(interval){
		if (!Type.isNumber(interval)){
			throw new TypeError('Please specify interval numerically.');
		}
		this._interval = interval;
		return this;
	},

	getInterval: function(){
		return this._interval;
	},

	_nextPosition: function(){
		var next = this._current + 1;
		if (next >= this._positions.length) {
			clearTimeout(this._getWatchID());
			return false;
		}
		this._current = next;
		return true;
	},

	_getWatchPosition: function(){
		return this._positions[this._current];
	},

	_watchPosition: function(){
		var opts = this.options;
		var position = this._getWatchPosition();
		var interval = this.getInterval();

		if (position === false){
			return;
		} else if (position instanceof Error){
			opts.errorHandler(position);
		} else if (Type.isObject(position)) {
			opts.watchHandler(position);
		} else {
			throw new TypeError('Please specify coordinates information for the verification or the error object.'); 
		}

		if (this._nextPosition()) {
			this._watchPosition.delay(interval, this);
		}
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