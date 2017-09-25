abbottApp.controller('ViewLastLogController', [
  '$sce',
  '$scope',
  '$rootScope',
  'abbottConfigService',
  'popupService',
  'databaseManager',
  'syncLog',
  'loaderManager',
  'presentationFileManager',
  function ($sce, $scope, $rootScope, abbottConfigService, popupService, databaseManager, syncLog, loaderManager, presentationFileManager) {
      $scope.init = function () {

          window.ga.trackView('ViewlastLog');
          window.ga.trackTiming('lastLog Load Start Time', 20000, 'lastLogLoadStart', 'lastLog Load Start');

          $scope.locale = abbottConfigService.getLocale();
          $scope.listOfLogs = [];
          syncLog.loadLog()
            .then(function (logsList) {
                //          $scope.listOfLogs = logsList.map(function(logItem){
                //            logItem = logItem.replace(/\\n/ig, '<br/>').replace(/\n/ig, '<br/>');
                //            return $sce.trustAsHtml(logItem);
                //          });
                $scope.listOfLogs = logsList;
                $rootScope.transparentConfig.display = false;
            });

          window.ga.trackTiming('lastLog Load Finish Time', 20000, 'lastLogLoadFinish', 'lastLog Load Finish');
      };

      //Clear the local database
      $scope.clearDataBase = function () {
          if (loaderManager.hasActiveLoaders()) {
              popupService.openPopup($scope.getLocale().ClearDataBaseAlert, 'Ok');
          } else {
              clearDataBase();
          }

      };

      function clearDataBase() {
          popupService.openConfirm($scope.locale.ClearDatabase,
            $scope.locale.ClearDatabaseConfirmation,
            $scope.locale.No,
            $scope.locale.Yes,
            '35%',
            function () {
            },
            function () {
                databaseManager.clearUserData()
      //            .then(function(){
      //              return presentationFileManager.getDirectory(presentationFileManager.getPathToPresentations());
      //            })
      //            .then(presentationFileManager.removeDirectory)
                  .then(function () {
                      //Database cleared successfully
                      $rootScope.LastSyncFail = true;
                      $scope.listOfLogs = [];
                      $scope.showPopupWithMessage($scope.locale.DatabaseClearedSuccessfully);
                  })
                  .catch(function () {
                      $scope.showPopupWithMessage($scope.locale.DatabaseFailedToClear);
                  });
            });
      };

      $scope.showPopupWithMessage = function (message) {
          popupService.openPopup(message, $scope.locale.OK, '35%', function () {
              $rootScope.disableMTPAndDCRUsingViewPort = true;
          });
      };

      //Send the logs to support
      $scope.sendLogsToSupport = function () {
          window.LogReader.printLog();
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
