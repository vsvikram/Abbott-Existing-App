abbottApp.controller('salesZoneController', ['$rootScope', '$filter', 'userDetailService', 'dashboardStateService', '$scope', '$http', 'chartTypes', 'chartConfigService', '$state', 'piSalesTargetService', '$q','abbottConfigService', function($rootScope, $filter, userDetailService, dashboardStateService, $scope, $http, chartTypes, chartConfigService, $state, piSalesTargetService, $q,abbottConfigService) {
    $scope.salesAchTrend = {};
    var currentDate = new Date();
    currentDate = $filter('date')(currentDate,'dd MMM');
    $scope.progressbar = {
        "axis": "Target Acheived:Till " + currentDate,
        "progession": 0
    };
    $scope.$emit('updateHeader', {
        isDashboard: false,
        prevHeading: "Sales Target Acheived",
        zoneData: null
    });
    var salesZoneData = {
        userDetail: {}
    };

    $scope.reload = function() {
        var promisesArr = [userDetailService.getUserInfo(), piSalesTargetService.fetchSalesTarget('SalesAchTrend'), piSalesTargetService.fetchSalesTarget('salesGrowth'),piSalesTargetService.fetchDailySales('dailySales'), piSalesTargetService.fetchSalesAchGrwthPrcnt('salesAchPrcnt'), piSalesTargetService.fetchSalesAchGrwthPrcnt('salesGrowthPrcnt')];        
        $q.all(promisesArr).then(function(data) {
            $scope.charts = [];
            salesZoneData.userDetail = data[0];
            salesZoneData.SalesAchTrend = data[1];
            salesZoneData.salesGrowth = data[2];
            salesZoneData.dailySales = data[3];
            salesZoneData.salesAchPrcnt = data[4];
            salesZoneData.salesGrowthPrcnt = data[5];
            $scope.progressbar.progession = salesZoneData.dailySales.dailyFlashSales;

            $scope.charts.push(chartConfigService.createChart(salesZoneData.SalesAchTrend.chartData, chartTypes.lineChart, 'Sales Achievement % Trend', chartConfigService.lineChartConfig({
                median: true,
                medianValue: salesZoneData.SalesAchTrend.YTD,
                yAxis: 'SALES ACHIEVEMENT',
                yGap: salesZoneData.SalesAchTrend.steps
            })));
            $scope.charts.push(chartConfigService.createChart(salesZoneData.salesGrowth.chartData, chartTypes.lineChart, 'Sales Growth % Trend', chartConfigService.lineChartConfig({
                median: true,
                medianValue: salesZoneData.salesGrowth.YTD,
                yAxis: 'SALES GROWTH',
                yGap: salesZoneData.salesGrowth.steps
            })));
            var dailySalesChart = chartConfigService.createChart(salesZoneData.dailySales.chartData, chartTypes.barChart, 'Daily Sales Flash', chartConfigService.barChartConfig({
                yAxis: 'Daily Sales'
            }));
            dailySalesChart['showProgress'] = true;
            $scope.charts.push(dailySalesChart);

            $scope.charts.push(chartConfigService.createChart(salesZoneData.salesAchPrcnt.chartData, chartTypes.barChart, 'Sales Achievement %', chartConfigService.barChartConfig({
                yAxis : 'SALES ACHIEVEMENT',
                className: 'bar-yellow',
                clickAllowed: true,
                stateToGo : 'piHome.salesTarget.area',
                dataToNext :  {},
                dataToNextKey: 'area',
                yGap: 10,
                tickStart: 10,
                tickEnd: 10
            })));
            $scope.charts.push(chartConfigService.createChart(salesZoneData.salesGrowthPrcnt.chartData, chartTypes.barChart, 'Sales Growth %', chartConfigService.barChartConfig({
                yAxis : 'SALES GROWTH',
                className: 'bar-yellow',
                clickAllowed: true,
                stateToGo : 'piHome.salesTarget.area',
                dataToNext : {},
                dataToNextKey: 'area',
                yGap: 10,
                tickStart: 10,
                tickEnd: 10
            }))); 
            $scope.screenLoaderStartEnd() 
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
