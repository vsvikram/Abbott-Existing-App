abbottApp.filter('getDataBasedOnDateFilter', function () {
    Object.byString = function (o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    };

    return function (input, date, path) {
        var data = [];
        angular.forEach(input, function (value, index) {
            if (Object.byString(value, path) == date) {
                data.push(value);
            }
        });

        return data;
    };
});

abbottApp.filter('designationFilter', function () {

    return function (input, designation) {
        var data = [];
        angular.forEach(input, function (value, index) {
            if (value.User__r != null && value.User__r.Designation__c == designation) {
                data.push(value);
            }
        });

        return data;
    };
});

abbottApp.filter('CampaignFilter', function () {

    return function (input, aBrandName) {
        var data = [];
        angular.forEach(input, function (value, index) {

            if (value.Name != null) {
                var campaignSplit = value.Name.split("_"),
    				brandName = '';

                if (campaignSplit.length > 0) {
                    brandName = campaignSplit[1];
                }
                if (brandName == aBrandName) {
                    data.push(value);
                }
            }
        });

        return data;
    };
});

abbottApp.filter('filterNonEmpty', function () {
    return function (data, fieldName) {
        var dataToBePushed = [];
        data.forEach(function (value) {
            if (value[fieldName] != undefined && value[fieldName] != null)
                dataToBePushed.push(value);
        });
        return dataToBePushed;
    }
});

abbottApp.filter('filterEmpty', function () {
    return function (data, fieldName) {
        var dataToBePushed = [];
        data.forEach(function (value) {
            if (value[fieldName] == undefined || value[fieldName] == null)
                dataToBePushed.push(value);
        });
        return dataToBePushed;
    }
});

abbottApp.filter('dateGreaterThan', function () {

    return function (input, date) {
        var data = [],
    		passedDateObj = new Date(date);
        angular.forEach(input, function (value, index) {
            if (new Date(value.Date__c) > passedDateObj) {
                data.push(value);
            }
        });

        return data;
    };
});


abbottApp.filter('groupBy', function () {
    return function (data, key) {
        if (!(data && key)) return;
        var result = {};
        for (var i = 0; i < data.length; i++) {
            if (!result[data[i][key]])
                result[data[i][key]] = [];
            result[data[i][key]].push(data[i])
        }
        return result;
    };
});

abbottApp.filter('toNumber', function () {
    return function (input, key) {
        var value = 0;
        for (var i = 0; i < input.length; i++) {
            value = parseInt(input[i][key], 10);
            input[i][key] = value;
        }
        return input;
    };
});

abbottApp.filter("formatter", function () {
    return function (item) {
        var result = (item.option != "All") ? item.Territory__c + '(' + item.User__r.Name + ')' : item.option;
        return result;
    }
});

abbottApp.filter('trustAsResourceUrl', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);


abbottApp.filter('toMarketFilter',function() {
return function(input,fromMarket){
        var data = [];
        if(fromMarket && fromMarket.length && fromMarket != 'undefined'){
        angular.forEach(input, function (value, index) {
            if (value.fromRoute != null && value.fromRoute.toUpperCase() == fromMarket.toUpperCase()) {
                data.push(value);
            }
        });
        }
        return data;
};
});


abbottApp.filter('prependZeroOnSingleDigits', function () {
    return function (input) {
        var n = input;
        return (n < 10) ? '0' + n : n;
    }
});
