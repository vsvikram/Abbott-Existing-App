abbottApp.service('piSalesTargetService', ['$q', '$filter', '$state', 'entityCollection', 'SALESFORCE_QUERIES', 'dashboardStateService', 'userDetailService', function($q, $filter, $state, entityCollection, SALESFORCE_QUERIES, dashboardStateService, userDetailService) {
    var entityCollectionInstance = new entityCollection();
    this.SalesAchTrendData = {};
    this.monthToShow = [];
    var viewType = {
        SalesAchTrend: {
            saleskey: '_SEC_ACH_PRCT__c',
            YTD: 'YTD_SEC_ACH_PRCT__c',
            query: SALESFORCE_QUERIES.SERVER_QUERIES.getPISalesAchTrend
        },
        salesGrowth: {
            saleskey: '_GRWTH_PRCT__c',
            YTD: 'YTD_GRWTH_PRCT__c',
            query: SALESFORCE_QUERIES.SERVER_QUERIES.getPISalesGrowth
        },
        dailySales: {
            query: SALESFORCE_QUERIES.SERVER_QUERIES.getPIDailyFlashSales,
            defaultCount: 5
        },
        salesAchPrcnt: {
            saleskey: '_SEC_ACH_PRCT__c',
            query: SALESFORCE_QUERIES.SERVER_QUERIES.getSalesAchPrcnt
        },
        salesGrowthPrcnt: {
            saleskey: '_GRWTH_PRCT__c',
            query: SALESFORCE_QUERIES.SERVER_QUERIES.getSalesGrowthPrcnt
        },
        claimsAchTrend:{
            saleskey: '_CLAIMS_PCNT__c',
            query: SALESFORCE_QUERIES.SERVER_QUERIES.getPIClaimsAchTrend
        },
        claimsGrowth:{
            saleskey: '_CLAIMS_PCNT__c',
            query: SALESFORCE_QUERIES.SERVER_QUERIES.getPIClaimsGrowth
        }
    };
    this.updateSalesQuery = function(query, numOfPrevMonth) {
        var self = this;
        var getTragetsQuery = query;
        self.monthToShow = []; // Resetting the months to show
        getTragetsQuery = getTragetsQuery.replace(/\$BRAND\$/g, dashboardStateService.getSelectedBrand().EBRAND_CD__c);
        var currentDate = new Date();
        for (var i = 1; i <= numOfPrevMonth; i++) {
            var month = new Date(currentDate);
            month.setMonth(currentDate.getMonth() - i);
            formattedMonth = $filter('date')(month, 'MMM').toUpperCase();
            self.monthToShow.push(formattedMonth);
            getTragetsQuery = getTragetsQuery.replace('$PREV-' + i + '-MONTH$', formattedMonth);
        }
        return getTragetsQuery;
    };
    /*Jayan -- Common functino for query replacement for Sales Achviment % and Sales Growth %*/
    this.salesAchAndGrwthPrcntQuery = function (query) {
        var self = this;
        var salesAchAndGrwthPrcntQuery = query;
        //self.monthToShow = []; // Resetting the months to show
        var currentDate = new Date();
        var month = new Date(currentDate);
            month.setMonth(currentDate.getMonth() - 1);
            formattedMonth = $filter('date')(month, 'MMM').toUpperCase();
            console.log(formattedMonth);            
        salesAchAndGrwthPrcntQuery = salesAchAndGrwthPrcntQuery.replace(/\$PREV-MONTH\$/g, formattedMonth);         
        salesAchAndGrwthPrcntQuery = salesAchAndGrwthPrcntQuery.replace(/\$BRAND\$/g, dashboardStateService.getSelectedBrand().EBRAND_CD__c);         
        return salesAchAndGrwthPrcntQuery;
    };
    /*Jayan -- Common functino for query replacement for Sales Achviment % and Sales Growth %*/
    this.getDates = function(dayCount) {
        var obj = {
            currentDate: '',
            prevDate: ''
        };
        var currentDate = new Date(),
            pastDate = new Date();
        obj['currentDate'] = $filter('date')(currentDate,'yyyy-MM-dd');
        pastDate.setDate(pastDate.getDate()-dayCount);
        obj['prevDate'] = $filter('date')(pastDate,'yyyy-MM-dd');;
        /*Dummy Data To be removed*/
        /*obj['currentDate'] = '2017-07-10';
        obj['prevDate'] = '2017-07-05';*/
        /*Dummy Data To be removed*/
        return obj;
    }
    this.updateDailySales = function(query, numOfDays) {
        var self = this;
        var getTragetsQuery = query;
        var dateObj = this.getDates(numOfDays);
        getTragetsQuery = getTragetsQuery.replace('$currentDate$', dateObj.currentDate);
        getTragetsQuery = getTragetsQuery.replace('$prevDate$', dateObj.prevDate);
        return getTragetsQuery;
    };
    this.processSalesData = function(data, queryType) {
        var self = this,
            q = $q.defer(),
            rawData = data,
            formatedData = {
                chartData: [],
                minVal: 0,
                maxVal: 0,
                steps: 0,
                YTD: null
            },
            valArray = [];

        angular.forEach(rawData, function(value, key) {
            value = value || 0;
            if (typeof(value) == "number") {
                value = Math.round(value); // Round of value
                rawData[key] = value; // Setting value back after round off
                valArray.push(value);
            }
        });
        formatedData.minVal = Math.min.apply(null, valArray);
        formatedData.maxVal = Math.max.apply(null, valArray);

        formatedData.steps = Math.round((formatedData.maxVal - formatedData.minVal) / 10);
        formatedData.minVal = Math.round(formatedData.minVal - formatedData.steps);
        formatedData.maxVal = Math.round(formatedData.maxVal + formatedData.steps);
        var ytdKey = viewType[queryType].YTD;
        formatedData.YTD = Math.round(rawData[viewType[queryType].YTD]);

        /* Logic to update chart data */
        angular.forEach(self.monthToShow, function(month, key) {
            //var dynmKey = month + '_SEC_ACH_PRCT__c';            
            var dynmKey = month + viewType[queryType].saleskey;
            var obj = {
                names: month,
                value: rawData[dynmKey]
            }
            formatedData.chartData.push(obj);
        });
        q.resolve(formatedData);
        return q.promise;
    };
    this.processDailySales = function(data, queryType) {
        var self = this,
            rawData = data,
            formatedData = {
                chartData: [],
                dailyFlashSales: 0,
                minVal: 0,
                maxVal: 0,
                steps: 0
            },
            valArray = [];
        for(let i=0;i<rawData.length;i++) {

            if(Object.keys(rawData[i])[0] =='Target_Achieved__c' && rawData[i]['Target_Achieved__c']) {
                formatedData.dailyFlashSales = rawData[i]['Target_Achieved__c'];
            }
            var value = Math.round(rawData[i]['TOTAL_PRIMARY_VAL__c']);
            valArray.push(value);
            names = $filter('date')(new Date(rawData[i]['UPDATED_DATE__c']), 'dd MMM').toUpperCase();
            formatedData.chartData.push({
                names : names,
                value: value
            });
        }
        formatedData.minVal = Math.min.apply(null, valArray);
        formatedData.maxVal = Math.max.apply(null, valArray);
        formatedData.steps = Math.round((formatedData.maxVal - formatedData.minVal)/6);

        formatedData.minVal = Math.round(formatedData.minVal);
        formatedData.maxVal = Math.round(formatedData.maxVal);
        return formatedData;
    };

    /*Jayan*/
    this.processSalesAchAndGrowthPrcnt = function (data, queryType) {
        var self = this,
            q = $q.defer(),
            rawData = data,
            formatedData = {
                chartData: [],
                minVal: 0,
                maxVal: 0,
                steps: 0
            };
            var currentDate = new Date();
            var month = new Date(currentDate);
            month.setMonth(currentDate.getMonth() - 1);
            var formattedMonth = $filter('date')(month, 'MMM').toUpperCase();
            var formattedFeildName = formattedMonth + viewType[queryType].saleskey;
            angular.forEach(rawData, function(value, key) {
                //Condition to Show as value if the actual value is null
                    //if(value[formattedFeildName] === null) value[formattedFeildName] = 0;
                //Condition to Show as value if the actual value is null
                var obj = {
                    names: value.EHIER_NAME__c,
                    value: value[formattedFeildName],
                    userTerritory: value.EHIER_CD__c
                }
                formatedData.chartData.push(obj);
            });
            q.resolve(formatedData);
            return q.promise;
    };
    /*Jayan*/

    this.fetchSalesTarget = function(queryType) {
        var self = this,
            q = $q.defer(),
            error = "Error in proceesing data : SalesAchTrend",
            getTragetsQuery = self.updateSalesQuery(viewType[queryType].query, 4);
        self.fetchFromSalesforceData(getTragetsQuery).then(function(data) {
            if (data != null && data[0]) {
                self.SalesAchTrendData = data[0];
                self.processSalesData(data[0], queryType).then(function(dataAfterProcess) {
                    q.resolve(dataAfterProcess);
                });
            } else {
                q.reject(error);
            }
        });
        return q.promise;
    };

    this.fetchDailySales = function(queryType) {
        var self = this,
            q = $q.defer(),
            error = "Error in proceesing data : SalesAchTrend",
            getTragetsQuery = self.updateDailySales(viewType[queryType].query, 5);
            /*Dummy Query To be removed*/
            var getTragetsQuery ="SELECT TOTAL_PRIMARY_VAL__c, UPDATED_DATE__c FROM SFE_DB_Sales_Matrices__c WHERE EHIER_CODE__c = 'IT007320' AND UPDATED_DATE__c <= 2017-07-10 AND UPDATED_DATE__c > 2017-07-05 ORDER BY UPDATED_DATE__c ASC";
            /*Dummy Data To be removed*/
        self.fetchFromSalesforceData(getTragetsQuery).then(function(data) {
            console.log("raw data", data);
            if (data != null && data) {
                self.SalesAchTrendData = data;
                q.resolve(self.processDailySales(data, queryType));
            } else {
                q.reject(error);
            }
        });
        return q.promise;
    };

    /*Jayan*/
    this.fetchSalesAchGrwthPrcnt = function (queryType) {
        var self = this,
            q = $q.defer(),
            error = "Error in proceesing data : SalesAchGrwthPrcnt",
            getSalesAchPrcntQuery = self.salesAchAndGrwthPrcntQuery(viewType[queryType].query); 
        self.fetchFromSalesforceData(getSalesAchPrcntQuery).then(function(data) {
            if (data != null) {               
                self.processSalesAchAndGrowthPrcnt(data, queryType).then(function (dataAfterProcess) {
                    q.resolve(dataAfterProcess);
                });
            } else {
                q.reject(error);
            }
        });
        return q.promise;
    };
     /*Jayan*/

    this.fetchFromSalesforceData = function(query) {
        var self = this,
            q = $q.defer(),
            error = "Error in proceesing data : fetchFromSalesforceData Fn",
            state = JSON.parse(decodeURI($state.params.object));
        userDetailService.getUserInfo().then(function(userDetail) {
            var getTragetsQuery = query
                dynamcTerritoryID = userDetail.userTerritory;

            if($state.current.url.indexOf('area') !== -1 && state && state.area && state.area.userTerritory) {
                dynamcTerritoryID = state.area.userTerritory;
            } else if ($state.current.url.indexOf('territory') !== -1 && state && state.territory && state.territory.userTerritory) {
                dynamcTerritoryID = state.territory.userTerritory;
            }
            getTragetsQuery = getTragetsQuery.replace(/\$Z_A_T_ID\$/g, dynamcTerritoryID);
            entityCollectionInstance.fetchFromSalesforce(getTragetsQuery).then(function(res) {
                if (res != null && res.records.length > 0) {
                    q.resolve(res.records);
                } else {
                    q.resolve(null);
                }
            }, function() {
                q.reject(error);
            });
        });
        return q.promise;
    };
}]);