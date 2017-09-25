abbottApp.directive('doccoveragefooter', ['$state', '$rootScope', '$timeout','dashboardStateService',function($state, $rootScope, $timeout,dashboardStateService) {
    var directive = {};
    directive.restrict = 'E'; /* restrict this directive to elements */
    directive.templateUrl = "app/framework/components/PIFooter/doc_coverage_footer.html";

    directive.link = function($scope, element, atttributes) {
        var selection = {
            ZBM: {
                area: {},
                territory: {}
            },
            ABM: {
                territory: {}
            },
            TBM: {}
        };

        $scope.defaultSelection = {
            Name: '',
            Id: '',
            Description: 'OverAll',
            type: 'ZBM'
        };
        $scope.Selected =  $scope.defaultSelection;
        $scope.ZAT_Obj = [];


        function reload() {
            dashboardStateService.getDocCoveageFilterData($scope.Selected.type).then(function (data) {
                $scope.ZAT_Obj = data;
            });
        }
        reload();

        var colWidth = 0;

        $scope.updateSelected = function(object) {
            $scope.Selected = object;
            reload();
        }

        $scope.$watch('ZAT_Obj',function(newVal) {
            console.log(newVal)
            if(newVal) {
                $scope.setDynamicWidth();
            }
        });

        $scope.setDynamicWidth = function() {
            /*setting dynamic width for footer scroll area */
            $timeout(function() {
                angular.element(element).find('.footer-ns-col').each(function(ele) {
                    colWidth = colWidth + angular.element(this).width();
                    angular.element(element).find('.nav-scroller-wrap').width(colWidth);
                });
            },2000);
        }

        $scope.navigateToHome = function() {
            $state.go('piHome.piDashboard');
        }
    }
    return directive;

}]);