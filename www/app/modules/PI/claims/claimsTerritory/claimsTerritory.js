abbottApp.controller('claimsTerritoryCtrl', ['$rootScope','userDetailService', 'dashboardStateService', '$scope', 'chartTypes', 'chartConfigService', '$state','piSalesTargetService','$q','abbottConfigService', function($rootScope,userDetailService,dashboardStateService,$scope, chartTypes, chartConfigService, $state, piSalesTargetService,$q,abbottConfigService) {
    $scope.$emit('updateHeader',{
        isDashboard : false,
        prevHeading : "Claims",
        zoneData : JSON.parse(decodeURI($state.params.object))
    });
    var claimsZoneData = {
        userDetail: {}
    };
    $scope.reload = function() {
        var promisesArr = [userDetailService.getUserInfo(), piSalesTargetService.fetchSalesTarget('claimsAchTrend')];        
        $q.all(promisesArr).then(function(data) {
            $scope.charts = [];
            claimsZoneData.userDetail = data[0];
            claimsZoneData.claimsAchTrend = data[1];
            var state = JSON.parse(decodeURI($state.params.object));
            $scope.territoryName = (state && state['territory']) ? state['territory']['names'] : claimsZoneData.userDetail.userTerritoryName;
            $scope.progressbar = {
                "title": "Claims %",
                "axis": $scope.territoryName,
                "progession": 17
            }
            $scope.charts.push(new chartConfigService.createChart(claimsZoneData.claimsAchTrend.chartData, chartTypes.lineChart, 'Claims % Trend', chartConfigService.lineChartConfig({
                median: false,
                /*medianValue: claimsZoneData.claimsAchTrend.YTD,*/
                yAxis: 'CLAIMS',
                yGap: claimsZoneData.claimsAchTrend.steps
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
    $rootScope.$on('brandUpdated',function(event, data){
        console.log("Territory Reload Worked");
        $scope.screenLoaderStart();
        $scope.reload();
    });

}]);