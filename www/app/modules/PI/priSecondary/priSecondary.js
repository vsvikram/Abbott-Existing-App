var isloaded = false;
abbottApp.controller('priSecondaryController', ['$rootScope','$scope', '$http', function($rootScope,$scope, $http) {
    $rootScope.showLogo = false;
    $rootScope.showBack = true;
    $rootScope.showFilter = false;
    $rootScope.screenTitle = 'Primary : Secondary';
    $rootScope.screenSubTitle = null;
    $rootScope.showZone = true;
    $rootScope.hideFooterHome = false;

}]);
