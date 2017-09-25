abbottApp.controller('leaveHomeController', [
'$scope',
'navigationService',
'abbottConfigService',
'popupService',
'$timeout',
'userCollection',
'PIService',
'leaveService',
'dcrLeaveCollection',
function ($scope,
navigationService,
abbottConfigService,
popupService,
$timeout,
userCollection,
PIService,
leaveService,
dcrLeaveCollection) {
    var invocationData = {};
    var userCollectionInstance = new userCollection();
    $scope.imagePath = 'img/';
    $scope.iconsPath = "img/icons/";
    $scope.locale = abbottConfigService.getLocale();
	var dcrLeaveCollectionInstance = new dcrLeaveCollection();
	$scope.model = null;
    $scope.config = {
        left: {
            text: $scope.locale.Introduction
        }
    };
    $scope.abwheaderConfig = {
        hambergFlag: true,
        applogoFlag: false,
        textFlag  : false,
        syncFlag: true,
        headerText: "Leave",
        toggleSideMenu: false,
        notifyFlag: true,
        notifyCount: 3,
        searchFlag: false,
        searchHandler : searchHandler
    };
    function searchHandler(searchVal) {
        $scope.searchVal = searchVal;
    };
    $scope.init = function(){
        $scope.openSplashLoader();
        if (!navigator.onLine){
            popupService.openPopup($scope.locale.NoInternetConnection,
                                   $scope.locale.OK,
                                   '35%', function(){
                                   navigationService.backFunc()});
        }
		dcrLeaveCollectionInstance
			.serverConfig()
			.then(dcrLeaveCollectionInstance.fetchFromSalesforce)
			.then(dcrLeaveCollectionInstance.fetchRecursiveFromResponse)
			.then(dcrLeaveCollectionInstance.onDownloadingFinished)
			.then(function(dcrData){
					leaveService.setDCRDates(dcrData);
				}, function(fail){
					console.log("dcr failed");
					console.log(fail);
				});
		
        userCollectionInstance
        .getActiveUser()
        .then(function(activeUser){
            invocationData.url = "/leaveservice?userId="+activeUser.Id;
            invocationData.method = "GET";
            invocationData.data = "";
            PIService.invoke(invocationData)
            .then(function(sRes){
                leaveService.setLeaveModel(angular.copy(PIService.response[0]));
                $scope.model = leaveService.getModel();
                $scope.closeSplashLoader();
            },
            function(eRes){
                popupService.openPopup(
                    $scope.locale.NoInternetConnection,
                    eRes[0].message,
                    '35%',
                    function() {});
                $scope.closeSplashLoader();
            });
        });
    };
    $scope.onLeaveSummaryClick = function(){
        if (navigator.onLine){
            navigationService.navigate('leaveSummary');
        }else{
            popupService.openPopup($scope.locale.NoInternetConnection, $scope.locale.OK, '35%', function() {			});
        }

    };
    $scope.onApplyLeaveClick = function(){
        if (navigator.onLine){
            if($scope.model.leave_matrix.Overall.closing_balance > 0){
                navigationService.navigate('applyLeave');
            }else{
                popupService.openPopup("You do not have enough leave balance.", $scope.locale.OK, '35%', function() {});
            }
        }else{
            popupService.openPopup($scope.locale.NoInternetConnection, $scope.locale.OK, '35%', function() {			});
        }
    };
    $scope.onLeavePolicyClick = function(){
        if (navigator.onLine){
            navigationService.navigate('leavePolicy');
        }else{
            popupService.openPopup($scope.locale.NoInternetConnection, $scope.locale.OK, '35%', function() {			});
        }
    };
    $scope.onOrganizationalLeaveClick = function(){
        if (navigator.onLine){

            navigationService.navigate('organizationalLeave');
        }else{
            popupService.openPopup($scope.locale.NoInternetConnection, $scope.locale.OK, '35%', function() {			});
        }
    };
    $scope.openSplashLoader = function(){
        //Loading indicator code
        $scope.transperantConfig = abbottConfigService.getTransparency();
        $scope.transperantConfig.display = true;
        $scope.transperantConfig.showBusyIndicator = true;
        $scope.transperantConfig.showTransparancy = true;
        abbottConfigService.setTransparency($scope.transperantConfig);
    };

    $scope.closeSplashLoader = function(){
        //Ending indicator code
        $scope.transperantConfig = abbottConfigService.getTransparency();
        $scope.transperantConfig.display = false;
        $scope.transperantConfig.showBusyIndicator = false;
        $scope.transperantConfig.showTransparancy = false;
        abbottConfigService.setTransparency($scope.transperantConfig);
    };
}]);
