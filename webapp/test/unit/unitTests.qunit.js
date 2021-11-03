/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"tchibo/b2c/mdm/more/ui/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});