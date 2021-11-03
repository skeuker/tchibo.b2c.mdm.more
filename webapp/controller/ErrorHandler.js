sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/MessageBox"
], function (UI5Object, MessageBox) {
	"use strict";

	return UI5Object.extend("tchibo.b2c.mdm.more.ui.controller.ErrorHandler", {

		constructor: function (oComponent) {
			// var oMessageManager = sap.ui.getCore().getMessageManager(),
			// 	oMessageModel = oMessageManager.getMessageModel(),
			// 	oResourceBundle = oComponent.getModel("i18n").getResourceBundle(),
			// 	sErrorText = oResourceBundle.getText("errorText"),
			// 	sMultipleErrors = oResourceBundle.getText("multipleErrorsText");

			// this._oComponent = oComponent;
			// this._bMessageOpen = false;
			// this.oMessageModelBinding = oMessageModel.bindList("/", undefined, [], new sap.ui.model.Filter("technical", sap.ui.model.FilterOperator.EQ, true));

			// this.oMessageModelBinding.attachChange(function (oEvent) {
			// 	let sErrorTitle;
			// 	let aMessages = [];
			// 	const aContexts = oEvent.getSource().getContexts();

			// 	if (this._bMessageOpen || !aContexts.length) {
			// 		return;
			// 	}

			// 	// Extract and remove the technical messages
			// 	aContexts.forEach(function (oContext) {
			// 		aMessages.push(oContext.getObject());
			// 	});

			// 	oMessageManager.removeMessages(aMessages);
			// 	sErrorTitle = aMessages.length === 1 ? sErrorText : sMultipleErrors;
			// 	this._showServiceError(sErrorTitle, aMessages[0].message);
			// }, this);
		}

		//_showServiceError: function (sErrorTitle, sDetails) {
		/*	this._bMessageOpen = true;
			MessageBox.error(
				sErrorTitle, {
					id: "serviceErrorMessageBox",
					details: sDetails,
					styleClass: this._oComponent.getContentDensityClass(),
					actions: [MessageBox.Action.CLOSE],
					onClose: function () {
						this._bMessageOpen = false;
					}.bind(this)
				}
			);*/
	//	}
		
	});
});