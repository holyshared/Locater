/*
---
name: YourPosition

description: 

license: MIT-style

authors:
- Noritaka Horio

provides: [YourPosition]

...
*/
(function(){

var YourPosition = {
	name: 'Loacter demo application',
	version: '1.0'
};

this.YourPosition = YourPosition;

}());

/*
---
name: YourPosition.MVCObject

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - YourPosition/YourPosition

provides: [YourPosition.MVCObject]

...
*/

(function(YourPosition){

YourPosition.MVCObject = MVCObject;

function MVCObject(){}

MVCObject.implement({
	set: function(name, value){
		if (this[name] == value) return;
		this[name] = value;
		if (this[name + '_changed']) {
			this[name + '_changed']();
		}
	},
	get: function(name){
		return (this[name] == undefined || this[name] == null) ? '' : this[name];
	},
	setValues: function(values){
		for (var name in values){
			this.set(name, values[name]);
		}
	}
});

}(YourPosition));

/*
---
name: YourPosition.Dialog

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Function
  - YourPosition/YourPosition
  - YourPosition/YourPosition.MVCObject

provides: [YourPosition.Dialog]

...
*/

(function(YourPosition){

YourPosition.Dialog = Dialog;

/**
 *============================================= 
 * Dialog Common Function
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

function _setValue(name){
	if (!this._isBuild()) this._build();
	var propKey = '_' + name;
	var changeValue = this.get(name);

	if (this[propKey].textContent){
		this[propKey].textContent = '';
	} else {
		this[propKey].innerHtml = '';
	}

	var text = document.createTextNode(changeValue);
	this[propKey].appendChild(text);
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

function _toggleVisibleState() {
	var visible = this._visible;
	this._removeClass('hidden');
	this._removeClass('visible');
	if (visible){
		this._addClass('visible');
	} else {
		this._addClass('hidden');
	}
}

var defaultDialogOptions = {
	title: 'current',
	style: 'dialog',
	content: 'dialog'
}

function Dialog(opts){
	var options = {};
	for (var key in defaultDialogOptions){
		options[key] = opts[key] || defaultDialogOptions[key];
	}
	this.setValues(options);
	this._buildButton(opts.buttons);
	this._visible = false;
}

function _buildDialogPanel(){
	if (this._viewPanel) return this._viewPanel;

	var viewPanel =	document.createElement('aside');
	viewPanel.setAttribute('class', this.get('style'));

	var header = document.createElement('header');
	var headerTitle = document.createElement('h3');

	header.setAttribute('class', 'hd');
	header.appendChild(headerTitle);

	viewPanel.appendChild(header);

	var content = document.createElement('div');
	content.setAttribute('class', 'bd');

	viewPanel.appendChild(content);

	var footer = document.createElement('footer');
	footer.setAttribute('class', 'ft');

	viewPanel.appendChild(footer);

	document.body.appendChild(viewPanel);

	this._title = headerTitle;
	this._content = content;
	this._footer = footer;
	this._viewPanel = viewPanel;
	return viewPanel;
}

function open(){
	this._visible = true;
	if (!this._isBuild()) this._build();
	this._toggleVisibleState();
}

function close(){
	this._visible = false;
	this._destroy();
}

function _destroy(){
	var panel = this._getPanel();
	var parent = panel.parentNode;
	parent.removeChild(panel);
}

function contentChanged(){
	this._setValue('content');
}

function titleChanged(){
	this._setValue('title');
}

function styleChanged(){
	var panel = (this._isBuild()) ? this._getPanel() : this._build();
	panel.setAttribute('class', this.get('style'));
}

function _buildButton(buttons){
	for (var key in buttons){
		var button = document.createElement('button');
		var text = document.createTextNode(key);
		button.setAttribute('type', 'button');
		button.setAttribute('class', 'button');
		button.addEventListener('click', this._bindHandler(buttons[key]), false);
		button.appendChild(text);
		this._footer.appendChild(button);
	}
}

function _bindHandler(handler){
	var self = this;
	return function(){
		var isClose = handler.call(self);
		if (isClose != false){
			self.close();
		}
	}
}

/**
 * Dialog.confirm('fuga', 'hoge', okHandler, cancelHandler);
 */
function showConfirm(title, content, okHandler, cancelHandler){
	var options = {
		title: title,
		content: content,
		buttons: {
			'Ok': okHandler,
			'Cancel': cancelHandler || function(){}
		}
	};
	var dialog = new Dialog(options);
	return dialog;
}
Dialog.confirm = showConfirm;


/**
 * Dialog.alert('fuga', 'hoge', okHandler);
 */
function showAlert(title, content, okHandler){
	var options = {
		title: title,
		content: content,
		buttons: {
			'Ok': okHandler || function(){}
		}
	};
	var dialog = new Dialog(options);
	return dialog;
}
Dialog.alert = showAlert;

Dialog.implement(new YourPosition.MVCObject());
Dialog.implement({
	_isBuild: _isBuild,
	_getPanel: _getPanel,
	_setValue: _setValue,
	_build: _buildDialogPanel,
	_buildButton: _buildButton,
	_addClass: _addClass,
	_removeClass: _removeClass,
	_toggleVisibleState: _toggleVisibleState,
	_bindHandler: _bindHandler,
	_destroy: _destroy,
	open: open,
	close: close,
	style_changed: styleChanged,
	title_changed: titleChanged,
	content_changed: contentChanged
});

}(YourPosition));

