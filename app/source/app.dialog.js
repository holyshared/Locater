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