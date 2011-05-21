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

/**
 *============================================= 
 * View Common Function
 *============================================= 
 */

/* View
--------------------------------------------------*/
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
	if (!this._isBuild()) this._build();
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
	map.controls[renderPosition].push(this._build());
	this._toggleVisibleState();
}


/* State changed
--------------------------------------------------*/
function mapChanged(){
	if (!this.get('position')) return;
	this.render(this.get('position'));
}

function styleChanged(){
	var panel = (this._isBuild()) ? this._getPanel() : this._build();
	panel.setAttribute('class', this.get('style'));
}

function positionChanged(){
	if (!this.get('map')) return;
	this.render(this.get('position'), this.get('map'));
}

function visibleChanged(){
	if (!this._isBuild()) this._build();
	this._toggleVisibleState();
	this._highlight();
}

function toggleVisibleState() {
	var visible = this.get('visible');
	visible = (visible == undefined) ? false : visible;
	this._removeClass('hidden');
	this._removeClass('visible');
	if (visible){
		this._addClass('visible');
	} else {
		this._addClass('hidden');
	}
}

/* State animation
--------------------------------------------------*/
function highlight(){
	if (!(Browser.safari || Browser.chrome)) return;

	var self = this;
	var panel = this._getPanel();
	this._addClass('highlight');
	var listener = maps.event.addDomListenerOnce(panel, 'webkitAnimationEnd', function(event){
		self._removeClass('highlight');
	});
}


/**
 *============================================= 
 * CurrentPositionView
 *============================================= 
 */

var defaultCpvOptions = {
	title: 'current',
	latitude: 35.6763,
	longitude: 139.8105,
	map: null,
	style: 'currentPositionView',
	position: 'topLeft',
	visible: false
}

var cpvProps = [
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

function CurrentPositionView(opts){
	var options = {};
	for (var key in defaultCpvOptions){
		options[key] = opts[key] || defaultCpvOptions[key];
	}
	this.setValues(options);
}

function _buildCpvPanel(){
	if (this._viewPanel) return this._viewPanel;

	var viewPanel =	document.createElement('aside');
	viewPanel.setAttribute('class', this.get('style'));

	viewPanel.appendChild(this._buildHeader.call(this));
	viewPanel.appendChild(this._buildBody.call(this));

	this._viewPanel = viewPanel;
	this._toggleVisibleState();
	return viewPanel;
}

function _buildCpvHeader(){
	var viewPanelHeader = document.createElement('header');
	var viewPanelTitle = document.createElement('h3');
	var titleText = document.createTextNode(this.get('title'));

	viewPanelHeader.setAttribute('class', 'hd');

	viewPanelTitle.appendChild(titleText);
	viewPanelHeader.appendChild(viewPanelTitle);
	this._title = viewPanelTitle;
	return viewPanelHeader;
}

function _buildCpvBody(){
	var viewPanelBody = document.createElement('div');
	var propList = document.createElement('dl');

	viewPanelBody.setAttribute('class', 'bd');

	for (var i = 0; l = cpvProps.length, i < l; i++){
		var prop = cpvProps[i];
		var label = document.createElement('dt');
		var content = document.createElement('dd');
		var labelText = document.createTextNode(prop.label + ': ');
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
	this._setValue('title');
}

function cpvLatitudeChanged(){
	this._setValue('latitude');
}

function cpvLongitudeChanged(){
	this._setValue('longitude');
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
	_toggleVisibleState: toggleVisibleState,
	_highlight: highlight,
	_addClass: _addClass,
	_removeClass: _removeClass,
	render: render,
	map_changed: mapChanged,
	position_changed: positionChanged,
	style_changed: styleChanged,
	visible_changed: visibleChanged,
	title_changed: cpvTitleChanged,
	latitude_changed: cpvLatitudeChanged,
	longitude_changed: cpvLongitudeChanged
});


/**
 *============================================= 
 * StatusView
 *============================================= 
 */

var defaultSvOptions = {
	map: null,
	style: 'statusView',
	position: 'bottom',
	message: 'display status',
	visible: true
}

function StatusView(opts){
	var options = {};
	for (var key in defaultSvOptions){
		options[key] = opts[key] || defaultSvOptions[key];
	}
	this.setValues(options);
}

function _buildSvPanel(){
	if (this._viewPanel) return this._viewPanel;

	var viewPanel =	document.createElement('aside');
	viewPanel.setAttribute('class', this.get('style'));

	var message = document.createElement('strong');
	var text = document.createTextNode(this.get('message'));
	message.appendChild(text);

	viewPanel.appendChild(message);

	this._message = message;
	this._viewPanel = viewPanel;
	return viewPanel;
}

function svMessageChanged(){
	this._setValue('message');
	this._highlight();
}

function _addClass(value){
	var panel = this._getPanel();
	var classValue = panel.getAttribute('class');
	panel.setAttribute('class', classValue + ' ' + value);
}

function _removeClass(value){
	var panel = this._getPanel();
	var classValue = panel.getAttribute('class');
	classValue = classValue.replace(value, '');
	panel.setAttribute('class', classValue);
}

StatusView.implement(new maps.MVCObject());
StatusView.implement({
	_toRenderPosition: _toRenderPosition,
	_isBuild: _isBuild,
	_getPanel: _getPanel,
	_setValue: _setValue,
	_build: _buildSvPanel,
	_addClass: _addClass,
	_removeClass: _removeClass,
	_highlight: highlight,
	_toggleVisibleState: toggleVisibleState,
	render: render,
	visible_changed: visibleChanged,
	map_changed: mapChanged,
	style_changed: styleChanged,
	message_changed: svMessageChanged,
	position_changed: positionChanged
});

}(google.maps, App));
