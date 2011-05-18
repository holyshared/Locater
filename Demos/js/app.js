(function(maps, Application, Adapter, Handler){

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
	var view = new CurrentPositionView({
		map: map,
		title: 'Your position',
		position: 'left'
	});

	//Debugging event DebugHandler
	var debugEvents = ['start', 'stop', 'error', 'currentWatched'];

	//Using Event Handlers
	var handlers = [
		new Handler.DebugHandler({
			events: debugEvents
		}),
		new Handler.CurrentPositionHandler(marker)
	];

	//Running Applications
	var adapter = new Adapter.CurrentPositionAdapter();
	var app = new Application(adapter);
	app.addHandlers(handlers).run();

}, false);

}(google.maps, Locater.Application, Locater.Adapter, Locater.Handler));
