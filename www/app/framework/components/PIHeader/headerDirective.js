abbottApp.directive('piHeader', ['$state','navigationService',function($state,navigationService) {
    return {
        restrict: 'E',
        scope : {
            headerConfig: "="
        },
        templateUrl : "app/framework/components/PIHeader/header.html",
        link : function(scope, element, atttributes){
            
        },
        controller:function($scope){
            $scope.showDashboardFilter = function(){
                $state.go('filter');
            }
            $scope.prevScreen = function(){
                window.history.back();
            }
            $scope.navigateToHome = function (){
                navigationService.navigate('home', null, true);
            }
        }

    }
}]);