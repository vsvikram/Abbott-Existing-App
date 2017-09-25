abbottApp.controller('HelpdeskLandingController', ['$scope', 'navigationService', 'abbottConfigService',
function($scope, navigationService, abbottConfigService) {
	window.ga.trackView('HelpDesk');
	window.ga.trackTiming('HelpDesk Load Start Time',20000,'helpdeskLoadStart','HelpDesk Load Start');
	$scope.locale = abbottConfigService.getLocale();
	$scope.listOfTabs=[];
	$scope.firstTimeEntry=true;
 	$scope.listOfTabs.push({"title": $scope.locale.Support});
	$scope.listOfTabs.push({"title": $scope.locale.ViewLastLog});
	$scope.listOfTabs.push({"title": $scope.locale.fullSync});


	//$scope.listOfTabs.push({"title": $scope.locale.associatedApps});

	$scope.tabTitleHelp=$scope.locale.Support;

	//Selection between the tab
	$scope.defaultSelection=function(selectedTabHeader,index){
		$scope.firstTimeEntry=false;
		$scope.tabTitleHelp=selectedTabHeader;
		$scope.tabIndex=index;
	}
	$scope.backButton = function() {
        navigationService.backFunc();
    }

    //Header configuration
    $scope.abwheaderConfig = {
        hambergFlag: true,
        applogoFlag: false,
        textFlag  : true,
        syncFlag: true,
        toggleSideMenu: false,
        notifyFlag: true,
        notifyCount: 3,
        searchFlag: false,
        searchHandler : searchHandler
    }
    function searchHandler(searchVal) {
        $scope.searchVal = searchVal;
    }

	window.ga.trackTiming('HelpDesk Load Finish Time',20000,'helpdeskLoadFinish','HelpDesk Load Finish');
}]);