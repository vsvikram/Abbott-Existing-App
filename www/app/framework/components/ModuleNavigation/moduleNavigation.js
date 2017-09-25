abbottApp.directive('moduleNav', [
'popupService',
'navigationService',
'abbottConfigService',
'$rootScope',
'$timeout',
function (
popupService,
navigationService,
abbottConfigService,
$rootScope,
$timeout) {

var link = function($scope, element, attrs){
    $scope.dirConfig = {
        left: {
            active: true,
            text: null,
            clickable: false,
            callback : null
        },
        right: {
            active: false,
            text: null,
            clickable: false,
            callback : null
        }
    };
    $scope.filterGivenCommands = function(config){
        for(configKey in config){
            for(optionKey in config[configKey]){
                if(typeof $scope.dirConfig[configKey][optionKey] != 'undefined'){
                    $scope.dirConfig[configKey][optionKey] = config[configKey][optionKey];
                }
            }
        }

    };
    $scope.checkIfOptionAvailable = function(option){
        return typeof option != 'undefined'? option : null;
    };
    $scope.leftTabClick = function(){
        console.log("left tab clicked");
        if($scope.dirConfig.left.callback
           && $scope.dirConfig.left.clickable
           && !$scope.dirConfig.left.active){
            $scope.dirConfig.right.active = false;
            $scope.dirConfig.left.active = true;
            $scope.dirConfig.left.callback();
            console.log("left callback invoked");
        };
    };
    $scope.rightTabClick = function(){
        console.log("right tab clicked");
        if($scope.dirConfig.right.callback
           && $scope.dirConfig.right.clickable
           && !$scope.dirConfig.right.active){
            console.log("right callback invoked");
            $scope.dirConfig.left.active = false;
            $scope.dirConfig.right.active = true;
            $scope.dirConfig.right.callback();
        };
    };
    $scope.backButton = function() {
        navigationService.backFunc();
    }
    $scope.filterGivenCommands($scope.config);
    console.log($scope.dirConfig);
};

return{
    restrict: 'E',
    scope: {
        config: "="
    },
    link: link,
    templateUrl: 'app/framework/components/ModuleNavigation/moduleNavigation.html'
}

}]);