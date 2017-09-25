abbottApp.controller('docCoverageAreaCtrl', ['$rootScope','userDetailService','dashboardStateService','$scope', '$http','chartTypes','$state','chartConfigService','piSalesTargetService','$q','abbottConfigService', function($rootScope,userDetailService,dashboardStateService,$scope, $http, chartTypes, $state, chartConfigService, piSalesTargetService,$q,abbottConfigService) {
    $scope.progressbar = {
        "axis" : "Target Acheived:Till 05 May",
        "progession" : 17
    }
    $scope.$emit('updateHeader',{
        isDashboard : false,
        prevHeading : "Sales Target Acheived",
        zoneData : JSON.parse(decodeURI($state.params.object))
    });
    var salesZoneData = {
        userDetail: {}
    };

    $scope.reload = function(){
        var promisesArr = [userDetailService.getUserInfo(),piSalesTargetService.fetchSalesTarget('SalesAchTrend'),piSalesTargetService.fetchSalesTarget('salesGrowth'), piSalesTargetService.fetchDailySales('dailySales'), piSalesTargetService.fetchSalesAchGrwthPrcnt('salesAchPrcnt'), piSalesTargetService.fetchSalesAchGrwthPrcnt('salesGrowthPrcnt')];
        $scope.charts = []; 
        $q.all(promisesArr).then(function(data){
            salesZoneData.userDetail = data[0];
            salesZoneData.SalesAchTrend = data[1];
            salesZoneData.salesGrowth = data[2];
            salesZoneData.salesDailyFlash = data[3];
            salesZoneData.salesAchPrcnt = data[4];
            salesZoneData.salesGrowthPrcnt = data[5];
            $scope.charts.push(chartConfigService.createChart(salesZoneData.SalesAchTrend.chartData, chartTypes.lineChart, 'Sales Achievement % Trend', chartConfigService.lineChartConfig({
                median:true,
                medianValue: salesZoneData.SalesAchTrend.YTD,
                yAxis : 'SALES ACHIEVEMENT',
                yGap : salesZoneData.SalesAchTrend.steps
            }))); 
            $scope.charts.push(chartConfigService.createChart(salesZoneData.salesGrowth.chartData, chartTypes.lineChart, 'Sales Growth % Trend', chartConfigService.lineChartConfig({
                median:true,
                medianValue: salesZoneData.salesGrowth.YTD,
                yAxis : 'SALES GROWTH',
                yGap : salesZoneData.salesGrowth.steps
            })));
            $scope.charts.push(chartConfigService.createChart(salesZoneData.salesDailyFlash.chartData, chartTypes.barChart, 'Daily Sales Flash', chartConfigService.barChartConfig({
                yAxis: 'Daily Sales'
            })));            
            $scope.charts.push(chartConfigService.createChart(salesZoneData.salesAchPrcnt.chartData, chartTypes.barChart, 'Sales Achievement %', chartConfigService.barChartConfig({
                yAxis : 'SALES ACHIEVEMENT',
                className: 'bar-yellow',
                clickAllowed: true,
                stateToGo : 'piHome.salesTarget.territory',
                dataToNext : JSON.parse(decodeURI($state.params.object)),
                dataToNextKey: 'territory',
                yGap: 10,
                tickStart: 10,
                tickEnd: 10
            })));  
            $scope.charts.push(chartConfigService.createChart(salesZoneData.salesGrowthPrcnt.chartData, chartTypes.barChart, 'Sales Growth %', chartConfigService.barChartConfig({
                yAxis : 'SALES GROWTH',
                className: 'bar-yellow',
                clickAllowed: true,
                stateToGo : 'piHome.salesTarget.territory',
                dataToNext : JSON.parse(decodeURI($state.params.object)),
                dataToNextKey: 'territory',
                yGap: 10,
                tickStart: 10,
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
    $rootScope.$on('brandUpdated',function(event, data){
        console.log("Area Reload Worked");
        $scope.screenLoaderStart();
        $scope.reload();
    });

}]);
