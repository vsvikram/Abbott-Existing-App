abbottApp.controller('docCoverageCtrl', ['$rootScope','$scope', '$http','$q','PIService','userDetailService','chartConfigService', 'piDocterCoverageService', function($rootScope,$scope, $http,$q,PIService,userDetailService,chartConfigService, piDocterCoverageService) {
    $scope.setChartDataFormat = function(data) {
        var dcChartMothData = [];
        angular.forEach(data,function(value,key) {
            dcChartMothData.push({names:value.month,value:parseFloat(value.coverage)})
        });
        return dcChartMothData;
    };
    $scope.error = '';
    $scope.setMultiBarChartDataFormat = function(data) {
        var dcChartMothData = [],values = [];
        if(data) {
            for(var i=0;i<data[0].bpd0.monthWiseData.length;i++) {
                dcChartMothData.push({
                    names:data[0].bpd0.monthWiseData[i].month,
                    value:[parseFloat(data[0].bpd0.monthWiseData[i].coverage),
                    parseFloat(data[0].bpd1.monthWiseData[i].coverage),
                    parseFloat(data[0].bpd2plus.monthWiseData[i].coverage)]
                });
            }
        }
        return dcChartMothData;
    }

    $scope.getMinMaxValues = function(data){
        var dcMin,dcMax,dcDiff,dcLow,dcHigh;

        dcMin = Math.min.apply(Math,data.map(function(item){return Math.round(parseFloat(item.coverage));}));
        dcMax = Math.max.apply(Math,data.map(function(item){return Math.round(parseFloat(item.coverage));}));

        dcDiff = dcMax - dcMin;
        dcLow = dcMin - dcDiff;
        dcHigh = dcMax + dcDiff;

        return {min:dcLow,max:dcHigh,diff:dcDiff};
    }

    $scope.reload = function() {
        $scope.charts = [];
        piDocterCoverageService.getData().then(function(sRes) {
            if(sRes.error) {
                $scope.error = sRes.error;
                return false;
            }
            $scope.dcMonthData = sRes[0].dc.monthWiseData;
            $scope.dcLineData = sRes[0].dc.noOfDaysCovered;

            dcBXY = $scope.getMinMaxValues($scope.dcMonthData);
            dcLXY = $scope.getMinMaxValues($scope.dcLineData);

            $scope.charts.push(chartConfigService.createChart({
                barData: $scope.setChartDataFormat($scope.dcMonthData),
                lineData: $scope.setChartDataFormat($scope.dcLineData)
            }, 'barLine', 'Doctor Coverage %', chartConfigService.barLineChartConfig({
                yAxisOne: 'DOCTOR COVERAGE',
                yAxisTwo: 'TOTAL NO. OF DAYS',
                yGapL : dcLXY.diff,
                tickStartL: dcLXY.min,
                tickEndL: dcLXY.max,
                yGapB : dcBXY.diff,
                tickStartB: dcBXY.min,
                tickEndB: dcBXY.max
            })));

            $scope.dcCAMonthData = sRes[0].ca.monthWiseData;
            dcCAXY = $scope.getMinMaxValues($scope.dcCAMonthData);


            $scope.charts.push(chartConfigService.createChart($scope.setChartDataFormat($scope.dcCAMonthData),
                'line',
                'Call Average',
                chartConfigService.lineChartConfig({
                    yAxis : 'DOCTOR COVERAGE(%)',
                    yGap : dcCAXY.diff,
                    className: 'sales',
                    tickStart: dcCAXY.min,
                    tickEnd: dcCAXY.max
            })));

            $scope.dcDFCMonthData = sRes[0].dfc.monthWiseData;
            dcDFCXY = $scope.getMinMaxValues($scope.dcDFCMonthData);

            $scope.charts.push(chartConfigService.createChart($scope.setChartDataFormat($scope.dcDFCMonthData),
                'line',
                'L Doctor Frequency Coverage',
                chartConfigService.lineChartConfig({
                    yAxis : 'DOCTOR COVERAGE(%)',
                    yGap : dcDFCXY.diff,
                    className: 'sales',
                    tickStart: dcDFCXY.min,
                    tickEnd: dcDFCXY.max
            })));

            var BDPValues = []
            if(sRes){
                for(var i=0;i<sRes[0].bpd0.monthWiseData.length;i++){
                    BDPValues.push({coverage:sRes[0].bpd0.monthWiseData[i].coverage});
                    BDPValues.push({coverage:sRes[0].bpd1.monthWiseData[i].coverage});
                    BDPValues.push({coverage:sRes[0].bpd2plus.monthWiseData[i].coverage});
                }
            }

            var BPDXY = $scope.getMinMaxValues(BDPValues);

            $scope.charts.push(chartConfigService.createChart($scope.setMultiBarChartDataFormat(sRes),
                'multibar',
                'BPD',
                chartConfigService.multibarChartConfig({
                   yGap : 10,
                   tickStart: 0,
                   tickEnd: 0
            })));
            
        });           
    };

    $scope.reload();

}]);
