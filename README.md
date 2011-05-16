Locater
====================================

Locater is an application framework using [Geolocation API Specification](http://dev.w3.org/geo/api/spec-source.html "Geolocation API Specification").  
It is possible to correspond from the medium scale flexibly because it is the best for the application of a large scale, and event operation type.
The event can control a detailed event by being able to customize and coming.

![Screenshot1](url_to_image1)

How to use
------------------------------------------------------------------------

### Step1 The handler's making

Hands used by the application are made in the beginning. 
The event handler mounts the processing of the event that it wants to handle the event with the object. 
Please make it as much as possible though it is unquestionable for the error hands even if it doesn't make it. 

#### Hanlder Example

	#js
	var myHanlder = {
		currentWatched: function(context){
			//do something
		}
	};

	var errorHanlder = {
		error: function(error){
			alert(error.message);
		}
	};

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
		var myHanlder = {
			currentWatched: function(context){
				//do something
			}
		};

		var errorHanlder = {
			error: function(error){
				alert(error.message);
			}
		};

		window.addEvent('domready', function(){

			var adapter = new Adapter.CurrentPositionAdapter();
			var app = new Application(adapter);
			app.addHandler(myHanlder);
			app.addHandler(errorHanlder);
			app.run();

		});
	}());


Screenshots
------------------------------------------------------------------------

