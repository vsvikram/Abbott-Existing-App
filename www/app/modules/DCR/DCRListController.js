abbottApp.controller('DCRListController',['$scope', '$q', 'CUSTOMER_TYPES', "TABS_TYPES", 'navigationService', 'abbottConfigService', 'statusDCRActivty', '$filter', '$rootScope','reporteeJFWCollection','dcrDropCollection','materialTransactionCollection','dcrCollection','materialLotCollection','mtpRemoveConfigCollection','newCustomerCollection','activitySelectionCollection','popupService','$location','$window',
function($scope, $q, CUSTOMER_TYPES, TABS_TYPES, navigationService, abbottConfigService, statusDCRActivty, $filter, $rootScope, reporteeJFWCollection, dcrDropCollection, MaterialTransactionCollection, dcrCollection, materialLotCollection, mtpRemoveConfigCollection, newCustomerCollection, activitySelectionCollection,popupService,$location,$window) {

    var reporteeJFWCollectionInstance = new reporteeJFWCollection(),
        dcrDropCollectionInstance = new dcrDropCollection(),
        materialTransactionCollectionInstance = new MaterialTransactionCollection(),
        dcrCollectionInstance = new dcrCollection(),
        materialLotCollectionInstance = new materialLotCollection(),
        mtpRemoveConfigCollectionInstance = new mtpRemoveConfigCollection(),
        newCustomerCollectionInstance = new newCustomerCollection(),
        activitySelectionCollectionInstance = new activitySelectionCollection(),
        materialLotArray = [];

    $scope.getMaterialData = function () {
            return materialLotCollectionInstance.fetchAll()
              .then(materialLotCollectionInstance.fetchRecursiveFromCursor)
              .then(function (materialLotList) {
                  if (materialLotList.length) {
                      materialLotArray = materialLotList;
                  }
                  return materialLotList;
              });
        };

     $scope.init = function() {

        $scope.customerData_from_dcr ={};
        $scope.customerData_from_dcr.mtpRemoveConfig =[];
        $scope.customerData_from_dcr.dcrDropData = [];

        $scope.locale = abbottConfigService.getLocale();
        $scope.activitiesSelectedInActivitySelectionPage = [];
        $scope.activitiesSelectedInActivitySelectionPage = statusDCRActivty.getActivityStatus();
        $scope.currentCalenderDate = statusDCRActivty.getCalenderDate();
        $scope.filterdatetime = $filter('date')($scope.currentCalenderDate, 'yyyy-MM-dd');

        $scope.transperantConfig = abbottConfigService.getTransparency();
        $scope.transperantConfig.display = true;
        $scope.transperantConfig.showBusyIndicator = true;
        $scope.transperantConfig.showTransparancy = true;

        $scope.isFieldWork = false;
        abbottConfigService.setTransparency($scope.transperantConfig);
        if ($scope.activitiesSelectedInActivitySelectionPage.length > 1 && $scope.activitiesSelectedInActivitySelectionPage[1].Name == "Field Work") {
            $scope.activitiesSelectedInActivitySelectionPage[1].Name = $scope.activitiesSelectedInActivitySelectionPage[0].Name;
            $scope.activitiesSelectedInActivitySelectionPage[0].Name = "Field Work";
        }

        $scope.listOfTabs = [];
        $scope.tabType = TABS_TYPES;
        $scope.firstTimeEntry = true;
        var index = 0;
        angular.forEach($scope.activitiesSelectedInActivitySelectionPage, function(value, key) {
            if (value.Name == "Field Work") {
                $scope.isFieldWork = true;
                $scope.listOfTabs.push({
                    "title" : $scope.locale.Doctors,
                    "customer_type" : CUSTOMER_TYPES.DOCTORS,
                    "tab_type" : TABS_TYPES.CUSTOMERS,
                    "url":'dcrCreateDoctor'
                });
                $scope.listOfTabs.push({
                    "title" : $scope.locale.Chemists,
                    "customer_type" : CUSTOMER_TYPES.CHEMISTS,
                    "tab_type" : TABS_TYPES.CUSTOMERS,
                    "url":'dcrCreateChemist'
                });
                $scope.listOfTabs.push({
                    "title" : $scope.locale.Stockists,
                    "customer_type" : CUSTOMER_TYPES.STOCKIST,
                    "tab_type" : TABS_TYPES.CUSTOMERS,
                    "url":'dcrCreateStockist'
                });
              /*  $scope.listOfTabs.push({
                    "title" : $scope.locale.Others,
                    "customer_type" : CUSTOMER_TYPES.OTHERS,
                    "tab_type" : TABS_TYPES.CUSTOMERS,
                    "url": 'dcrCreateOthers'
                }); */
            } else if (value.Name != "Field Work") {
                $scope.listOfTabs.push({
                    "title" : value.Name,
                    "customer_type" : CUSTOMER_TYPES.ACTIVTY,
                    "tab_type" : TABS_TYPES.ACTIVITIES,
                    "index": index,
                     "url": 'dcrCreateActivity'
                });
                index = index + 1;
            }
        });

     //   if ($scope.activitiesSelectedInActivitySelectionPage.length > 1 && $scope.listOfTabs[($scope.listOfTabs.length) - 2].tab_type == TABS_TYPES.ACTIVITIES) {
     //       $scope.listOfTabs.pop();
     //   }
        $scope.listOfTabs.push({
            "title" : $scope.locale.Summary,
            "customer_type" : CUSTOMER_TYPES.SUMMARY,
            "tab_type" : TABS_TYPES.SUMMARY,
            "url": 'dcrSummary'
        });

        mtpRemoveConfigCollectionInstance.fetchAll().then(mtpRemoveConfigCollectionInstance.fetchRecursiveFromCursor).then(function(mtpRemoveConfigList) {
                $scope.customerData_from_dcr.mtpRemoveConfig = mtpRemoveConfigList;
        });

        dcrDropCollectionInstance.fetchAll().then(dcrDropCollectionInstance.fetchRecursiveFromCursor).then(function(dcrDropList) {
                $scope.customerData_from_dcr.dcrDropData = dcrDropList;
        });
        $scope.fetchReporteesJFW = function() {
            return reporteeJFWCollectionInstance.fetchAll().then(reporteeJFWCollectionInstance.fetchRecursiveFromCursor);
        };
        $scope.getMaterialData();



     }

     $scope.onNavigateClick=function(url,indexPassed){
        if(url == 'dcrCreateDoctor'){
             $rootScope.tabTitle = $scope.locale.Doctors;
             navigationService.navigate('DCRcreateDoctorChemistStockists');
        }else if(url == 'dcrCreateChemist'){
             $rootScope.tabTitle = $scope.locale.Chemists;
             navigationService.navigate('DCRcreateDoctorChemistStockists');
        }else if(url == 'dcrCreateStockist'){
             $rootScope.tabTitle = $scope.locale.Stockists;
             navigationService.navigate('DCRcreateDoctorChemistStockists');
        }else if(url == 'dcrCreateOthers'){
            $rootScope.tabTitle = $scope.locale.Others;
            navigationService.navigate('DCRcreateDoctorChemistStockists');
        }else if(url == 'dcrCreateActivity'){
            $rootScope.tabTitle = $scope.locale.Activity;
            navigationService.navigate('dcrCreateActivity', {
                  'dcrActiviyIndex': indexPassed
            }, true);
        }else if(url == 'dcrSummary'){
            navigationService.navigate('dcrSummary');
        }
     }

     //Stop the Event bubbleing on root emit from navigation service
      var customeEventListener = $rootScope.$on('clearActivityValues',function(event,obj){
           $scope.naviateToActivitySelection();
      });
      $scope.$on('$destroy', function() {
          customeEventListener();
      });
     //To Clear the Activity selection on back button click
     $scope.naviateToActivitySelection = function() {
            popupService.openConfirm($scope.locale.SelectActivity, $scope.locale.NavigateToActivitySelectionAlert, $scope.locale.No, $scope.locale.Yes, '55%', function() {

            }, function() {
                var dcrSoupEntryId = $rootScope.dcrGlobalId,
                    filteredCustomerInNewCustomer = $filter('filter')($rootScope.newCustomersForSelectedDay, {
                    "Date__c" : $scope.filterdatetime
                }),
                    soupArray = [],
                    dcrDrop = [];
                angular.forEach(filteredCustomerInNewCustomer, function(value, index) {
                    soupArray.push(value._soupEntryId);
                });
                if (soupArray != undefined && soupArray.length > 0) {
                    newCustomerCollectionInstance.removeEntitiesByIds(soupArray);
                }

                var MTPRemoveConfigRecord = $filter('filter')($scope.customerData_from_dcr.mtpRemoveConfig, {
                    'Date__c' : $scope.filterdatetime
                }),
                    currentMTPRemoveSoupEntryIds = [];
                angular.forEach(MTPRemoveConfigRecord, function(value, index) {
                    currentMTPRemoveSoupEntryIds.push(value._soupEntryId);
                });

                mtpRemoveConfigCollectionInstance.removeEntitiesByIds(currentMTPRemoveSoupEntryIds);

                //Filtering dcr_drop data using dcr_id
                dcrDrop = $filter('filter')($scope.customerData_from_dcr.dcrDropData, {
                    "DCR__c" : dcrSoupEntryId
                }, true);

                //up[dating material in hand quantity
                dcrDrop.forEach(function(value, index) {
                    var record = $filter('filter')(materialLotArray, {
                        'Id' : value.Material_Lot__c
                    });
                    record[0].In_Hand_Quantity__c += value.Quantity__c;
                    materialLotCollectionInstance.upsertEntities(record);
                });
                // removing material transactions for current dcr
                materialTransactionCollectionInstance.fetchAll().then(materialTransactionCollectionInstance.fetchRecursiveFromCursor).then(function(materialTransactionList) {
                    var record = $filter('filter')(materialTransactionList, {
                        'Call_Date__c' : $scope.filterdatetime
                    });
                    materialTransactionCollectionInstance.removeEntities(record);
                });
                // removing dcr_drop for current dcr
                dcrDropCollectionInstance.removeEntities(dcrDrop);

                $scope.fetchReporteesJFW().then(function(reporteeList) {
                    if (reporteeList.length) {
                        reporteeList = $filter('getDataBasedOnDateFilter')(reporteeList, $scope.filterdatetime, 'DCR__r.Date__c');
                        angular.forEach(reporteeList, function(value, index) {
                            value.IsActive__c = true;
                        });
                        reporteeJFWCollectionInstance.upsertEntities(reporteeList);
                    }
                });

                if (dcrSoupEntryId != undefined) {
                    dcrCollectionInstance.removeEntitiesByIds([dcrSoupEntryId]);
                }
                activitySelectionCollectionInstance.clearSoup();

                var history = navigationService.registry.history.pop();
                if(history == "MTPList"){
                    navigationService.registry.history=[];
                    $location.replace();
                    $window.history.back();
                }else{
                     navigationService.navigate('dcrActivitySelection', {
                        'dateDCR' : $rootScope.DCRDate
                     }, true);
                }
            });
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

}]);
