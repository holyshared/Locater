/*
---
name: YourPosition.Handler

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - YourPosition/YourPosition
  - YourPosition/YourPosition.Dialog
  - YourPosition/YourPosition.Views.StatusView
  - YourPosition/YourPosition.Views.CurrentPositionView
  - Locater/Locater.Handler.SimpleHandler

provides: [YourPosition.Handlers, YourPosition.Handlers.StatusHandler, YourPosition.Handlers.CurrentPositionHandler, YourPosition.Handlers.ErrorHandler]

...
*/

(function(YourPosition, Dialog, SimpleHandler){

YourPosition.Handlers = {
	StatusHandler: StatusHandler,
	CurrentPositionHandler: CurrentPositionHandler,
	ErrorHandler: ErrorHandler
};

/**
 * StatusHandler
 */
function StatusHandler(view){
	this._view = view;
};
StatusHandler.implement(new SimpleHandler());
StatusHandler.implement({

	start: function(){
		this._view.set('message', 'The application is begun....');
	},

	currentWatched: function(context){
		this._view.set('message', 'The present place was detected.');
	},

	stop: function(){
		this._view.set('message', 'The detection at the present place was stopped.');
	},

	error: function(error){
		switch(error.code){
			//PERMISSION_DENIED
			case error.PERMISSION_DENIED:
				this._permissionDenied(error);
				break;
			//POSITION_UNAVAILABLE
			case error.POSITION_UNAVAILABLE:
				this._positionUnavailable(error);
				break;
			//TIMEOUT
			case error.TIMEOUT:
				this._timeout(error);
				break;
			default:
				this._default(error);
				break;
		}
	},

	_permissionDenied: function(error){
		this._view.set('message', 'The acquisition of the location information was canceled.');
	}.protect(),

	_positionUnavailable: function(error){
		this._view.set('message', 'The present place was not able to be detected.');
	}.protect(),

	_timeout: function(error){
		this._view.set('message', 'The timeout was done though it tried to detect the present place.');
	}.protect(),

	_default: function(error){
		this._view.set('message', error.message);
	}.protect()

});


/**
 * CurrentPositionHandler
 */
function CurrentPositionHandler(view){
	this._view = view;
};

CurrentPositionHandler.implement(new SimpleHandler());
CurrentPositionHandler.implement({

	currentWatched: function(context){
		this._view.setValues({
			latitude: context.getLatitude(),
			longitude: context.getLongitude(),
			visible: true
		});
	}

});


/**
 * ErrorHandler
 */
var TITLE_REACQUISITION = 'Reacquisition of coordinates position';
var TITLE_NO_SUPPORT = 'The support is off the subject.';

var MSG_PERMISSION_DENIED = 'Are coordinates acquired again though the acquisition of the location information was canceled?';
var MSG_POSITION_UNAVAILABLE = 'Is the location information acquired again?';
var MSG_NO_SUPPORT = 'I am sorry, the support is off the subject.<br />Please try by a modern browser such as Firefox, Chrome, and Safari.'

function ErrorHandler(){
};

ErrorHandler.implement(new SimpleHandler());
ErrorHandler.implement({

	error: function(error){
		switch(error.code){
			//PERMISSION_DENIED
			case error.PERMISSION_DENIED:
				this._permissionDenied(error);
				break;
			//POSITION_UNAVAILABLE
			case error.POSITION_UNAVAILABLE:
				this._positionUnavailable(error);
				break;
			//TIMEOUT
			case error.TIMEOUT:
				this._timeout(error);
				break;
			default:
				this._default(error);
				break;
		}
	},

	_permissionDenied: function(error){
		var app = this.getApplication();
		Dialog.confirm(TITLE_REACQUISITION, MSG_PERMISSION_DENIED, function(){
			app.start();
		});
	}.protect(),

	_positionUnavailable: function(error){
		var app = this.getApplication();
		Dialog.confirm(TITLE_REACQUISITION, MSG_POSITION_UNAVAILABLE, function(){
			app.start();
		});
	}.protect(),

	_timeout: function(error){
		var app = this.getApplication();
		Dialog.confirm(TITLE_REACQUISITION, MSG_POSITION_UNAVAILABLE, function(){
			app.start();
		});
	}.protect(),

	_default: function(error){
		Dialog.alert(TITLE_NO_SUPPORT, MSG_NO_SUPPORT);
	}.protect()

});

}(YourPosition, YourPosition.Dialog, Locater.Handler.SimpleHandler));