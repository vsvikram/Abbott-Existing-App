/**
 * @author 481494
 */

// main tab directive
'use strict';
abbottApp.directive('tabs', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: ['$scope',
        function ($scope) {
            var panes = $scope.panes = [];

            $scope.select = function (pane) {
                if (pane.isSelectable == false)
                    return;
                angular.forEach(panes, function (pane) {
                    if (pane.selected && pane.formElement != undefined) {
                        $scope.$broadcast('tab-leave', {
                            'form': pane.formElement
                        });
                    }
                });
                angular.forEach(panes, function (pane) {
                    pane.selected = false;
                });
                pane.selected = true;
                if (pane.onSelect != undefined)
                    $scope.$eval(pane.onSelect);
            };

            this.addPane = function (pane) {
                if (panes.length === 0) {
                    pane.selected = true;
                }
                panes.push(pane);
            };
        }],

        templateUrl: 'app/framework/components/tabs/tabs.html'
    };
});
abbottApp.directive('tabPane', function () {
    return {
        require: '^tabs',
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@',
            selectable: "@",
            onSelect: '&',
            formElement: '@'
        },
        link: function (scope, element, attrs, tabsCtrl) {
            scope.isSelectable = scope.selectable == 'false' ? false : true;
            tabsCtrl.addPane(scope);
        },
        templateUrl: 'app/framework/components/tabs/tab-pane.html'
    };
});
