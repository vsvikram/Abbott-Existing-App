abbottApp.controller('leavePolicyController', [
'$scope',
'navigationService',
'abbottConfigService',
'popupService',
'$timeout',
'userCollection',
'PIService',
'leaveService',
function ($scope,
navigationService,
abbottConfigService,
popupService,
$timeout,
userCollection,
PIService,
leaveService) {
    $scope.dataReteived = false;
    $scope.policy = null;
    $scope.locale = abbottConfigService.getLocale();
    $scope.allModel = leaveService.getModel();
    $scope.config = {
        left: {
            text: $scope.locale.LeavePolicyDocument
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
    $scope.policy = $scope.allModel.leave_policy;

    $scope.back = function(){
        navigationService.backFunc();
    }

}]);