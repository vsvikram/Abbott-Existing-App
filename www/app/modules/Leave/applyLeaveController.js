abbottApp.controller('applyLeaveController', [
'$scope',
'navigationService',
'abbottConfigService',
'popupService',
'$timeout',
'userCollection',
'PIService',
'leaveService',
'$filter',
'$stateParams',
'$window',
function ($scope,
navigationService,
abbottConfigService,
popupService,
$timeout,
userCollection,
PIService,
leaveService,
$filter,
$stateParams,
$window) {
    var userCollectionInstance = new userCollection();
    $scope.imagePath = 'img/';
    $scope.iconsPath = "img/icons/";
    $scope.locale = abbottConfigService.getLocale();
    $scope.labels = leaveService.omitOverallInGroups();
    $scope.selectedLabel = ($stateParams.selectedGroup && $stateParams.selectedGroup != "Overall")? $stateParams.selectedGroup : $scope.labels[0];
    $scope.defaultLabel = $scope.selectedLabel;
    $scope.dataModel = leaveService.getModel();
    $scope.placeSelected = "";
    $scope.leavingHq = 'no';
    $scope.leavingHqYes = false;
    $scope.leavingHqNo = true;
    $scope.fromDate = new Date();
    $scope.toDate= new Date();
    $scope.totalDays = 1;
    $scope.reason = null;
    $scope.errorOccurred = false;
    $scope.errorMessage = "";
    $scope.showPopup = false;
    $scope.pagePush = 0;
    $scope.config = {
        left: {
            text: $scope.locale.ApplyLeave
        }
    };

    $scope.viewFromDate = getDateFormat($scope.fromDate);
    $scope.viewToDate= getDateFormat($scope.toDate);
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

    $scope.calculateTotalDays = function(){
        if($scope.fromDate == null){
            $scope.fromDate = new Date();
        }
        if($scope.toDate == null){
            $scope.toDate = new Date();
        }
        if($scope.fromDate && $scope.toDate){
            $scope.viewFromDate = getDateFormat($scope.fromDate);
            $scope.viewToDate= getDateFormat($scope.toDate);
            $scope.dateErrorOccurred = false;
            $scope.openSplashLoader();
            var state = leaveService.checkApplyDateValidation($scope.fromDate, $scope.toDate, $scope.selectedLabel);
            if(state.error){
                $scope.errorMessage = state.error;
                $scope.dateErrorOccurred = true;
                $scope.totalDays = null;
            }else{
                $scope.totalDays = state.closingBalance;
            }
            $scope.closeSplashLoader();
        }
        console.log($scope.dateErrorOccurred);
    }
    $scope.onApply = function(){
        $scope.clearErrors();
        $scope.calculateTotalDays();
        if(!$scope.dateErrorOccurred){
            if(!$scope.reason){
                $scope.errorMessage = "Please specify the reason";
                $scope.errorOccurred = true;
            }else{
                console.log("data sent");
                $scope.sendData();
            }
        }
    };
    $scope.runValidationAndClearErrors = function(){
        $scope.clearErrors();
        $scope.calculateTotalDays();
    };
    $scope.clearErrors = function(){
        $scope.dateErrorOccurred = false;
        $scope.errorOccurred = false;
        $scope.errorMessage = null;
    };
    $scope.sendData = function(){

        var invocationData = {};
        var payLoad = {

            "from_date": $filter('date')($scope.fromDate, 'yyyy-MM-dd'),
            "to_date": $filter('date')($scope.toDate, 'yyyy-MM-dd'),
            "total_days": $scope.totalDays,
            "place": $scope.placeSelected,
            "approver": $scope.dataModel.approver.id,
            "leave_balance_id": $scope.dataModel.leave_balance_id,
            "leaving_hq": ($scope.leavingHq == "yes"),
            "reason": $scope.reason,
            "leave_type": $scope.selectedLabel,
            "user_id": null,
            "approverName": $scope.dataModel.approver.name
        };
        if (navigator.onLine){
            $scope.openSplashLoader();
            userCollectionInstance
                .getActiveUser()
                .then(function(activeUser){
                    payLoad.user_id = activeUser.Id;
                    invocationData.url = "/leaveservice";
                    invocationData.method = "POST";
                    invocationData.data = payLoad;
                    PIService.invoke(invocationData)
                        .then(function(sRes){
                            $scope.closeSplashLoader();
                            console.log(sRes);
                            $scope.leaveSuccessHandler(payLoad, sRes[0].success);
                            $scope.showPopup = true;
                        },function(eRes){
                            $scope.closeSplashLoader();
                            popupService.openPopup("leave cannot be applied", $scope.locale.OK, '80%', function() {});
                        });
                });
        }else{
            popupService.openPopup($scope.locale.NoInternetConnection, $scope.locale.OK, '80%', function () { });
        }
    };
    $scope.leaveSuccessHandler = function(payLoad, leaveId){
        var detail = {};
        detail.applied_date = $filter('date')(new Date(), 'yyyy-MM-dd');
        detail.from_date = payLoad.from_date;
        detail.from_date_formatted = new Date(payLoad.from_date);
        detail.to_date = payLoad.to_date;
        detail.id = leaveId;
        detail.leave_status = "Pending";
        detail.leaving_hq = payLoad.leaving_hq;
        detail.number_of_days = payLoad.total_days;
        detail.placeSelected = $scope.placeSelected;
        detail.reason = payLoad.reason;
        $scope.dataModel.leave_matrix[$scope.selectedLabel].details.push(detail);
        $scope.dataModel.leave_matrix[$scope.selectedLabel].pending_for_approval += payLoad.total_days;
        if($scope.dataModel.leave_matrix[$scope.selectedLabel].closing_balance >=  payLoad.total_days){
            $scope.dataModel.leave_matrix[$scope.selectedLabel].closing_balance -= payLoad.total_days;
        }
        leaveService.calculateOverallLeaves();
        leaveService.sortDetailsByDate();

        $scope.clearFrom();

    };
    $scope.clearFrom  = function(){
        $scope.selectedLabel = $scope.defaultLabel;
        $scope.placeSelected = "";
        $scope.leavingHq = 'no';
        $scope.fromDate = new Date();
        $scope.toDate= new Date();
        $scope.viewFromDate = getDateFormat($scope.fromDate);
        $scope.viewToDate= getDateFormat($scope.toDate);
        $scope.totalDays = 1;
        $scope.reason = null;
        $scope.errorOccurred = false;
        $scope.errorMessage = "";
        $scope.dateErrorOccurred = false;
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


    $scope.prependZeroOnSingleDigits = function(value){
        if(value){
        return parseInt(value) > 9? value : "0"+value;
        }else{
            return null;
        }

    };
    window.addEventListener('native.keyboardshow', keyboardShowHandler);
    function keyboardShowHandler(e) { // fired when keyboard enabled
        var keyboardHeight = e.keyboardHeight;
        $scope.$apply(function() {
            $scope.pagePush = keyboardHeight;
        });
    }


    window.addEventListener('native.keyboardhide', keyboardHideHandler);
    function keyboardHideHandler(e) { // fired when keyboard enabled
        $scope.$apply(function() {
            $scope.pagePush = 0;
        });
    }
}]);

function getDateFormat(date){
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var cMonth = date.getMonth()+1;
    var cDate = date.getDate();
    var cYear = date.getFullYear();
    if(cDate <10)
        cDate = '0'+cDate;
    if(cMonth<10)
        cMonth = '0'+cMonth;
    cYear = cYear.toString().substr(2,2);
    var vDate = cDate +'.'+ cMonth +'.'+ cYear;
    return vDate;
}