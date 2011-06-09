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