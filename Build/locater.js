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
name: Locater.Handler

description: Event handler of application.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Type
  - Core/Class
  - Core/Options
  - Locater/Locater

provides: [Locater.Handler, Locater.Handler.Handler, Locater.Handler.SimpleHandler]

...
*/

(function(Locater){

var Handler = Locater.Handler = {

	create: function(name, options){
		if (!this[name]){
			throw new Error('It tries to make an invalid handler.');
		}
		return new this[name](options);
	},

	isHandler: function(target){
		var name = 'Application';
		var result = (Type.isFunction(target['set' + name])
			&& Type.isFunction(target['get' + name]));
		return result;
	}

};

function _createProxy(app){
	var appProxyMethods = ['start', 'stop', 'isWatching'];
	var proxy = {};
	appProxyMethods.each(function(method){
		proxy[method] = Function.from(app[method]).bind(app)
	});
	return proxy;
};

Handler.Handler = new Class({

	setApplication: function(app){
		this._app = _createProxy(app);
	},

	getApplication: function(){
		return this._app;
	}

});

Handler.SimpleHandler = function(handler){
	return Object.merge(this, handler);
};
Handler.SimpleHandler.implement(new Handler.Handler());

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
  - Locater/Locater.Handler

provides: [Locater.Dispacher]

...
*/

(function(Locater, Handler){

Locater.Dispacher = new Class({

	_handlers: [],

	addHandler: function(handler){
		if (!Handler.isHandler(handler)) {
			throw new Error('It is not a handler.');
		}
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

	removeHandler: function(handler){
		if (!this.hasHandler(handler)){
			return this;
		}
		this._handlers.erase(handler);
		return this;
	},

	removeHandlers: function(handlers){
		var self = this;
		handlers.each(function(handler){
			self.removeHandler(handler);
		});
		return this;
	},

	hasHandler: function(handler){
		return this._handlers.contains(handler);
	},

	dispatch: function(eventName, context){
		this._handlers.each(function(handler){
			if (Type.isFunction(handler[eventName])) {
				handler[eventName].apply(handler, [context]);
			};
		});
	}

});

}(Locater, Locater.Handler));

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
	},

	isAdapter: function(adapter){
		return (Type.isFunction(adapter.start) && Type.isFunction(adapter.stop));
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
		gps.getCurrentPosition(opts._watchHandler, this._errorHandler, watchOpts);
		this._setWatchID(true);
	},

	_watchHandler: function(context){
		if (!this.isWatching()) return;

		var opts = this.options;
		opts.watchHandler(context);
		this.stop();
	},

	_errorHandler: function(error){
		if (!this.isWatching()) return;

		var opts = this.options;
		opts.errorHandler(error);
		this.stop();
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
	var params = {};
	var keys = Object.keys(defaultContext);
	var context = Object.subset(props, keys);
	Object.each(context, function(value, key){
		params[key] = value || defaultContext[key];
	});
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
  - Locater/Locater.Handler
  - Locater/Locater.Dispacher
  - Locater/Locater.Adapter
  - Locater/Locater.Handler.SimpleHandler
  - Locater/Locater.Handler.Context

provides: [Locater.Application]

...
*/

(function(Locater, Adapter, Handler){

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
		if (!Adapter.isAdapter(adapter)) {
			throw new Error('It is not an adaptor.');
		}
		this.setOptions(options);
		this._adapter = adapter;
		this._adapter.setOptions({
			'watchHandler': this.onWatchSuccess.bind(this),
			'errorHandler': this.onError.bind(this)
		});
		this._dispacher = new Locater.Dispacher();
	},

	addHandler: function(handler){
		if (!Handler.isHandler(handler)) {
			throw new Error('It is not a handler.');
		}
		handler.setApplication(this);
		this._dispacher.addHandler(handler);
		return this;
	},

	addHandlers: function(handlers){
		var self = this;
		handlers.each(function(handler, key){
			self.addHandler(handler);
		});
		return this;
	},

	removeHandler: function(handler){
		this._dispacher.removeHandler(handler);
		return this;
	},

	removeHandlers: function(handlers){
		this._dispacher.removeHandlers(handlers);
		return this;
	},

	onWatchSuccess: function(position){
		var context = new Locater.Handler.Context(position.coords);
		var self = this;
		var rules = Locater.Rules.getRules();
		Object.each(rules, function(rule, key){
			if (rule.apply(rule, [self.context, context])) {
				self._dispacher.dispatch(key, context);
			}
		});
		this.context = context;
	},

	onError: function(error){
		this._dispacher.dispatch('error', error);
	},

	run: function(){
		if (this.isWatching()) return;
		this._dispacher.dispatch('start');
		this.start();
	},

	isWatching: function(){
		return this._adapter.isWatching();
	},

	start: function(){
		if (this.isWatching()) return;
		this._adapter.start();
	},

	stop: function(){
		if (!this.isWatching()) return;
		this._adapter.stop();
		this._dispacher.dispatch('stop');
	}

});

}(Locater, Locater.Adapter, Locater.Handler));
