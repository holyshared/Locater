(function(maps){

var renderPosition = {
	bottom: maps.ControlPosition.BOTTOM,
	bottomLeft: maps.ControlPosition.BOTTOM_LEFT,
	bottomRight: maps.ControlPosition.BOTTOM_RIGHT,
	left: maps.ControlPosition.LEFT,
	right: maps.ControlPosition.RIGHT,
	top: maps.ControlPosition.TOP,
	topRight: maps.ControlPosition.TOP_RIGHT,
	topLeft: maps.ControlPosition.TOP_LEFT
};

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
	map: null,
	style: 'currentPositionView',
	position: 'topLeft'
}

function CurrentPositionView(opts){
	var mergeOpts = {};
	for (var key in defaultOptions){
		var value = opts[key] || defaultOptions[key];
		mergeOpts[key] = value;
	}
	this.setValues(mergeOpts);
}

function render(position, map){
	var renderPosition = _toRenderPosition(position);
	if (!map){
		map = this.get('map');
	}
	map.controls[renderPosition].push(_build.call(this));
}

function _toRenderPosition(position){
	return renderPosition[position];
}

function _isBuild(){
	return (this._viewPanel) ? true : false;
}

function _getPanel(){
	return this._viewPanel;
}

function _build(){
	if (this._viewPanel) return this._viewPanel;

	var viewPanel =	document.createElement('aside');
	viewPanel.setAttribute('class', this.get('style'));

	viewPanel.appendChild(_buildHeader.call(this));
	viewPanel.appendChild(_buildBody.call(this));

	this._viewPanel = viewPanel;
	return viewPanel;
}

function _buildHeader(){
	var viewPanelHeader = document.createElement('header');
	var viewPanelTitle = document.createElement('h3');
	var titleText = document.createTextNode(this.get('title'));
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
		var contentText = document.createTextNode(this.get(prop.key));

		label.appendChild(labelText);
		content.appendChild(contentText);

		propList.appendChild(label);
		propList.appendChild(content);
		this[prop.name] = content;
	}

	viewPanelBody.appendChild(propList);

	return viewPanelBody;
}

function mapChanged(){
	if (!this.get('position')) return;
	this.render(this.get('position'));
}

function titleChanged(){
	_setValue.apply(this, ['title']);
}

function latitudeChanged(){
	_setValue.apply(this, ['latitude']);
}

function longitudeChanged(){
	_setValue.apply(this, ['longitude']);
}

function styleChanged(){
	if (!_isBuild.call(this)) return;
	var panel = _getPanel.call(this);
	panel.setAttribute('class', this.get('style'));
}

function positionChanged(){
	if (!this.get('map')) return;
	this.render(this.get('position'), this.get('map'));
}

function _setValue(name){
	if (!_isBuild.call(this)) return false;
	var propKey = '_' + name;
	var changeValue = this.get(name);
	if (this[propKey].textContent){
		this[propKey].textContent = changeValue;
	} else {
		this[propKey].innerHtml = changeValue;
	}
}

var methods = {
	render: render,
	map_changed: mapChanged,
	position_changed: positionChanged,
	style_changed: styleChanged,
	title_changed: titleChanged,
	latitude_changed: latitudeChanged,
	longitude_changed: longitudeChanged
};

CurrentPositionView.prototype = new maps.MVCObject();
for (var key in methods){
	CurrentPositionView.prototype[key] = methods[key];
}
window.CurrentPositionView = CurrentPositionView;

}(google.maps));
