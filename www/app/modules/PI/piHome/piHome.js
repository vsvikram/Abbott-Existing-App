abbottApp.controller('piHomeController', ['$scope', '$rootScope', 'dashboardStateService', 'userDetailService','$state', function($scope, $rootScope, dashboardStateService, userDetailService, $state) {
    $scope.brandArr = [];
    $scope.showNormalFooter = true;


    dashboardStateService.getBrandFilterData().then(function(res) {
        $scope.brandArr = res;
    });
    $scope.$watch(function(){ return $state.$current.name }, function(newVal, oldVal) {
        if($state.current.url.indexOf('doctorCoverage') !== -1) {
            $scope.showNormalFooter = false;
        } else {
            $scope.showNormalFooter = true;
            //If we load the brand here then selected brand will be removed.
            /*dashboardStateService.getBrandFilterData().then(function(res) {
                $scope.brandArr = res;
            });*/
        }
    });

    $scope.HeaderConfig = {
        showlogo: true,
        userName: "",
        subUserDetail: "",
        isDashboard: true,
        prevHeading: '',
        zoneData: null
    };
    userDetailService.getUserInfo().then(function(userDetail) {
        $scope.HeaderConfig['userName'] = userDetail.Name;
        $scope.HeaderConfig['subUserDetail'] = userDetail.Designation__c;
    });
    $scope.$on('updateHeader', function(event, data) {
        $scope.HeaderConfig.isDashboard = data.isDashboard;
        $scope.HeaderConfig.prevHeading = data.prevHeading;
        $scope.HeaderConfig.zoneData = data.zoneData;
    });
}]);