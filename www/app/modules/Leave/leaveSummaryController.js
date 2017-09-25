abbottApp.controller('leaveSummaryController', [
'$scope',
'navigationService',
'abbottConfigService',
'popupService',
'userCollection',
'PIService',
'leaveService',
function ($scope,
navigationService,
abbottConfigService,
popupService,
userCollection,
PIService,
leaveService) {
    $scope.allModel = leaveService.getModel();
    $scope.selectedModel = $scope.allModel.selectedLabel? $scope.allModel.leave_matrix[$scope.allModel.selectedLabel]: $scope.allModel.leave_matrix.Overall;
    $scope.selectedLabel = $scope.allModel.selectedLabel? $scope.allModel.selectedLabel : "Overall";
    $scope.imagePath = 'img/';
    $scope.iconsPath = "img/icons/";
    $scope.locale = abbottConfigService.getLocale();
    $scope.config = {
        left: {
            text: $scope.locale.MyLeaveSummary
        },
        right: {
            text: ""
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
    $scope.changeLeaveGroup = function(){
        $scope.selectedModel = $scope.allModel.leave_matrix[$scope.selectedLabel];
        console.log($scope.selectedModel);
        leaveService.assignSelectedLabel($scope.selectedLabel);
    };
    $scope.onDetailsClick = function(){
        if (navigator.onLine){
            navigationService.navigate('leaveDetails', {
                'selectedGroup' : $scope.selectedLabel,
            });
        }else{
            popupService.openPopup($scope.locale.NoInternetConnection, $scope.locale.OK, '35%', function() {});
        }

    };
    $scope.prependZeroOnSingleDigits = function(value){
                value = value? value : 0;
                return parseFloat(value) > 9? value : "0"+value;
        };
    $scope.onApplyLeaveClick = function(){
        if (navigator.onLine){
            navigationService.navigate('applyLeave',{
                "selectedGroup": $scope.selectedLabel
            });
        }else{
            popupService.openPopup($scope.locale.NoInternetConnection, $scope.locale.OK, '35%', function() {});
        }
    };
}]);