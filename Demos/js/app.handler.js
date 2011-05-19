(function(App){

App.Handlers = {
	StatusHandler: StatusHandler,
	ErrorHandler: ErrorHandler
};

/**
 * StatusHandler
 */
function StatusHandler(view){
	this._view = view;
};

StatusHandler.implement({

	start: function(){
		this._view.set('message', 'The application is begun....');
	},

	currentWatched: function(context){
		this._view.set('message', 'The present place was detected.');
	},

	stop: function(){
		this._view.set('message', 'The detection at the present place was stopped.');
	}

});



/**
 * ErrorHandler
 */
function ErrorHandler(view){
	this._view = view;
};

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

}(App));