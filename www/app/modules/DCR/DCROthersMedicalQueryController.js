abbottApp.controller('DCROthersMedicalController', ['$scope', 'abbottConfigService', 'dcrHelperService', 'popupService', 'dcrJunctionCollection',
function($scope, abbottConfigService, dcrHelperService, popupService, DcrJunctionCollection) {
	var dcrJunctionCollection = new DcrJunctionCollection();
	$scope.locale = abbottConfigService.getLocale();

	$scope.init = function() {
		window.ga.trackView('DCROthersMedicalQuery');
		window.ga.trackTiming('DCROthersMedicalQuery load Start Time', 20000, 'othersMedQueryStart', 'DCROthersMedicalQuery Load start');

		var data = {},
		    dataArray = [];

		$scope.docAndDetails = angular.copy(dcrHelperService.getCustomerDetails());
		$scope.currentDocAndDetailsIndex = dcrHelperService.getCurrentCustomerIndex();
		data = $scope.docAndDetails[$scope.currentDocAndDetailsIndex].dcrJunction;

		dataArray.push(data);
		$scope.compInfoDetail = dataArray;

		$scope.docInfoText = $scope.docAndDetails[$scope.currentDocAndDetailsIndex].name + " (" + $scope.docAndDetails[$scope.currentDocAndDetailsIndex].patch + ")";
		window.ga.trackTiming('DCROthersMedicalQuery load Finish Time', 20000, 'othersMedQueryFinish', 'DCROthersMedicalQuery Load Finish');
	};

	$scope.saveCompInfo = function() {
		window.ga.trackEvent('Save Medical Query', 'click', 'MedicalQuery Saved', 20000);
		window.ga.trackTiming('DCROthersMedicalQuery Save Start Time', 20000, 'othersMedQuerySaveStart', 'DCROthersMedicalQuery Save start');
		var Medical_Query_Value = $scope.compInfoDetail[0].Medical_Query__c,
		    Post_call_Note_Value = $scope.compInfoDetail[0].Post_call_Note__c,
		    Next_Call_Objective = $scope.compInfoDetail[0].Next_Call_Objective__c,
		    _soupEntryId = $scope.docAndDetails[$scope.currentDocAndDetailsIndex].DCR_Junction__c;

		if (_soupEntryId != null) {
			$scope.compInfoDetail[0]._soupEntryId = _soupEntryId;
		}

		dcrJunctionCollection.upsertEntities($scope.compInfoDetail).then(function() {
			$scope.docAndDetails[$scope.currentDocAndDetailsIndex].dcrJunction.Medical_Query__c = Medical_Query_Value;
			$scope.docAndDetails[$scope.currentDocAndDetailsIndex].dcrJunction.Post_call_Note__c = Post_call_Note_Value;
			$scope.docAndDetails[$scope.currentDocAndDetailsIndex].dcrJunction.Next_Call_Objective__c = Next_Call_Objective;
			dcrHelperService.setCustomerDetails($scope.docAndDetails);
			popupService.openPopup($scope.locale.DataSaveConfirmation, "Ok", '35%');
		});
		window.ga.trackTiming('DCROthersMedicalQuery Save Finish Time', 20000, 'othersMedQuerySaveFinish', 'DCROthersMedicalQuery Save Finish');
	};

}]);
