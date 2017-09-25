abbottApp.controller('SFEHomeController', ['$scope','$filter','$location', 'navigationService', 'abbottConfigService', '$rootScope', '$q', 'popupService','dcrHelperService', 'SALESFORCE_QUERIES','$timeout',
function($scope, $filter,$location, navigationService, abbottConfigService, $rootScope,$q, popupService,dcrHelperService,SALESFORCE_QUERIES,$timeout) {
   
	$scope.date=new Date();
    $scope.locale = abbottConfigService.getLocale();
    $scope.config = {
            left: {
                text: "Salesforce Excellence"
            },
            right: {
                text: ""
            }
    };
    $scope.abwheaderConfig = {
            hambergFlag: true,
            applogoFlag: true,
            textFlag  : false,
            syncFlag: true,
            toggleSideMenu: false,
            notifyFlag: true,
            notifyCount: 3,
            searchFlag: false,
            searchHandler : searchHandler
    };
    function searchHandler(searchVal) {
            $scope.searchVal = searchVal;
    };
    $scope.navigateToPerformance = function() {
    window.ga.trackEvent('Navigate to Performance','click','Navigate to performance Metrics',20000);
    	navigateToModule('performanceMatrix');
    };
      
    $scope.navigateToDoctorcall = function() {
    window.ga.trackEvent('Navigate to Doctor Call','click','Navigate to Doctor Call Metrics',20000);
    	navigateToModule('doctorCallMatrix');
    };
    
    $scope.navigateToIncentive = function(){
    window.ga.trackEvent('Navigate to Incentive','click','Navigate to incentive Metrics',20000);
    	navigateToModule('incentiveMatrix');
    };
    
    $scope.navigateToSale = function(){
    window.ga.trackEvent('Navigate to Incentive','click','Navigate to incentive Metrics',20000);
    	navigateToModule('salesMatrix');
    };

    $scope.init = function(){

    window.ga.trackView('SFE');
    window.ga.trackTiming('SFE Home Load Start Time',20000,'SFEHomeLoadStart','SFE Home Page Load Start');

    	$scope.firstName = $rootScope.firstName;

    window.ga.trackTiming('SFE Home Load Finish Time',20000,'SFEHomeLoadFinish','SFE Home Page Load Finish');
    };
    
    var navigateToModule = function(module){
    	if(navigator.onLine)
    		navigationService.navigate(module);
    	else
    		popupService.openPopup($scope.locale.NoInternetConnection, $scope.locale.OK, '35%', function() {});
    };
}]);