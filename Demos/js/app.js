(function(maps){

window.addEventListener('load', function(){

	var element = document.getElementById('map');

	var defaultPosition = new maps.LatLng(35.6763, 139.8105);
	var map = new maps.Map(element, {
		disableDefaultUI: false,
		disableDoubleClickZoom: false,
		draggable: false,
		mapTypeControl: false,
		mapTypeId: maps.MapTypeId.ROADMAP,
		zoom: 18,
		center: defaultPosition
	});

	var view = new CurrentPositionView({ title: 'Your position' });
	view.render('topLeft', map);
	view.set('latitude', 139.8102);

}, false);

}(google.maps));
