/**
 * abbott header directive
 */

abbottApp.directive('abwHeader', ['popupService','navigationService','abbExchangeService','associatedAppCollection','abbottConfigService','databaseManager','sfdcAccount','$rootScope','$timeout','$location','$localStorage','$stateParams','$q', '$sce', 'moment','notificationCollection', 'notificationReadCollection',
  function (popupService, navigationService, abbExchangeService, associatedAppCollection , abbottConfigService, databaseManager,sfdcAccount,

   $rootScope, $timeout,$location,$localStorage,$stateParams,$q, $sce, moment,notificationCollection,notificationReadCollection) {


        var linker = function ($scope, element, attrs) {

          $scope.hideSideMenu = true;
          $scope.showSideMenu = false;
          $scope.showNotification = false;
          $scope.notificationToggle = false;
          $scope.overlayActive = false;
          $scope.appList=[];
          $scope.appListLength=0;
          $scope.extraApps=0;
          $scope.test="";
          $rootScope.allRead = false;
          $scope.unread=0;

          moment.relativeTimeThreshold('d', 31);
          moment.relativeTimeThreshold('h', 24);
          moment.relativeTimeThreshold('m', 60);

          moment.locale('en', {
            relativeTime : {
               future: "in %s",
               past:   "%s",
               s  : '1s',
               ss : '%ds',
               m:  "1m",
               mm: "%dm",
               h:  "1h",
               hh: "%dh",
               d:  "1d",
               dd: "%dd",
               M:  "a month",
               MM: "%d months",
               y:  "a year",
               yy: "%d years"
            }
          });

         function fetchNotifications() {
             var deferred = $q.defer();
             var notificationCollectionInstance = new notificationCollection();
             var notificationReadCollectionInstance = new notificationReadCollection();

             notificationCollectionInstance.fetchAll().then(notificationCollectionInstance.fetchRecursiveFromCursor).then(function(data) {
                    deferred.resolve(data);

                    var entry = [];
                    var tempData = [];


                    angular.forEach(data, function(value, key)
                    {
                        var msg="";
                        if(value.Category__c == 'SMS')
                        {
                            msg = value.SMS_Engine_Message__c;
                        }
                        else if(value.Category__c == 'App' && value.Operation_Type__c == 'Create')
                        {
                            msg = "To use \"" + value.AppName__c + "\" app, Please ‘install’ the app on your device."
                        }
                        else if(value.Category__c == 'App' && value.Operation_Type__c == 'Update')
                        {
                            msg = "Please upgrade \"" + value.AppName__c + "\" app to access new features & a better experience."
                        }

                        if(msg.length>50)
                        {
                            msg = msg.substring(0, 50) + "...";
                        }

                        value.message = $sce.trustAsHtml(msg);
                        value.isRead = 'false';
                        tempData[key] = value;
                    });

                    $rootScope.notificationData = tempData;
                    $rootScope.notificationDataLength = $rootScope.notificationData.length;
             });


             notificationReadCollectionInstance.fetchAll().then(notificationReadCollectionInstance.fetchRecursiveFromCursor).then(function(data) {
                    deferred.resolve(data);
                    $rootScope.notificationReadData = data;
                    $rootScope.notificationReadDataLength = $rootScope.notificationReadData.length;

                        for(var i=0;i<$rootScope.notificationDataLength;i++)
                        {
                           for(var j=0;j<$rootScope.notificationReadDataLength;j++)
                           {
                               if($rootScope.notificationData[i].Id == $rootScope.notificationReadData[j].ABBWorld_Wrapper_Notification__c)
                               {
                                    $rootScope.notificationData[i].isRead = 'true';
                               }
                           }
                        }

                        if($rootScope.notificationReadDataLength==0)
                        {
                            $scope.unread=0;
                            $scope.unread = $rootScope.notificationDataLength;
                        }
                        else
                         {
                            $scope.unread=0;
                            for(var i=0;i<$rootScope.notificationDataLength;i++)
                            {
                                if($rootScope.notificationData[i].isRead == 'false')
                                {
                                    $scope.unread = $scope.unread+1;
                                }
                            }
                         }
             });
         }

            $rootScope.$on('databaseAvailableHeader', fetchNotifications);
            $rootScope.$on('databaseAvailable', fetchNotifications);

            $timeout(function () {
               $rootScope.$emit('databaseAvailableHeader');
            }, 0);

            $scope.notificationPopup = function()
            {
              if (!$scope.notificationToggle)
                {
                  $scope.showNotification = true;
                  $scope.notificationToggle = true;
                }
               else
                {
                  $scope.notificationToggle = false;
                  $timeout(function() {
                  $scope.showNotification = false;
                  }, 500);
                }
            }

            $scope.markAsRead = function()
              {
                  sfdcAccount.getCurrentUserId().then(function (userId)
                  {
                      $scope.currentUser = userId;
                      $rootScope.changeColor = true;
                      $scope.unread=0;
                      $rootScope.allRead = true;
                      angular.forEach($rootScope.notificationData, function(value, key)
                      {
                          var obj = {}, entry=[];

                          obj.ABBWorld_Wrapper_Notification__c = value.Id;
                          obj.User__c = $scope.currentUser;
                          obj.isRead__c = true;
                          entry.push(obj);

                          var notificationReadCollectionInstance = new notificationReadCollection();
                          notificationReadCollectionInstance.upsertEntities(entry).then(function (response) {
                          });

                      });
                  });
              }

            $scope.changeRead = function(item,index)
             {
                sfdcAccount.getCurrentUserId().then(function (userId){
                    $scope.currentUser = userId;
                    $scope.unread=0;
                    item.isRead = 'true';
                    $rootScope.notificationData[index].isRead = 'true';

                    if(!$rootScope.allRead)
                    {
                        angular.forEach($rootScope.notificationData, function(value, key)
                        {
                            if(value.isRead == 'false')
                            {
                                $scope.unread = $scope.unread+1;
                            }
                        });
                    }

                    var obj = {}, entry=[];

                    obj.ABBWorld_Wrapper_Notification__c = item.Id;
                    obj.User__c = $scope.currentUser;
                    obj.isRead__c = true;
                    entry.push(obj);

                    var notificationReadCollectionInstance = new notificationReadCollection();
                    notificationReadCollectionInstance.upsertEntities(entry).then(function (response) {
                    });
                });


             }

            $scope.openSMSPopup = function(message)
            {
                popupService.openPopup(message, 'OK');
            }

            $scope.openUpdatePopup = function(item)
            {
                $scope.message = "Please upgrade \"" + item.AppName__c + "\" app to access new features & a better experience."
                popupService.openPopup($scope.message, 'OK');
            }

            $scope.openAddPopup = function(item)
            {
                $scope.message = "To use \"" + item.AppName__c + "\" app, Please ‘install’ the app on your device."
                popupService.openPopup($scope.message, 'OK');
            }

            $scope.closePopup = function()
            {
                popupService.closePopup();
            }






           $scope.$on('setHomeAppList',function(event,obj){
                $scope.appCards = obj;
           });




           //Getting the data from SFDC
          $timeout(function () {
              var appData = abbExchangeService.getAppList();
                  appData.then(function(data) {

                      $scope.appCards = data;
                  });
          }, 1000);


           //Adding manual sync on click of refresh icon to sync up the transactions filed -- Amrita

            $scope.sync = function () {
               $scope.showNotification = false;
               databaseManager.runSync($rootScope.LastSyncFail,$rootScope.userType);
            };



           $scope.toggleSideMenu = function(isShow) {
              if (isShow) {
                  $scope.hideSideMenu = false;
                  $scope.showSideMenu = true;
              } else {
                  $scope.showSideMenu = false;
                  $timeout(function() {
                      $scope.hideSideMenu = true;
                  }, 500);
              }
          }

          $scope.iconHandler = true ;
          $scope.searchHandler = false;
          $scope.showSearchHandler = function() {
             $scope.showNotification = false;
             $scope.iconHandler = false;
             $scope.searchHandler = true;
             $scope.overlayActive = true;
             //Recent search getting updated each time
             if(localStorage.getItem("names")!==null)
             {
             $scope.appList = JSON.parse(localStorage.getItem("names"));
             }
             console.log($scope.appList);

             //Recent search and clear to be shown on recent search list(appList) availability
             if($scope.appList!=null){
                              $scope.showRecentSearch = true;
                              $scope.showRecentClear = true;
              }
              console.log($scope.appList.length);
              //Clear not to be shown if recent search is empty
              if($scope.appList.length == 0 || $scope.appList === undefined){
                 $scope.showRecentClear = false;
              }

             //Removing the extra items in the recent searc once exceed the limit 3
             if($scope.appList!=null){
             if($scope.appList.length>3){
             $scope.appListLength=$scope.appList.length;
             $scope.extraApps=$scope.appListLength-3;
             $scope.appList.splice(0,$scope.extraApps);
             }
             }
             console.log($scope.appList);
             }
             //Appending the appname into search bar on clicking recent search or suggstion list
             $scope.appendSearch=function(name){
                $scope.test=name;
             }

             //On cancel suggestion,recent search,grey area should be disabled
           $scope.hideSearchHandler = function() {
                        $scope.iconHandler = true;
                        $scope.searchHandler = false;
                        $scope.showRecentSearch = false;
                        $scope.showSuggestion=false;
                        $scope.overlayActive = false;
                        $scope.test="";
            }
            /*On clicking search icon inside search bar appname goes to abbexchange and there it filters and
            shows up the filtered appcard. Adding appnames to local storage*/
            $scope.recentStorage=function(){
            console.trace();
                   console.log($scope.test);
              if(typeof($scope.test)!=='undefined' && $scope.test!=="" ){
                                var param = $stateParams;
                                  $scope.showRecentSearch = true;
                                  param.appName = $scope.test;

                                  console.log($scope.test)
                                  $scope.appList.unshift($scope.test);

                                  console.log($scope.appList);
                                  window.localStorage.setItem('names',JSON.stringify($scope.appList));
                                  console.log(window.localStorage.names);
                                   navigationService.navigate('abbExchange', param);
               }



             }

         $scope.showRecentSearch = false;
         $scope.showSuggestion=false;
         //Suggestion list shows up
         $scope.showSuggestions = function() {
            $scope.showSuggestion=true;
            $scope.showRecentSearch = false;
         }

          //Clears the local storage recent search
          $scope.clearSearch = function() {
              window.localStorage.removeItem('names');
              $scope.appList=[];
              $scope.showRecentSearch = false;
              $scope.showSuggestion=false;
          }

          //Removes the item from the recent search and local storage
         $scope.deleteList = function($index, list) {
             console.log("in delete list");
             $scope.appList.splice($index, 1);
             if($scope.appList == null || $scope.appList == '' || $scope.appList == undefined)
             {
             $scope.showRecentClear = false;
             }
             window.localStorage.setItem('names',JSON.stringify($scope.appList));

             $scope.$emit('listDeleted', list);
          };

          $scope.navigateToHome = function (){
               navigationService.navigate('home', null, true);
          }
      }
      return {
          restrict: 'E',
          link: linker,
          scope: {
            abwheaderConfig: "="
          },
          templateUrl: 'app/framework/components/abwHeader/abwheader.html'
      };

  }]);
  abbottApp.filter('searchFilter', function(){
    return function(collection, keyname, search) {
          var output = [];
          angular.forEach(collection, function(item) {
              var key = item[keyname];
              if(key.toLowerCase().indexOf(search.toLowerCase()) == 0) {
                 output.push(key);
               }
          });
          //console.log(output);
          return output;
       };
    });
