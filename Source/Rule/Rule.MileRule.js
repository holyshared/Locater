/*
---
name: Locater.Rules.MileRule

description: The rule definition library using a mile 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Locater/Locater.Rules.RadiusRule

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