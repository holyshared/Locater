/*
---
name: Locater

description: The core and the name space of locater are supported.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/MooTools

provides: [Locater]

...
*/

(function(){

var Locater = this.Locater = {
	version: '1.0'
};

}());

/*
---
name: Locater.Rules

description: The application is controlled the event, and a new event addition becomes possible. 

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
	 * if (Locater.Rules.isDefined('currentWatched')){
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

	'currentWatched': function(current, wacth){
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

/*
---
name: Locater.Dispacher

description: The execution of the event handler of the application can be controlled.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Array
  - Core/Type
  - Core/Class
  - Locater/Locater

provides: [Locater.Dispacher]

...
*/

(function(Locater){

Locater.Dispacher = new Class({

	_handlers: [],

	addHandler: function(handler){
		this._handlers.push(handler);
		return this;
	},

	addHandlers: function(handlers){
		var self = this;
		handlers.each(function(handler){
			self.addHandler(handler);
		});
		return this;
	},

	dispatch: function(eventName, context){
		this._handlers.each(function(handler){
			if (Type.isFunction(handler[eventName])) {
				handler[eventName].apply(handler, [context]);
			};
		});
	}

});

}(Locater));

/*
---
name: Locater.Adapter

description: Adaptor that acquisition or observes location information.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Object
  - Core/Function
  - Core/Class
  - Core/Options
  - Locater/Locater

provides: [Locater.Adapter, Locater.Geolocation, Locater.Adapter.CurrentPositionAdapter, Locater.Adapter.WatchPositionAdapter]

...
*/

(function(Locater){

var Geolocation = Locater.Geolocation = new Class({

	options: {
		enableHighAccuracy: true,
		timeout: 10000,
		maximumAge: 0
	},

	_getWatchID: function(){
		return this._watchID;
	}.protect(),

	_setWatchID: function(watchID){
		this._watchID = watchID;
	}.protect(),

	_getGeolocation: function(){
		return navigator.geolocation;
	}.protect(),

	isWatching: function(){
		return (this._getWatchID() != null);
	}

});


var Adapter = Locater.Adapter = {

	create: function(name, options){
		if (!this[name]) throw new Error('It tries to make an invalid adaptor.');
		return new this[name](options);
	}

};

Adapter.CurrentPositionAdapter = new Class({

	Implements: [Geolocation, Options],

	options: {
		watchHandler: null,
		errorHandler: null
	},

	initialize: function(options){
		this.setOptions(options);
	},

	start: function(){
		var gps = this._getGeolocation();
		if (!gps){
			throw new Error('Geolocation API is not supported.');
		}

		var opts = this.options;
		var watchOpts = Object.subset(opts, ['enableHighAccuracy', 'timeout', 'maximumAge']);
		if (opts.watchHandler == null) {
			throw new Error('Please specify either watchHandler.');
		}
		gps.getCurrentPosition(opts.watchHandler, opts.errorHandler, watchOpts);
		this._setWatchID(true);
	},

	stop: function(){
		this._setWatchID(null);
	}

});


Adapter.WatchPositionAdapter = new Class({

	Implements: [Geolocation, Options],

	options: {
		watchHandler: null,
		errorHandler: null
	},

	initialize: function(options){
		this.setOptions(options);
	},

	start: function(){
		var gps = this._getGeolocation();
		if (!gps){
			throw new Error('Geolocation API is not supported.');
		}

		var opts = this.options;
		var watchOpts = Object.subset(opts, ['enableHighAccuracy', 'timeout', 'maximumAge']);
		if (opts.watchHandler == null) {
			throw new Error('Please specify either watchHandler.');
		} else if (opts.watchHandler){
			this._setWatchID(gps.watchPosition(opts.watchHandler, opts.errorHandler));
		}
	},

	stop: function(){
		var gps = this._getGeolocation();
		gps.clearWatch(this._getWatchID());
		this._setWatchID(null);
	}

});

}(Locater));

/*
---
name: Locater.Handler

description: Event handler of application.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Class
  - Core/Options
  - Locater/Locater

provides: [Locater.Handler, Locater.Handler.Handler]

...
*/

(function(Locater){

var Handler = Locater.Handler = {

	create: function(name, options){
		if (!this[name]){
			throw new Error('It tries to make an invalid handler.');
		}
		return new this[name](options);
	}

};


Handler.Handler = new Class({

	Implements: [Options],

	initialize: function(options){
		this.setOptions(options);
	}

});

}(Locater));

/*
---
name: Locater.Handler.Context

description: Context of event handler.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Object
  - Core/Function
  - Core/Type
  - Locater/Locater
  - Locater/Locater.Handler

provides: [Locater.Handler.Context]

...
*/

