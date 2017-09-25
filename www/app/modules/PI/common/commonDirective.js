abbottApp.directive('renderChart', function(customChartThemeService) {
    return {
        "restrict": "AC",
        "link": function(scope, element, attrs) {
            var chartDetails = scope[attrs.renderChart];
            var svgEle = d3.select(element.find('svg')[0]);
            var chartData = chartDetails.data;
            switch (chartDetails.chartType) {
                case 'bar':
                    customChartThemeService.barChart(svgEle, chartData, chartDetails.config)
                    break;
                case 'line':
                    customChartThemeService.lineChart(svgEle,chartData,chartDetails.config)
                    break;
                case 'barLine':
                    customChartThemeService.barLineChart(svgEle,chartData,chartDetails.config)
                    break;
                case 'multibar':
                    customChartThemeService.multibarChart(svgEle,chartData,chartDetails.config)
                    break;
                default:
                    break;
            }
        }
    }
});