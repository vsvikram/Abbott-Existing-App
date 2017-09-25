abbottApp.controller('FullSyncController', [
  '$sce',
  '$scope',
  '$rootScope',
  'abbottConfigService',
  'popupService',
  'databaseManager',
  'syncLog',
  'loaderManager',
  'presentationFileManager',
  'dcrLockedStatusCollection',
  function ($sce, $scope, $rootScope, abbottConfigService, popupService, databaseManager, syncLog, loaderManager, presentationFileManager, dcrLockedStatusCollection) {
      $scope.init = function () {

          window.ga.trackView('FullSync');
          window.ga.trackTiming('lastLog Load Start Time', 20000, 'lastLogLoadStart', 'lastLog Load Start');
          $scope.locale = abbottConfigService.getLocale();
          //window.ga.trackTiming('lastLog Load Finish Time', 20000, 'lastLogLoadFinish', 'lastLog Load Finish');
      };
       var dcrLockedStatusCollectionInstance = new dcrLockedStatusCollection();
       $scope.getDcrLockedStatus = function () {
                return dcrLockedStatusCollectionInstance.getDcrLockedStatus();
              };
      $scope.showPopupWithMessage = function (message) {
          popupService.openPopup(message, $scope.locale.OK, '35%', function () {
              $rootScope.disableMTPAndDCRUsingViewPort = true;
          });
      };

      $scope.runFullSync = function () {
            databaseManager.runSync(true,$rootScope.userType);
            return $scope.getDcrLockedStatus().then(function (lockedStatus) {
             var isLockedUser = lockedStatus && (lockedStatus.Status__c == "Locked" || lockedStatus.Status__c == "Requested For Unlock");
              if(isLockedUser) {
                  $rootScope.disableMTPAndDCRUsingViewPort = true;
                  dcrLockService.showLockPopup($scope);
              }
             });
            };
  }
]);
