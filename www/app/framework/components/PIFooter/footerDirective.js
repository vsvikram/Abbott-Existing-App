abbottApp.directive('scrollingfooter', ['$state', '$rootScope', '$timeout','dashboardStateService',function($state, $rootScope, $timeout,dashboardStateService) {
    var directive = {};
    directive.restrict = 'E'; /* restrict this directive to elements */
    directive.templateUrl = "app/framework/components/PIFooter/footer.html";
    directive.scope = {
        brandArr: "=brandArr"
    }

    directive.link = function($scope, element, atttributes) {
        $scope.currentSelection = [true];
        $scope.overAllBrand = dashboardStateService.overAllBrand;
        var colWidth = 0;
        $scope.$watch(function(){ return $state.$current.name }, function(newVal, oldVal){
            if(newVal === "piHome.piDashboard"){
                $scope.hideFooterHome = true;
            } else {
                $scope.hideFooterHome = false;
            }
        }); 
        $scope.updateBrand = function(brandObj,index){
            for(var i=0;i< $scope.currentSelection.length ; i++){
                    $scope.currentSelection[i] = false;
            }
            $scope.currentSelection[index] = true;
            dashboardStateService.setBrandValue(brandObj);
        }
        $scope.$watch('brandArr',function(newVal){
            if(newVal){
                $scope.setDynamicWidth();
                $scope.updateBrand($scope.overAllBrand,0);
            }
        });
        $scope.setDynamicWidth = function(){
            /*setting dynamic width for footer scroll area */
         $timeout(function(){
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