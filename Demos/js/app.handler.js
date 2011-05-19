(function(App){

App.Handlers = {
	ErrorHandler: ErrorHandler
};

/**
 * ErrorHandler
 */
function ErrorHandler(){};

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
	}.protect(),

	_positionUnavailable: function(error){
	}.protect(),

	_timeout: function(error){
	}.protect(),

	_default: function(error){
	}.protect()

});

}(App));