sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("tchibo.b2c.mdm.more.ui.controller.App", {

		onInit: function () {
			const oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				selectedVkorg: [],
				magrv_filter: [{
					"magrv": "NORM"
				}, {
					"magrv": "SEPF"
				}, {
					"magrv": "SEPA"
				}, {
					"magrv": "STRE"
				}, {
					"magrv": "D2CS"
				}, {
					"magrv": "D2CK"
				}, {
					"magrv": "D2CL"
				}, {
					"magrv": "DEZK"
				}, {
					"magrv": "D2CG"
				}, {
					"magrv": "WERT"
				}, {
					"magrv": "HANG"
				}],
				ColumnCollection: [{
					"path": "matnr",
					"text": "Artikelnummer"
				}, {
					"path": "tdbnr",
					"text": "Bestellnummer"
				}, {
					"path": "maktx",
					"text": "Artikelbeschreibung"
				}, {
					"path": "clusterType",
					"text": "Meldungscluster"
				}, {
					"path": "errors",
					"text": "Meldung"
				}, {
					"path": "vkorg",
					"text": "vkorg"
				}, {
					"path": "kalwo",
					"text": "hvk"
				}, {
					"path": "kanal",
					"text": "Phasentyp"
				}, {
					"path": "magrv",
					"text": "ArtikelgruppePM"
				}, {
					"path": "mtart",
					"text": "Artikelart"
				}, {
					"path": "atyp",
					"text": "F/R"
				}],
				kanal_filter: [{
					"kanal": "HVK",
					"text": "Hauptverkauf"
				}, {
					"kanal": "PVK",
					"text": "TchiboCard"
				}, {
					"kanal": "SCOUT",
					"text": "Scout"
				}, {
					"kanal": "SM",
					"text": "Mixer"
				}, {
					"kanal": "TC",
					"text": "Dauersortiment"
				}, {
					"kanal": "TN",
					"text": "Prozente"
				}, {
					"kanal": "TL",
					"text": "Streckenartikel"
				}, {
					"kanal": "TM",
					"text": "TM"
				}]
			});

			this.setModel(oViewModel, "appView");
			oViewModel.setSizeLimit(999);

			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});

});