abbottApp.controller('DCRCreateOthersLandingController', ['$scope', 'navigationService', 'abbottConfigService', '$rootScope', 'statusDCRActivty',
function($scope, navigationService, abbottConfigService, $rootScope, statusDCRActivty) {
	window.ga.trackView('Others');
	window.ga.trackTiming('Otherslanding Start time', 20000, 'othersLandingStart', 'Others Landing start');
	$scope.listOfTabs = [];
	$scope.currentCalenderDate = statusDCRActivty.getCalenderDate();
	$scope.disableEdit = $rootScope.disablingEdit;
	$scope.firstTimeEntry = true;
	$scope.locale = abbottConfigService.getLocale();
	$scope.listOfTabs.push({
		"title" : $scope.locale.POB
	});
	$scope.listOfTabs.push({
		"title" : $scope.locale.CompetitorInfo
	});
	$scope.listOfTabs.push({
		"title" : $scope.locale.KeyMessages
	});
	$scope.listOfTabs.push({
		"title" : $scope.locale.FollowupActivity
	});
	$scope.listOfTabs.push({
		"title" : $scope.locale.CorporateInitiative
	});
	$scope.listOfTabs.push({
		"title" : $scope.locale.MedicalQuery_PCN_NCO
	});
	$scope.tabTitle = $scope.locale.POB;

	$scope.defaultSelection = function(selectedTabHeader, index) {
		$scope.firstTimeEntry = false;
		$scope.tabTitle = selectedTabHeader;
		$scope.tabIndex = index;
	}
	window.ga.trackTiming('Otherslanding Finish time', 20000, 'othersLandingFinish', 'Others Landing Finish');
}]); 