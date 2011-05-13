(function(win){

win.isEqualValues = isEqualValues;
win.assertEquals = assertEquals;
win.assertTrue = assertTrue;
win.assertFalse = assertFalse;

var ul = document.createElement('ul');
win.addEventListener('load', function(){
	var elements = document.getElementsByTagName('body');
	elements[0].appendChild(ul);
}, false);

var type = {
	OK: 'ok',
	NG: 'ng'
}

function createRow(message, type){
	var row = document.createElement('li');
	if (type == type.NG) {
		row.setAttribute('class', 'ok');
	} else {
		row.setAttribute('class', 'ng');
	}
	row.appendChild(document.createTextNode(message));
	return row;
}

function isEqualValues(values, context){
	for (var key in values){
		var first = key.charAt(0).toUpperCase();
		var other = key.substr(1, key.length);
		var getter = 'get' + first + other;
		if (values[key] != context[getter]()) {
			return false;
		}
	}
	return true;
}

function assertEquals(first, second, message){
	var row = (first == second) ? createRow('assert ok', type.OK) : createRow(message, type.NG);
	ul.appendChild(row);
}

function assertTrue(value, message){
	var row = (value == true) ? createRow('assert ok', type.OK) : createRow(message, type.NG);
	ul.appendChild(row);
}

function assertFalse(value, message){
	var row = (value == false) ? createRow('assert ok', type.OK) : createRow(message, type.NG);
	ul.appendChild(row);
}

}(window));
