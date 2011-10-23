Locater
====================================

Locater is an application framework using [Geolocation API Specification](http://dev.w3.org/geo/api/spec-source.html "Geolocation API Specification").  
It is possible to correspond from the medium scale flexibly because it is the best for the application of a large scale, and event operation type.
The event can control a detailed event by being able to customize and coming.

![Locater](http://holyshared.github.com/Locater/img_logo.jpg "Locater")

How to use
------------------------------------------------------------------------

### Step1 The handler's making

Hands used by the application are made in the beginning. 
The event handler mounts the processing of the event that it wants to handle the event with the object. 
Please make it as much as possible though it is unquestionable for the error hands even if it doesn't make it. 

#### Hanlder Example

	#js
	var myHanlder = new Locater.Handler.SimpleHandler({
		currentWatched: function(context){
			//do something
		}
	});

	var errorHanlder = new Locater.Handler.SimpleHandler({
		error: function(error){
			alert(error.message);
		}
	});

The event that the event can be handled is as follows.

#### Hanlder Events

##### Position

A positional event takes a present position in the argument.

* **currentWatched** - When the coordinates position is acquired, it is generated only once most first.
* **positionChanged** - When latitude and the longitude change, it is generated.
* **latitudeChanged** - When latitude changes, it is generated. 
* **longitudeChanged** - When longitude changes, it is generated. 
* **altitudeChanged** - When altitude changes, it is generated.
* **accuracyChanged** - When accuracy changes, it is generated.
* **altitudeAccuracyChanged** - When altitudeAccuracy changes, it is generated.
* **headingChanged** - When heading changes, it is generated.
* **speedChanged** - When speed changes, it is generated.

##### Application

The application event is an event related to the application. 
There is no argument.

* **start** - When the application is begun, it is generated.
* **stop** - When the application is stopped, it is generated.

##### Error

It is an event when the error originates while executing it.
The argument is [PositionError](http://dev.w3.org/geo/api/spec-source.html#position_error_interface "PositionError").

* **error** - When the error occurs, it is generated. 


### Step2 Making of adaptor

Next, the adaptor used by the application is made. 
The adaptor has **CurrentPositionAdapter** to acquire present coordinates position and **WacthPositionAdapter** to acquire the coordinates position regularly.

The method of generating the adaptor becomes as follows. 
Moreover, the option of the adaptor is the same as [PositionOptions](http://dev.w3.org/geo/api/spec-source.html#position_options_interface "PositionOptions").

#### CurrentPositionAdapter

	#js
	var options = { enableHighAccuracy: true };
	var adapter = new Locater.Adapter.CurrentPositionAdapter(options);

#### WacthPositionAdapter

	#js
	var options = { enableHighAccuracy: true };
	var adapter = new Locater.Adapter.CurrentPositionAdapter(options);


### Step3 Making of application

The adaptor and the option are handed over to the constructor of the application. 
The handler is registered by using the **addHandler** method at the end, and the application is executed by the **run** method. 

A final code is as follows. 

	#js
	(function(){
		//Alias
		var Application = Locater.Application;
		var Adapter = Locater.Adapter;
		var Handler = Locater.Handler;

		//Handlers
		var myHanlder = new Handler.SimpleHandler({
			currentWatched: function(context){
				//do something
				/*
					//Context methods
					context.getLatitude();
					context.getLongitude();
					context.getAltitude();
					context.getAccuracy();
					context.getAltitudeAccuracy();
					context.getHeading();
					context.getSpeed();
				*/
			}
		});

		var errorHanlder = new Handler.SimpleHandler({
			error: function(error){
				alert(error.message);
			}
		});

		window.addEvent('domready', function(){

			var adapter = new Adapter.CurrentPositionAdapter();
			var app = new Application(adapter);
			app.addHandler(myHanlder);
			app.addHandler(errorHanlder);
			app.run();

		});
	}());


The definition of a custom-made rule
------------------------------------------------------------------------

The following example defines the custom-made event when latitude longitude turns up rather than Tokyo.  
The definition of a custom-made event has the method of defining functionally, and the method of specifying by an object.  
An event name can be decided freely.  

### When a definition is given function 

	Locater.Rules.define('fooEvent', function(current, wacth){
		//In the first stage, the position of current is null. 
		//It can be referred to now from the 2nd time or subsequent ones.
		if (current == null) return false;

		//A custom-made event when latitude longitude turns up rather than Tokyo
		if (wacth.getLatitude() > 35.4122 && wacth.getLatitude() > 139.4130){
			return true;
		} else {
			return false;
		}
	});

### When defining by an object

	var custumRule = {
		invoke: function(current, wacth){
			//In the first stage, the position of current is null. 
			//It can be referred to now from the 2nd time or subsequent ones.
			if (current == null) return false;
	
			//A custom-made event when latitude longitude turns up rather than Tokyo
			if (wacth.getLatitude() > 35.4122 && wacth.getLatitude() > 139.4130){
				return true;
			} else {
				return false;
			}
		}
	};
	Locater.Rules.define('fooEvent', custumRule);


### Mounting of event handler

The rest only mounts processing at the time of an event occurring in an event hair drier.  
Since **fooEvent** defined the event name, it mounts in an event hair drier by a key called **fooEvent**.

	(function(){
		//Alias
		var Application = Locater.Application;
		var Adapter = Locater.Adapter;
		var Handler = Locater.Handler;

		//Handlers
		var myHanlder = new Handler.SimpleHandler({
			fooEvent: function(context){
				//do something
			}
		});

		window.addEvent('domready', function(){

			var adapter = new Adapter.CurrentPositionAdapter();
			var app = new Application(adapter);
			app.addHandler(myHanlder);
			app.run();

		});
	}());



Use of an inclusion rule 
------------------------------------------------------------------------

There are **Locater.Rules.MileRule** and **Locater.Rules.KilometerRule** which can define the custom-made event performed whenever a fixed distance separates in Locator.  
There is the following feature, respectively. 

* Locater.Rules.MileRule - The mileage specified by coordinates can define the event performed whenever it gets used.
* Locater.Rules.KilometerRule - The number of kilometers specified by coordinates can define the event performed whenever it gets used.

### The definition method of a rule 

	//Whenever it gets used, 1 mile of fiveKilometerOvered events of an event hair drier are performed.
	Locater.Rules.define('oneMileOvered', new Locater.Rules.MileRule(1));

	//Whenever it gets used, 5 km of fiveKilometerOvered events of an event hair drier are performed.
	Locater.Rules.define('fiveKilometerOvered', new Locater.Rules.KilometerRule(5));


The test which uses an emulator 
------------------------------------------------------------------------

An emulator can be used for the test of application.  
In an emulator, a coordinates position can be specified instead of using [Geolocation API](http://dev.w3.org/geo/api/spec-source.html "Geolocation API").  
That is, it is possible to specify and test test data freely.

### Locater.Emulator.CurrentPositionEmulator

CurrentPositionEmulator enables the test of the application which uses CurrentPositionAdaptor.  
The actual example of use specifies an emulator as a change of an adapter as follows.  

	(function(){
		//Alias
		var Application = Locater.Application,
			Emulator = Locater.Emulator,
			Handler = Locater.Handler;

		//Handlers
		var myHanlder = new Handler.SimpleHandler({
			currentWatched: function(context){
				alert(context.getLatitude()); //Alert 37
				alert(context.getLongitude()); //Alert -122
			}
		});

		window.addEvent('domready', function(){
			var emulator = new Emulator.CurrentPositionEmulator({
				potistion: {
					coords: {
						latitude: 37,
						longitude: -122
					}
				}
			});
			var app = new Application(emulator);
			app.addHandler(myHanlder);
			app.run();

		});
	}());


### Locater.Emulator.WatchPositionEmulator

WatchPositionEmulator enables the test of the application which uses WatchPositionAdaptor.  
The actual example of use specifies an emulator as a change of an adapter as follows.  
The interval processed as the **interval option** can be specified.  

	(function(){
		//Alias
		var Application = Locater.Application,
			Emulator = Locater.Emulator,
			Handler = Locater.Handler;

		//Handlers
		var myHanlder = new Handler.SimpleHandler({
			currentWatched: function(context){
				alert(context.getLatitude()); //Alert 37
				alert(context.getLongitude()); //Alert -122
			},
			positionChanged: function(context){
				alert(context.getLatitude()); //Alert 36, 35 ....
				alert(context.getLongitude()); //Alert -123, 124 ....
			}
		});

		window.addEvent('domready', function(){

			var emulator = new Emulator.WatchPositionEmulator({
				interval: 2000,
				positions: [
					{ coords: { latitude: 37, longitude: -122 } },
					{ coords: { latitude: 36, longitude: -123 } },
					{ coords: { latitude: 35, longitude: -124 } }
				]
			});
			var app = new Application(emulator);
			app.addHandler(myHanlder);
			app.run();

		});
	}());


Required libraries
------------------------------------------------------------------------

### Mootools Core
http://mootools.net/core/3db61bb25aa2a339b7aee42f4d7bad03


Building Locater
------------------------------------------------------------------------

### All components
packager build Locater/* +use-only Locater > locater-full.js

### Application which acquires a coordinates position only once

packager build Locater/Locater.Application Locater/Locater.Adapter.CurrentPositionAdapter +use-only Locater > locater-current-position.js
packager build Locater/Locater.Application Locater/Locater.Emulator.CurrentPositionEmulator +use-only Locater > locater-current-position-dev.js

### Application which acquires a coordinates position periodically

packager build Locater/Locater.Application Locater/Locater.Adapter.WatchPositionAdapter +use-only Locater > locater-watch-position.js
packager build Locater/Locater.Application Locater/Locater.Emulator.WatchPositionEmulator +use-only Locater > locater-watch-position-dev.js 


Screenshots
------------------------------------------------------------------------

