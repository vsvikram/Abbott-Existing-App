abbottApp.controller('DCRActivitySelectionController', ['$scope', '$stateParams', '$filter', 'navigationService', 'abbottConfigService', 'statusDCRActivty', 'popupService', '$rootScope', 'fullDayActivityCollection', 'halfDayActivityCollection', 'activitySelectionCollection', 'userCollection','CUSTOMER_TYPES', "TABS_TYPES",
    function($scope, $stateParams, $filter, navigationService, abbottConfigService, statusDCRActivty, popupService, $rootScope, FullDayActivityCollection, HalfDayActivityCollection, ActivitySelectionCollection, UserCollection, CUSTOMER_TYPES, TABS_TYPES) {

        var fullDayActivityCollection = new FullDayActivityCollection(),
            halfDayActivityCollection = new HalfDayActivityCollection(),
            activitySelectionCollection = new ActivitySelectionCollection(),
            userCollection = new UserCollection(),
            usersList = [],
            currentUser = {};
        $scope.field = {};
        $scope.init = function() {

            window.ga.trackView('DCRActivitySelection');
            window.ga.trackTiming('DCRActivitySelection Load Start Time', 20000, 'DCRActivitySelectionStart', 'DCRActivitySelection Load Start');

            if ($stateParams.dateDCR != null) {
                $rootScope.DCRDate = $stateParams.dateDCR
            }
            $rootScope.tabTitle = null;
            $scope.locale = abbottConfigService.getLocale();
            $scope.listOfActivitiesForFullDayActivity = [];
            $scope.listOfActivitiesForHalfDayActivity = [];
            $scope.transperantConfig = abbottConfigService.getTransparency();
            $scope.transperantConfig.display = true;
            $scope.transperantConfig.showBusyIndicator = true;
            $scope.transperantConfig.showTransparancy = true;
            abbottConfigService.setTransparency($scope.transperantConfig);
            if ($rootScope.DCRDate) {
                $scope.date = $rootScope.DCRDate;
                $scope.displayDate = $filter('date')($scope.date, 'MMMM dd yyyy');
                $scope.displayYear = $filter('date')($scope.date, 'yyyy');
            }
            $scope.fullDayViewShow = true;
            $scope.halfDayViewShow = false;
            $scope.dcrRadioButtonActiveFullDay = true;
            $scope.dcrRadioButtonInactiveFullDay = false;
            $scope.dcrRadioButtonActiveHalfDay = false;
            $scope.dcrRadioButtonInactiveHalfDay = true;
            $scope.buttonStatusDisabled = true;

            $scope.loadUserData().then(fullDayActivityCollection.fetchAll).then(fullDayActivityCollection.fetchRecursiveFromCursor).then(function(fullDayActivityList) {
                $scope.listOfActivitiesForFullDayActivity = $scope.listOfActivitiesForFullDayActivity.concat(fullDayActivityList);
                $scope.buttonStatusDisabled = false;
                if (usersList.length) {
                    $scope.listOfActivitiesForFullDayActivity = $filter('filter')($scope.listOfActivitiesForFullDayActivity, {
                        "Allowed_Division__c": currentUser.Division
                    });
                    $scope.listOfActivitiesForFullDayActivity = $filter('filter')($scope.listOfActivitiesForFullDayActivity, {
                        "Allowed_Designation__c": currentUser.Designation__c
                    });
                }
                $scope.listOfActivitiesForFullDayActivity = $scope.listOfActivitiesForFullDayActivity.filter(function(activity) {
                    return $scope.getDate(activity.Start_Date__c) <= $scope.date && $scope.getDate(activity.Expiration_Date__c) >= $scope.date;
                });
                $scope.listOfActivitiesForFullDayActivity = $filter('orderBy')($scope.listOfActivitiesForFullDayActivity, 'Priority__c');
            }).then(halfDayActivityCollection.fetchAll).then(halfDayActivityCollection.fetchRecursiveFromCursor).then(function(halfDayActivitiesList) {
                $scope.listOfActivitiesForHalfDayActivity = $scope.listOfActivitiesForHalfDayActivity.concat(halfDayActivitiesList);
                $scope.buttonStatusDisabled = false;
                if (usersList.length) {
                    $scope.listOfActivitiesForHalfDayActivity = $filter('filter')($scope.listOfActivitiesForHalfDayActivity, {
                        "Allowed_Division__c": currentUser.Division
                    });
                    $scope.listOfActivitiesForHalfDayActivity = $filter('filter')($scope.listOfActivitiesForHalfDayActivity, {
                        "Allowed_Designation__c": currentUser.Designation__c
                    });
                }
                $scope.listOfActivitiesForHalfDayActivity = $scope.listOfActivitiesForHalfDayActivity.filter(function(activity) {
                    return $scope.getDate(activity.Start_Date__c) <= $scope.date && $scope.getDate(activity.Expiration_Date__c) >= $scope.date;
                });
                $scope.listOfActivitiesForHalfDayActivity = $filter('orderBy')($scope.listOfActivitiesForHalfDayActivity, 'Priority__c');
                $scope.transperantConfig.display = false;
            }).then(activitySelectionCollection.fetchAll).then(activitySelectionCollection.fetchRecursiveFromCursor).then(function(activitySelectionList) {
                $scope.activitySelectionData = activitySelectionList;
                return activitySelectionList
            }).catch(function() {
                $scope.transperantConfig.display = false;
                popupService.openPopup($scope.locale.ThereissomeProblemintheServer, $scope.locale.OK, "35%");
            });
        };

        $scope.loadUserData = function() {
            return userCollection.fetchAllCollectionEntities().then(function(allUsers) {
                usersList = allUsers;
            }).then(userCollection.getActiveUser).then(function(activeUser) {
                currentUser = activeUser;
                window.ga.trackTiming('DCRActivitySelection Load Finish Time', 20000, 'DCRActivitySelectionFinish', 'DCRActivitySelection Load Finish');
            })
        };

        // view for full day
        $scope.fullDayView = function() {
            $scope.fullDayViewShow = true;
            $scope.halfDayViewShow = false;
            $scope.dcrRadioButtonActiveFullDay = true;
            $scope.dcrRadioButtonInactiveFullDay = false;
            $scope.dcrRadioButtonActiveHalfDay = false;
            $scope.dcrRadioButtonInactiveHalfDay = true;
            $scope.field.selectedActivityForHalfDaySecondHalf = undefined;
            $scope.field.selectedActivityForHalfDayFirstHalf = undefined;
            $scope.firstHalfActivityWindow = false;
            $scope.secondHalfActivityWindow = false;
            $scope.activeFirstTab=true;
            $scope.activeSecondTab=false;

        };
        $scope.fullDayView();
        $scope.firstHalfActivityWindow = false;
        $scope.secondHalfActivityWindow = false;
        $scope.secondHalfSelected = false;
        $scope.firstHalfSelected = false;


        // view for half day
        $scope.halfActivitySelection = false;
        $scope.halfDayView = function() {

            $scope.halfActivitySelection = true;
            $scope.field.halfActivityChoosed = 'first';
            $scope.fullDayViewShow = false;
            $scope.halfDayViewShow = true;
            $scope.dcrRadioButtonActiveFullDay = false;
            $scope.dcrRadioButtonInactiveFullDay = true;
            $scope.dcrRadioButtonActiveHalfDay = true;
            $scope.dcrRadioButtonInactiveHalfDay = false;
            $scope.field.selectedActivityForFullDay = undefined;
            $scope.halfDaySelectWindow = true;
            $scope.field.selectedActivityForHalfDaySecondHalf = undefined;
                     $scope.field.selectedActivityForHalfDayFirstHalf = undefined;
                     $scope.firstHalfActivityWindow=false;
            $scope.secondHalfActivityWindow=false;
            $scope.activeFirstTab=false;
            $scope.activeSecondTab=true;
        };




        $scope.halfActivitySubmit = function(val) {

            if (val === 'first') {

                if (typeof($scope.field.selectedActivityForHalfDaySecondHalf) === 'undefined') {
                    $scope.firstHalfActivityWindow = false;
                    $scope.halfActivitySelection = true;
                    $scope.field.halfActivityChoosed = 'second';
                    $scope.halfDaySelectWindow = true;
                } else {
                    $scope.submitClick();
                }
            } else {

                if (typeof($scope.field.selectedActivityForHalfDayFirstHalf) === 'undefined') {
                    $scope.halfDaySelectWindow = true;
                    $scope.secondHalfActivityWindow = false;
                    $scope.halfActivitySelection = true;
                    $scope.field.halfActivityChoosed = 'first';
                } else {
                    $scope.submitClick();
                }


            }


        }



        $scope.field.halfActivityChoosed = undefined;
        $scope.selectedHalfDay = function(val) {
            $scope.halfDaySelectWindow = false;

            if (val === 'first') {

                $scope.halfActivitySelection = true;
                $scope.firstHalfActivityWindow = true;
                $scope.secondHalfActivityWindow = false;
            } else {

                $scope.halfActivitySelection = true;
                $scope.secondHalfActivityWindow = true;
                $scope.firstHalfActivityWindow = false;
            }

        }

        $scope.halfDaysubmitClick = function() {
            $scope.secondHalfButtonDisabled = true;


        }
        $scope.fullDaysubmitClick = function() {
            $scope.firstHalfButtonDisabled = true;


        }

        // code for submit button
        $scope.submitClick = function() {
            console.log('fullshow->'+$scope.fullDayViewShow);
            console.log('fulldayact->'+$scope.field.selectedActivityForFullDay);
            console.log('halfshow->'+$scope.halfDayViewShow);
            console.log('firsthalf->'+$scope.field.selectedActivityForHalfDayFirstHalf);
            console.log('secondhalf->'+$scope.field.selectedActivityForHalfDaySecondHalf);

           window.ga.trackTiming('iconClick', 20000, 'pageLoad', 'submitActivity');
           window.ga.trackEvent('navigate', 'click', 'Activity', 20000);

           if ((!$scope.field.selectedActivityForHalfDayFirstHalf && $scope.halfDayViewShow == true) || (!$scope.field.selectedActivityForHalfDaySecondHalf && $scope.halfDayViewShow == true) || (!$scope.field.selectedActivityForFullDay && $scope.fullDayViewShow == true)) {
               popupService.openPopup($scope.locale.YoucannotleaveActivityempty, $scope.locale.OK, '35%', function() {
                   popupService.closePopup();
               });
           } else if ($scope.field.selectedActivityForHalfDayFirstHalf == $scope.field.selectedActivityForHalfDaySecondHalf && $scope.field.selectedActivityForHalfDayFirstHalf && $scope.field.selectedActivityForHalfDaySecondHalf && $scope.fullDayViewShow == false && $scope.halfDayViewShow) {
               popupService.openPopup($scope.locale.YoucannotselectsameActivity, $scope.locale.OK, '35%', function() {
                   popupService.closePopup();
               });
           } else {
               if ($scope.fullDayViewShow == true && $scope.halfDayViewShow == false) {
                   statusDCRActivty.setActivityStatus([$scope.field.selectedActivityForFullDay]);
                   statusDCRActivty.setCalenderDate($scope.date);
               } else if ($scope.fullDayViewShow == false && $scope.halfDayViewShow == true) {
                   statusDCRActivty.setActivityStatus([$scope.field.selectedActivityForHalfDayFirstHalf, $scope.field.selectedActivityForHalfDaySecondHalf]);
                   statusDCRActivty.setCalenderDate($scope.date);
               }
               $scope.saveActivitySelection();
               //To Migrate  Navigation from DCR Landing controller               
               navigationService.navigate('dcrList');
           }
       };      

       $scope.saveActivitySelection = function() {

           window.ga.trackTiming('DCRActivitySelection Save Start Time', 20000, 'DCRActivitySelectionSaveStart', 'DCRActivitySelection Save Start');
           window.ga.trackEvent('Save Activity Selection', 'click', 'ActivitySaved', 20000);

           $scope.filterdatetime = $filter('date')($scope.date, 'yyyy-MM-dd');
           var obj = {},
               fieldActivityRecord = $filter('filter')($scope.activitySelectionData, {
                   "Date__c": $scope.filterdatetime
               });
           if (fieldActivityRecord != undefined && fieldActivityRecord.length > 0) {
               obj._soupEntryId = fieldActivityRecord[0]._soupEntryId;
           }
           obj.Date__c = $scope.filterdatetime;

           if ($scope.fullDayViewShow == true) {
               obj.Activity_Selection__c = "Full Day";
               if ($scope.field.selectedActivityForFullDay != undefined) {
                   obj.Activity1__c = $scope.field.selectedActivityForFullDay.Id;
               }
           } else {
               obj.Activity_Selection__c = "Half Day";
               if ($scope.field.selectedActivityForHalfDayFirstHalf != undefined) {
                   obj.Activity1__c = $scope.field.selectedActivityForHalfDayFirstHalf.Id;
               }
               if ($scope.field.selectedActivityForHalfDaySecondHalf != undefined) {
                   obj.Activity2__c = $scope.field.selectedActivityForHalfDaySecondHalf.Id;
               }
           }

           activitySelectionCollection.upsertEntities([obj]).then(function() {
               $rootScope.activitySaved = true;
               window.ga.trackTiming('init', 20000, 'pageLoad', 'activitySaved');
           });
           window.ga.trackTiming('DCRActivitySelection Save Finish Time', 20000, 'DCRActivitySelectionSaveFinish', 'DCRActivitySelection Save Finish');
       };

        $scope.navigateToDCRCalendar = function() {
            navigationService.navigate('dcrCalendar');
        };

        $scope.getDate = function(dateString) {
            if (dateString && dateString.length) {
                var temparray = [];
                temparray = dateString.split("-");
                var year = temparray[0],
                    month = temparray[1],
                    day = temparray[2];
                return new Date(year, month - 1, day);
            } else {
                return new Date();
            }
        };
         //Header configuration
        $scope.abwheaderConfig = {
            hambergFlag: true,
            applogoFlag: false,
            headerText: 'Daily Call Report',
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
        $scope.backButton = function() {
            navigationService.backFunc();
        }

    }
]);