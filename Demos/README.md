YourPosition
==================================

This application is an application to display your present position in the map by using location information API.
This application is made for the demonstration of [Locater](https://github.com/holyshared/Locater "Locater"). 

Author
----------------------------------
Noritaka Horio<holy.shared.design@gmail.com>

Licence
----------------------------------
[The MIT Licence ](http://www.opensource.org/licenses/mit-license.php "The MIT Licence ")

Build of source
----------------------------------

Please do the build by using [packager](https://github.com/kamicane/packager "packager").

### Mootools
packager build Core/Object Core/Browser Core/Class Core/Class.Extras

### Locater(All components)
packager build Locater/Locater.Application Locater/Locater.Handler.DebugHandler Locater/Locater.Handler.CurrentPositionHandler +use-only Locater

### Application
packager build YourPosition/* +use-only YourPosition
