/**
 * transparent screen directive
 */
abbottApp.directive('transparentScreen', ['abbottConfigService',

function (abbottConfigService) {
    var linker = function (scope, elem, attrs) {
        scope.$watch(function () {
            return abbottConfigService.transparentConfig;
        }, function () {
            scope.transparentConfig = abbottConfigService.getTransparency();
        }, true);
    };
    return {
        restrict: 'E',
        link: linker,
        templateUrl: 'app/framework/components/transparentScreen/transparantScreenTemplate.html'
    };
}]);