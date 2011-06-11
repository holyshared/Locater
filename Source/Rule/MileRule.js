/*
---
name: Locater.Rules.MileRule

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Locater/Locater.Rules.MileRule

provides: [Locater.Rules.MileRule]

...
*/

(function(Rules){

function MileRule(radius){
	Rules.RadiusRule.apply(this, [radius]);
}

MileRule.implement(new Rules.RadiusRule());
MileRule.implement({ _rate: 3959 });

Rules.MileRule = MileRule;

}(Locater.Rules));