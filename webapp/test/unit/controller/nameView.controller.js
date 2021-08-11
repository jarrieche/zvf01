/*global QUnit*/

sap.ui.define([
	"comvf01.off./zvf01_offline/controller/nameView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("nameView Controller");

	QUnit.test("I should test the nameView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
