sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("tchibo.b2c.mdm.more.ui.controller.Object", {
		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			const oViewModel = new sap.ui.model.json.JSONModel({
				objectTableTitle: this.getResourceBundle().getText("objectTableTitle"),
				delay: 0,
				sameDC: false,
				busyPage: false
			});
			this.setModel(oViewModel, "objectView");
			this.getModel("objectView").setProperty("/busyPage", true);

			this._oErrorTable = this.byId("errorTable");
			this._oDcTable = this.byId("idDcTable");
			this._oWebTable = this.byId("idWebTable");
		},

		onAfterRendering: function () {
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
		},

		/* =========================================================== */
		/* async methods                                               */
		/* =========================================================== */

		_prepareFilter: async function (oArticle) {
			const aFilters = [
				new Filter("vkorg", FilterOperator.EQ, oArticle.vkorg),
				new Filter("kanal", FilterOperator.EQ, oArticle.kanal),
				new Filter("kalwo", FilterOperator.EQ, oArticle.kalwo),
				new Filter("matnr", FilterOperator.EQ, oArticle.matnr)
			];
			const webFilters = [
				new Filter("matnr", FilterOperator.EQ, oArticle.matnr)
			];

			await this._getErrorItems(aFilters);
			await this._getDcInfoItems(aFilters);
			await this._getWebShopInfoItems(webFilters);
		},

		_getErrorItems: async function (aFilters) {
			return this._oErrorTable.bindRows({
				path: "/Errors",
				model: "modelOdatav4",
				filters: aFilters,
				events: {
					dataReceived: (oEvent) => this._onBindingChange(oEvent, "errorTable")
				},
				parameters: {
					$orderby: "error asc",
				}
			});
		},

		_getDcInfoItems: async function (aFilters) {
			return this._oDcTable.bindRows({
				path: "/DcInformations",
				model: "modelOdatav4",
				filters: aFilters,
				parameters: {
					$orderby: "mtpos_mara asc, vzwrk asc, matnrPosition asc"

				},
				events: {
					dataReceived: (oEvent) => this._onBindingChange(oEvent, "idDcTable")
				}
			});
		},

		_getWebShopInfoItems: async function (aFilters) {
			return this._oWebTable.bindRows({
				path: "/WebShopInformations",
				model: "modelOdatav4",
				filters: aFilters,
				parameters: {
					$orderby: "mtpos desc, vkorg asc, matnrPosition asc"
				},
				events: {
					dataReceived: (oEvent) => this._onBindingChange(oEvent, "idWebTable")
				}
			});
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		_onBindingChange: function (oEvent, sTableId) {
			this.getView().byId(sTableId).setVisibleRowCount(oEvent.getSource().getLength());
		},

		_onObjectMatched: function (oEvent) {
			const oArticle = JSON.parse(oEvent.getParameter("arguments").contextPath);
			this.getModel("objectView").setProperty("/overviewObject", oArticle);
			this._prepareFilter(oArticle);
			//Setze korrekte Navigation.
			this._setShellNavigation("worklist");
		}

	});
});