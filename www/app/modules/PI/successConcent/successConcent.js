var isloaded = false;
abbottApp.controller('successConcentController', ['$rootScope','$scope', '$http', function($rootScope,$scope, $http) {
    $rootScope.showLogo = false;
    $rootScope.showBack = true;
    $rootScope.showFilter = false;
    $rootScope.screenTitle = 'Sucess Concentration';
    $rootScope.screenSubTitle = null;
    $rootScope.showZone = true;
    $rootScope.hideFooterHome = false;
}]);
