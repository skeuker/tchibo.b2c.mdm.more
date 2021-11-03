sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
	"use strict";

	return Controller.extend("tchibo.b2c.mdm.more.ui.controller.BaseController", {

		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		getSelectedItemText: function (oSelect) {
			return oSelect.getSelectedItem() ? oSelect.getSelectedItem().getKey() : "";
		},

		_setShellNavigation: function (sView) {
			const oRouter = this.getRouter();
			this.getOwnerComponent().getService("ShellUIService").then(function (oShellService) {
				oShellService.setBackNavigation(function () {
					oRouter.navTo(sView);
				});
			});
		},

		onMessageNames: function (sValue) {
			if (sValue === "EXCLUDED_FROM_CATEGORY_LISTS") {
				return this.getResourceBundle().getText("excluded_from_category_lists");
			} else if (sValue === "EXCLUDED_FROM_SEARCH") {
				return this.getResourceBundle().getText("excluded_from_search");
			} else if (sValue === "FORCE_NOT_AVAILABLE_EDITED") {
				return this.getResourceBundle().getText("force_not_available_edited");
			} else if (sValue === "FORCE_NOT_AVAILABLE_IMPORTED") {
				return this.getResourceBundle().getText("force_not_available_imported");
			} else if (sValue === "HAS_TEXT") {
				return this.getResourceBundle().getText("has_text");
			} else if (sValue === "HAS_IMAGE") {
				return this.getResourceBundle().getText("has_image");
			} else if (sValue === "HAS_TITLE") {
				return this.getResourceBundle().getText("has_title");
			} else if (sValue === "HAS_PRICE") {
				return this.getResourceBundle().getText("has_price");
			} else if (sValue === "PRODUCT_VISIBILITY") {
				return this.getResourceBundle().getText("product_visibility");
			} else if (sValue === "BC_ERROR") {
				return this.getResourceBundle().getText("bc_error");
			} else if (sValue === "STRECH_ARTICLE_ERROR") {
				return this.getResourceBundle().getText("strech_article_error");
			} else if (sValue === "RUEST_ERROR") {
				return this.getResourceBundle().getText("ruest_error");
			} else if (sValue === "MANUAL_PRODUCT_LIVE_STATUS") {
				return this.getResourceBundle().getText("manual_product_live_status");
			} else if (sValue === "STOCK_ERROR") {
				return this.getResourceBundle().getText("stock_error");
			} else {
				return sValue;
			}
		}

	});

});