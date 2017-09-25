var isloaded = false;
abbottApp.controller('imsEiController', ['$rootScope','$scope', '$http', function($rootScope,$scope, $http) {
    $rootScope.showLogo = false;
    $rootScope.showBack = true;
    $rootScope.showFilter = false;
    $rootScope.screenTitle = 'IMS EI';
    $rootScope.screenSubTitle = null;
    $rootScope.showZone = true;
    $rootScope.hideFooterHome = false;
}]);
