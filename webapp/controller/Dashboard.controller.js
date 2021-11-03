	sap.ui.define([
		"./BaseController",
		"../model/models",
		"../model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
	], function (BaseController, models, formatter, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("tchibo.b2c.mdm.more.ui.controller.Dashboard", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit: function () {
				this.setModel(models.createDashboardModel(this.getResourceBundle()), "dashboard");
				this._oTable = this.byId("idFragmentDashboardProcessTile--idDashboardProcessTable");
				this._oComboBox = this.byId("idFragmentDashboardProcessTile--idFragmentSelectVkorg--idSelectVkorg");
			},

			onAfterRendering: function () {
				const sSelectedKey = "0001"
				this._getDashboardProcess([new Filter("vkorg", FilterOperator.EQ, sSelectedKey)]);
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			onDataRequestedProcess: function () {
				this.getModel("dashboard").setProperty("/busyProcess", true);
			},

			onDataReceivedProcess: function () {
				this._bindingChange();
				this.getModel("dashboard").setProperty("/busyProcess", false);
			},

			onDataRequestedError: function () {
				this.getModel("dashboard").setProperty("/busyError", false);
			},

			onDataRequestedErrorDetail: function () {
				this.getModel("dashboard").setProperty("/busyErrorDetail", false);
			},

			onNavigateWorklist: function (oEvent, sTile) {
				this.getModel("appView").setProperty("/busy", true);

				if (sTile === "process") {
					this.getRouter().navTo("worklist", {
						kanal: oEvent.getSource().getProperty("ariaLabel")
					});
				} else {
					this.getRouter().navTo("worklist", {
						clusterType: oEvent.getSource().getProperty("ariaLabel"),
						clusterError: oEvent.getSource().getProperty("additionalTooltip")
					});
				}
			},

			onNavigateWorklistNoFilter: function () {
				this.getModel("appView").setProperty("/busy", true);
				this.getRouter().navTo("worklist", {
					view: "dashboard"
				});
			},

			onSelectionChangeVkorg: function (oEvent) {
				let aFilters = [];
				let sSelectedKey = oEvent.getSource().getSelectedKey();
				const oBinding = this._oTable.getBinding("rows");

				console.log(sSelectedKey);
				aFilters.push(new Filter("vkorg", FilterOperator.EQ, sSelectedKey));
				!oBinding ? this._getDashboardProcess(aFilters) : oBinding.filter(aFilters, true);
			},

			/* =========================================================== */
			/* async methods                                               */
			/* =========================================================== */

			_getDashboardProcess: async function (aFilters) {
				this._oTable.bindRows({
					path: "modelOdatav4>/DashboardProcess",
					parameters: {
						templateShareable: false
					},
					events: {
						dataRequested: (oEvent) => this.onDataRequestedProcess(oEvent),
						dataReceived: (oEvent) => this.onDataReceivedProcess(oEvent)
					},
					filters: aFilters
				});
			},

			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */

			_bindingChange: function () {
				const sRowLength = this._oTable.getBinding("rows").getLength();
				if (this._oTable.isBound("rows") && sRowLength === 0) {
					this._oTable.unbindRows();
				}
			}

		});
	});