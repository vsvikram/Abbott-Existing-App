abbottApp.controller('salesTrrController', ['$rootScope','$filter','userDetailService', 'dashboardStateService', '$scope', 'chartTypes', 'chartConfigService', '$state','piSalesTargetService','$q','abbottConfigService', function($rootScope,$filter,userDetailService,dashboardStateService,$scope, chartTypes, chartConfigService, $state, piSalesTargetService,$q,abbottConfigService) {
    var currentDate = new Date();
    currentDate = $filter('date')(currentDate,'dd MMM');
    $scope.progressbar = {
        "axis": "Target Acheived:Till " + currentDate,
        "progession": 0
    };
    $scope.$emit('updateHeader', {
        isDashboard: false,
        prevHeading: "Sales Target Acheived",
        zoneData: JSON.parse(decodeURI($state.params.object))
    });
    var salesZoneData = {
        userDetail: {}
    };
    $scope.reload = function(){
        var promisesArr = [userDetailService.getUserInfo(),piSalesTargetService.fetchSalesTarget('SalesAchTrend'),piSalesTargetService.fetchSalesTarget('salesGrowth'), piSalesTargetService.fetchDailySales('dailySales')];
        $scope.charts = []; 
        $q.all(promisesArr).then(function(data){
            salesZoneData.userDetail = data[0];
            salesZoneData.SalesAchTrend = data[1];
            salesZoneData.salesGrowth = data[2];
            salesZoneData.salesDailyFlash = data[3];
            $scope.progressbar.progession = salesZoneData.salesDailyFlash.dailyFlashSales;
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