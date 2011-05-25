(function(Application, Adapter, Handler){

var Observer = {
	attach: function(target, type, handler){
		if (target.addEventListener){
			target.addEventListener(type, handler, false);
		} else {
			target.attachEvent('on' + type, handler);
		}
	}
};

Observer.attach(window, 'load', function(){

	//Using Event Handlers
	var handlers = [
		new Handler.SimpleHandler({

			currentWatched: function(context){

				var dc = document;
				var view = dc.getElementById('context');

				var text = 'Latitude: ' + new String(context.getLatitude())
				 + ', Longitude: ' + new String(context.getLongitude());

				var p = dc.createElement('p');
				var textNode = dc.createTextNode(text);

				p.appendChild(textNode);

				view.appendChild(p);
			}

		}),

		new Handler.SimpleHandler({

			error: function(error){
				switch(error.code){
					//PERMISSION_DENIED
					//POSITION_UNAVAILABLE
					//TIMEOUT
					case error.PERMISSION_DENIED:
					case error.POSITION_UNAVAILABLE:
					case error.TIMEOUT:
						this._exception(error);
						break;
					default:
						this._default(error);
						break;
				}
			},

			_exception: function(error){
				alert('Please execute it again.');
			}.protect(),

			_default: function(error){
				alert('Your browser doesn\'t correspond to the acquisition of the location information.');
			}.protect()

		})
	];


	//Create Applications
	var adapter = new Adapter.CurrentPositionAdapter();
	var app = this.app = new Application(adapter);
	app.addHandlers(handlers);

	var doWatch = document.getElementById('doWatch');

	Observer.attach(doWatch, 'click', function(event){
		//Running Applications
		if (app.isWatching()){
			app.stop();
		}
		app.run();
	});

});

}(Locater.Application, Locater.Adapter, Locater.Handler));
