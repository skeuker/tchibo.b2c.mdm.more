sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"../model/models",
	"sap/ui/Device",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/Token",
	"sap/ui/export/Spreadsheet"
], function (BaseController, formatter, models, Device, Filter, FilterOperator, MessageToast, Token, Spreadsheet) {
	"use strict";

	return BaseController.extend("tchibo.b2c.mdm.more.ui.controller.Worklist", {

		formatter: formatter,
		_smartFilterBar: null,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			this._mViewSettingsDialogs = {};
			this.oPersonalizationDialog = null;

			const oViewModel = new sap.ui.model.json.JSONModel({
				SortItems: [],
				mulitsearchMatnr: [],
				mulitsearchTdbnr: [],
				sorter: [],
				fullFileters: [],
				tableBusy: false,
				filterBusy: false,
				noItems: false,
				tableTitleRowCount: 0,
				enabled: {
					download: false,
					p13nReset: false
				}
			});

			this.setModel(oViewModel, "worklistView");
			this._oTable = this.byId("idWorklistTable");

			var fnPress = this.handleActionPress.bind(this);
			this._oTable.setRowActionTemplate(new sap.ui.table.RowAction({
				items: [
					new sap.ui.table.RowActionItem({
						type: "Navigation",
						press: fnPress
					})
				]
			}));
			this._oTable.setRowActionCount(1);

			this._smartFilterBar = this.getView().byId("smartFilterBar");
			if (this._smartFilterBar) {
				this._smartFilterBar.attachFilterChange(function () {});
			}

			//Daten für Filterbar laden - async.
			this._getFilterValues();
		},

		onAfterRendering: function (oEvent) {
			this.getRouter().getRoute("worklist").attachPatternMatched(this._onObjectMatched, this);
		},

		onExit: function () {
			let oDialogKey;
			let oDialogValue;

			for (oDialogKey in this._mViewSettingsDialogs) {
				oDialogValue = this._mViewSettingsDialogs[oDialogKey];

				if (oDialogValue) {
					oDialogValue.destroy();
				}
			}
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		onDataRequested: function () {
			this.getModel("worklistView").setProperty("/loadBusy", true);
		},

		onDataReceived: function () {
			this._bindingChange();
			this.getView().getModel("worklistView").setProperty("/loadBusy", false);
		},

		onPressDataExport: function () {
			let aProducts = [];
			let sFilterQuerry = '';
			const sDataSource = window.location.hostname.startsWith("launchpad") ? "/sap/fiori/mdmmore" : "";
			const sServiceUrl = sDataSource + "/SAP_CAR/sap/opu/odata4/sap/zb2c/default/sap/zb2c_mdm_more_odata/0001/";
			const sDataUrl = sDataSource + "/SAP_CAR/sap/opu/odata4/sap/zb2c/default/sap/zb2c_mdm_more_odata/0001/ExcelExports";

			if (this._oTable.getBinding("rows").mAggregatedQueryOptions.$filter != undefined) {
				sFilterQuerry = '?$filter= ' + this._oTable.getBinding("rows").mAggregatedQueryOptions.$filter;
			}

			let oSettings = {
				workbook: {
					columns: models.createColumnConfig(this.getResourceBundle()),
					context: {
						application: "mdm-more",
						title: "MAP_" + this._getDate(),
						modifiedBy: "Hauke Bremer",
						sheetName: "MORe Download"
					}
				},
				dataSource: {
					type: "odata",
					useBatch: true,
					serviceUrl: sServiceUrl,
					dataUrl: sDataUrl + sFilterQuerry,
					count: this._oTable.getBinding("rows").getLength()
				},
				fileName: "MORe_" + this._getDate()
			};

			let oSheet = new Spreadsheet(oSettings);
			oSheet.build().then(() => {
				sap.m.MessageToast.show(this.getResourceBundle().getText("msgSuccessExport"));
			}).finally(() => {
				oSheet.destroy;
				this._oTable.removeSelectionInterval(0, 99999);
			});
		},

		onPressOpenP13nDialog: function () {
			this.oPersonalizationDialog = sap.ui.xmlfragment("tchibo.b2c.mdm.more.ui.view.fragments.SortDialog", this);
			this.getView().addDependent(this.oPersonalizationDialog);
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.oPersonalizationDialog);
			this.oPersonalizationDialog.open();
		},

		calWeekInputChange: function (oEvent) {
			var input = oEvent.getSource().getValue();
			if (input.length === 6 && input.match(/^[0-9]+$/) !== null) {
				oEvent.getSource().setValueState("Success");
			} else if (input === "" || (input.length < 6 && input.match(/^[0-9]+$/) !== null)) {
				oEvent.getSource().setValueState("None");
			} else {
				oEvent.getSource().setValueState("Error");
			}
		},

		addSortItemP13n: function (oEvent) {
			oEvent.getSource().addSortItem(oEvent.getParameter("sortItemData"));
			this._enableP13nReset(true);
		},

		removeSortItemP13n: function (oEvent) {
			oEvent.getSource().removeSortItem(oEvent.getParameter("index"));
			this._enableP13nReset(true);
		},

		handleOkP13n: function (oEvent) {
			let aSorters = [];
			let aSorterItems = [];

			oEvent.getSource().getPanels()[0].getSortItems().forEach(oSortItem => {
				aSorterItems.push({
					"columnKeyModel": oSortItem.getColumnKey(),
					"operationModel": oSortItem.getOperation()
				});
				aSorters.push(new sap.ui.model.Sorter(oSortItem.getColumnKey(), oSortItem.getOperation() === "Descending" ? true : false));
			});

			this.getModel("worklistView").setProperty("/sorter", aSorters);
			this.getModel("worklistView").setProperty("/SortItems", aSorterItems);
			this._getWorklistItems(this.getModel("worklistView").getProperty("/fullFileters"));
			this.handleCancelP13n();
		},

		handleCancelP13n: function () {
			this.oPersonalizationDialog.close();
		},

		handleResetP13n: function () {
			this.getModel("worklistView").setProperty("/SortItems", []);
		},

		handleActionPress: function (oEvent) {
			const nIndex = oEvent.getParameter("item").getParent().getParent().getIndex();
			let oContext = this._oTable.getContextByIndex(nIndex).getObject();
			oContext.maktx = oContext.maktx.replace(/\//g, " ");
			this.getRouter().navTo("object", {
				contextPath: JSON.stringify(oContext)
			});
		},

		/* =========================================================== */
		/* async methods                                               */
		/* =========================================================== */

		_getFilterValues: async function () {
			const sSpras = sap.ui.getCore().getConfiguration().getLanguage()[0].toUpperCase();
			await this._getFilterbarClusterType(sSpras);
			await this._getFilterbarCluster(sSpras);
			await this._getFilterbarError(sSpras);
		},

		_getFilterbarCluster: async function (sSpras) {
			return this.byId("slVCluster").bindItems({
				path: "modelOdatav4>/FilterbarCluster",
				template: new sap.ui.core.Item({
					key: "{modelOdatav4>clusterError}",
					text: "{modelOdatav4>clusterError}"
				}),
				parameters: {
					$filter: "spras eq '" + sSpras + "'",
					$select: "spras,clusterError",
					$orderby: "clusterError asc"
				}
			});
		},

		_getFilterbarClusterType: async function (sSpras) {
			return this.byId("slVClusterType").bindItems({
				path: "modelOdatav4>/FilterbarClusterType",
				template: new sap.ui.core.Item({
					key: "{modelOdatav4>clusterType}",
					text: "{modelOdatav4>clusterType}"
				}),
				parameters: {
					$filter: "spras eq '" + sSpras + "'",
					$orderby: "clusterType asc",
					$select: "spras,clusterType"
				}
			});
		},

		_getFilterbarError: async function (sSpras) {
			return this.byId("slMClass").bindItems({
				path: "modelOdatav4>/FilterbarError",
				template: new sap.ui.core.Item({
					key: "{modelOdatav4>errorId}",
					text: "{modelOdatav4>errors}"
				}),
				parameters: {
					$filter: "spras eq '" + sSpras + "'",
					$select: "spras,errors,errorId",
					$orderby: "errors asc"
				}
			});
		},

		_getWorklistItems: async function (aFilters) {
			this._oTable.bindRows({
				path: "modelOdatav4>/AssortmentErrorsOverviews",
				parameters: {
					templateShareable: false
				},
				events: {
					dataRequested: (oEvent) => this.onDataRequested(oEvent),
					dataReceived: (oEvent) => this.onDataReceived(oEvent)
				},
				filters: aFilters,
				sorter: this.getModel("worklistView").getProperty("/sorter")
			});
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		onAfterVariantLoad: function () {
			if (this._smartFilterBar) {

				var oData = this._smartFilterBar.getFilterData();
				var oCustomFieldData = oData._CUSTOM;
				if (oCustomFieldData) {

					let oCtrl = this._smartFilterBar.determineControlByName("slMClass");
					let oslKalwo = this._smartFilterBar.determineControlByName("slKalwo");
					let oslKalwo_til = this._smartFilterBar.determineControlByName("slKalwo_til");
					let oslVKOrg = this._smartFilterBar.determineControlByName("slVKOrg");
					let oslPHTyp = this._smartFilterBar.determineControlByName("slPHTyp");
					let oslMagrv = this._smartFilterBar.determineControlByName("slMagrv");
					let oslMtart = this._smartFilterBar.determineControlByName("slVMtart");
					let oslVClusterType = this._smartFilterBar.determineControlByName("slVClusterType");
					let oslVCluster = this._smartFilterBar.determineControlByName("slVCluster");

					if (oCtrl || oslKalwo || oslKalwo_til || oslVKOrg || oslPHTyp || oslMagrv || oslMtart || oslVClusterType || oslVCluster) {
						oCtrl.setSelectedKeys(oCustomFieldData.slMClass);
						oslKalwo.setSelectedKey(oCustomFieldData.slKalwo);
						oslKalwo_til.setSelectedKey(oCustomFieldData.slKalwo_til);
						oslVKOrg.setSelectedKey(oCustomFieldData.slVKOrg);
						oslPHTyp.setSelectedKeys(oCustomFieldData.slPHTyp);
						oslMagrv.setSelectedKeys(oCustomFieldData.slMagrv);
						oslMtart.setSelectedKeys(oCustomFieldData.slVMtart);
						oslVClusterType.setSelectedKeys(oCustomFieldData.slVClusterType);
						oslVCluster.setSelectedKeys(oCustomFieldData.slVCluster);
					}
				}
			}
		},

		onInitFilter: function () {
			this._onLoadFilters();
		},

		onBeforeVariantSave: function (oEvent) {
			if (oEvent.getParameter("context") === "STANDARD") {
				this._updateCustomFilter();
			}
		},

		onBeforeVariantFetch: function () {
			this._updateCustomFilter();
		},

		_onLoadFilters: function () {
			const oViewModel = this.getModel("worklistView");
			let twistDate = this.byId("slKalwo").getValue();
			let twistDate_til = this.byId("slKalwo_til").getValue();
			let fullfilters = [];
			let aFilters = [];
			let bFilters = [];
			let cFilters = [];
			let dFilters = [];
			let eFilters = [];
			let fFilters = [];
			let gFilters = [];
			let hFilters = [];
			let iFilters = [];

			let oKeyMatnr = 0;
			let oMultiMatnrValue = this.byId("slVMatnr").getValue();
			let oMultiMatnr = this.byId("slVMatnr");
			let oMatnrarray = oMultiMatnrValue.split(", ");
			let oMatnrtokens = [];

			let oKeyTdbnr = 0;
			let oMultiTdbnrValue = this.byId("slVTdbnr").getValue();
			let oMultiTdbnr = this.byId("slVTdbnr");
			let oTdbnrarray = oMultiTdbnrValue.split(", ");
			let oTdbnrtokens = [];

			oViewModel.setProperty("/tableBusy", true);

			//Filter Kalwo/Vkorg nur aufbauen, wenn gefüllt.
			if (twistDate_til !== "" && twistDate !== "") {
				aFilters.push(new Filter("kalwo", FilterOperator.BT, twistDate, twistDate_til));
			}

			if (this.getSelectedItemText(this.byId("slVKOrg")) !== "") {
				aFilters.push(new Filter("vkorg", FilterOperator.EQ, this.getSelectedItemText(this.byId("slVKOrg"))));
			}

			// filters for Phasen-Typ
			this.byId("slPHTyp").getSelectedItems().forEach(oFilter => {
				cFilters.push(new Filter("kanal", FilterOperator.EQ, oFilter.getKey()));
			});

			// filters for Artikelgruppe-Packmittel
			this.byId("slMagrv").getSelectedItems().forEach(oFilter => {
				dFilters.push(new Filter("magrv", FilterOperator.EQ, oFilter.getKey()));
			});

			// filters for Artikelgruppe-Packmittel
			this.byId("slVMtart").getSelectedItems().forEach(oFilter => {
				eFilters.push(new Filter("mtart", FilterOperator.EQ, oFilter.getKey()));
			});

			this.byId("slVClusterType").getSelectedItems().forEach(oFilter => {
				fFilters.push(new Filter("clusterType", FilterOperator.EQ, oFilter.getKey()));
			});

			this.byId("slVCluster").getSelectedItems().forEach(oFilter => {
				gFilters.push(new Filter("clusterError", FilterOperator.EQ, oFilter.getKey()));
			});

			this.byId("slMClass").getSelectedItems().forEach(oFilter => {
				bFilters.push(new Filter("errorId", FilterOperator.EQ, oFilter.getKey()));
			});

			if (twistDate > twistDate_til) {
				MessageToast.show(this.getResourceBundle().getText("messageToastErrorHVK"));
			}
			if (oMultiMatnrValue != "") {
				oMultiMatnr.setValue("");
				oMatnrarray.forEach(oToken => {
					oMatnrtokens.push(
						new Token({
							text: oToken,
							key: oKeyMatnr + 1
						})
					);
				});
				oMultiMatnr.setTokens(oMatnrtokens);
			}

			oMultiMatnr.getTokens().forEach(oToken => {
				hFilters.push(new Filter("matnr", sap.ui.model.FilterOperator.Contains, oToken.getProperty("text")));
			});

			if (oMultiTdbnrValue != "") {
				oMultiTdbnr.setValue("");
				oTdbnrarray.forEach(oToken => {
					oTdbnrtokens.push(
						new Token({
							text: oToken,
							key: oKeyTdbnr + 1
						})
					);
				});
				oMultiTdbnr.setTokens(oTdbnrtokens);
			}

			oMultiTdbnr.getTokens().forEach(oToken => {
				iFilters.push(new Filter("tdbnr", sap.ui.model.FilterOperator.EQ, oToken.getProperty("text")));
			});

			if (aFilters.length) {
				fullfilters.push(new Filter(aFilters, true));
			}
			if (bFilters.length) {
				fullfilters.push(new Filter(bFilters, false));
			}
			if (cFilters.length) {
				fullfilters.push(new Filter(cFilters, false));
			}
			if (dFilters.length) {
				fullfilters.push(new Filter(dFilters, false));
			}
			if (eFilters.length) {
				fullfilters.push(new Filter(eFilters, false));
			}
			if (fFilters.length) {
				fullfilters.push(new Filter(fFilters, false));
			}
			if (gFilters.length) {
				fullfilters.push(new Filter(gFilters, false));
			}
			if (hFilters.length) {
				fullfilters.push(new Filter(hFilters, false));
			}
			if (iFilters.length) {
				fullfilters.push(new Filter(iFilters, false));
			}
			this.getModel("worklistView").setProperty("/fullFileters", fullfilters);
			this._requestCall(fullfilters);
		},

		onClearTable: function () {
			this._oTable.unbindRows();
			this._oIndexObjectTable = {};
		},

		onRefresh: function () {
			this._oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		_applySearch: function (aTableSearchState) {
			this._oTable.getBinding("items").filter(aTableSearchState, "Application");
		},

		_bindingChange: function () {
			const sRowLength = this._oTable.getBinding("rows").getLength();
			this.getModel("worklistView").setProperty("/tableTitleRowCount", sRowLength);

			if (this._oTable.isBound("rows") && sRowLength === 0) {
				this._oTable.unbindRows();
			}
		},

		_createViewSettingsDialog: function (sDialogFragmentName) {
			const oi18n = this.getModel("i18n");
			let oDialog = this._mViewSettingsDialogs[sDialogFragmentName];

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
				oDialog.setModel(oi18n, "i18n");
				this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;

				if (Device.system.desktop) {
					oDialog.addStyleClass("sapUiSizeCompact");
				}
			}
			return oDialog;
		},

		_enableP13nReset: function (bEnabled) {
			this.getView().getModel("worklistView").setProperty("/enabled/p13nReset", bEnabled);
		},

		_getDate: function () {
			let oDay = new Date().getDate();
			let oMonth = new Date().getMonth() + 1;
			let oYear = new Date().getFullYear();
			oDay < 10 ? 0 + oDay : oDay;
			oMonth < 10 ? 0 + oMonth : oMonth;
			let oToday = oDay + '.' + oMonth + '.' + oYear;
			return oToday;
		},

		_getSelectedContext: function () {
			let aItems = [];
			this._oTable.getSelectedIndices().forEach(sIndicie => {
				aItems.push(this._oTable.getContextByIndex(sIndicie).getObject());
			});
			return aItems;
		},

		_onBindingChangeTable: function (oEvent) {
			this.getView().byId("idWorklistTable").setVisibleRowCount(oEvent.getSource().getLength());
		},

		_onObjectMatched: function (oEvent) {
			const oArguments = oEvent.getParameter("arguments");

			let aFilters = [];
			this.getModel("appView").setProperty("/busy", false);

			//Setze korrekte Navigation.
			this._setShellNavigation("dashboard");

			if (oArguments.kanal === undefined && oArguments.clusterError === undefined && oArguments.clusterType === undefined && oArguments.view ===
				undefined) {
				//Mach nichts, weil die Seite nicht neugeladen werden soll. 
			} else if (oArguments.view === "dashboard") {
				this.byId("slVClusterType").setSelectedKeys([]);
				this.byId("slVCluster").setSelectedKeys([]);
				this.byId("slMClass").setSelectedKeys([]);
				this.byId("slKalwo").setSelectedKey([]);
				this.byId("slVKOrg").setSelectedKey([]);
				this.byId("slKalwo_til").setSelectedKey([]);
				this.byId("slPHTyp").setSelectedKeys([]);
				this.byId("slMagrv").setSelectedKeys([]);
				this.byId("slVMtart").setSelectedKeys([]);
				this.byId("slVMatnr").removeAllTokens();
				this.byId("slVTdbnr").removeAllTokens();
				this._getWorklistItems([]);
			} else {
				//Tabelle unbinden, damit diese auch wirklich leer ist.
				this._oTable.unbindRows();
				this.byId("slVClusterType").setSelectedKeys([]);
				this.byId("slVCluster").setSelectedKeys([]);
				this.byId("slMClass").setSelectedKeys([]);
				this.byId("slKalwo").setSelectedKey([]);
				this.byId("slVKOrg").setSelectedKey([]);
				this.byId("slKalwo_til").setSelectedKey([]);
				this.byId("slPHTyp").setSelectedKeys([]);
				this.byId("slMagrv").setSelectedKeys([]);
				this.byId("slVMtart").setSelectedKeys([]);
				this.byId("slVMatnr").removeAllTokens();
				this.byId("slVTdbnr").removeAllTokens();

				//Kanal.
				if (oArguments.kanal !== undefined) {
					let aAndFilter = [];
					let aOrFilter = [];

					aAndFilter.push(new Filter("kanal", FilterOperator.NE, "SM"));
					aAndFilter.push(new Filter("kanal", FilterOperator.NE, "TL"));
					aOrFilter.push(new Filter(aAndFilter, true));

					aAndFilter = [];
					aAndFilter.push(new Filter("kanal", FilterOperator.NE, "SCOUT"));
					aAndFilter.push(new Filter("atyp", FilterOperator.EQ, "F"));
					aOrFilter.push(new Filter(aAndFilter, true));

					aFilters.push(new sap.ui.model.Filter(aOrFilter, false));
				}

				//Meldungstyp.
				if (oArguments.clusterType !== undefined) {
					aFilters.push(new Filter("clusterType", FilterOperator.EQ, oArguments.clusterType));
					this.byId("slVClusterType").setSelectedKeys([oArguments.clusterType]);
				} else {
					this.byId("slVClusterType").setSelectedKeys([]);
				}

				//Meldungscluster.
				if (oArguments.clusterError !== undefined && oArguments.clusterError !== "Gesamt") {
					aFilters.push(new Filter("clusterError", FilterOperator.EQ, oArguments.clusterError));
					this.byId("slVCluster").setSelectedKeys([oArguments.clusterError]);
				} else {
					this.byId("slVCluster").setSelectedKeys([]);
				}

				this._getWorklistItems(aFilters);
			}
		},

		_requestCall: function (aFilters) {
			const oBinding = this._oTable.getBinding("rows");
			!oBinding ? this._getWorklistItems(aFilters) : oBinding.filter(aFilters, true);
		},

		_showObject: function (oItem) {
			this.getRouter().navTo("object", {
				contextPath: encodeURIComponent(oItem.getBindingContext("appView").getPath())
			});
		},

		_updateCustomFilter: function () {
			if (this._smartFilterBar) {

				let oCtrl = this._smartFilterBar.determineControlByName("slMClass");
				let oslKalwo = this._smartFilterBar.determineControlByName("slKalwo");
				let oslKalwo_til = this._smartFilterBar.determineControlByName("slKalwo_til");
				let oslVKOrg = this._smartFilterBar.determineControlByName("slVKOrg");
				let oslPHTyp = this._smartFilterBar.determineControlByName("slPHTyp");
				let oslMagrv = this._smartFilterBar.determineControlByName("slMagrv");
				let oslMtart = this._smartFilterBar.determineControlByName("slVMtart");
				let oslVClusterType = this._smartFilterBar.determineControlByName("slVClusterType");
				let oslVCluster = this._smartFilterBar.determineControlByName("slVCluster");

				if (oCtrl || oslKalwo || oslKalwo_til || oslVKOrg || oslPHTyp || oslMagrv || oslMtart || oslVClusterType || oslVCluster) {
					this._smartFilterBar.setFilterData({
						_CUSTOM: {
							slMClass: oCtrl.getSelectedKeys(),
							slKalwo: oslKalwo.getSelectedKey(),
							slKalwo_til: oslKalwo_til.getSelectedKey(),
							slVKOrg: oslVKOrg.getSelectedKey(),
							slPHTyp: oslPHTyp.getSelectedKeys(),
							slMagrv: oslMagrv.getSelectedKeys(),
							slVMtart: oslMtart.getSelectedKeys(),
							slVClusterType: oslVClusterType.getSelectedKeys(),
							slVCluster: oslVCluster.getSelectedKeys()
						}
					}, true);
				}

			}
		}

	});
});