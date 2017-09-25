abbottApp.service('chartConfigService', [function() {
    this.createChart = function(data, chartType, ChartTitle, chartConfig) {
        return  {
            data: data,
            chartType: chartType,
            chartTitle: ChartTitle,
            config: chartConfig
        }
    }
    this.lineChartConfig = function(updatedConfig) {
        var defaulConfig = {
            median: false,
            medianValue: 0,       // Used only if median is true. Also used over right median value
            yAxis: 'Y-Axis',
            yGap: 1,
            className: 'sales',
            tickStart: 10,
            tickEnd: 10
        };
        return this.mergeObject(defaulConfig, updatedConfig)
    }
    this.barChartConfig = function(updatedConfig) {
        var defaulConfig = {
            median: false,
            yGap: 10000,
            yAxis: 'Y-Axis',
            className: 'sales',
            clickAllowed:false,
            tickLimit: null,
            stateToGo:'',
            dataToNext : [],
            dataToNextKey : '',
            tickStart: 0,
            tickEnd: 10000
        }
        return this.mergeObject(defaulConfig, updatedConfig)
    }
    this.barLineChartConfig = function(updatedConfig) {
        var defaulConfig = {
            yAxisOne: 'Y-Axis 1',
            yAxisTwo: 'Y-Axis 2',
            yGapL: 1,
            tickStartL: 0,
            tickEndL: 0,
            yGapB: 1,
            tickStartB: 0,
            tickEndB: 0
        }
        return this.mergeObject(defaulConfig, updatedConfig)
    }
    this.multibarChartConfig = function(updatedConfig) {
        var defaulConfig = {
            yGap: 10,
            tickStart: 0,
            tickEnd: 0
        };
        return this.mergeObject(defaulConfig, updatedConfig)
    }
    this.mergeObject = function(defaultObj, updatedObj) {
        if (updatedObj) {
            for (var key in updatedObj) {
                if (key in defaultObj) {
                    defaultObj[key] = updatedObj[key]
                }
            }
        }
        return defaultObj;
    }
    this.updateDataForChart = function(data) {
        var newArr = [];
        for (var i = 0;i<data.length;i++) {
            var nameVal = Object.keys(data[i])[0].split('_')[0],
            value = data[i][Object.keys(data[i])[0]];
            var obj = {
                names: nameVal,
                value: value
            };
            newArr.push(obj);
        }
        return newArr;
    }
}]);
