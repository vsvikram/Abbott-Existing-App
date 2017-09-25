abbottApp.directive('abbSlider', ['$filter',
function ($filter) {
    return {
        scope: {
            slider: '='
        },
        link: function (scope, element, attrs) {
            scope.$watch(function () {
                return scope.slider.value
            }, function () {
                var slider = scope.slider;

                if (slider.value > 10000000) {
                    scope.slider.displayValue = (slider.value / 10000000).toFixed(2) + ' crore';
                } else {
                    if (slider.value > 100000) {
                        scope.slider.displayValue = (slider.value / 100000).toFixed(2) + ' Lakhs';
                    } else {
                        scope.slider.displayValue = slider.value;
                    }
                }
                scope.slider.incentive = 0;
                var type = scope.slider.type;
                var target = scope.slider.maxvalue / 1.4;
                var percentageVal = (scope.slider.value * 100) / target;
                var bandSlab = $filter('orderBy')(scope.$parent.bandsInfo, 'Band_Slab__c');
                angular.forEach(bandSlab, function (val) {
                    if (percentageVal > val.Band_Slab__c) {
                        switch (type) {
                            case "primary":
                                scope.slider.incentive = val.Band_Value__c;
                                break;
                            case "p1":
                                scope.slider.incentive = val.Band_P1Value__c;
                                break;
                            case "p2":
                                scope.slider.incentive = val.Band_P2Value__c;
                                break;
                            case "qtr":
                                scope.slider.incentive = val.Band_QuarterlySales__c;
                                break;
                            default:
                                scope.slider.incentive = val.Band_Value__c;
                                break;
                        }
                    }	// scope.slider.incentive = val.Band_value__c;
                });
                // scope.slider.incentive = (slider.value * 0.030);
                scope.$emit('update-incentive');
            });
        },
        controller: ['abbottConfigService', '$scope',
		function (abbottConfigService, $scope) {
		    $scope.locale = abbottConfigService.getLocale();
		}],
        templateUrl: 'app/framework/components/Slider/slider.html'
    };
}]);
