abbottApp.controller('claimsZoneController', ['$rootScope', 'userDetailService', 'dashboardStateService', '$scope', '$http', 'chartTypes', 'chartConfigService', '$state', 'piSalesTargetService', '$q', 'abbottConfigService', function($rootScope, userDetailService, dashboardStateService, $scope, $http, chartTypes, chartConfigService, $state, piSalesTargetService, $q,abbottConfigService) {
    $scope.salesAchTrend = {};
    $scope.progressbar = {
        "axis": "Target Acheived:Till 05 May",
        "progession": 17
    };
    $scope.$emit('updateHeader', {
        isDashboard: false,
        prevHeading: "Claims",
        zoneData: null
    });
    var claimsZoneData = {
        userDetail: {}
    };

    $scope.reload = function() {
        var promisesArr = [userDetailService.getUserInfo(), piSalesTargetService.fetchSalesTarget('claimsAchTrend'), piSalesTargetService.fetchSalesAchGrwthPrcnt('claimsGrowth')];        
        $q.all(promisesArr).then(function(data) {
            $scope.charts = [];
            claimsZoneData.userDetail = data[0];
            claimsZoneData.claimsAchTrend = data[1];
            claimsZoneData.claimsGrowth = data[2];
            $scope.charts.push(new chartConfigService.createChart(claimsZoneData.claimsAchTrend.chartData, chartTypes.lineChart, 'Claims % Trend', chartConfigService.lineChartConfig({
                median: false,
                //medianValue: claimsZoneData.claimsAchTrend.YTD,
                yAxis: 'CLAIMS',
                yGap: claimsZoneData.claimsAchTrend.steps
            })));
            $scope.charts.push(chartConfigService.createChart(claimsZoneData.claimsGrowth.chartData, chartTypes.barChart, 'Claims %', chartConfigService.barChartConfig({
                yAxis : 'CLAIMS',
                className: 'bar-yellow',
                clickAllowed: true,
                stateToGo : 'piHome.claims.area',
                dataToNext : {},
                dataToNextKey: 'area',
                yGap: 5,
                tickEnd: 10
            })));   
            $scope.screenLoaderStartEnd();
        });
    }
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
    $rootScope.$on('brandUpdated', function(event, data) {
        console.log("Zone Reload Worked");
        $scope.screenLoaderStart();
        $scope.reload();
    });
}]);