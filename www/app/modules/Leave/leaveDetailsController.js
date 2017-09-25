abbottApp.controller('leaveDetailsController', [
'$scope',
'navigationService',
'abbottConfigService',
'popupService',
'$timeout',
'userCollection',
'PIService',
'leaveService',
'$stateParams',
function ($scope,
navigationService,
abbottConfigService,
popupService,
$timeout,
userCollection,
PIService,
leaveService,
$stateParams) {
    var invocationData = {};
    var leaveToBeCancelled = null;
    var userCollectionInstance = new userCollection();
    $scope.locale = abbottConfigService.getLocale();
    $scope.allModel = leaveService.getModel();
    $scope.selectedModel = $scope.allModel.leave_matrix[$stateParams.selectedGroup];
    $scope.selectedLabel = $stateParams.selectedGroup;
    $scope.cancelInvoked = false;
    $scope.showPopup = false;
    $scope.imagePath = 'img/';
    $scope.iconsPath = "img/icons/";
    $scope.locale = abbottConfigService.getLocale();
    $scope.config = {
        left: {
            text: $scope.locale.MyLeaveSummary
        }
    };
    $scope.checkCancelValidity = function(detail){
        //cancelInvoked
        if((detail.leave_status == "Approved"
           ||detail.leave_status == "Pending")
           && $scope.cancelInvoked){
            return true;
        }else{
            return false;

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
    console.log($scope.selectedModel);
    $scope.prependZeroOnSingleDigits = function(value){
        return parseInt(value) > 9? value : "0"+value;

    };
    $scope.convertDateFormat = function(dt){
        var receivedDate = new Date(dt);
        var dd = receivedDate.getDate();
        var mm = receivedDate.getMonth()+1; //January is 0!

        var yyyy = receivedDate.getFullYear();
        var yy = String(yyyy).substring(2);
        if(dd<10){
            dd='0'+dd;
        }
        if(mm<10){
            mm='0'+mm;
        }
        return receivedDate = dd+'/'+mm+'/'+ yy;
    };
    $scope.cancelLeaveClick = function(detail){
        $scope.showPopup = !$scope.showPopup;
        leaveToBeCancelled = detail;
    };
    $scope.cancelLeave = function(){
        $scope.showPopup = !$scope.showPopup;
        if (navigator.onLine){
            $scope.openSplashLoader();
            userCollectionInstance
                .getActiveUser()
                .then(function(activeUser){
                    var payLoad = {};
                    payLoad.user_id = activeUser.Id;
                    payLoad.id = leaveToBeCancelled.id;
                    invocationData.url = "/leaveservice";
                    invocationData.method = "POST";
                    invocationData.data = payLoad;
                    console.log("leave has been successfully cancelled");
                    PIService.invoke(invocationData)
                        .then(function(sRes){
                            if(typeof sRes[0].success != 'undefined'){
                                if(sRes[0].success.indexOf("pending with") < 0){
                                   leaveService.impactLeaveCancellation($stateParams.selectedGroup, leaveToBeCancelled.id);
                                }else{
                                    leaveService.setCancellationStatusToPending($stateParams.selectedGroup, leaveToBeCancelled.id);
                                }
                                message = sRes[0].success
                            }else{
                                message = "Your cancel request has been sent for approval.";
                            }

                            popupService.openPopup(message, $scope.locale.OK, '80%', function() {});
                            $scope.closeSplashLoader();
                        },
                        function(eRes){
                            var res = JSON.parse(eRes.responseText);
                            var message = typeof res.Error == 'undefined'? "Server Error: Leave could not be cancelled": res.Error;
                            popupService.openPopup(message, $scope.locale.OK, '80%', function() {});
                            $scope.closeSplashLoader();
                        });

                });

            }else{
                popupService.openPopup($scope.locale.NoInternetConnection, $scope.locale.OK, '80%', function () { });
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