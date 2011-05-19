(function(maps, App){

App.Views = {
	CurrentPositionView: CurrentPositionView,
	StatusView: StatusView
};

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

/**
 *============================================= 
 * View Common Function
 *============================================= 
 */

function _isBuild(){
	return (this._viewPanel) ? true : false;
}

function _getPanel(){
	return this._viewPanel;
}

function _toRenderPosition(position){
	return renderPosition[position];
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

function render(position, map){
	var renderPosition = this._toRenderPosition(position);
	if (!map){
		map = this.get('map');
	}
	map.controls[renderPosition].push(this._build.call(this));
}

function mapChanged(){
	if (!this.get('position')) return;
	this.render(this.get('position'));
}

function styleChanged(){
	if (!this._isBuild.call(this)) return;
	var panel = this._getPanel.call(this);
	panel.setAttribute('class', this.get('style'));
}


/**
 *============================================= 
 * CurrentPositionView
 *============================================= 
 */
function CurrentPositionView(opts){
	var mergeOpts = {};
	for (var key in defaultOptions){
		var value = opts[key] || defaultOptions[key];
		mergeOpts[key] = value;
	}
	this.setValues(mergeOpts);
}

function _buildCpvPanel(){
	if (this._viewPanel) return this._viewPanel;

	var viewPanel =	document.createElement('aside');
	viewPanel.setAttribute('class', this.get('style'));

	viewPanel.appendChild(this._buildHeader.call(this));
	viewPanel.appendChild(this._buildBody.call(this));

	this._viewPanel = viewPanel;
	return viewPanel;
}

function _buildCpvHeader(){
	var viewPanelHeader = document.createElement('header');
	var viewPanelTitle = document.createElement('h3');
	var titleText = document.createTextNode(this.get('title'));
	viewPanelTitle.appendChild(titleText);
	viewPanelHeader.appendChild(viewPanelTitle);
	this._title = viewPanelTitle;
	return viewPanelHeader;
}

function _buildCpvBody(){
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



function cpvTitleChanged(){
	this._setValue.apply(this, ['title']);
}

function cpvLatitudeChanged(){
	this._setValue.apply(this, ['latitude']);
}

function cpvLongitudeChanged(){
	this._setValue.apply(this, ['longitude']);
}

function cpvPositionChanged(){
	if (!this.get('map')) return;
	this.render(this.get('position'), this.get('map'));
}

CurrentPositionView.implement(new maps.MVCObject());
CurrentPositionView.implement({
	_toRenderPosition: _toRenderPosition,
	_isBuild: _isBuild,
	_getPanel: _getPanel,
	_setValue: _setValue,
	_build: _buildCpvPanel,
	_buildHeader: _buildCpvHeader,
	_buildBody: _buildCpvBody,
	render: render,
	map_changed: mapChanged,
	position_changed: cpvPositionChanged,
	style_changed: styleChanged,
	title_changed: cpvTitleChanged,
	latitude_changed: cpvLatitudeChanged,
	longitude_changed: cpvLongitudeChanged
});


/**
 *============================================= 
 * StatusView
 *============================================= 
 */
function StatusView(opts){
	var mergeOpts = {};
	for (var key in defaultOptions){
		var value = opts[key] || defaultOptions[key];
		mergeOpts[key] = value;
	}
	this.setValues(mergeOpts);
}


function _buildSvPanel(){
	if (this._viewPanel) return this._viewPanel;
/*
	var viewPanel =	document.createElement('aside');
	viewPanel.setAttribute('class', this.get('style'));

	viewPanel.appendChild(_buildHeader.call(this));
	viewPanel.appendChild(_buildBody.call(this));

	this._viewPanel = viewPanel;
	return viewPanel;
*/
}

CurrentPositionView.implement(new maps.MVCObject());
CurrentPositionView.implement({
	_toRenderPosition: _toRenderPosition,
	_isBuild: _isBuild,
	_getPanel: _getPanel,
	_setValue: _setValue,
	_build: _buildSvPanel,
	render: render,
	map_changed: mapChanged,
	style_changed: styleChanged
});

}(google.maps, App));
