function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZCDS_B2C_MDM_MORE_ODATA_CDS/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}