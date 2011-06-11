/*
---
name: Locater.Rules.KilometerRule

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Locater/Locater.Rules.RadiusRule

provides: [Locater.Rules.KilometerRule]

...
*/

(function(Rules){

function KilometerRule(radius){
	Rules.RadiusRule.apply(this, [radius]);
}

KilometerRule.implement(new Rules.RadiusRule());
KilometerRule.implement({ _rate: 6371 });

Rules.KilometerRule = KilometerRule;

}(Locater.Rules));