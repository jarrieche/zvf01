/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comvf01.off./zvf01_offline/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
