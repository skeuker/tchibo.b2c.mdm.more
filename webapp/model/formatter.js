sap.ui.define([], function () {
	"use strict";

	return {

		formatWorklistIcons: function (oEntry) {
			switch (oEntry) {
			case "ROT":
				return "#E74C3C";
			case "GELB":
				return "#F1C40F";
			case "GRÜN":
				return "#27AE60";
			}
		},

		betterDate: function (sValue) {
			//if (sValue) {
			if (sValue.length === 6) {
				const substr1 = sValue.substr(0, 4);
				const substr2 = sValue.substr(4, 2);
				const newString = substr2 + "." + substr1;
				return newString;
			} else {
				return sValue;
			}
			//}
		},

		DatumDe: function (sValue) {
			//if (sValue) {
			if (sValue.length === 8) {
				const substr1 = sValue.substr(0, 4);
				const substr2 = sValue.substr(4, 2);
				const substr3 = sValue.substr(6, 4);
				const newString = substr3 + "." + substr2 + "." + substr1;
				return newString;
			} else {
				return sValue;
			}
			//}
		},

		numberZero: function (sValue) {
			let iValue = sValue;
			if (!sValue) {
				return "";
			}

			iValue = sValue.replace(",000", "");
			if (iValue == -1) {
				return "";
			}
			return iValue;
		},

		numberUnit: function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(0);
		},

		removeZeros: function (sValue) {
			return parseInt(sValue);
		},

		setCalWeek: function (sValue) {
			if (sValue) {
				if (sValue.length === 6) {
					const substr1 = sValue.substr(0, 4);
					const substr2 = sValue.substr(4, 2);
					const newString = substr2 + "." + substr1;
					return newString;
				} else {
					return sValue;
				}
			}
		},

		backDate: function (sValue) {
			let twistDate;
			let substr1 = sValue.substr(0, 2);
			let substr2 = sValue.substr(3, 4);
			twistDate = substr2 + substr1;
			return twistDate;
		},

		formatWebInfos: function (sValue) {
			let sWebInfo = "";

			switch (sValue) {
			case "true":
				sWebInfo = "Ja";
				break;
			case "false":
				sWebInfo = "Nein";
				break;
			default:
				sWebInfo = "";
			}
			return sWebInfo;
		},

		getMessageIcon: function (sValue) {
			let sIcon = "";

			switch (sValue) {
			case "GELB":
				sIcon = "sap-icon://alert";
				break;
			case "ROT":
				sIcon = "sap-icon://error";
				break;
			default:
				sIcon = "sap-icon://accept";
			}
			return sIcon;
		},

		getMessageColor: function (sValue) {
			let sColor = "";

			switch (sValue) {
			case "GELB":
				sColor = "Critical";
				break;
			case "ROT":
				sColor = "Negative";
				break;
			default:
				sColor = "Positive";
			}
			return sColor;
		},

		getValueState: function (sValue) {
			let sColor = "";

			switch (sValue) {
			case "GELB":
				sColor = "Warning";
				break;
			case "ROT":
				sColor = "Error";
				break;
			default:
				sColor = "Success";
			}
			return sColor;
		},

		changeAtyp: function (sValue) {
			let sText = "";
			if (sValue === "F") {
				sText = "Frischeartikel";
			} else if (sValue === "P") {
				sText = "TC-%-Artikel";
			} else if (sValue === "R") {
				sText = "Restant";
			} else if (sValue === "T") {
				sText = "Testartikel";
			}
			return sText;
		},

		changeRust: function (sValue) {
			let sText = "";
			if (sValue === "X") {
				sText = "gerüstet";
			} else if (sValue === null) {
				sText = "nicht gerüstet";
			} else {
				sText = "nicht gerüstet";
			}

			return sText;
		},

		getMessageTag: function (sValue) {
			let sText = "";

			switch (sValue) {
			case "GELB":
				sText = "Warnung";
				break;
			case "ROT":
				sText = "Fehler";
				break;
			default:
				sText = "Grün";
			}
			return sText;
		},

		getPHType: function (sValue) {
			let phType = sValue;
			switch (sValue) {
			case "HVK":
				phType = "Hauptverkauf";
				break;
			case "SCOUT":
				phType = "Scout";
				break;
			case "PVK":
				phType = "TchiboCard";
				break;
			case "TN":
				phType = "Prozente";
				break;
			case "SM":
				phType = "Mixer";
				break;
			case "TC":
				phType = "Dauersortiment";
				break;
			case "TL":
				phType = "Streckenartikel";
				break;
			}
			return phType;
		},

		getTileNumberColor: function (sColor) {
			switch (sColor) {
			case "GELB":
				sColor = "Critical";
				break;
			case "GRÜN":
				sColor = "Good";
				break;
			case "ROT":
				sColor = "Error";
				break;
			default:
				sColor = "Neutral";
			}
			return sColor;
		},

		getTileHeader: function (sClusterError, sClusterType) {
			//Gib den CusterType nicht als Text aus.
			if (sClusterError && sClusterType || sClusterError && !sClusterType) {
				return sClusterError;
			}
			//Gib nur den ClusterType aus.
			if (!sClusterError && sClusterType) {
				return sClusterType
			}
		},

		getTileProcess: function (sProcess) {
			switch (sProcess) {
			case "Mixer":
				sProcess = "SM";
				break;
			case "D2C":
				sProcess = "TL";
				break;
			case "Scout":
				sProcess = "SCOUT";
				break;
			case "Artikelreine Rüstung":
				sProcess = "RÜST";
				break;
			default:
				sProcess = "";
			}
			return sProcess;
		}

	};

});