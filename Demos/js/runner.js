(function(maps, Application, Adapter, Handler, App){

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
	var currentPositionView = new App.Views.CurrentPositionView({
		map: map,
		title: 'Your position',
		position: 'top'
	});

	var statusView = new App.Views.StatusView({
		map: map,
		message: 'stating',
		position: 'bottom'
	});

	//Debugging event DebugHandler
	var debugEvents = ['currentWatched', 'error'];

	//Using Event Handlers
	var handlers = [
		new App.Handlers.StatusHandler(statusView),
		new Handler.DebugHandler({ events: debugEvents }),
		new Handler.CurrentPositionHandler(marker),
		new App.Handlers.ErrorHandler(statusView)
	];

	//Running Applications
	var adapter = new Adapter.CurrentPositionAdapter();
	var app = new Application(adapter);
	app.addHandlers(handlers).run();

}, false);

}(google.maps, Locater.Application, Locater.Adapter, Locater.Handler, App));
