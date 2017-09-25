abbottApp.controller('HomeController', [
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
  'dcrLockingCollection',
  'dcrUnlockReasonCollection',
  'userPreferences',
  'databaseManager',
  'sfdcAccount',
  'deviceCollection',
  'dcrJunctionCollection',
  'mtpAppointmentDetails1Collection',
  'dcrCollection',
  'dcrLockService',
  'newCustomerCollection',
  'mtpRemoveConfigCollection',
  '$cordovaInAppBrowser',
  'abbExchangeService',
  function ($scope, $filter, $q, navigationService, abbottConfigService, $rootScope, popupService, $timeout, userCollection, greenFlagCollection, divisionCollection, dcrLockedStatusCollection, dcrLockingCollection, dcrUnlockReasonCollection, userPreferences, databaseManager, sfdcAccount, deviceCollection, DcrJunctionCollection, MtpAppointmentDetails1Collection, DcrCollection, dcrLockService, NewCustomerCollection, MtpRemoveConfigCollection, $cordovaInAppBrowser, abbExchangeService) {
      var userCollectionInstance = new userCollection(),
        divisionCollectionInstance = new divisionCollection(),
        dcrLockedStatusCollectionInstance = new dcrLockedStatusCollection(),
        dcrUnlockReasonCollectionInstance = new dcrUnlockReasonCollection(),
        dcrLockingCollectionInstance = new dcrLockingCollection(),
        greenFlagCollectionInstance = new greenFlagCollection(),
        dcrJunctionCollection = new DcrJunctionCollection(),
        newCustomerCollection = new NewCustomerCollection(),
        mtpAppointmentDetails1Collection = new MtpAppointmentDetails1Collection(),
        mtpRemoveConfigCollection = new MtpRemoveConfigCollection(),
        dcrCollection = new DcrCollection(),
        divisionInfo = {},
        currentUser = {};

      $scope.user = {};
      $scope.disableMTPAndDCRUsingViewPort = $rootScope.disableMTPAndDCRUsingViewPort = false;
      $scope.lastSuccessSyncDate = null;
      $scope.locale = abbottConfigService.getLocale();
      $scope.callsToGo = '';
      $rootScope.sfeEnabled = false;
      $scope.LastSyncFail = false;
      $scope.surgeAppAvailable = false;
      $scope.surgeAppLabel = 'open';

      $scope.openPopup = function(appcard) {
        $scope.showKnowMore = false;
        appcard.ratingArray = $scope.getNumber(appcard);
        appcard.halfRatingArray = $scope.getHalfRating(appcard);
        appcard.ratedArray = $scope.getCount(appcard);
        popupService.appExchangePopup(appcard);
      };

      $scope.getUserName = function () {
          return $scope.user && $scope.user.Name || $scope.locale.Unknown;
      };
      $scope.getDivisionName = function () {
          return divisionInfo && divisionInfo.Division_Name__c || '';
      };
      $scope.getAddress = function () {
          var user = $scope.user;
          return user && [user.Designation__c, user.HQ__c].filter(function (value) { return value }).join(', ') || '';
      };

      $scope.onLogoutIconClicked = function () {
          popupService.openConfirm($scope.locale.Logout, $scope.locale.LogoutConfirmation, $scope.locale.No, $scope.locale.Yes, '35%', function () {

          }, function () {
              localStorage.removeItem('logInStart');
              localStorage.removeItem("isLoggedIn");
              sfdcAccount.logout();
          });
      };

      $scope.sync = function () {
          databaseManager.runSync($rootScope.LastSyncFail, $rootScope.userType);
      };

      //Open the DCR page while clicking on the DCR icon
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

      // navigate to landing page while clicking on the abbworld icon
      $scope.onABBWorldClick = function(){
          navigationService.navigate('LandingPage');
      };

      // navigate to abbexchange page while clicking on the view all icon
      $scope.onAbbExchangeClick = function(){
        navigationService.navigate('abbExchange', {'viewState': 'all'});
      };

      // navigate to abbexchange page while clicking on the view installed icon
      $scope.abbExchangeViewInstalled = function(){
          navigationService.navigate('abbExchange', {'viewState': 'installed'});
      };

      $scope.navigateToDCRCalendar = function () {
          navigationService.navigate('dcrCalendar');
          window.ga.trackTiming('Navigate to DCR', 20000, 'DCRLoad', 'DCR Module Load');
      };

      // Navigate to MTP page while clicking on the mtp icon
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

      $scope.onSFEClick = function () {

          window.ga.trackTiming('SFE Icon Click', 20000, 'SFELoad', 'SFE Module Load');
          window.ga.trackEvent('Navigate to SFE link', 'click', 'SFE load', 20000);

          if (navigator.onLine)
              navigationService.navigate('SFE');
          else
              popupService.openPopup($scope.locale.NoInternetConnection, $scope.locale.OK, '35%', function () { });
      };

      $scope.navigateToMTPList = function () {
          navigationService.navigate('MTPList');
          window.ga.trackTiming('Navigate to MTP', 20000, 'MTPLoad', 'MTP Module Load');
      };

      $scope.navigateToMyLeave = function () {

          window.ga.trackEvent('Navigate To Leave', 'click', 'LeaveNavigationLink', 20000);
          window.ga.trackTiming('Navigate To Leave Start Time', 20000, 'navigationToLeaveStart', 'Navigation to Leave Start');

          var options = {
              location: 'no',
              toolbar: 'no'
          };
          var loginUrl = sfdcAccount.getSfdcClient().loginUrl;
          var isProd = loginUrl != null && loginUrl.indexOf('test') == -1;
          var leaveUrl = isProd ? 'https://abbworld--c.ap4.visual.force.com/apex/leaveHome' : 'https://abbworld--ailtesting--c.cs31.visual.force.com/apex/leaveHome';
          $cordovaInAppBrowser.open(leaveUrl, '_blank', options);

          window.ga.trackTiming('Navigate To Leave Finish Time', 20000, 'navigationToLeaveFinish', 'Navigation to Leave Finish');
      };
      $scope.navigateToHelpdesk = function () {
          window.ga.trackEvent('Navigate To Helpdesk', 'click', 'HelpdeskNavigationLink', 20000);

          navigationService.navigate('helpdeskCreate');
      };

      function subscribeOnDatabaseAvailable() {
          var subscription = $rootScope.$on('databaseAvailable', load);
          $scope.$on('$destroy', subscription);
      }

      subscribeOnDatabaseAvailable();

      $scope.init = function () {
          setTimeout(function () {
              window.ga.trackView('Home');
              window.ga.trackTiming('Home Page Load Start Time', 20000, 'HomePageLoadStart', 'Home page load Start');
          }, 5000);

          if ($rootScope.databaseInited) {
              load();
          }
          //setTimeout(function(){
          //	checkIfSurgeAppIsInstall()
          //        .then(function(isAppAvailable){
          //            $scope.surgeAppAvailable = isAppAvailable;
          //            $scope.surgeAppLabel  = isAppAvailable ? $scope.locale.open : $scope.locale.get;
          //            console.log('App available '+ $scope.surgeAppAvailable);
          //        });
          //}, 3000);
      };

      $scope.openSurgeApp = function () {
          if ($scope.surgeAppAvailable)
              window.plugins.launcher.launch({ packageName: 'com.abbott.surge' }, function () { }, function () { });
          else
              window.open("market://details?id=com.abbott.surge", "_system");
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
              initCallsToGo();
              $rootScope.databaseInited = true;

              window.ga.trackTiming('Home Page Load Finish Time', 20000, 'HomePageLoadFinish', 'Home page load Finish');
              return device;
          });
      }

      function initCallsToGo() {
          $q.all([mtpAppointmentDetails1Collection.mtpTodayCount(),
            dcrJunctionCollection.dcrJunctionTodayCount(),
            dcrCollection.isDcrTodaySubmited(),
            newCustomerCollection.newCustomersCountByDay(moment()),
            mtpRemoveConfigCollection.getMTPRemoveConfigsCountByDate(moment())
          ])
          .then(function (values) {
              var mtpTodayCount = values.shift(),
                dcrJunctionTodayCount = values.shift(),
                isDcrTodaySubmited = values.shift(),
                newDoctorsCount = values.shift(),
                mtpRemoveConfigsCount = values.shift();
              var callsToGoCount = mtpTodayCount + newDoctorsCount - dcrJunctionTodayCount - mtpRemoveConfigsCount;
              if (callsToGoCount < 0) {
                  callsToGoCount = 0;
              }
              $scope.callsToGo = isDcrTodaySubmited ? 0 : callsToGoCount;
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
                     $rootScope.userType = user.Designation__c;
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

      //var checkIfSurgeAppIsInstall = function () {
      //    var deferred = $q.defer();
      //    window.plugins.launcher.canLaunch({ packageName: 'com.abbott.surge' }, function () {
      //        deferred.resolve(true);
      //    }, function () {
      //        deferred.resolve(false);
      //    });
      //    return deferred.promise;
      //};

      $rootScope.focus = false;
      $scope.showRecentSearch = false;
      $scope.hideSearch = true;

      $scope.showSearch = function(){
        $scope.showRecentSearch = true;
        $scope.hideSearch = false;
        $rootScope.focus = true;
      }

      $scope.cancelSearch = function(){
        $scope.showRecentSearch = false;
        $rootScope.focus = false;
      }

      $rootScope.backToSearch = function(){
        $scope.showRecentSearch = false;
        $rootScope.focus = false;
      }
      $scope.lists = [
                  {name: 'Joe'},
                  {name: 'Hank'},
                  {name: 'Zoe'},
              ];

      // function for hiding the three dots submenu
       $scope.hideSettings=function(){
           var i=0;
           for(i=0;i< $scope.appCards.length; i++){
                   if($scope.appCards[i].showSettings==true)
                       $scope.appCards[i].showSettings=false;
           }
           $scope.sortDot('');
       }

        // For displaying filled star ratings
       $scope.getNumber = function(appcard) {
                var x=0;
                $scope.array=[];

                for(x=1;x<=appcard.Rating__c;x++) {
                   $scope.array.push(x);
                }
                $scope.starCount=$scope.array.length;

                return $scope.array;
       }

       // For displaying half star ratings
              $scope.getHalfRating = function(appcard) {
                  $scope.halfStarArray = [];
                  $scope.halfStarCount = "";
                  var halfRatingCount = appcard.Rating__c % 1;
                  if(halfRatingCount != 0)
                  {
                       $scope.halfStarArray.push(1);
                  }
                  $scope.halfStarCount = $scope.halfStarArray.length;
                  return $scope.halfStarArray;
              }

       // For displaying empty star ratings
       $scope.getCount=function(appcard){
                 var y=0;
                 var remaining=5 - ($scope.starCount + $scope.halfStarCount);
                 $scope.fullArray=[];
                 for(y=1;y<=remaining;y++){
                 $scope.fullArray.push(y);
                 }
                 return $scope.fullArray;
       }

       //showing the submenu while clicking on the dot image in App
       $scope.cardSettings = function(appcard,value) {
               $scope.showKnowMore = true;
               appcard.showSettings = value;
               $scope.sortDot('toggle');
       }

       $scope.sortDot= function(e) {
                $scope.status = e;
       }

      //Get the app list for the home
        $timeout(function () {
            var appData = abbExchangeService.getAppList();
            $timeout( function(){
                    appData.then(function(data) {
                        $scope.appCards = data;
                    });
                },100);
        }, 500);

        //Get values of the home after sync is complete
        $scope.$on('setHomeAppList',function(event,obj){
                $scope.appCards = obj;
        });

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
  }]);
