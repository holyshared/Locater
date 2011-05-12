(function(){

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

function assertEquals(first, second){
	return (first == second);
}

function assertTrue(value){
	return (value == true);
}

function assertFalse(value){
	return (value == false);
}

}());