/*
---
name: YourPosition.View

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Function
  - Core/Browser
  - YourPosition/YourPosition

provides: [YourPosition.Views, YourPosition.Views.CurrentPositionView, YourPosition.Views.StatusView]

...
*/

(function(maps, YourPosition){

YourPosition.Views = {
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
		this[propKey].textContent = '';
	} else {
		this[propKey].innerHtml = '';
	}

	var text = document.createTextNode(changeValue);
	this[propKey].appendChild(text);
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
//	var titleText = document.createTextNode(this.get('title'));

	viewPanelHeader.setAttribute('class', 'hd');

//	viewPanelTitle.appendChild(titleText);
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
//		var contentText = document.createTextNode(this.get(prop.key));

		label.appendChild(labelText);
//		content.appendChild(contentText);

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
//	var text = document.createTextNode(this.get('message'));
	//message.appendChild(text);

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

}(google.maps, YourPosition));


/*
---
name: YourPosition.Handler

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - YourPosition/YourPosition
  - YourPosition/YourPosition.Dialog
  - YourPosition/YourPosition.Views.StatusView
  - YourPosition/YourPosition.Views.CurrentPositionView
  - Locater/Locater.Handler.SimpleHandler

provides: [YourPosition.Handlers, YourPosition.Handlers.StatusHandler, YourPosition.Handlers.CurrentPositionHandler, YourPosition.Handlers.ErrorHandler]

...
*/

(function(YourPosition, Dialog, SimpleHandler){

YourPosition.Handlers = {
	StatusHandler: StatusHandler,
	CurrentPositionHandler: CurrentPositionHandler,
	ErrorHandler: ErrorHandler
};

/**
 * StatusHandler
 */
function StatusHandler(view){
	this._view = view;
};
StatusHandler.implement(new SimpleHandler());
StatusHandler.implement({

	start: function(){
		this._view.set('message', 'The application is begun....');
	},

	currentWatched: function(context){
		this._view.set('message', 'The present place was detected.');
	},

	stop: function(){
		this._view.set('message', 'The detection at the present place was stopped.');
	},

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
		this._view.set('message', 'The acquisition of the location information was canceled.');
	}.protect(),

	_positionUnavailable: function(error){
		this._view.set('message', 'The present place was not able to be detected.');
	}.protect(),

	_timeout: function(error){
		this._view.set('message', 'The timeout was done though it tried to detect the present place.');
	}.protect(),

	_default: function(error){
		this._view.set('message', error.message);
	}.protect()

});


/**
 * CurrentPositionHandler
 */
function CurrentPositionHandler(view){
	this._view = view;
};

CurrentPositionHandler.implement(new SimpleHandler());
CurrentPositionHandler.implement({

	currentWatched: function(context){
		this._view.setValues({
			latitude: context.getLatitude(),
			longitude: context.getLongitude(),
			visible: true
		});
	}

});


/**
 * ErrorHandler
 */
var TITLE_NO_SUPPORT = 'The support is off the subject.';

var MSG_NO_SUPPORT = 'I am sorry, the support is off the subject.<br />Please try by a modern browser such as Firefox, Chrome, and Safari.'

function ErrorHandler(){
};

ErrorHandler.implement(new SimpleHandler());
ErrorHandler.implement({

	error: function(error){
		switch(error.code){
			default:
				this._default(error);
				break;
		}
	},

	_default: function(error){
		Dialog.alert(TITLE_NO_SUPPORT, MSG_NO_SUPPORT);
	}.protect()

});

}(YourPosition, YourPosition.Dialog, Locater.Handler.SimpleHandler));
