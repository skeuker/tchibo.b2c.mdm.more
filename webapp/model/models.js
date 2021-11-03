sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/ui/export/library"
], function (JSONModel, Device, exportLibrary) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createDashboardModel: function () {
			const oModel = new JSONModel({
				busyError: true,
				busyProcess: true,
				busyErrorDetail: true,
				busyIndicator: 0,
				selectVkorg: [{
					key: "0047",
					text: "0047"
				}, {
					key: "0051",
					text: "0051"
				}, {
					key: "0052",
					text: "0052"
				}, {
					key: "0054",
					text: "0054"
				}, {
					key: "0073",
					text: "0073"
				}, {
					key: "0085",
					text: "0085"
				}, {
					key: "0001",
					text: "0001"
				}]
			});
			return oModel;
		},

		createColumnConfig: function (oBundle) {
			return [{
				label: oBundle.getText("tableColumnTypeMessage"),
				property: "clusterType"
			}, {
				label: oBundle.getText("tableColumnOrderNumber"),
				property: "tdbnr",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("tableColumnArticleNumber"),
				property: "matnr",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("tableColumnArticleDescription"),
				property: "maktx"
			}, {
				label: oBundle.getText("columndisplay"),
				property: "mtpos"
			}, {
				label: oBundle.getText("tableColumnMessageCluster"),
				property: "clusterError"
			}, {
				label: oBundle.getText("tableColumnMessage"),
				property: "errors"
			}, {
				label: oBundle.getText("tableColumnVkorg"),
				property: "vkorg"
			}, {
				label: oBundle.getText("tableColumnHvk"),
				property: "kalwo"
			}, {
				label: oBundle.getText("tableColumnPackaging"),
				property: "magrv"
			}, {
				label: oBundle.getText("tableColumnProcess"),
				property: "kanalFach"
			}, {
				label: oBundle.getText("tableColumnArticleType"),
				property: "mtart"
			}, {
				label: oBundle.getText("tableColumnFwRe"),
				property: "atyp"
			}, {
				label: oBundle.getText("tableColumnOnlineOnly"),
				property: "onlineOnly"
			}, {
				label: oBundle.getText("columnDwerk"),
				property: "dwerk"
			}, {
				label: oBundle.getText("columnDcRuestfrom_10"),
				property: "kommistart_10",
				type: sap.ui.export.EdmType.Date,
				inputFormat: "yyyymmdd"
			}, {
				label: oBundle.getText("columnDcRuestto_10"),
				property: "kommiende_10",
				type: sap.ui.export.EdmType.Date,
				inputFormat: "yyyymmdd"
			}, {
				label: oBundle.getText("columnDcRuestfrom_71"),
				property: "kommistart_71",
				type: sap.ui.export.EdmType.Date,
				inputFormat: "yyyymmdd"
			}, {
				label: oBundle.getText("columnDcRuestto_71"),
				property: "kommiende_71",
				type: sap.ui.export.EdmType.Date,
				inputFormat: "yyyymmdd"
			}, {
				label: oBundle.getText("columnDcRuestfrom_17"),
				property: "kommistart_17",
				type: sap.ui.export.EdmType.Date,
				inputFormat: "yyyymmdd"
			}, {
				label: oBundle.getText("columnDcRuestto_17"),
				property: "kommiende_17",
				type: sap.ui.export.EdmType.Date,
				inputFormat: "yyyymmdd"
			}, {
				label: oBundle.getText("columnDcRuestfrom_52"),
				property: "kommiende_52",
				type: sap.ui.export.EdmType.Date,
				inputFormat: "yyyymmdd"
			}, {
				label: oBundle.getText("columnDcRuestto_52"),
				property: "kommiende_52",
				type: sap.ui.export.EdmType.Date,
				inputFormat: "yyyymmdd"
			}, {
				label: oBundle.getText("columnDcRuestfrom_60"),
				property: "kommistart_60",
				type: sap.ui.export.EdmType.Date,
				inputFormat: "yyyymmdd"
			}, {
				label: oBundle.getText("columnDcRuestto_60"),
				property: "kommiende_60",
				type: sap.ui.export.EdmType.Date,
				inputFormat: "yyyymmdd"
			}, {
				label: oBundle.getText("columnDcRuestfrom_77"),
				property: "kommistart_77",
				type: sap.ui.export.EdmType.Date,
				inputFormat: "yyyymmdd"
			}, {
				label: oBundle.getText("columnDcRuestto_77"),
				property: "kommiende_77",
				type: sap.ui.export.EdmType.Date,
				inputFormat: "yyyymmdd"
			}, {
				label: oBundle.getText("columnAtp_10"),
				property: "atp_10",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnAtp_71"),
				property: "atp_71",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnAtp_17"),
				property: "atp_17",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnAtp_52"),
				property: "atp_52",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnAtp_60"),
				property: "atp_60",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnAtp_77"),
				property: "atp_77",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnAtp_st01"),
				property: "atp_st01",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnAtp_st02"),
				property: "atp_st02",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnAtp_st03"),
				property: "atp_st03",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnAtp_st04"),
				property: "atp_st04",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnQ_quantitity_10"),
				property: "q_quantity_10",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnQ_quantitity_71"),
				property: "q_quantity_71",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnQ_quantitity_17"),
				property: "q_quantity_17",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnQ_quantitity_52"),
				property: "q_quantity_52",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnQ_quantitity_60"),
				property: "q_quantity_60",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnQ_quantitity_77"),
				property: "q_quantity_77",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnTransitHDc"),
				property: "transit_h_dc",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnTransitSpDc"),
				property: "transit_sp_dc",
				type: exportLibrary.EdmType.Number,
				scale: 0
			}, {
				label: oBundle.getText("columnSalesStart"),
				property: "salesStart",
				type: sap.ui.export.EdmType.Date,
				inputFormat: "yyyymmdd"
			}, {
				label: oBundle.getText("columnSalesEnd"),
				property: "salesEnd",
				type: sap.ui.export.EdmType.Date,
				inputFormat: "yyyymmdd"
			}, {
				label: oBundle.getText("columnWebBCLock"),
				property: "vmsta"
			}, {
				label: oBundle.getText("columnWebWsBcLock"),
				property: "isforcenotavailableimported"
			}, {
				label: oBundle.getText("columnWebPriceSap"),
				property: "price",
				type: sap.ui.export.EdmType.Currency,
				unitProperty: "waer"
			}, {
				label: oBundle.getText("columnWebZZKanal"),
				property: "zzkanal"
			}, {
				label: oBundle.getText("columnWebisAvailable"),
				property: "isavailable"
			}, {
				label: oBundle.getText("columnWebExcludedSearch"),
				property: "isexcludedinsearch"
			}, {
				label: oBundle.getText("columnWebExcludedCategory"),
				property: "isexcludedfromcategoryassetlis"
			}, {
				label: oBundle.getText("columnWebVisible"),
				property: "productvisibility"
			}, {
				label: oBundle.getText("columnWebextravisibility"),
				property: "extravisibility"
			}, {
				label: oBundle.getText("columnWebVisibilityMan"),
				property: "manualproductlivestatus"
			}, {
				label: oBundle.getText("columnWebNotAvailableEdited"),
				property: "isforcenotavailableedited"
			}, {
				label: oBundle.getText("columnWebPicture"),
				property: "hasimage"
			}, {
				label: oBundle.getText("columnWebTitel"),
				property: "hastitle"
			}, {
				label: oBundle.getText("columnWebText"),
				property: "hastext"
			}, {
				label: oBundle.getText("columnWebPrice"),
				property: "hasprice"
			}, {
				label: oBundle.getText("columnWebTestproduct"),
				property: "istestproduct"
			}];
		}

	};
});