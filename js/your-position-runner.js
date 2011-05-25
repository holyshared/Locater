(function(maps, Application, Adapter, Handler, YourPosition){

window.addEventListener('load', function(){

	var element = document.getElementById('map');

	var defaultPosition = new maps.LatLng(35.6763, 139.8105);

	var map = new maps.Map(element, {
		disableDefaultUI: false,
		disableDoubleClickZoom: false,
		draggable: false,
		mapTypeControl: false,
		mapTypeId: maps.MapTypeId.ROADMAP,
		navigationControl: false,
		streetViewControl: false,
		zoom: 18,
		center: defaultPosition
	});

	//To view the current marker position
	var marker = new maps.Marker({
		map: map,
		position: defaultPosition
	});

	//View pane displays the current position
	var currentPositionView = new YourPosition.Views.CurrentPositionView({
		map: map,
		title: 'Your position',
		position: 'top',
		visible: false
	});

	var statusView = new YourPosition.Views.StatusView({
		map: map,
		message: 'The situation is displayed here.',
		position: 'bottom'
	});

	//Debugging event DebugHandler
	var debugEvents = ['currentWatched', 'error'];

	//Using Event Handlers
	var handlers = [
		new YourPosition.Handlers.StatusHandler(statusView),
		new YourPosition.Handlers.CurrentPositionHandler(currentPositionView),
		new Handler.DebugHandler({ events: debugEvents }),
		new Handler.CurrentPositionHandler(marker),
		new YourPosition.Handlers.ErrorHandler()
	];

	//Create Applications
	var adapter = new Adapter.CurrentPositionAdapter();
	var app = this.app = new Application(adapter);
	app.addHandlers(handlers);


	var doWatch = document.getElementById('doWatch');
	doWatch.addEventListener('click', function(event){

		//Running Applications
		if (!app.isWatching()){
			app.run();
		}

	}, false);

}, false);

}(google.maps, Locater.Application, Locater.Adapter, Locater.Handler, YourPosition));
