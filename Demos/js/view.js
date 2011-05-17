(function(maps){

var props = [
	{
		name: '_latitude',
		key: 'latitude',
		label: 'latitude'
	},
	{
		name: '_longitude',
		key: 'longitude',
		label: 'longitude'
	}
];

var defaultOptions = {
	title: 'current',
	latitude: 35.6763,
	longitude: 139.8105,
	map: null
}

function CurrentPositionView(opts){
	var mergeOpts = {};
	for (var key in defaultOptions){
		var value = opts[key] || defaultOptions[key];
		if (key == 'map'){
			this.setMap(value);
		} else {
			mergeOpts[key] = value;
		}
	}
	this._opts = mergeOpts;
}

function draw(){
}

function onAdd(){
	var map = this.getMap();
	map.controls[maps.ControlPosition.TOP_LEFT].push(_build.call(this));
}

function onRemove(){
	var parent = this._element.parentNode;
	parent.removeChild(this._element);
	this._element = null;
}

function _build(){
	var viewPanel =	document.createElement('aside');
	viewPanel.setAttribute('class', 'currentPositionView');

	viewPanel.appendChild(_buildHeader.call(this));
	viewPanel.appendChild(_buildBody.call(this));

	this._viewPanel = viewPanel;
	return viewPanel;
}

function _buildHeader(){
	var viewPanelHeader = document.createElement('header');
	var viewPanelTitle = document.createElement('h3');
	var titleText = document.createTextNode(this._opts.title);
	viewPanelTitle.appendChild(titleText);
	viewPanelHeader.appendChild(viewPanelTitle);
	this._title = viewPanelTitle;
	return viewPanelHeader;
}

function _buildBody(){
	var viewPanelBody = document.createElement('div');
	var propList = document.createElement('dl');

	for (var i = 0; l = props.length, i < l; i++){
		var prop = props[i];
		var label = document.createElement('dt');
		var content = document.createElement('dd');
		var labelText = document.createTextNode(prop.label);
		var contentText = document.createTextNode(this._opts[prop.key]);

		label.appendChild(labelText);
		content.appendChild(contentText);

		propList.appendChild(label);
		propList.appendChild(content);
		this[prop.name] = content;
	}

	viewPanelBody.appendChild(propList);

	return viewPanelBody;
}

var methods = {
	draw: draw,
	onAdd: onAdd,
	onRemove: onRemove
};

CurrentPositionView.prototype = new maps.OverlayView();
for (var key in methods){
	CurrentPositionView.prototype[key] = methods[key];
}
window.CurrentPositionView = CurrentPositionView;

}(google.maps));
