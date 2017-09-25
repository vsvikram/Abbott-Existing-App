abbottApp.directive('dropdownMultiselect', function () {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            options: '=',
            customerType: '=',
            translationTexts: '='
        },
        templateUrl: 'app/framework/components/dropdownMultiselect/dropdownMultiselect.html',
        controller: ['$scope', '$q', 'navigationService', 'abbottConfigService', '$rootScope',
        function ($scope, $q, navigationService, abbottConfigService, $rootScope, $filter) {

            $scope.noneOptions = [];
            $scope.noneOptions.push({
                "id" : "NONE",
                "name" : abbottConfigService.getLocale().None.toUpperCase(),
                "designation" : null
            });
            $scope.locale = abbottConfigService.getLocale();
            $scope.model = [];
            $scope.disableEdit = $rootScope.disablingEdit;
            $scope.isNonFieldWork = $rootScope.isNonFieldWork;
            var texts = {};
            angular.extend(texts, $scope.translationTexts);
            $scope.buttonDefaultText=texts.buttonDefaultText;

            if ($scope.isNonFieldWork == true) {
                $scope.options.splice(0, 1);
            }

            $scope.openDropdown = function () {
                $scope.open = !$scope.open;
                $scope.isJFWClicked = true;
            };

            $scope.selectAll = function () {
                $scope.model = [];
                angular.forEach($scope.options, function (item, index) {
                    $scope.model.push(item);
                });
            };

            $scope.deselectAll = function () {
                $scope.model = [];
            };

            $scope.toggleSelectItem = function (option) {
                $scope.isJFWClicked = true;
                var intIndex = -1;
                angular.forEach($scope.model, function (item, index) {
                    if (item.id == option.id) {
                        intIndex = index;
                    }
                });

                if (intIndex >= 0) {
                    $scope.model.splice(intIndex, 1);
                } else {
                    $scope.model.push(option);
                }
            };

            $scope.getClassName = function (option) {
                var varClassName = 'dcrModuleIcons dcrCheckButtonInactive';
                angular.forEach($scope.model, function (item, index) {
                    if (item.id == option.id) {
                        varClassName = 'dcrModuleIcons dcrCheckButtonActive';
                    }
                });
                return (varClassName);
            };

            document.getElementsByTagName("html")[0].addEventListener('click', function () {
                $scope.$apply(function () {
                    if (!$scope.isJFWClicked)
                        $scope.open = false;
                    $scope.isJFWClicked = false;
                });
            });
        }
        ]
    };
});
