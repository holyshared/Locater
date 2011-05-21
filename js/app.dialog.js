(function(App){

App.Dialog = Dialog;

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


function toggleVisibleState() {
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
	content: 'dialog',
	buttons: {}
}

function Dialog(opts){
	var options = {};
	for (var key in defaultDialogOptions){
		options[key] = opts[key] || defaultDialogOptions[key];
	}
	this.setValues(options);
	this._buildButton(options.buttons);
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
	this._toggleVisibleState();
}

function close(){
	this._visible = false;
	this._toggleVisibleState();
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
alert(key);
		var button = document.createElement('button');
		var text = document.createTextNode(key);
		button.setAttribute('type', 'button');
		button.setAttribute('class', 'button');
		button.addEventListener('click', buttons[key], false);
		button.appendChild(text);
		this._footer.appendChild(button);
	}
}

Dialog.implement({
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
Dialog.implement({
	_isBuild: _isBuild,
	_getPanel: _getPanel,
	_setValue: _setValue,
	_build: _buildDialogPanel,
	_buildButton: _buildButton,
	_addClass: _addClass,
	_removeClass: _removeClass,
	_toggleVisibleState: toggleVisibleState,
	open: open,
	close: close,
	style_changed: styleChanged,
	title_changed: titleChanged,
	content_changed: contentChanged
});

}(App));