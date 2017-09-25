abbottApp.controller('DCROthersCompetitorInfoController', ['$scope', '$filter', 'abbottConfigService', 'dcrHelperService', 'popupService', 'divisionwiseCompetitorsCollection', 'dcrJunctionCollection',
function($scope, $filter, abbottConfigService, dcrHelperService, popupService, DivisionwiseCompetitorsCollection, DcrJunctionCollection) {

	var divisionwiseCompetitorsCollection = new DivisionwiseCompetitorsCollection(),
	    dcrJunctionCollection = new DcrJunctionCollection(),
	    customerDetails = [],
	    currentCustomerIndex = 0,
	    competitorsObj = {},
	    noOfBrands = 0;

	$scope.brands = [];

	$scope.init = function() {
		window.ga.trackView('DCROthersCompetitorInfo');
		window.ga.trackTiming('DCROthersCompetitorInfo Load Start Time', 20000, 'othersCompetitorInfoStart', 'DCROthersCompetitorInfo Load start');
		var brandData = [];
		$scope.locale = abbottConfigService.getLocale();

		customerDetails = dcrHelperService.getCustomerDetails();
		currentCustomerIndex = dcrHelperService.getCurrentCustomerIndex();

		brandData = customerDetails[currentCustomerIndex].attributes;
		noOfBrands = brandData.length;

		competitorsObj = customerDetails[currentCustomerIndex].dcrJunction;

		$scope.getCompetitor().then(function() {
			$scope.load(brandData);
		});

		$scope.docInfoText = customerDetails[currentCustomerIndex].name + " (" + customerDetails[currentCustomerIndex].patch + ")";
	};

	$scope.load = function(brandData) {
		$scope.submitOtherCompInfo = [];

		var brand = "",
		    brandName = "",
		    brandComp1KeyName = "",
		    brandComp1RxMonthKeyName = "",
		    brandComp2KeyName = "",
		    brandComp2RxMonthKeyName = "",
		    brandComp3KeyName = "",
		    brandComp3RxMonthKeyName = "",
		    brandComp4KeyName = "",
		    brandComp4RxMonthKeyName = "",
		    brandComp1Value = "",
		    brandComp1RxMonthValue = "",
		    brandComp2Value = "",
		    brandComp2RxMonthValue = "",
		    brandComp3Value = "",
		    brandComp3RxMonthValue = "";
		brandComp4Value = "",
		brandComp4RxMonthValue = "";
		for (var i = 1; i <= 10; i++) {
			brand = "Brand" + i + "__c";
			brandComp1KeyName = "Brand" + i + "_Competitor1__c";
			brandComp1RxMonthKeyName = "Brand" + i + "_Comp1_Rx_Month__c";
			brandComp2KeyName = "Brand" + i + "_Competitor2__c";
			brandComp2RxMonthKeyName = "Brand" + i + "_Comp2_Rx_Month__c";
			brandComp3KeyName = "Brand" + i + "_Competitor3__c";
			brandComp3RxMonthKeyName = "Brand" + i + "_Comp3_Rx_Month__c";
			brandComp4KeyName = "Brand" + i + "_Competitor4__c";
			brandComp4RxMonthKeyName = "Brand" + i + "_Comp4_Rx_Month__c";

			for (var j = 0; j < brandData.length; j++) {
				if (competitorsObj[brand] == brandData[j].brandId) {
					brandName = brandData[j].brandName;
					brandComp1Value = competitorsObj[brandComp1KeyName];
					brandComp1RxMonthValue = competitorsObj[brandComp1RxMonthKeyName];
					brandComp2Value = competitorsObj[brandComp2KeyName];
					brandComp2RxMonthValue = competitorsObj[brandComp2RxMonthKeyName];
					brandComp3Value = competitorsObj[brandComp3KeyName];
					brandComp3RxMonthValue = competitorsObj[brandComp3RxMonthKeyName];
					brandComp4Value = competitorsObj[brandComp4KeyName];
					brandComp4RxMonthValue = competitorsObj[brandComp4RxMonthKeyName];

					$scope.submitOtherCompInfo.push({
						"brandIndex" : i,
						"brandId" : competitorsObj[brand],
						"brandName" : brandName,
						"comp1" : brandComp1Value,
						"rx1" : brandComp1RxMonthValue,
						"comp2" : brandComp2Value,
						"rx2" : brandComp2RxMonthValue,
						"comp3" : brandComp3Value,
						"rx3" : brandComp3RxMonthValue,
						"comp4" : brandComp4Value,
						"rx4" : brandComp4RxMonthValue
					});
					break;
				}
			}
		}
		window.ga.trackTiming('DCROthersCompetitorInfo Load Finish Time', 20000, 'othersCompetitorInfoFinish', 'DCROthersCompetitorInfo Load Finish');
	};

	$scope.getCompetitor = function() {
		return divisionwiseCompetitorsCollection.fetchAll().then(divisionwiseCompetitorsCollection.fetchRecursiveFromCursor).then(function(competitorsList) {
			$scope.compInfoDetails = $filter('orderBy')(competitorsList, 'Name');
			return competitorsList;
		});
	};

	$scope.saveCompInfo = function() {

		window.ga.trackEvent('Save Competitor Info', 'click', 'CompetitorInfoSaved', 20000);
		window.ga.trackTiming('DCROthersCompetitorInfo Save Start Time', 20000, 'othersCompetitorInfoSaveStart', 'DCROthersCompetitorInfo Save start');

		var alertMsg = $scope.validateDateData();
		if (alertMsg.length > 1) {
			popupService.openPopup(alertMsg, $scope.locale.OK, '55%');
			return;
		}

		for (var i = 0; i < $scope.submitOtherCompInfo.length; i++) {
			brandIndex = $scope.submitOtherCompInfo[i]['brandIndex'];
			brandComp1KeyName = "Brand" + brandIndex + "_Competitor1__c";
			brandComp1RxMonthKeyName = "Brand" + brandIndex + "_Comp1_Rx_Month__c";
			brandComp2KeyName = "Brand" + brandIndex + "_Competitor2__c";
			brandComp2RxMonthKeyName = "Brand" + brandIndex + "_Comp2_Rx_Month__c";
			brandComp3KeyName = "Brand" + brandIndex + "_Competitor3__c";
			brandComp3RxMonthKeyName = "Brand" + brandIndex + "_Comp3_Rx_Month__c";
			brandComp4KeyName = "Brand" + brandIndex + "_Competitor4__c";
			brandComp4RxMonthKeyName = "Brand" + brandIndex + "_Comp4_Rx_Month__c";
			competitorsObj[brandComp1KeyName] = $scope.submitOtherCompInfo[i]['comp1'];
			competitorsObj[brandComp1RxMonthKeyName] = $scope.submitOtherCompInfo[i]['rx1'];
			competitorsObj[brandComp2KeyName] = $scope.submitOtherCompInfo[i]['comp2'];
			competitorsObj[brandComp2RxMonthKeyName] = $scope.submitOtherCompInfo[i]['rx2'];
			competitorsObj[brandComp3KeyName] = $scope.submitOtherCompInfo[i]['comp3'];
			competitorsObj[brandComp3RxMonthKeyName] = $scope.submitOtherCompInfo[i]['rx3'];
			competitorsObj[brandComp4KeyName] = $scope.submitOtherCompInfo[i]['comp4'];
			competitorsObj[brandComp4RxMonthKeyName] = $scope.submitOtherCompInfo[i]['rx4'];
		}

		dcrJunctionCollection.upsertEntities([competitorsObj]).then(function() {
			customerDetails[currentCustomerIndex].dcrJunction = competitorsObj;
			dcrHelperService.setCustomerDetails(customerDetails);
			popupService.openPopup($scope.locale.DataSaveConfirmation, $scope.locale.OK, '35%');
		}).catch(function() {
			popupService.openPopup($scope.locale.SaveFailed, $scope.locale.OK, '35%');
		});
	};

	$scope.validateDateData = function() {
		//check brand selected for RX filled row
		var brandName = '',
		    alertMsg = '';
		for (var i in $scope.submitOtherCompInfo) {
			if (((($scope.submitOtherCompInfo[i].rx1 >= 0) && $scope.submitOtherCompInfo[i].rx1 != null) && $scope.submitOtherCompInfo[i].comp1 == undefined) || ((($scope.submitOtherCompInfo[i].rx2 >= 0) && $scope.submitOtherCompInfo[i].rx2 != null) && $scope.submitOtherCompInfo[i].comp2 == undefined) || ((($scope.submitOtherCompInfo[i].rx3 >= 0) && $scope.submitOtherCompInfo[i].rx3 != null) && $scope.submitOtherCompInfo[i].comp3 == undefined) || ((($scope.submitOtherCompInfo[i].rx4 >= 0) && $scope.submitOtherCompInfo[i].rx4 != null) && ($scope.submitOtherCompInfo[i].comp4 == '' || $scope.submitOtherCompInfo[i].comp4 == undefined))) {
				brandName = brandName + $scope.submitOtherCompInfo[i].brandName + ',';
			}
		}
		brandName = brandName.substring(0, brandName.length - 1);
		if (brandName != "") {
			alertMsg = $scope.locale.CompetitorAlert1 + " " + customerDetails[currentCustomerIndex].name + " " + $scope.locale.CompetitorAlert2 + " " + brandName;
		}

		//check empty brand for entered RX/Month
		if (alertMsg == '') {
			for (var i in $scope.submitOtherCompInfo) {
				if (($scope.submitOtherCompInfo[i].rx1 == undefined && $scope.submitOtherCompInfo[i].comp1 != undefined) || ($scope.submitOtherCompInfo[i].rx2 == undefined && $scope.submitOtherCompInfo[i].comp2 != undefined) || ($scope.submitOtherCompInfo[i].rx3 == undefined && $scope.submitOtherCompInfo[i].comp3 != undefined) || ($scope.submitOtherCompInfo[i].rx4 == undefined && $scope.submitOtherCompInfo[i].comp4 != undefined)) {
					brandName = brandName + $scope.submitOtherCompInfo[i].brandName + ',';
				}
			}
			brandName = brandName.substring(0, brandName.length - 1);
			if (brandName != "") {
				alertMsg = $scope.locale.CompetitorAlert4 + " " + customerDetails[currentCustomerIndex].name + " " + $scope.locale.CompetitorAlert2 + " " + brandName;
			}
		}

		//check for duplicate brands
		if (alertMsg == '') {
			for (var i in $scope.submitOtherCompInfo) {
				if ($scope.submitOtherCompInfo[i].comp1 != undefined && $scope.submitOtherCompInfo[i].comp2 != undefined && ($scope.submitOtherCompInfo[i].comp1 == $scope.submitOtherCompInfo[i].comp2)) {
					brandName = brandName + $scope.submitOtherCompInfo[i].brandName + ',';
					break;
				}
				if ($scope.submitOtherCompInfo[i].comp1 != undefined && $scope.submitOtherCompInfo[i].comp3 != undefined && ($scope.submitOtherCompInfo[i].comp1 == $scope.submitOtherCompInfo[i].comp3)) {
					brandName = brandName + $scope.submitOtherCompInfo[i].brandName + ',';
					break;
				}
				if ($scope.submitOtherCompInfo[i].comp2 != undefined && $scope.submitOtherCompInfo[i].comp3 != undefined && ($scope.submitOtherCompInfo[i].comp2 == $scope.submitOtherCompInfo[i].comp3)) {
					brandName = brandName + $scope.submitOtherCompInfo[i].brandName + ',';
					break;
				}
			}
			brandName = brandName.substring(0, brandName.length - 1);
			if (brandName != "") {
				alertMsg = $scope.locale.CompetitorAlert3 + " " + customerDetails[currentCustomerIndex].name + " " + $scope.locale.CompetitorAlert2 + " " + brandName;
			}
		}
		return alertMsg;

		window.ga.trackTiming('DCROthersCompetitorInfo Save Finish Time', 20000, 'othersCompetitorInfoSaveFinish', 'DCROthersCompetitorInfo Save Finish');

	};
}]);
