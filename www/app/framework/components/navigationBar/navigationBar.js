/**
 * dashboard directive
 */
abbottApp.directive('navigationBar', [
  'popupService',
  'navigationService',
  'abbottConfigService',
  'databaseManager',
  'sfdcAccount',
  '$rootScope',
  function (popupService, navigationService, abbottConfigService, databaseManager, sfdcAccount, $rootScope) {

      var controller = [
        '$scope',
        function ($scope) {

            $scope.onleftSideHeaderIconClicked = function () {
                if ($scope.leftSideIcon == "menu") {
                    $scope.menuStatus = true;
                } else if ($scope.leftSideIcon == "back") {
                    navigationService.backFunc();
                } else if ($scope.leftSideIcon == "sync") {
                    databaseManager.runSync($rootScope.LastSyncFail,$rootScope.userType);
                }
            };

            $scope.onLockIconClicked = function () {
                //			popupService.openPopupWithTemplateUrl($scope,"app/modules/LockScreen/LockScreen.html",'50%');
            };

            $scope.closeThisDialog = function () {
                popupService.closePopup();
            };

            $scope.addSync = function () {
                popupService.closePopup();
            };

            $scope.lockOptionSelected = function () {

            };


            $scope.onLogoutIconClicked = function () {
                popupService.openConfirm($scope.getLocale().Logout, $scope.getLocale().LogoutConfirmation, $scope.getLocale().No, $scope.getLocale().Yes, '35%', function () {

                }, function () {
                    localStorage.setItem("isLoggedIn", false);
                    sfdcAccount.logout();
                });
            };

            $scope.getLocale = function () {
                return abbottConfigService.getLocale();
            };
        }];

      var link = function (scope, element, attrs) {
          scope.isHidden = attrs.isHidden;
          scope.headerTitle = attrs.headerTitle;
          scope.leftSideIcon = attrs.leftSideIcon;
          scope.previousScreenName = attrs.previousScreenName;
          scope.isDisplayHeaderTitle = attrs.isDisplayHeaderTitle;
          scope.isDisplayLoggedInUser = attrs.isDisplayLoggedInUser;
      };


      return {
          restrict: 'E',
          controller: controller,
          link: link,
          templateUrl: 'app/framework/components/navigationBar/navigationBar.html'
      };
  }]);
