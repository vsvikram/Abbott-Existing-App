abbottApp.controller('DCROthersPOBController', ['$scope', 'dcrHelperService', 'abbottConfigService', 'popupService', 'dcrJunctionCollection',
function($scope, dcrHelperService, abbottConfigService, popupService, DcrJunctionCollection) {
	var dcrJunctionCollection = new DcrJunctionCollection();
	$scope.locale = abbottConfigService.getLocale();
	$scope.init = function() {

		window.ga.trackView('DCROthersPOB');
		window.ga.trackTiming('DCROthersPOB Load Start Time', 20000, 'othersPOBLoadStart', 'DCROthersPOB Load Start');
		var data = {};

		$scope.compInfoDetails = [];
		$scope.getDetails = [];

		// fetch value from table and filter on junction id and show in text field
		$scope.docAndDetails = angular.copy(dcrHelperService.getCustomerDetails());
		$scope.currentDocAndDetailsIndex = dcrHelperService.getCurrentCustomerIndex();

		data = $scope.docAndDetails[$scope.currentDocAndDetailsIndex].dcrJunction;

		$scope.docInfoText = $scope.docAndDetails[$scope.currentDocAndDetailsIndex].name + " (" + $scope.docAndDetails[$scope.currentDocAndDetailsIndex].patch + ")";

		//    	dataArray.push(data);
		//    	$scope.compInfoDetails = dataArray;
		var brand = "",
		    pobKeyName = "",
		    brandName = "",
		    pobValue = "";
		for (var i = 1; i <= 10; i++) {
			brand = "Brand" + i + "__c",
			pobKeyName = "POB" + i + "__c";

			for (var j = 0; j < dcrHelperService.getCustomerDetails()[$scope.currentDocAndDetailsIndex].attributes.length; j++) {
				if (data[brand] == dcrHelperService.getCustomerDetails()[$scope.currentDocAndDetailsIndex].attributes[j].brandId) {
					brandName = dcrHelperService.getCustomerDetails()[$scope.currentDocAndDetailsIndex].attributes[j].brandName;
					pobValue = data[pobKeyName];
					if (pobValue == null || !pobValue) {
						pobValue = 0;
					}
					$scope.compInfoDetails.push({
						"brandIndex" : i,
						"brandId" : data[brand],
						"brandName" : brandName,
						"POB" : pobValue,

					});
					break;
				}
			}
		}
		window.ga.trackTiming('DCROthersPOB Load Finish Time', 20000, 'othersPOBLoadFinish', 'DCROthersPOB Load Finish');
	};

	$scope.saveCompInfo = function() {
		window.ga.trackEvent('Save POB', 'click', 'POBSaved', 20000);
		window.ga.trackTiming('DCROthersPOB Save Start Time', 20000, 'othersPOBSaveStart', 'DCROthersPOB save start');

		var brandIndex = "",
		    pobKeyName = "",
		    pobObj = {
			POB1__c : "",
			POB2__c : "",
			POB3__c : "",
			POB4__c : "",
			POB5__c : "",
			POB6__c : "",
			POB7__c : "",
			POB8__c : "",
			POB9__c : "",
			POB10__c : ""
		};

		var dcrJunction = $scope.docAndDetails[$scope.currentDocAndDetailsIndex].dcrJunction;

		for (var i = 0; i < $scope.compInfoDetails.length; i++) {
			brandIndex = $scope.compInfoDetails[i]['brandIndex'];
			pobKeyName = "POB" + (brandIndex) + "__c";
			pobObj[pobKeyName] = $scope.compInfoDetails[i]['POB'];
			dcrJunction[pobKeyName] = pobObj[pobKeyName];
		}
		dcrJunctionCollection.upsertEntities(dcrJunction).then(function() {
			$scope.docAndDetails[$scope.currentDocAndDetailsIndex].dcrJunction.POB1__c = pobObj['POB1__c'];
			$scope.docAndDetails[$scope.currentDocAndDetailsIndex].dcrJunction.POB2__c = pobObj['POB2__c'];
			$scope.docAndDetails[$scope.currentDocAndDetailsIndex].dcrJunction.POB3__c = pobObj['POB3__c'];
			$scope.docAndDetails[$scope.currentDocAndDetailsIndex].dcrJunction.POB4__c = pobObj['POB4__c'];
			$scope.docAndDetails[$scope.currentDocAndDetailsIndex].dcrJunction.POB5__c = pobObj['POB5__c'];
			$scope.docAndDetails[$scope.currentDocAndDetailsIndex].dcrJunction.POB6__c = pobObj['POB6__c'];
			$scope.docAndDetails[$scope.currentDocAndDetailsIndex].dcrJunction.POB7__c = pobObj['POB7__c'];
			$scope.docAndDetails[$scope.currentDocAndDetailsIndex].dcrJunction.POB8__c = pobObj['POB8__c'];
			$scope.docAndDetails[$scope.currentDocAndDetailsIndex].dcrJunction.POB9__c = pobObj['POB9__c'];
			$scope.docAndDetails[$scope.currentDocAndDetailsIndex].dcrJunction.POB10__c = pobObj['POB10__c'];

			dcrHelperService.setCustomerDetails($scope.docAndDetails);
			popupService.openPopup($scope.locale.DataSaveConfirmation, "Ok", '35%');
		});

		window.ga.trackTiming('DCROthersPOB Save Finish Time', 20000, 'othersPOBSaveFinish', 'DCROthersPOB save Finish');
		;
	};
}]);
