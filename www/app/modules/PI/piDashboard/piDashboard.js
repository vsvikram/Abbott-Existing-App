abbottApp.controller('piDashboardController', ['$rootScope', '$scope', '$http', 'roundProgService', 'dashboardStateService', '$state','abbottConfigService', function($rootScope, $scope, $http, roundProgService, dashboardStateService, $state,abbottConfigService) {

    $scope.date = dashboardStateService.getPrevDay();
    $scope.reload = function() {
        dashboardStateService.getTrendData().then(function(trends) {
            $scope.trends = trends;
            $scope.roundProgConfig = roundProgService.generateCirlceProg();
            $scope.defaultThreshold = dashboardStateService.defaultThreshold;
            $scope.screenLoaderStartEnd();
        });
        $scope.selectedBrand = dashboardStateService.getSelectedBrand();
    };
    $scope.screenLoaderStart = function(){
        $scope.transperantConfig = abbottConfigService.getTransparency();
        $scope.transperantConfig.display = true;
        $scope.transperantConfig.showBusyIndicator = true;
        $scope.transperantConfig.showTransparancy = true;
        abbottConfigService.setTransparency($scope.transperantConfig);
    }
    $scope.screenLoaderStartEnd = function(){
        $scope.transperantConfig.display = false;
        abbottConfigService.setTransparency($scope.transperantConfig);
    }
    $scope.reload();
    $scope.screenLoaderStart();
    $scope.$emit('updateHeader', {
        isDashboard: true
    });
    $scope.navigateScreen = function(stateName, data) {
        $state.go(stateName, {
            object: encodeURI(JSON.stringify([]))
        });
    }
    $rootScope.$on('brandUpdated', function(event, data) {
        $scope.screenLoaderStart();
        $scope.reload();
    });
}]);