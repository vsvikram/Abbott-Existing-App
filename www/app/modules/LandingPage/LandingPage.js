abbottApp.controller('LandingPage', [
  '$scope',
    '$filter',
    '$q',
    'navigationService',
    'abbottConfigService',
    '$rootScope',
    'popupService',
    '$timeout',
    'userCollection',
    'greenFlagCollection',
    'divisionCollection',
    'dcrLockedStatusCollection',
    'userPreferences',
    'deviceCollection',
    'dcrCollection',
    'dcrLockService',
  function($scope, $filter, $q, navigationService, abbottConfigService, $rootScope, popupService, $timeout, userCollection, greenFlagCollection, divisionCollection, dcrLockedStatusCollection, userPreferences, deviceCollection, DcrCollection, dcrLockService){

     var userCollectionInstance = new userCollection(),
            divisionCollectionInstance = new divisionCollection(),
            dcrLockedStatusCollectionInstance = new dcrLockedStatusCollection(),
            greenFlagCollectionInstance = new greenFlagCollection(),
            divisionInfo = {},
            currentUser = {};

      $scope.user = {};
          $scope.disableMTPAndDCRUsingViewPort = $rootScope.disableMTPAndDCRUsingViewPort = false;
          $scope.lastSuccessSyncDate = null;
          $scope.locale = abbottConfigService.getLocale();
          $rootScope.sfeEnabled = false;

  $scope.getUserName = function () {
    return $scope.user && $scope.user.Name || $scope.locale.Unknown;
  };

  // Function for navigate to MTP list
  $scope.navigateToMTPList = function () {
    navigationService.navigate('MTPList');
    window.ga.trackTiming('Navigate to MTP', 20000, 'MTPLoad', 'MTP Module Load');
    };

  // Function for navigate to DCR calender
  $scope.navigateToDCRCalendar = function () {
    navigationService.navigate('dcrCalendar');
    window.ga.trackTiming('Navigate to DCR', 20000, 'DCRLoad', 'DCR Module Load');
    };


  // Function to navigate MTP page while clicking on the MTP menu
  $scope.onMTPClick = function () {
            window.ga.trackTiming('MTP Icon Click', 20000, 'MTPLoad', 'MTP Module Load');
            window.ga.trackEvent('Navigate to MTP link', 'click', 'MTP load', 20000);

            if ($rootScope.LastSyncFail) {
              popupService.openPopup($scope.locale.LastSyncFailure, $scope.locale.OK, '35%', function () {
                  $scope.navigateToMTPList();
              });
            }else if ($rootScope.disableMTPAndDCRUsingViewPort) {
                dcrLockService.showLockPopup($scope);
            }else {
              $scope.navigateToMTPList();
            }
        };

  // Function to navigate DCR page while clicking on the DCR menu
  $scope.onDCRClick = function () {
            window.ga.trackTiming('DCR Icon Click', 20000, 'DCRLoad', 'DCR Module Load');
            window.ga.trackEvent('Navigate to DCR link', 'click', 'DCR load', 20000);

            if ($rootScope.LastSyncFail) {
                popupService.openPopup($scope.locale.LastSyncFailure, $scope.locale.OK, '35%', function () {
                    $scope.navigateToDCRCalendar();
                });
            }else if ($rootScope.disableMTPAndDCRUsingViewPort) {
              dcrLockService.showLockPopup($scope);
            }else {
                $scope.navigateToDCRCalendar();
            }
        };

  // Function to navigate SFE page while clicking on the SFE menu
  $scope.navigateToSFE = function(){
        navigationService.navigate('SFE');
  };

  // navigate to landing page while clicking on the abbworld icon
    $scope.navigateToPI = function() {
        navigationService.navigate('piHome.piDashboard');
    };  

  // Function to navigate Leave page while clicking on the leave menu
  $scope.navigateToMyLeave = function () {
            /*window.ga.trackEvent('Navigate To Leave', 'click', 'LeaveNavigationLink', 20000);
            window.ga.trackTiming('Navigate To Leave Start Time', 20000, 'navigationToLeaveStart', 'Navigation to Leave Start');

            var options = {
                location: 'no',
                toolbar: 'no'
            };
            var loginUrl = sfdcAccount.getSfdcClient().loginUrl;
            var isProd = loginUrl != null && loginUrl.indexOf('test') == -1;
            var leaveUrl = isProd ? 'https://abbworld--c.ap4.visual.force.com/apex/leaveHome' : 'https://abbworld--ailtesting--c.cs31.visual.force.com/apex/leaveHome';
            $cordovaInAppBrowser.open(leaveUrl, '_blank', options);

            window.ga.trackTiming('Navigate To Leave Finish Time', 20000, 'navigationToLeaveFinish', 'Navigation to Leave Finish');*/
            navigationService.navigate('leave');
        };

  /*  $scope.navigateToExpense = function(){
    //navigate to Expense
           navigationService.navigate('Expense');
    };*/

    // Function to navigate 1point page while clicking on the 1point menu
    $scope.navigateToHelpdesk = function () {
         window.ga.trackEvent('Navigate To Helpdesk', 'click', 'HelpdeskNavigationLink', 20000);
         navigationService.navigate('helpdeskCreate');
    };

    // Header configuration
     $scope.abwheaderConfig = {
         hambergFlag: true,
         applogoFlag: true,
         textFlag  : false,
         syncFlag: true,
         toggleSideMenu: false,
         notifyFlag: true,
         notifyCount: 3,
         searchFlag: false,
         searchHandler : searchHandler
     }
     function searchHandler(searchVal) {
         $scope.searchVal = searchVal;
     }

      $scope.init = function () {
               setTimeout(function () {
                   window.ga.trackView('Home');
                   window.ga.trackTiming('Home Page Load Start Time', 20000, 'HomePageLoadStart', 'Home page load Start');
               }, 5000);

               if ($rootScope.databaseInited) {
                   load();
               }
           };

       function load() {
                 return $scope.getUser().then($scope.getLastDCRFilled).then($scope.fetchMobileUsageDays).then($scope.getDcrLockedStatus).then(function (lockedStatus) {
                     userPreferences.getPreferences().then(function (preferences) {
                         var isLockedUser = lockedStatus && (lockedStatus.Status__c == "Locked" || lockedStatus.Status__c == "Requested For Unlock"),
                             canUseData = (currentUser.Id == preferences.LastLoggedUserId) && !isLockedUser;

                         $rootScope.disableMTPAndDCRUsingViewPort = !canUseData;
                         if (isLockedUser) {
                             $rootScope.disableMTPAndDCRUsingViewPort = true;
                             dcrLockService.showLockPopup($scope);
                         }
                         $scope.disableMTPAndDCRUsingViewPort = $rootScope.disableMTPAndDCRUsingViewPort;
                         if (!preferences.Is_Last_Sync_Completed && currentUser.Id == preferences.LastLoggedUserId) {
                             $rootScope.LastSyncFail = true;
                         }
                     });
                 }).then(new deviceCollection().getCurrentDevice).then(function (device) {
                     var syncTime = device.Last_Syncronization__c;
                     $scope.lastSuccessSyncDate = syncTime ? new Date(moment(syncTime).utc().format()) : null;

                     $rootScope.databaseInited = true;

                     window.ga.trackTiming('Home Page Load Finish Time', 20000, 'HomePageLoadFinish', 'Home page load Finish');
                     return device;
                 });
             }

     $scope.getUser = function () {
              return userCollectionInstance.getActiveUser()
                .then(function (user) {
                    if (user) {
                        currentUser = user;
                        $scope.user = user;
                        if (user != null)
                           // localStorage.setItem('isUserLoginRequired', user.Mobile_Login__c);
                            $rootScope.firstName = user.Name.split(' ')[0];
                        $rootScope.sfeEnabled = $rootScope.sfeEnabled || user.Mobile_SFE_Display__c;
                        $rootScope.clmEnabled = user.CLM_User__c && $rootScope.platform === "iOS" && isiPad;
                    } else {
                        $rootScope.firstName = $scope.locale.Unknown;
                        $rootScope.sfeEnabled = false;
                        $rootScope.clmEnabled = false;
                    }
                    return user;
                })
                .catch(function () {
                    $rootScope.firstName = $scope.locale.Unknown;
                });
          };

          $scope.getLastDCRFilled = function () {
              greenFlagCollectionInstance.fetchLastDCRDate()
                .then(function (lastDcrDate) {
                    if (lastDcrDate) {
                        lastDcrDate = lastDcrDate.Date__c;
                        $scope.lastFilledDCRNotFound = $rootScope.lastFilledDCRNotFound = !lastDcrDate;
                        if (lastDcrDate) {
                            $scope.lastFilledDCR = $rootScope.lastFilledDCR = $filter('date')(lastDcrDate, 'd/M/yyyy');
                        }
                    }
                    else {
                        $scope.lastFilledDCRNotFound = true;
                    }
                    return lastDcrDate;
                })
                .catch(function () {
                    $scope.lastFilledDCRNotFound = $rootScope.lastFilledDCRNotFound = true;
                });
          };

          $scope.fetchMobileUsageDays = function () {
              return divisionCollectionInstance.fetchAll()
                .then(divisionCollectionInstance.getEntityFromResponse)
                .then(function (division) {
                console.log(division);
                    divisionInfo = division;
                    if (division != null) {
                       //  localStorage.setItem('isDivisionLoginRequired', division.Mobile_Login__c);
                        $rootScope.sfeEnabled = $rootScope.sfeEnabled && division.Mobile_SFE_Allowed__c;
                    }
                    return division;
                });
          };

          $scope.getDcrLockedStatus = function () {
              return dcrLockedStatusCollectionInstance.getDcrLockedStatus();
          };

           //Reload the page data on the sync complete
      var customeEventListener = $rootScope.$on('databaseAvailable',function(event,obj){
                 load();
       });
        $scope.$on('$destroy', function() {
            customeEventListener();
        });


  }])