(function(Handler){

/**
 * Coordinates interface
 * @see: http://dev.w3.org/geo/api/spec-source.html
 */
var defaultContext = {
	latitude: 0, //double
	longitude: 0, //double
	altitude: 0, //double
	accuracy: 0, //double
	altitudeAccuracy: 0, //double
	heading: 0, //double
	speed: 0 //double
};

function __toGetterMethodName(name){
	var first = name.charAt(0).toUpperCase();
	var other = name.substr(1, name.length);
	var getter = 'get' + first + other;
	return getter;
}

Handler.Context = function(props){
	var keys = Object.keys(defaultContext);
	var ctx = Object.subset(props, keys);
	var params = Object.merge(defaultContext, ctx);
	for (var key in params){
		var getter = __toGetterMethodName(key);
		this[getter] = Function.from(params[key]);
	}
	return this;
};

Handler.Context.implement({

	toString: function(){
		var tokens = [];
		for (var key in defaultContext){
			var getter = __toGetterMethodName(key);
			var value = this[getter]();
			if (Type.isObject(value)) {
				if (Type.isFunction(value.toString)) {
					value = value.toString();
				} else {
					continue;
				}
			}
			tokens.push(key + '=' + value);
		}
		return tokens.join(' ');
	}

});

}(Locater.Handler));

/*
---
name: Locater.Application

description: The application and two or more handlers are executed.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Object
  - Core/Class
  - Core/Options
  - Locater/Locater
  - Locater/Locater.Rules
  - Locater/Locater.Dispacher
  - Locater/Locater.Adapter
  - Locater/Locater.Handler.Handler
  - Locater/Locater.Handler.Context

provides: [Locater.Application]

...
*/

(function(Locater){

Locater.Application = new Class({

	Implements: [Options],

	options: {
//		enableHighAccuracy: true,
//		timeout: 10000,
//		maximumAge: 0
	},

	_adapter: null,
	_dispacher: null,

	initialize: function(adapter, options){
		this.setOptions(options);
		this._adapter = adapter;
		this._dispacher = new Locater.Dispacher();
	},

	addHandler: function(handler){
		this._dispacher.addHandler(handler);
		return this;
	},

	addHandlers: function(handlers){
		this._dispacher.addHandlers(handlers);
		return this;
	},

	onWatchSuccess: function(position){
		var context = new Locater.Handler.Context(position.coords);
		var self = this;
		var rules = Locater.Rules.getRules();
		Object.each(rules, function(rule, key){
			if (rule.apply(rule, [this.context, context])) {
				self._dispacher.dispatch(key, context);
			}
		});
		this.context = context;
	},

	onError: function(error){
		this._dispacher.dispatch('error', error);
	},

	run: function(){
		this.start();
	},

	start: function(){
		this._dispacher.dispatch('start');
		this._adapter.setOptions({
			'watchHandler': this.onWatchSuccess.bind(this),
			'errorHandler': this.onError.bind(this)
		});
		this._adapter.start();
	},

	stop: function(){
		this._adapter.stop();
		this._dispacher.dispatch('stop');
	}

});

}(Locater));

/*
---
name: Locater.Handler.DebugHandler

description: Present location is displayed in the debugging console. 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Array
  - Core/Function
  - Core/Class
  - Core/Options
  - Locater/Locater
  - Locater/Locater.Handler

provides: [Locater.Handler.DebugHandler]

...
*/

(function(Handler){

Handler.DebugHandler = new Class({

	Extends: Handler.Handler,

	options: {
		events: ['currentWatched']
	},

	initialize: function(options){
		this.parent(options);
		this._setup();
	},

	write: function(context){
		if (!window.console) return;
		if (!context) return;
		window.console.log(context.toString());
	},

	//protected methods
	_setup: function(){
		var self = this;
		var events = this.options.events;
		events.each(function(key, value){
			self[key] = self.write;
		});
	}.protect()

});

}(Locater.Handler));

/*
---
name: Locater.Handler.CurrentPositionHandler

description: The coordinates position is observed, and the present place is displayed in Google Maps as a marker.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Type
  - Core/Function
  - Core/Class
  - Locater/Locater
  - Locater/Locater.Handler

provides: [Locater.Handler.CurrentPositionHandler]

...
*/

(function(Handler){

Handler.CurrentPositionHandler = new Class({

	Extends: Handler.Handler,

	options: {
		currentMapSync: true
	},

	initialize: function(marker, options){
		this.parent(options);
		if (!Type.isFunction(marker.setPosition)){
			throw new Error('The setPosition method is not mounted.');
		}
		this._marker = marker;
	},

	currentWatched: function(context){
		this._update(context);
	},

	positionChanged: function(context){
		this._update(context);
	},

	_update: function(context){
		var lat = context.getLatitude();
		var lng = context.getLongitude();
		var latlng = new google.maps.LatLng(lat, lng);
		this._marker.setPosition(latlng);
		if (this._marker.getMap() && this.options.currentMapSync){
			var map = this._marker.getMap();
			map.setCenter(latlng);
		};
	}.protect()

});

}(Locater.Handler));