abbottApp.controller('createDCRTabPanes', ['$scope', '$filter', '$q', 'navigationService', 'abbottConfigService', 'dcrHelperService', 'popupService', 'statusDCRActivty', '$rootScope', '$timeout', 'TABS_TYPES', 'utils', 'dcrDropCollection', 'mtpAppointmentDetails1Collection', 'mtpAppointmentDetails2Collection', 'lastVisitCollection', 'dcrCollection', 'dcrJunctionCollection', 'dcrBrandActivityCollection', 'dcrJFWCollection', 'dcrKeyMessageCollection', 'dcrFollowupActivityCollection', 'jfwOtherRolesCollection', 'newCustomerCollection', 'mtpRemoveConfigCollection', 'reporteeJFWCollection', 'divisionwiseBrandCollection', 'materialLotCollection', 'userCollection', 'targetCollection', 'assigmentDetailCollection', 'activitySelectionCollection', 'patchCollection', 'productPresentationPopupService', 'kpiCollectorService', 'materialTransactionCollection', 'brandActivityCollection', 'campaignBrandActivityCollection',
    function($scope, $filter, $q, navigationService, abbottConfigService, dcrHelperService, popupService, statusDCRActivty, $rootScope, $timeout, TABS_TYPES, utils, dcrDropCollection, mtpAppointmentDetails1Collection, mtpAppointmentDetails2Collection, lastVisitCollection, dcrCollection, dcrJunctionCollection, dcrBrandActivityCollection, dcrJFWCollection, dcrKeyMessageCollection, dcrFollowupActivityCollection, jfwOtherRolesCollection, newCustomerCollection, mtpRemoveConfigCollection, reporteeJFWCollection, DivisionwiseBrandCollection, materialLotCollection, userCollection, targetCollection, assigmentDetailCollection, activitySelectionCollection, PatchCollection, productPresentationPopupService, kpiCollectorService, MaterialTransactionCollection, BrandActivityCollection, CampaignBrandActivityCollection) {



        var reporteeJFWCollectionInstance = new reporteeJFWCollection(),
            userCollectionInstance = new userCollection(),
            targetCollectionInstance = new targetCollection(),
            dcrCollectionInstance = new dcrCollection(),
            dcrJFWCollectionInstance = new dcrJFWCollection(),
            newCustomerCollectionInstance = new newCustomerCollection(),
            mtpRemoveConfigCollectionInstance = new mtpRemoveConfigCollection(),
            dcrDropCollection = new dcrDropCollection(),
            dcrJunctionCollection = new dcrJunctionCollection(),
            activitySelectionCollectionInstance = new activitySelectionCollection(),
            dcrKeyMessageCollectionInstance = new dcrKeyMessageCollection(),
            dcrFollowupActivityCollectionInstance = new dcrFollowupActivityCollection(),
            dcrBrandActivityCollection = new dcrBrandActivityCollection(),
            materialLotCollection = new materialLotCollection(),
            patchCollection = new PatchCollection(),
            materialTransactionCollection = new MaterialTransactionCollection(),
            divisionwiseBrandCollection = new DivisionwiseBrandCollection(),
            brandActivityCollection = new BrandActivityCollection(),
            campaignBrandActivityCollection = new CampaignBrandActivityCollection(),
            customerBrandActivityObj = [],
            usersList = [],
            targetsList = [],
            currentUser = {},
            currentTarget = {},
            appointmentDetails = null,
            userType = '',
            materialLotArray = [];


        $scope.customerData_from_mtp = {
            mtpCustomerDetails: [],
            mtpOtherDetails: [],
            lastVisited: []
        };

        $scope.showPresentations = function() {

            window.ga.trackEvent('Navigate To Show Presentations', 'click', 'Show Presentations', 20000);

            if (!($scope.docAndDetailsLength == 0 || $scope.disableEdit == true)) {
                productPresentationPopupService.showProductPresentationPopup($scope);
            }
        };

        $scope.updateKPIData = function(brandId, divisionwiseBrandPresentationId, jsonKPI) {
            kpiCollectorService.addKPI(brandId, divisionwiseBrandPresentationId, jsonKPI);
        };

        $scope.customerData_from_dcr = {
            dcrData: [],
            dcrJunctionData: [],
            dcrDropData: [],
            dcrBrandActivityData: [],
            dcrJFWData: [],
            dcrKeyMessageData: [],
            dcrFollowupActivityData: [],
            newCustomers: [],
            mtpRemoveConfig: [],
            reporteesJFWs: []
        };

        //Show or Hide flag the Remove functionality of when minus icon is clicked
        $scope.removeFlag = false;
        $scope.myClass = false;
        $scope.releaseResources = function() {
            $scope.customerData_from_mtp.mtpCustomerDetails = [];
            $scope.customerData_from_mtp.mtpOtherDetails = [];
            $scope.customerData_from_mtp.lastVisited = [];
            $scope.customerData_from_dcr.dcrData = [];
            $scope.customerData_from_dcr.dcrJunctionData = [];
            $scope.customerData_from_dcr.dcrDropData = [];
            $scope.customerData_from_dcr.dcrBrandActivityData = [];
            $scope.customerData_from_dcr.dcrJFWData = [];
            $scope.customerData_from_dcr.dcrKeyMessageData = [];
            $scope.customerData_from_dcr.dcrFollowupActivityData = [];
            $scope.customerData_from_dcr.newCustomers = [];
            $scope.customerData_from_dcr.mtpRemoveConfig = [];
            $scope.customerData_from_dcr.reporteesJFWs = [];
            appointmentDetails = null;
            usersList = [];
            targetsList = [];
            currentUser = {};
            currentTarget = {};
            customerBrandActivityObj = [];
            $scope.locale = {};
        };

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {

            if (fromState.url == "/DCRcreateDoctorChemistStockists") {

                // if ($scope.tabTabType == TABS_TYPES.CUSTOMERS) {
                    $scope.releaseResources();
                //}
            }
        });

        $scope.getMTPCustomerAppointments = function() {
            var mtpAppointmentDetails1CollectionInstance = new mtpAppointmentDetails1Collection();
            return mtpAppointmentDetails1CollectionInstance.fetchAll().then(mtpAppointmentDetails1CollectionInstance.fetchRecursiveFromCursor).then(function(mtpAppointmentDetails1List) {
                $scope.customerData_from_mtp.mtpCustomerDetails = mtpAppointmentDetails1List;
                return mtpAppointmentDetails1List;
            });
        };

        $scope.getMTPOtherInformation = function() {
            var mtpAppointmentDetails2CollectionInstance = new mtpAppointmentDetails2Collection();
            return mtpAppointmentDetails2CollectionInstance.fetchAll()
                .then(mtpAppointmentDetails2CollectionInstance.fetchRecursiveFromCursor)
                .then(function(mtpAppointmentDetails2List) {
                    $scope.customerData_from_mtp.mtpOtherDetails = mtpAppointmentDetails2List;
                    return mtpAppointmentDetails2List;
                });
        };

        $scope.getLastVisitDate = function() {
            var lastVisitCollectionInstance = new lastVisitCollection();
            return lastVisitCollectionInstance.fetchAll()
                .then(lastVisitCollectionInstance.fetchRecursiveFromCursor)
                .then(function(lastVisitList) {
                    $rootScope.lastVisited = lastVisitList;
                    return lastVisitList;
                });
        };

        //Fetch DCR__c soup records
        $scope.getDCR__c_data = function() {
            return dcrCollectionInstance.fetchAll()
                .then(dcrCollectionInstance.fetchRecursiveFromCursor)
                .then(function(dcrList) {
                    $scope.customerData_from_dcr.dcrData = dcrList;
                    return dcrList;
                });
        };

        //Fetch DCR_Junction__c soup records
        $scope.getDCR_Junction__c_data = function() {
            return dcrJunctionCollection.fetchAll()
                .then(dcrJunctionCollection.fetchRecursiveFromCursor)
                .then(function(dcrJunctionList) {
                    $scope.customerData_from_dcr.dcrJunctionData = dcrJunctionList;
                    return dcrJunctionList;
                });
        };

        //Fetch DCR_Junction__c soup records
        $scope.getPatchData = function() {
            return patchCollection.fetchAll()
                .then(patchCollection.fetchRecursiveFromCursor)
                .then(function(patchList) {
                    $scope.customerData_from_dcr.patchData = patchList;
                    return patchList;
                });
        };

        $scope.getPrevLastCallCommentByDoctor = function(accountId) {
            var dcrData,
                dcrJunctionData,
                dcrJunctionIds,
                lastDcrJunction = [];
            dcrJunctionData = $scope.customerData_from_dcr.dcrJunctionData.filter(function(dcrJunctionData) {
                return dcrJunctionData.Account__c === accountId;
            });
            dcrJunctionIds = dcrJunctionData.map(function(dcrJunction) {
                return dcrJunction.DCR__c;
            });
            dcrData = $scope.customerData_from_dcr.dcrData.filter(function(dcrData) {
                return dcrJunctionIds.indexOf(dcrData.Id) != -1;
            }).sort(function(a, b) {
                if (a.Date__c > b.Date__c) {
                    return -1;
                } else if (a.Date__c < b.Date__c) {
                    return 1;
                } else {
                    return 0;
                }
            });
            if (dcrData.length) {
                lastDcrJunction = dcrJunctionData.filter(function(dcrJunction) {
                    return dcrJunction.DCR__c === dcrData[0].Id;
                });
            }
            if (!lastDcrJunction.length) {
                return '';
            } else {
                return lastDcrJunction[0].Next_Call_Objective__c;
            }
        };

        //Fetch DCR_Drop__c soup records
        $scope.getDCR_Drop__c_data = function() {
            return dcrDropCollection.fetchAll().then(dcrDropCollection.fetchRecursiveFromCursor).then(function(dcrDropList) {
                $scope.customerData_from_dcr.dcrDropData = dcrDropList;
                return dcrDropList;
            });
        };

        //Fetch DCR_Brand_Activity soup records
        $scope.getDCR_Brand_Activity__c_data = function() {
            return dcrBrandActivityCollection.fetchAll()
                .then(dcrBrandActivityCollection.fetchRecursiveFromCursor)
                .then(function(dcrBrandActivityList) {
                    $scope.customerData_from_dcr.dcrBrandActivityData = dcrBrandActivityList;
                    return dcrBrandActivityList;
                });

        };

        //Fetch DCR_JFW__c soup records
        $scope.get_DCR_JFW__c_data = function() {
            return dcrJFWCollectionInstance.fetchAll()
                .then(dcrJFWCollectionInstance.fetchRecursiveFromCursor)
                .then(function(dcrJFWList) {
                    $scope.customerData_from_dcr.dcrJFWData = dcrJFWList;
                    return dcrJFWList;
                });
        };

        //Fetch DCR_Key_Message__c soup records
        $scope.getDCR_Key_Message__c_data = function() {
            return dcrKeyMessageCollectionInstance.fetchAll()
                .then(dcrKeyMessageCollectionInstance.fetchRecursiveFromCursor)
                .then(function(dcrKeyMessageList) {
                    $scope.customerData_from_dcr.dcrKeyMessageData = dcrKeyMessageList;
                    return dcrKeyMessageList;
                });
        };

        //Fetch get_DCR_Followup_Activity__c soup records
        $scope.getDCR_Followup_Activity__c_data = function() {
            return dcrFollowupActivityCollectionInstance.fetchAll()
                .then(dcrFollowupActivityCollectionInstance.fetchRecursiveFromCursor)
                .then(function(dcrFollowupActivityList) {
                    $scope.customerData_from_dcr.dcrFollowupActivityData = dcrFollowupActivityList;
                    return dcrFollowupActivityList;
                });
        };

        $scope.getOtherJFWs = function() {
            var jfwOtherRolesCollectionInstance = new jfwOtherRolesCollection();
            return jfwOtherRolesCollectionInstance.fetchAll()
                .then(jfwOtherRolesCollectionInstance.fetchRecursiveFromCursor)
                .then(function(jfwOtherRolesList) {
                    $rootScope.listOfOtherJFWs = jfwOtherRolesList;
                    return jfwOtherRolesList;
                });
        };

        $scope.getNewCustomers = function() {
            return newCustomerCollectionInstance.fetchAll()
                .then(newCustomerCollectionInstance.fetchRecursiveFromCursor)
                .then(function(newCustomerList) {
                    $scope.customerData_from_dcr.newCustomers = newCustomerList;
                    return newCustomerList;
                });
        };

        $scope.getMTPRemoveConfig = function() {
            return mtpRemoveConfigCollectionInstance.fetchAll().then(mtpRemoveConfigCollectionInstance.fetchRecursiveFromCursor).then(function(mtpRemoveConfigList) {
                $scope.customerData_from_dcr.mtpRemoveConfig = mtpRemoveConfigList;
                return mtpRemoveConfigList;
            });
        };

        $scope.fetchReporteesJFW = function() {
            return reporteeJFWCollectionInstance.fetchAll()
                .then(reporteeJFWCollectionInstance.fetchRecursiveFromCursor);
        };

        $scope.getReporteesJFWs = function() {
            return $scope.fetchReporteesJFW().then(function(reporteeJFWList) {
                reporteeJFWList = reporteeJFWList.map(function(reportee) {
                    if (reportee.IsActive__c == undefined) {
                        reportee.IsActive__c = true;
                    }
                    return reportee;
                });
                $scope.customerData_from_dcr.reporteesJFWs = reporteeJFWList;
                return reporteeJFWList;
            });
        };

        $scope.init = function() {

            window.ga.trackView('CreateDCRTabPanes');
            window.ga.trackTiming('DCR Tab Load Start Time', 20000, 'DCRLoadStart', 'DCR TabLoad Start');
            materialsList = [];
            campaignsList = [];
            $scope.lastVisitForNewCustomer = 0;

            $rootScope.backFromModules = false;
            $scope.disableEdit = $rootScope.disablingEdit;
            $rootScope.isNonFieldWork = false;

            if ($rootScope.tabTitle == "Doctors") {
                $scope.customerType = "Doctor";
                $scope.removePopUpLabel = "Doctors";
            } else if ($rootScope.tabTitle == "Chemists") {
                $scope.customerType = "Chemist";
                $scope.removePopUpLabel = "Chemists";
            } else if ($rootScope.tabTitle == "Stockists") {
                $scope.customerType = "Stockist";
                $scope.removePopUpLabel = "Stockists";
            } else if ($rootScope.tabTitle == "Others") {
                $scope.customerType = "Other";
                $scope.removePopUpLabel = "Customers";
            }
            $scope.filterdatetime = $filter('date')($scope.currentCalenderDate, 'yyyy-MM-dd');
            $scope.filterdatetime = $scope.filterdatetime.toString();
            $scope.listOfLastVisitDates = [];
            $scope.docAndDetails = [];
            $scope.locale = abbottConfigService.getLocale();
            $scope.dropdownDefault = {

                'buttonDefaultText': $scope.locale.FieldWorkDropdown,

            }
            kpiCollectorService.clearKPIs();

            userCollectionInstance.fetchAllCollectionEntities().then(function(allUsers) {
                usersList = allUsers;
            }).then(userCollectionInstance.getActiveUser).then(function(activeUser) {
                currentUser = activeUser;
                userType = activeUser.Designation__c;
            }).then(targetCollectionInstance.fetchAllCollectionEntities).then(function(targets) {
                targetsList = targets;
            }).then(targetCollectionInstance.fetchTarget).then(function(target) {
                currentTarget = target;
            }).then(function() {

               
                    $scope.division = currentUser;
               
           

                  $q.when(currentUser).then(divisionwiseBrandCollection.fetchAll).then(divisionwiseBrandCollection.fetchRecursiveFromCursor).then(function(brandList) {
                    if (brandList.length != 0 && !$scope.disableEdit) {
                        brandList = brandList.filter(function(brand) {
                            return new Date(brand.Effective_From__c) <= new Date($scope.currentCalenderDate) && (new Date(brand.Effective_Till__c) >= new Date($scope.currentCalenderDate) || brand.Effective_Till__c == null)
                        });
                    }
                    $scope.Brands = $filter('orderBy')(brandList, 'Name');
                    return brandList;
                }).then($scope.getBrandActivities).then(materialLotCollection.fetchAll).then(materialLotCollection.fetchRecursiveFromCursor).then(function(materialList) {
                    materialsList = materialList;
                    $scope.materialsList = materialList;
                    return materialList;
                }).then(campaignBrandActivityCollection.fetchAll).then(campaignBrandActivityCollection.fetchRecursiveFromCursor).then(function(campList) {
                    campaignsList = campList;
                    return campList;
                }).then($scope.loadData)
            });
        };

        $scope.loadData = function() {
            if (!navigationService.isBackOperation()) {
                $scope.currentDocAndDetailsIndex = 0;
                dcrHelperService.setCurrentCustomerIndex(0);
            } else {
                navigationService.isBackPressed = false;
            }
            $timeout(function() {
                $rootScope.dcrGlobalId = null;
                $q.all([$scope.getAssignmentDetails(),  
                        $scope.getDCR_Drop__c_data(),  
                        $scope.getMTPCustomerAppointments(),  
                        $scope.getMTPOtherInformation(),  
                        $scope.getLastVisitDate(),  
                        $scope.getDCR__c_data(),  
                        $scope.getDCR_Junction__c_data(),  
                        $scope.getDCR_Brand_Activity__c_data(),  
                        $scope.get_DCR_JFW__c_data(),  
                        $scope.getDCR_Key_Message__c_data(),  
                        $scope.getDCR_Followup_Activity__c_data(),  
                        $scope.getBrandData(),  
                        $scope.getMaterialData(),  
                        $scope.getOtherJFWs(),  
                        $scope.getNewCustomers(),  
                        $scope.getMTPRemoveConfig(),  
                        $scope.getReporteesJFWs(),  
                        $scope.getPatchData()
                    ])
                    .then($scope.setup);
            }, 500);
        };

        $scope.getAssignmentDetails = function() {

            var assigmentDetailCollectionInstance = new assigmentDetailCollection();
            return assigmentDetailCollectionInstance.fetchUserAssignmentDetails() 
                .then(function(assigments) {

                    appointmentDetails = assigments; 
                    return assigments;

                });
        };

        $scope.getBrandData = function() {
            var divisionwiseBrandCollectionInstance = new DivisionwiseBrandCollection();
            return divisionwiseBrandCollectionInstance.fetchAll()
                .then(divisionwiseBrandCollectionInstance.fetchRecursiveFromCursor)
                .then(function(divisionwiseBrandList) {
                    if (!$scope.disableEdit) {
                        divisionwiseBrandList = divisionwiseBrandList.filter(function(brandItem) {
                            return new Date(brandItem.Effective_From__c) <= new Date($scope.currentCalenderDate) && (new Date(brandItem.Effective_Till__c) >= new Date($scope.currentCalenderDate) || brandItem.Effective_Till__c == null);
                        });
                    }
                    if (divisionwiseBrandList.length) {
                        dcrHelperService.setBrandsList(divisionwiseBrandList);
                    }
                    return divisionwiseBrandList;
                });
        };

        $scope.getMaterialData = function() {
            return materialLotCollection.fetchAll()
                .then(materialLotCollection.fetchRecursiveFromCursor)
                .then(function(materialLotList) {
                    if (materialLotList.length) {
                        dcrHelperService.setMaterialList(materialLotList);
                        materialLotArray = materialLotList;
                    }
                    return materialLotList;
                });
        };

        $scope.updateSoupEntryId = function(data) {
            angular.forEach(data, function(value, index) {
                if (value.Id != null) {
                    value._soupEntryId = value.Id;
                }
            });
        };

        $scope.setup = function() {


 



            var dcrData = [],
                dcrJunctionData = [],
                filterPatchData = [],
                dcrDropData = [],
                dcrJFWData = [],
                dcrFollowupActivityData = [],
                dcrKeyMessageData = [],
                dcrBrandActivityData = [],
                dcrDataForSelectedDay = [],
                dcrJunctionDataForSelectedDay = [],
                customerOtherDetails = [],
                mtpRecord = {},
                isDcrRecordPresent = false,
                dcrDrop = [],
                dcrKeyMessages = [],
                dcrFollowupMessages = [],
                dcrJFWs = [],
                dcrBrandActivity = [],
                dcrJunctionDataTemp = [],
                mtpCustomerDetails = {},
                mtpOtherDetails = {},
                lastVisitedData = {},
                name = '',
                customerCode = '',
                patch = '',
                patchCode = '',
                designation = '',
                newCustomersFiltered = [],
                lastVisitDates = [],
                lastVisitDate = null,
                customerType = '',
                patchName = '';

            //Fetching MTP records
            if ($scope.customerData_from_mtp.mtpCustomerDetails) {
                mtpCustomerDetails = $scope.customerData_from_mtp.mtpCustomerDetails;
            } else {
                mtpCustomerDetails = [];
            }

            if ($scope.customerData_from_mtp.mtpOtherDetails) {
                mtpOtherDetails = $scope.customerData_from_mtp.mtpOtherDetails;
            } else {
                mtpOtherDetails = [];
            }

            if ($rootScope.lastVisited) {
                lastVisitedData = $rootScope.lastVisited;
            } else {
                lastVisitedData = [];
            }

            //Filtered based on date
            $rootScope.mtpCustomerDetailsForSelectedDate = $filter('getDataBasedOnDateFilter')(mtpCustomerDetails, $scope.filterdatetime, 'MTP_Cycle__r.Date__c');

            //Filtered based on customer type
            if ($scope.customerType == "Doctor" || $scope.customerType == "Chemist" || $scope.customerType == "Stockist") {
                $rootScope.mtpCustomerDetailsForSelectedDate = $filter('getDataBasedOnDateFilter')($rootScope.mtpCustomerDetailsForSelectedDate, $scope.customerType, 'Assignment__r.Account__r.RecordType.Name');
            } else {
                $rootScope.mtpCustomerDetailsForSelectedDate = $scope.filterCustomer($rootScope.mtpCustomerDetailsForSelectedDate);
            }

            // remove deactivated doctors
            for (var i = $rootScope.mtpCustomerDetailsForSelectedDate.length - 1; i >= 0; i--) {
                var docAssigns = $filter('filter')(appointmentDetails, {
                    'Id': $rootScope.mtpCustomerDetailsForSelectedDate[i].Assignment__c
                });
                if (docAssigns && docAssigns.length) {
                    var effectiveDate = new Date(docAssigns[0].Effective_Date__c),
                        deActivationDate = null;
                    if (docAssigns[0].Deactivation_Date__c != null) {
                        deActivationDate = new Date(docAssigns[0].Deactivation_Date__c);
                    }
                    DCRDate = new Date($scope.currentCalenderDate);
                    //filtering deactivated doctors
                    if (effectiveDate <= DCRDate && deActivationDate != null && deActivationDate <= DCRDate) {
                        $rootScope.mtpCustomerDetailsForSelectedDate.splice(i, 1);
                    }
                }
            }

            $rootScope.mtpCustomerDetailsForSelectedDate = $filter('orderBy')($rootScope.mtpCustomerDetailsForSelectedDate, 'Name');

            //Fetching DCR records
            dcrData = $scope.customerData_from_dcr.dcrData;
            dcrJunctionData = $scope.customerData_from_dcr.dcrJunctionData;
            dcrDropData = $scope.customerData_from_dcr.dcrDropData;
            dcrJFWData = $scope.customerData_from_dcr.dcrJFWData;
            dcrFollowupActivityData = $scope.customerData_from_dcr.dcrFollowupActivityData;
            dcrKeyMessageData = $scope.customerData_from_dcr.dcrKeyMessageData;
            dcrBrandActivityData = $scope.customerData_from_dcr.dcrBrandActivityData;

            if ($scope.disableEdit) {
                //updating soupEntryId with Id value if Id is not null
                $scope.updateSoupEntryId(dcrData);
                $scope.updateSoupEntryId(dcrJunctionData);
                $scope.updateSoupEntryId(dcrDropData);
                $scope.updateSoupEntryId(dcrJFWData);
                $scope.updateSoupEntryId(dcrFollowupActivityData);
                $scope.updateSoupEntryId(dcrKeyMessageData);
                $scope.updateSoupEntryId(dcrBrandActivityData);
            }

            dcrBrandActivityData = $filter('filterNonEmpty')(dcrBrandActivityData, 'DCR_Junction__c');
            //filter for Non CME Symposia
            dcrDataForSelectedDay = $filter('filter')(dcrData, {
                "Date__c": $scope.filterdatetime
            });
            $scope.customerData_from_dcr.reporteesJFWs = $filter('filter')($scope.customerData_from_dcr.reporteesJFWs, {
                'IsActive__c': true
            });
            $scope.customerData_from_dcr.reporteesJFWs = $filter('getDataBasedOnDateFilter')($scope.customerData_from_dcr.reporteesJFWs, $scope.filterdatetime, 'DCR__r.Date__c');

            //               if($scope.customerData_from_dcr.reporteesJFWs.length > 0) {
            //                  if(dcrJunctionDataForSelectedDay[0].Sequence_Number__c != undefined) {
            //                  $scope.customerData_from_dcr.reporteesJFWs = $filter('toNumber')($scope.customerData_from_dcr.reporteesJFWs, 'Sequence_Number__c');
            //                  $scope.customerData_from_dcr.reporteesJFWs = $filter('orderBy')($scope.customerData_from_dcr.reporteesJFWs, 'DCR_Junction__r.Sequence_Number__c');
            //                  } else {
            //                     $scope.customerData_from_dcr.reporteesJFWs = $filter('orderBy')($scope.customerData_from_dcr.reporteesJFWs, 'Name');
            //                  }
            //               }

            angular.forEach(dcrDataForSelectedDay, function(value, index) {

                $rootScope.dcrGlobalId = value._soupEntryId;
                dcrJunctionDataTemp = $filter('getDataBasedOnDateFilter')(dcrJunctionData, value._soupEntryId, "DCR__c");
                angular.forEach(dcrJunctionDataTemp, function(value, index) {
                    dcrJunctionDataForSelectedDay.push(value);
                });
            });

            dcrJunctionDataForSelectedDay = $filter('filterNonEmpty')(dcrJunctionDataForSelectedDay, 'Account__c');
            dcrJunctionDataForSelectedDay = $filter('filterEmpty')(dcrJunctionDataForSelectedDay, 'DCR_Brand_Activity__c');
            //filter for non CME Symposia

            $rootScope.newCustomersForSelectedDay = $filter('filter')($scope.customerData_from_dcr.newCustomers, {
                "Date__c": $scope.filterdatetime
            });
            $rootScope.newCustomersForSelectedDay = $filter('filter')($rootScope.newCustomersForSelectedDay, {
                "CustomerType": $scope.customerType
            });

            $rootScope.newCustomersForSelectedDay = $filter('orderBy')($rootScope.newCustomersForSelectedDay, 'SortIndex');
            //////////////////////////////////////////////### MTP Parsing ###////////////////////////////////////
            if (!$scope.disableEdit) {
                $rootScope.mtpOtherDetailsForSelectedDate = $filter('getDataBasedOnDateFilter')(mtpOtherDetails, $scope.filterdatetime, 'MTP_Junction__r.MTP_Cycle__r.Date__c');

                // check if dcr exist and is in saved state in $scope.customerData_from_dcr.dcrData
                 
                //             var currentDCR = $filter('filter')($scope.customerData_from_dcr.dcrData, {
                 
                //                'Date__c' : $scope.filterdatetime
                 
                //             });

                angular.forEach($rootScope.mtpCustomerDetailsForSelectedDate, function(value, index) {

                    var MTPRemoveConfigRecord = $filter('filter')($scope.customerData_from_dcr.mtpRemoveConfig, {
                            'Id': value.Id
                        }),
                        isMTPRemoved = false,
                        mtpRecord = [],
                        designation = '';
                    //TODO check with umesh: reason for adding this condition currentDCR.length>0
                    if (MTPRemoveConfigRecord != undefined && MTPRemoveConfigRecord.length > 0) {
                        isMTPRemoved = true;
                    }

                    if (!isMTPRemoved) {
                        customerOtherDetails = $filter('filter')($rootScope.mtpOtherDetailsForSelectedDate, {
                            $: $rootScope.mtpCustomerDetailsForSelectedDate[index].Id
                        });

                        if (userType != 'ZBM') {
                            mtpRecord = $filter('filter')(appointmentDetails, {
                                "Account__c": value.Assignment__r.Account__c
                            });
                        } else {
                            var ABMUsersData = $filter('designationFilter')(targetsList, 'ABM');
                            for (var i = 0; i < ABMUsersData.length; i++) {
                                mtpRecord = $filter('filter')(appointmentDetails[ABMUsersData[i].Territory__c], {
                                    "Account__c": value.Assignment__r.Account__c
                                });
                                if (mtpRecord != undefined && mtpRecord.length > 0) {
                                    break;
                                }
                            }
                        }

                        if (mtpRecord && mtpRecord.length > 0) {
                            designation = mtpRecord[0].Speciality__c;
                        } else {
                            designation = value.Assignment__r.Account__r.Speciality__c;
                        }

                        //Patch Name retrieved from Patch Table
                        filterPatchData = $scope.customerData_from_dcr.patchData.filter(function(patchData) {
                            return patchData.Id === value.Patch__c;
                        });

                        if (filterPatchData.length > 0) {
                            patchName = filterPatchData[0].Name;
                        } else {
                            patchName = value.Patch__r.Name;
                        }

                        $scope.docAndDetails.push({ //All doc details available
                            'id': value.Id,
                            'Account__c': value.Assignment__r.Account__c,
                            'assignment__c': value.Assignment__c,
                            'name': value.Assignment__r.Account__r.Name,
                            'customerCode': value.Assignment__r.Account__r.Customer_Code__c,
                            'isGovernmentDoctor': value.Assignment__r.Account__r.Is_Government_Doctor__c,
                            'institutionName': value.Assignment__r.Account__r.Institution_Name__c,
                            'privatePermittedPractice': value.Assignment__r.Account__r.PrivatePermittedPractice__c,
                            'patch': patchName,
                            'patchCode': value.Patch__c,
                            'designation': designation,
                            'DCR_Junction__c': null,
                            'DCR__c': $rootScope.dcrGlobalId,
                            'lastVisitDate': null,
                            'dcrKeyMessages': [],
                            'dcrFollowupMessages': [],
                            'dcrJFWs': [],
                            'attributes': [],
                            'recordType': "MTP",
                            'lastCallComments': $scope.getPrevLastCallCommentByDoctor(value.Assignment__r.Account__c),
                            'nextCallObjectives': '',
                            'sortIndex': $scope.docAndDetails.length,
                            'Local_DCR_Junction__c': null, // local mapping with DCR_Junction
                            'Local_DCR__c': $rootScope.dcrGlobalId // local mapping with DCR
                            

                        });

                        //load Reportees JFWs
                        if (userType != 'TBM') {
                            angular.forEach($scope.customerData_from_dcr.reporteesJFWs, function(value1, index) {
                                if (value.Assignment__r.Account__c == value1.DCR_Junction__r.Account__r.Id) {
                                    $scope.docAndDetails[$scope.docAndDetails.length - 1].dcrJFWs.push({
                                        'User2__c': value1.User1__c,
                                        'User_Type__c': value1.User1__r.Designation__c
                                    });
                                }
                            });
                        }

                        if ($scope.customerType == "Doctor") {
                            getMTPMaterialForSelectedBrand(value, customerOtherDetails);
                        } else {
                            getMTPNonDoctorMaterials(customerOtherDetails);
                        }

                        customerBrandActivityObj.push([]);

                        lastVisitDates = $filter('filter')(lastVisitedData, {
                            'Account__c': $rootScope.mtpCustomerDetailsForSelectedDate[index].Assignment__r.Account__c
                        });
                        angular.forEach(lastVisitDates, function(value, i) {
                            if (value.Last_Visit_Date__c != null) {
                                value.Last_Visit_Date__c = new Date(value.Last_Visit_Date__c);
                            }
                        });
                        lastVisitDates = $filter('orderBy')(lastVisitDates, 'Last_Visit_Date__c', true);
                        lastVisitDate = (lastVisitDates.length == 0 || (lastVisitDates.length > 0 && lastVisitDates[0].Last_Visit_Date__c == null) || (lastVisitDates.length > 0 && lastVisitDates[0].Last_Visit_Date__c == $scope.currentCalenderDate)) ? $scope.locale.NotFound : lastVisitDates[0].Last_Visit_Date__c;
                        $scope.docAndDetails[$scope.docAndDetails.length - 1].lastVisitDate = lastVisitDate;
                    }
                });
            }

            addJFWOfNewCustomersFromReportees(function() {
                //////////////////////////////////////////////###New customers###////////////////////////////////////
                if (!$scope.disableEdit) {
                    angular.forEach($rootScope.newCustomersForSelectedDay, function(value, index) {

                        //Patch Name retrieved from Patch Table
                        filterPatchData = $scope.customerData_from_dcr.patchData.filter(function(patchData) {
                            return patchData.Id === value.PatchCode;
                        });

                        if (filterPatchData.length > 0) {
                            patchName = filterPatchData[0].Name;
                        } else {
                            patchName = value.Patch;
                        }
                        var duplicationRemover = [];
                        duplicationRemover = $filter('getDataBasedOnDateFilter')($scope.docAndDetails, value.Account__c, 'Account__c');
                        if (duplicationRemover.length == 0) {

                            $scope.docAndDetails.push({
                                'id': value._soupEntryId,
                                'Account__c': value.Account__c,
                                'assignment__c': value.Assignment__c,
                                'name': value.Name,
                                'patch': patchName,
                                'patchCode': value.PatchCode,
                                'designation': value.Designation,
                                'customerCode': value.Customer_Code__c,
                                'isGovernmentDoctor': value.Is_Government_Doctor__c,
                                'institutionName': value.Institution_Name__c,
                                'privatePermittedPractice': value.PrivatePermittedPractice__c,
                                'DCR_Junction__c': null,
                                'DCR__c': $rootScope.dcrGlobalId,
                                'lastVisitDate': null,
                                'dcrJunction': null,
                                'dcrKeyMessages': [],
                                'dcrFollowupMessages': [],
                                'dcrJFWs': [],
                                'attributes': [],
                                'recordType': "New",
                                'lastCallComments': $scope.getPrevLastCallCommentByDoctor(value.Account__c),
                                'nextCallObjectives': '',
                                'sortIndex': value.SortIndex,
                                'Local_DCR_Junction__c': null, // local mapping with DCR_Junction
                                'Local_DCR__c': $rootScope.dcrGlobalId, // local mapping with DCR
                                'mobileNumber': value.Phone,
                                'isTicked' : null
                            });

                            //load Reportees JFWs
                            if (userType != 'TBM') {
                                angular.forEach($scope.customerData_from_dcr.reporteesJFWs, function(value1, index) {
                                    if (value.Account__c == value1.DCR_Junction__r.Account__r.Id) {
                                        $scope.docAndDetails[$scope.docAndDetails.length - 1].dcrJFWs.push({
                                            'User2__c': value1.User1__c,
                                            'User_Type__c': value1.User1__r.Designation__c
                                        });
                                    }
                                });
                            }

                            if (userType != 'ZBM') {
                                getNewCutomerMaterialForSelectedBrand(value, appointmentDetails);
                            } else {
                                getNewCutomerMaterialForSelectedBrand(value, appointmentDetails[value.ABM_Territory__c]);
                            }

                            customerBrandActivityObj.push([]);

                            lastVisitDates = $filter('filter')(lastVisitedData, {
                                'Account__c': value.Account__c
                            });
                            angular.forEach(lastVisitDates, function(value, i) {
                                if (value.Last_Visit_Date__c != null) {
                                    value.Last_Visit_Date__c = new Date(value.Last_Visit_Date__c);
                                }
                            });
                            lastVisitDates = $filter('orderBy')(lastVisitDates, 'Last_Visit_Date__c', true);
                            lastVisitDate = (lastVisitDates.length == 0 || (lastVisitDates.length > 0 && lastVisitDates[0].Last_Visit_Date__c == null) || (lastVisitDates.length > 0 && lastVisitDates[0].Last_Visit_Date__c == $scope.currentCalenderDate)) ? $scope.locale.NotFound : lastVisitDates[0].Last_Visit_Date__c;
                            $scope.docAndDetails[$scope.docAndDetails.length - 1].lastVisitDate = lastVisitDate;
                        }
                    });
                }

                if ($scope.disableEdit && dcrJunctionDataForSelectedDay.length > 0) {
                    if (dcrJunctionDataForSelectedDay[0].Sequence_Number__c != undefined) {
                        dcrJunctionDataForSelectedDay = $filter('toNumber')(dcrJunctionDataForSelectedDay, 'Sequence_Number__c');
                        dcrJunctionDataForSelectedDay = $filter('orderBy')(dcrJunctionDataForSelectedDay, 'Sequence_Number__c');
                    } else {
                        dcrJunctionDataForSelectedDay = $filter('orderBy')(dcrJunctionDataForSelectedDay, 'Name');
                    }
                }

                ///////////////////////////////////////////### DCR Filed customers###///////////////////////////////////

                angular.forEach(dcrJunctionDataForSelectedDay, function(value, index) {

                    var mtpIdRecords = $scope.getAllIndexes($scope.docAndDetails, "Account__c", value.Account__c),
                        mtpIndex = 0,
                        sortIndex = -1;
                    if (mtpIdRecords.length > 0) {
                        mtpIndex = mtpIdRecords[0];
                        sortIndex = mtpIdRecords[0].sortIndex;
                    } else {
                        mtpIndex = -1;
                        sortIndex = (value.Sequence_Number__c != undefined) ? value.Sequence_Number__c : value.Name;
                    }

                    customerType = $scope.getCustomerType(value.Account__c);
                    if ($scope.customerType == customerType) {
                        dcrKeyMessages = $filter('filter')(dcrKeyMessageData, {
                            "DCR_Junction__c": value._soupEntryId
                        }, true);
                        dcrFollowupMessages = $filter('filter')(dcrFollowupActivityData, {
                            "DCR_Junction__c": value._soupEntryId
                        }, true);
                        dcrDrop = $filter('filter')(dcrDropData, {
                            "DCR_Junction__c": value._soupEntryId
                        }, true);
                        dcrBrandActivity = $filter('filter')(dcrBrandActivityData, {
                            "DCR_Junction__c": value._soupEntryId
                        }, true);
                        dcrJFWs = $filter('filter')(dcrJFWData, {
                            "DCR_Junction__c": value._soupEntryId
                        }, true);

                        dcrDrop = $filter('filterEmpty')(dcrDrop, 'Brand_Activity__c');
                        dcrJFWs = $filter('filterEmpty')(dcrJFWs, 'Brand_Activity__c');

                        if ($scope.disableEdit) {

                            if (dcrDrop.length > 0) {
                                if (dcrDrop[0].Sequence_Number__c != undefined) {
                                    dcrDrop = $filter('toNumber')(dcrDrop, 'Sequence_Number__c');
                                    dcrDrop = $filter('orderBy')(dcrDrop, 'Sequence_Number__c');
                                } else {
                                    dcrDrop = $filter('orderBy')(dcrDrop, 'Name');
                                }
                            }

                            if (dcrKeyMessages.length > 0) {
                                if (dcrKeyMessages[0].Sequence_Number__c != undefined) {
                                    dcrKeyMessages = $filter('toNumber')(dcrKeyMessages, 'Sequence_Number__c');
                                    dcrKeyMessages = $filter('orderBy')(dcrKeyMessages, 'Sequence_Number__c');
                                } else {
                                    dcrKeyMessages = $filter('orderBy')(dcrKeyMessages, 'Name');
                                }
                            }

                            if (dcrFollowupMessages.length > 0) {
                                if (dcrFollowupMessages[0].Sequence_Number__c != undefined) {
                                    dcrFollowupMessages = $filter('toNumber')(dcrFollowupMessages, 'Sequence_Number__c');
                                    dcrFollowupMessages = $filter('orderBy')(dcrFollowupMessages, 'Sequence_Number__c');
                                } else {
                                    dcrFollowupMessages = $filter('orderBy')(dcrFollowupMessages, 'Name');
                                }
                            }

                            if (dcrBrandActivity.length > 0) {
                                if (dcrBrandActivity[0].Sequence_Number__c != undefined) {
                                    dcrBrandActivity = $filter('toNumber')(dcrBrandActivity, 'Sequence_Number__c');
                                    dcrBrandActivity = $filter('orderBy')(dcrBrandActivity, 'Sequence_Number__c');
                                } else {
                                    dcrBrandActivity = $filter('orderBy')(dcrBrandActivity, 'Name');
                                }
                            }

                            if (dcrJFWs.length > 0) {
                                if (dcrJFWs[0].Sequence_Number__c != undefined) {
                                    dcrJFWs = $filter('toNumber')(dcrJFWs, 'Sequence_Number__c');
                                    dcrJFWs = $filter('orderBy')(dcrJFWs, 'Sequence_Number__c');
                                } else {
                                    dcrJFWs = $filter('orderBy')(dcrJFWs, 'Name');
                                }
                            }
                        }

                        newCustomersFiltered = $filter('filter')($rootScope.newCustomersForSelectedDay, {
                            "Account__c": value.Account__c
                        });

                        if (newCustomersFiltered.length > 0) {
                            mtpRecord = $filter('filter')(appointmentDetails, {
                                "Account__c": value.Account__c
                            });

                            name = newCustomersFiltered[0].Name;
                            customerCode = newCustomersFiltered[0].Customer_Code__c;
                            isGovernmentDoctor = newCustomersFiltered[0].Is_Government_Doctor__c;
                            institutionName = newCustomersFiltered[0].Institution_Name__c;
                            privatePermittedPractice = newCustomersFiltered[0].PrivatePermittedPractice__c;
                            patch = newCustomersFiltered[0].Patch;
                            patchCode = newCustomersFiltered[0].PatchCode;
                            designation = newCustomersFiltered[0].Designation;
                            mobileNumber = newCustomersFiltered[0].Phone;
                        } else {
                            if (userType != 'ZBM') {
                                mtpRecord = $filter('filter')(appointmentDetails, {
                                    "Account__c": value.Account__c
                                });
                            } else {
                                var ABMUsersData = $filter('designationFilter')(targetsList, 'ABM');
                                for (var i = 0; i < ABMUsersData.length; i++) {
                                    mtpRecord = $filter('filter')(appointmentDetails[ABMUsersData[i].Territory__c], {
                                        "Account__c": value.Account__c
                                    });
                                    if (mtpRecord != undefined && mtpRecord.length > 0) {
                                        break;
                                    }
                                }
                            }

                            if (mtpRecord.length > 0) {

                                name = mtpRecord[0].Account__r.Name;
                                customerCode = mtpRecord[0].Account__r.Customer_Code__c;
                                isGovernmentDoctor = mtpRecord[0].Account__r.Is_Government_Doctor__c;
                                institutionName = mtpRecord[0].Account__r.Institution_Name__c;
                                privatePermittedPractice = mtpRecord[0].Account__r.PrivatePermittedPractice__c;
                                patch = mtpRecord[0].Patch_Name__c;
                                patchCode = mtpRecord[0].Patch__c;
                                designation = mtpRecord[0].Speciality__c;
                                mobileNumber = mtpRecord[0].Phone;
                            }
                        }

                        //Patch Name retrieved from Patch Table
                        filterPatchData = $scope.customerData_from_dcr.patchData.filter(function(patchData) {
                            return patchData.Id === patchCode;
                        });

                        if (filterPatchData.length > 0) {
                            patchName = filterPatchData[0].Name;
                        } else {
                            patchName = patch;
                        }

                        if (mtpIndex > -1) {
                            $scope.docAndDetails[mtpIndex] = {
                                'id': value._soupEntryId,
                                'Account__c': value.Account__c,
                                'assignment__c': value.Assignment__c,
                                'name': name,
                                'patch': patchName,
                                'patchCode': patchCode,
                                'designation': designation,
                                'customerCode': customerCode,
                                'isGovernmentDoctor': isGovernmentDoctor,
                                'institutionName': institutionName,
                                'privatePermittedPractice': privatePermittedPractice,
                                'DCR_Junction__c': value._soupEntryId,
                                'DCR__c': $rootScope.dcrGlobalId,
                                'lastVisitDate': value.Last_Visit_Date__c,
                                'dcrJunction': value,
                                'dcrKeyMessages': dcrKeyMessages,
                                'dcrFollowupMessages': dcrFollowupMessages,
                                'dcrJFWs': dcrJFWs,
                                'POB__c': value.POB__c,
                                'attributes': [],
                                'recordType': "DCR",
                                'lastCallComments': value.Post_call_Note__c,
                                'nextCallObjectives': value.Next_Call_Objective__c,
                                'sortIndex': sortIndex,
                                'preDCRJunction': $scope.docAndDetails[mtpIndex].preDCRJunction,
                                'Local_DCR_Junction__c': value._soupEntryId, // local mapping with DCR_Junction
                                'Local_DCR__c': $rootScope.dcrGlobalId // local mapping with DCR
                            };

                            customerBrandActivityObj[mtpIndex] = dcrBrandActivity;
                        } else {

                            $scope.docAndDetails.push({
                                'id': value._soupEntryId,
                                'Account__c': value.Account__c,
                                'assignment__c': value.Assignment__c,
                                'name': name,
                                'patch': patchName,
                                'patchCode': patchCode,
                                'designation': designation,
                                'customerCode': customerCode,
                                'isGovernmentDoctor': isGovernmentDoctor,
                                'institutionName': institutionName,
                                'privatePermittedPractice': privatePermittedPractice,
                                'DCR_Junction__c': value._soupEntryId,
                                'DCR__c': $rootScope.dcrGlobalId,
                                'lastVisitDate': value.Last_Visit_Date__c,
                                'dcrJunction': value,
                                'dcrKeyMessages': dcrKeyMessages,
                                'dcrFollowupMessages': dcrFollowupMessages,
                                'dcrJFWs': dcrJFWs,
                                'POB__c': value.POB__c,
                                'attributes': [],
                                'recordType': "DCR",
                                'lastCallComments': value.Post_call_Note__c,
                                'nextCallObjectives': value.Next_Call_Objective__c,
                                'sortIndex': sortIndex,
                                'Local_DCR_Junction__c': value._soupEntryId, // local mapping with DCR_Junction
                                'Local_DCR__c': $rootScope.dcrGlobalId, // local mapping with DCR
                                'mobileNumber': value.mobileNumber
                            });
                            customerBrandActivityObj.push(dcrBrandActivity);
                            mtpIndex = $scope.docAndDetails.length - 1;
                        }

                        if ($scope.customerType == "Doctor") {
                            getDCRMaterialForSelectedBrand(value, dcrDrop, mtpIndex);
                        } else {
                            getDCRNonDoctorMaterials(dcrDrop, mtpIndex);
                        }

                        if ($scope.docAndDetails[mtpIndex].lastVisitDate == undefined) {
                            lastVisitDates = $filter('filter')(lastVisitedData, {
                                'Account__c': value.Account__c
                            });
                            angular.forEach(lastVisitDates, function(value, i) {
                                if (value.Last_Visit_Date__c != null) {
                                    value.Last_Visit_Date__c = new Date(value.Last_Visit_Date__c);
                                }
                            });
                            lastVisitDates = $filter('orderBy')(lastVisitDates, 'Last_Visit_Date__c', true);
                            lastVisitDate = (lastVisitDates.length == 0 || (lastVisitDates.length > 0 && lastVisitDates[0].Last_Visit_Date__c == null) || (lastVisitDates.length > 0 && lastVisitDates[0].Last_Visit_Date__c == $scope.currentCalenderDate)) ? $scope.locale.NotFound : lastVisitDates[0].Last_Visit_Date__c;
                            $scope.docAndDetails[mtpIndex].lastVisitDate = lastVisitDate;
                        }
                    }
                });
                setActiveCustomer();
                $scope.$parent.listOfSupervisors = $scope.listOfSupervisors;

                $scope.currentDocAndDetailsIndex = dcrHelperService.getCurrentCustomerIndex();
                //TODO
                var brandList = dcrHelperService.getBrandsList();
                angular.forEach($scope.docAndDetails, function(value, index) {
                    if (value.attributes) {
                        for (var i = value.attributes.length - 1; i >= 0; i--) {
                            var newCustomersFromReportee = $filter('filter')(brandList, {
                                "Id": value.attributes[i].brandId
                            });
                            if (newCustomersFromReportee.length == 0) {
                                value.attributes.splice(i, 1);
                            }
                        }
                    }
                });

                $scope.docAndDetailsLength = $scope.docAndDetails.length;
                $scope.currentDocAndDetails = $scope.docAndDetails[$scope.currentDocAndDetailsIndex];
                dcrHelperService.setCustomerDetails($scope.docAndDetails);
                dcrHelperService.setDCRBrandActivity(customerBrandActivityObj);
                $scope.transperantConfig.display = false;

                window.ga.trackTiming('DCR Tab Load Finish Time', 20000, 'DCRLoadFinish', 'DCR TabLoad Finish');

                $timeout(function() {
                    $scope.loadJFW();
                }, 100);
            });
        };

        $scope.setActive = function(index) {
            dcrHelperService.setCurrentCustomerIndex(index);
            $scope.currentDocAndDetails = $scope.docAndDetails[index];

        }

        function setActiveCustomer() {
            var customerId = statusDCRActivty.getCustomerId(),
                customerIndex;
            if (customerId) {
                customerIndex = $scope.docAndDetails.reduce(function(acc, item, index) {
                    return item.Account__c === customerId ? index : acc;
                }, 0);
                statusDCRActivty.setCustomerId('');
                $scope.currentDocAndDetailsIndex = customerIndex;
                dcrHelperService.setCurrentCustomerIndex(customerIndex);
            }
        }

        var addJFWOfNewCustomersFromReportees = function(callback) {
            var newCustomers = [],
                newCustomerSoupRecords = [],
                assignmentRecords = [],
                entry = [],
                assignments = [],
                TBMUserSelected = [],
                TBMParentTerritory = '',
                ABMUsersData = [],
                ABMTerritotyId = '',
                newCustomersFromReportee = [];

            if (userType != 'TBM' && !$scope.disableEdit) {
                angular.forEach($scope.customerData_from_dcr.reporteesJFWs, function(value1, index) {
                    if ($scope.docAndDetails.length > 0) {
                        newCustomersFromReportee = $filter('filter')($scope.docAndDetails, {
                            "Account__c": value1.DCR_Junction__r.Account__r.Id
                        });
                        if (newCustomersFromReportee.length == 0) {
                            newCustomers.push(value1);
                        }
                    } else {
                        newCustomers.push(value1);
                    }
                });

                angular.forEach(newCustomers, function(value, index) {
                    newCustomerSoupRecords = $filter('filter')($rootScope.newCustomersForSelectedDay, {
                        "Account__c": value.DCR_Junction__r.Account__r.Id
                    });
                    if (newCustomerSoupRecords.length == 0) {
                        if (userType == "ZBM") {
                            if (value.User1__r.Designation__c == "ABM") {
                                ABMUsersData = $filter('getDataBasedOnDateFilter')(targetsList, value.User1__c, 'User__c');
                                if (ABMUsersData.length > 0) {
                                    assignments = appointmentDetails[ABMUsersData[0].Territory__c];
                                }
                            } else {
                                TBMUserSelected = $filter('getDataBasedOnDateFilter')(targetsList, value.User1__c, 'User__c');

                                if (TBMUserSelected.length > 0) {
                                    TBMParentTerritory = TBMUserSelected[0].Parent_Territory__c;
                                    ABMUsersData = $filter('getDataBasedOnDateFilter')(targetsList, TBMParentTerritory, 'Territory__c');
                                    if (ABMUsersData.length > 0) {
                                        ABMTerritotyId = ABMUsersData[0].Territory__c;
                                        assignments = appointmentDetails[ABMTerritotyId];
                                    }
                                }
                            }
                        } else {
                            assignments = appointmentDetails;
                        }
                        assignmentRecords = $filter('filter')(assignments, {
                            "Account__c": value.DCR_Junction__r.Account__r.Id
                        });
                        if (assignmentRecords && assignmentRecords.length > 0) {
                            var customerObj = {};
                            customerObj.Account__c = assignmentRecords[0].Account__c;
                            customerObj.Date__c = $scope.filterdatetime;
                            customerObj.Designation = assignmentRecords[0].Speciality__c;
                            customerObj.Name = assignmentRecords[0].Account__r.Name;
                            customerObj.Patch = assignmentRecords[0].Patch_Name__c;
                            customerObj.PatchCode = assignmentRecords[0].Patch__c;
                            customerObj.Customer_Code__c = assignmentRecords[0].Account__r.Customer_Code__c;
                            customerObj.CustomerType = assignmentRecords[0].Account__r.RecordType.Name;
                            customerObj.Assignment__c = assignmentRecords[0].Id;
                            //customerObj.mobileNumber = assignmentRecords[0].Assignment__r.Phone;
                            //                        customerObj.ReporteeJFW_User__c = value.User1__c;
                            //                        customerObj.ReporteeJFW_User_Type__c = value.User1__r.Designation__c;
                            if (userType == "ZBM" && ABMTerritotyId != undefined) {
                                customerObj.ABM_Territory__c = ABMTerritotyId;
                            }
                            customerObj.SortIndex = entry.length;

                            if ($scope.customerType == customerObj.CustomerType) {
                                entry.push(customerObj);
                                console.log("Test for ZBM" + " " + entry);
                            }
                        }
                    }
                });

                newCustomerCollectionInstance.upsertEntities(entry).then(function(response) {
                    angular.forEach(response, function(value, index) {
                        $rootScope.newCustomersForSelectedDay.push(value);
                    });
                    callback();
                }).catch(function(error) {

                    callback();
                });
            } else {
                callback();
            }
        };

        $scope.getCustomerType = function(accout__c) {
            var customerType = '';
            if (userType != 'ZBM') {
                for (var i = 0; i < appointmentDetails.length; i++) {
                    if (accout__c == appointmentDetails[i].Account__c) {
                        customerType = appointmentDetails[i].Account__r.RecordType.Name;
                        break;
                    }
                }
            } else {
                var ABMUsersData = $filter('designationFilter')(targetsList, 'ABM'),
                    assignments = [],
                    filterRecords = [];
                for (var i = 0; i < ABMUsersData.length; i++) {
                    assignments = appointmentDetails[ABMUsersData[i].Territory__c];
                    if (assignments != undefined) {
                        filterRecords = $filter('filter')(assignments, {
                            "Account__c": accout__c
                        });
                        if (filterRecords.length > 0) {
                            customerType = filterRecords[0].Account__r.RecordType.Name;
                            break;
                        }
                    }
                }
            }

            if (customerType == "Hospital")
                customerType = "Other";
            return customerType;
        };




        $scope.test1 = function(index) {

            dcrHelperService.setCurrentCustomerIndex(index);

            //$rootScope.$broadcast("saveBrand",index);
            $scope.init1(index);

        }
        $scope.loadJFW = function() {
            //Loading JFW
            var userName = '',
                selectedJFWUsers = [];
            $scope.selectedSupervisorIds = [];

            for (var i = 0; i < $scope.docAndDetails.length; i++) {


                if (typeof(selectedJFWUsers[i]) === 'undefined') {
                    selectedJFWUsers[i] = [];
                    $scope.selectedSupervisorIds[i] = [];
                }


                if (typeof($scope.selectedSupervisorIds[i]) === 'undefined') {

                    $scope.selectedSupervisorIds[i] = [];
                }

                if ($scope.docAndDetails[i] != undefined) {
                    angular.forEach($scope.docAndDetails[i].dcrJFWs, function(value, index) {
                        userName = getJFWUserName(value.User2__c);
                        selectedJFWUsers[i].push({
                            "id": value.User2__c,
                            "name": userName,
                            "designation": value.User_Type__c
                        });
                    });

                    if (selectedJFWUsers[i].length == 0 && ($scope.docAndDetails[i].dcrJunction != undefined)) {
                        selectedJFWUsers[i].push({
                            "id": "NONE",
                            "name": $scope.locale.None.toUpperCase(),
                            "designation": ""
                        });
                    }
                }


                $scope.selectedSupervisorIds[i] = selectedJFWUsers[i];


            }
        };

        var getJFWUserName = function(id) {
            var userWithPassedIdToSupervisors = $filter('filter')(usersList, {
                    'Id': id
                }),
                userName = '';

            if (userWithPassedIdToSupervisors.length == 0) {
                userWithPassedIdToSupervisors = $filter('filter')(targetsList, {
                    'User__c': id
                });
                if (userWithPassedIdToSupervisors.length > 0) {
                    userName = userWithPassedIdToSupervisors[0].User__r.Name;
                    return userName;
                } else {
                    userWithPassedIdToSupervisors = $filter('filter')($rootScope.listOfOtherJFWs, {
                        'User__c': id
                    });
                    if (userWithPassedIdToSupervisors.length > 0) {
                        userName = userWithPassedIdToSupervisors[0].User__r.Name;
                    }
                    return userName;
                }
            } else {
                userName = userWithPassedIdToSupervisors[0].Name;
                return userName;
            }
        };

        var checkIfDCRRecordAlreadyPresent = function(accountId, dcrRecords) {
            var foundRecord = $filter('filter')(dcrRecords, {
                'Account__c': accountId
            });

            if (foundRecord.length > 0) {
                return true;
            }
            return false;
        };

        var getDCRMaterialForSelectedBrand = function(dcrJunctionData, dcrDropDetails, mtpIndex) {
            var brandMaterialData = [],
                brandName = '',
                brandDataArray = [],
                materialName = '',
                materialDataArray = [],
                brandsList = dcrHelperService.getBrandsList(),
                materialsList = dcrHelperService.getMaterialList(),
                dcrDropDetailsFiltered = $filter('filter')(dcrDropDetails, {
                    'DCR_Junction__c': dcrJunctionData._soupEntryId
                }, true),
                rxKeyName = '',
                brandIdText = '';

            for (var i = 1; i <= 10; i++) {
                brandIdText = "Brand" + i + "__c";
                rxKeyName = "Rx_Month" + i + "__c";
                //               pobKeyName = "POB" + i + "__c";

                brandMaterialData = [];
                if (dcrJunctionData[brandIdText] != undefined) {
                    brandMaterialData = $filter('filter')(dcrDropDetailsFiltered, {
                        'Divisionwise_Brand__c': dcrJunctionData[brandIdText]
                    });
                }

                if (brandMaterialData.length == 0 && dcrJunctionData[brandIdText] != undefined) {
                    brandDataArray = [];
                    brandName = '';
                    brandDataArray = $filter('filter')(brandsList, {
                        'Id': dcrJunctionData[brandIdText]
                    });
                    if (brandDataArray.length > 0) {
                        brandName = brandDataArray[0].Name;
                    }

                    $scope.docAndDetails[mtpIndex].attributes.push({
                        'brandName': brandName,
                        'brandId': dcrJunctionData[brandIdText],
                        'materialName': $scope.locale.NoMaterials,
                        'rxMonth': dcrJunctionData[rxKeyName] || 0,
                        'quantity': 0,
                        'brandIndex': i
                    });
                } else {
                    if (brandMaterialData != undefined && brandMaterialData.length > 0) {
                        materialName = '';
                        brandName = '';
                        brandDataArray = $filter('filter')(brandsList, {
                            'Id': dcrJunctionData[brandIdText]
                        });
                        if (brandDataArray.length > 0) {
                            brandName = brandDataArray[0].Name;
                        }

                        angular.forEach(brandMaterialData, function(value, index) {

                            if (value.Material_Lot__c != undefined) {
                                materialDataArray = $filter('filter')(materialsList, {
                                    'Id': value.Material_Lot__c
                                });
                                if (materialDataArray.length > 0) {
                                    materialName = materialDataArray[0].Material_Name__c;
                                } else {
                                    materialName = $scope.locale.NoMaterials;
                                }
                            } else {
                                materialName = $scope.locale.NoMaterials;
                            }

                            $scope.docAndDetails[mtpIndex].attributes.push({
                                'brandName': brandName,
                                'materialName': materialName,
                                'quantity': value.Quantity__c,
                                'brandId': value.Divisionwise_Brand__c,
                                'materialCode': value.Material_Lot__c,
                                'dcrDropId': value._soupEntryId,
                                'rxMonth': dcrJunctionData[rxKeyName] || 0,
                                'brandIndex': i,
                                'sortIndex': value.Sequence_Number__c
                            });
                        });
                    }
                }
            }
        };

        var getDCRNonDoctorMaterials = function(dcrDropDetails, mtpIndex) {

            angular.forEach(dcrDropDetails, function(value, index) {
                var materialName = '',
                    brandName = '',
                    brandsList = dcrHelperService.getBrandsList(),
                    materialsList = dcrHelperService.getMaterialList(),
                    brandDataArray = $filter('filter')(brandsList, {
                        'Id': value['Divisionwise_Brand__c']
                    });
                if (brandDataArray.length > 0) {
                    brandName = brandDataArray[0].Name;
                }

                if (value.Material_Lot__c != undefined) {
                    var materialDataArray = $filter('filter')(materialsList, {
                        'Id': value.Material_Lot__c
                    });
                    if (materialDataArray.length > 0) {
                        materialName = materialDataArray[0].Material_Name__c;
                    } else {
                        materialName = $scope.locale.NoMaterials;
                    }
                } else {
                    materialName = $scope.locale.NoMaterials;
                }

                $scope.docAndDetails[mtpIndex].attributes.push({
                    'brandName': brandName,
                    'materialName': materialName,
                    'quantity': value.Quantity__c,
                    'brandId': value.Divisionwise_Brand__c,
                    'materialCode': value.Material_Lot__c,
                    'dcrDropId': value._soupEntryId,
                    'sortIndex': value.Sequence_Number__c
                });
            });
        };

        var getMTPMaterialForSelectedBrand = function(mtpCustomerDetails, customerOtherDetails) {
            var brandMaterialData = [],
                brandName = '',
                rxKeyName = '',
                materialBatchCode = '',
                materialLotId = '',
                materialsList = dcrHelperService.getMaterialList(),
                brand_r_obj_text = '',
                brandIdText = '',
                preDCRJunctionObj = {},
                isPreRxMonthDataAvailable = false,
                dcrJunctionParseData = $scope.customerData_from_dcr.dcrJunctionData,
                dcrJunctionData = $filter('filter')(dcrJunctionParseData, {
                    'Account__c': mtpCustomerDetails.Assignment__r.Account__c
                }),
                dcrParseData = $scope.customerData_from_dcr.dcrData,
                dcrData = [];

            if (dcrJunctionData.length > 0) {
                for (var i = dcrJunctionData.length - 1; i >= 0; i--) {
                    if (dcrJunctionData[i].DCR__c == $scope.docAndDetails[$scope.docAndDetails.length - 1].DCR__c) {
                        continue;
                    } else {
                        preDCRJunctionObj = dcrJunctionData[i];
                        break;
                    }
                }

                dcrData = $filter('filter')(dcrParseData, {
                    'Id': preDCRJunctionObj.DCR__c
                }, true);
                if (dcrData.length > 0 && dcrData[0].Date__c != $scope.filterdatetime && new Date(dcrData[0].Date__c).getMonth() == new Date($scope.currentCalenderDate).getMonth()) {
                    isPreRxMonthDataAvailable = true;
                    $scope.docAndDetails[$scope.docAndDetails.length - 1]['preDCRJunction'] = preDCRJunctionObj;
                }
            }
            for (var i = 1; i <= 10; i++) {
                brandIdText = "Brand" + i + "__c";
                brand_r_obj_text = "Brand" + i + "__r";
                rxKeyName = "Rx_Month" + i + "__c";

                brandMaterialData = [];
                if (mtpCustomerDetails.Assignment__r[brandIdText] != null && angular.isDefined(mtpCustomerDetails.Assignment__r[brandIdText])) {
                    brandMaterialData = $filter('filter')(customerOtherDetails, {
                        'Brand__c': mtpCustomerDetails.Assignment__r[brandIdText]
                    });
                }

                if (mtpCustomerDetails.Assignment__r[brandIdText] != null && angular.isDefined(mtpCustomerDetails.Assignment__r[brandIdText])) {

                    if (brandMaterialData.length == 0) {

                        $scope.docAndDetails[$scope.docAndDetails.length - 1].attributes.push({
                            'brandName': mtpCustomerDetails.Assignment__r[brand_r_obj_text].Name,
                            'brandId': mtpCustomerDetails.Assignment__r[brandIdText],
                            'materialCode': null,
                            'materialName': $scope.locale.NoMaterials,
                            'quantity': 0,
                            'rxMonth': (isPreRxMonthDataAvailable && preDCRJunctionObj[rxKeyName] != 0 && preDCRJunctionObj[rxKeyName] != undefined) ? preDCRJunctionObj[rxKeyName] : 0,
                            'brandIndex': i
                        });
                    } else {
                        angular.forEach(brandMaterialData, function(value, index) {
                            materialBatchCode = value.Material_Allocation__r.Batch_Code__c;
                            materialLotId = $filter('filter')(materialsList, {
                                'Batch_code__c': materialBatchCode
                            });
                            materialLotId = (materialLotId.length > 0) ? materialLotId[0].Id : '';

                            if (materialLotId != '') {
                                $scope.docAndDetails[$scope.docAndDetails.length - 1].attributes.push({
                                    'brandName': mtpCustomerDetails.Assignment__r[brand_r_obj_text].Name,
                                    'materialName': value.Material_Allocation__r.Material_Name__c,
                                    'quantity': value.Quantity__c,
                                    'brandId': value.Brand__c,
                                    'materialCode': materialLotId,
                                    'rxMonth': 0,
                                    'brandIndex': i,
                                    'sortIndex': $scope.docAndDetails[$scope.docAndDetails.length - 1].attributes.length
                                });
                            } else {
                                $scope.docAndDetails[$scope.docAndDetails.length - 1].attributes.push({
                                    'brandName': mtpCustomerDetails.Assignment__r[brand_r_obj_text].Name,
                                    'brandId': mtpCustomerDetails.Assignment__r[brandIdText],
                                    'materialCode': null,
                                    'materialName': $scope.locale.NoMaterials,
                                    'quantity': 0,
                                    'rxMonth': (isPreRxMonthDataAvailable && preDCRJunctionObj[rxKeyName] != 0 && preDCRJunctionObj[rxKeyName] != undefined) ? preDCRJunctionObj[rxKeyName] : 0,
                                    'brandIndex': i
                                });
                            }
                        });

                    }
                }
            }
        };

        var getMTPNonDoctorMaterials = function(customerOtherDetails) {
            var materialsList = dcrHelperService.getMaterialList(),
                brandList = dcrHelperService.getBrandsList(),
                materialBatchCode = '',
                materialLotId = '',
                brandId = '',
                brandName = '';
            angular.forEach(customerOtherDetails, function(value, index) {
                materialBatchCode = value.Material_Allocation__r.Batch_Code__c;
                materialLotId = $filter('filter')(materialsList, {
                    'Batch_code__c': materialBatchCode
                });
                materialLotId = (materialLotId.length > 0) ? materialLotId[0].Id : '';

                if (materialLotId != '') {
                    brandId = value.Brand__c;
                    brandName = $filter('filter')(brandList, {
                        'id': brandId
                    });

                    $scope.docAndDetails[$scope.docAndDetails.length - 1].attributes.push({
                        'brandName': brandName,
                        'materialName': value.Material_Allocation__r.Material_Name__c,
                        'quantity': value.Quantity__c,
                        'brandId': value.Brand__c,
                        'materialCode': materialLotId,
                        'sortIndex': $scope.docAndDetails[$scope.docAndDetails.length - 1].attributes.length
                    });
                }
            });
        };

        var getNewCutomerMaterialForSelectedBrand = function(newCustomerDetails, newCustomerAppointmentDetails) {
            var brandIdText = '',
                brand_r_obj_text = '',
                rxKeyName = '',
                cusomerDetails = [],
                customerAppointmentDetails = {},
                preDCRJunctionObj = {},
                isPreRxMonthDataAvailable = false,
                dcrJunctionParseData = $scope.customerData_from_dcr.dcrJunctionData,
                dcrJunctionData = $filter('filter')(dcrJunctionParseData, {
                    'Account__c': newCustomerDetails.Account__c
                }),
                dcrParseData = $scope.customerData_from_dcr.dcrData,
                dcrData = [];

            if (dcrJunctionData.length > 0) {
                for (var i = dcrJunctionData.length - 1; i >= 0; i--) {
                    if (dcrJunctionData[i].DCR__c == $scope.docAndDetails[$scope.docAndDetails.length - 1].DCR__c) {
                        continue;
                    } else {
                        preDCRJunctionObj = dcrJunctionData[i];
                        break;
                    }
                }
                dcrData = $filter('filter')(dcrParseData, {
                    'Id': preDCRJunctionObj.DCR__c
                }, true);
                if (dcrData.length > 0 && dcrData[0].Date__c != $scope.filterdatetime && new Date(dcrData[0].Date__c).getMonth() == new Date($scope.currentCalenderDate).getMonth()) {
                    isPreRxMonthDataAvailable = true;
                    $scope.docAndDetails[$scope.docAndDetails.length - 1]['preDCRJunction'] = preDCRJunctionObj;
                }
            }

            cusomerDetails = $filter('getDataBasedOnDateFilter')(newCustomerAppointmentDetails, newCustomerDetails.Customer_Code__c, 'Account__r.Customer_Code__c');
            if (cusomerDetails.length > 0) {
                customerAppointmentDetails = cusomerDetails[0];
            }

            for (var i = 1; i <= 10; i++) {
                brandIdText = "Brand" + i + "__c";
                brand_r_obj_text = "Brand" + i + "__r";
                rxKeyName = "Rx_Month" + i + "__c";

                if (customerAppointmentDetails[brandIdText] != undefined) {

                    $scope.docAndDetails[$scope.docAndDetails.length - 1].attributes.push({
                        'brandName': customerAppointmentDetails[brand_r_obj_text].Name,
                        'brandId': customerAppointmentDetails[brandIdText],
                        'materialCode': null,
                        'materialName': $scope.locale.NoMaterials,
                        'quantity': 0,
                        'rxMonth': (isPreRxMonthDataAvailable && preDCRJunctionObj[rxKeyName] != 0 && preDCRJunctionObj[rxKeyName] != undefined) ? preDCRJunctionObj[rxKeyName] : 0,
                        'brandIndex': i
                    });
                }
            }
        };

        $scope.prevDoc = function() {
            if ($scope.currentDocAndDetailsIndex > 0) {
                $scope.currentDocAndDetailsIndex--;
            } else {
                $scope.currentDocAndDetailsIndex = $scope.docAndDetailsLength - 1;
            }
            dcrHelperService.setCurrentCustomerIndex($scope.currentDocAndDetailsIndex);
            $scope.currentDocAndDetails = $scope.docAndDetails[$scope.currentDocAndDetailsIndex];
            $timeout(function() {
                $scope.loadJFW();
            }, 100);
        };

        $scope.nextDoc = function() {
            if ($scope.currentDocAndDetailsIndex >= $scope.docAndDetailsLength - 1) {
                $scope.currentDocAndDetailsIndex = 0;
            } else {
                $scope.currentDocAndDetailsIndex++;
            }

            dcrHelperService.setCurrentCustomerIndex($scope.currentDocAndDetailsIndex);
            $scope.currentDocAndDetails = $scope.docAndDetails[$scope.currentDocAndDetailsIndex];
            $timeout(function() {
                $scope.loadJFW();
            }, 100);
        };





        $scope.navigateToAddCustomer = function() {

            window.ga.trackEvent('Navigate to Add Customer', 'click', 'Add customer', 20000);

            if ($rootScope.loggedUserDesignation == 'ZBM' || $rootScope.loggedUserDesignation == 'ABM') {
                navigationService.navigate('addDoc', {
                    'selectedTab': $rootScope.tabTitle,
                    'selectedDate': $scope.filterdatetime
                });
            } else {

                navigationService.navigate('dcrAddDoc', {
                    'selectedTab': $rootScope.tabTitle,
                    'selectedDate': $scope.filterdatetime
                });
            };
        };

        $scope.navigateToRemoveCustomer = function() {

            //Toggle the Remove flag
            $scope.removeFlag = !$scope.removeFlag;
            $scope.myClass = !$scope.myClass;
           window.ga.trackEvent('Navigate to Remove Customer', 'click', 'Remove customer', 20000);

            var customers = [];

            angular.forEach($scope.docAndDetails, function(value, index) {
                customers.push({
                    'name': value.name,
                    'JunctionId': value.DCR_Junction__c,
                    'isChecked': false,
                    'isDcr': value.recordType == "DCR" ? true : false
                });
            });

            $scope.removeDoctorInfoDetail = customers;
            $scope.removeCustomerSubTitleText = $scope.locale.RemoveCustomerPopupSubTitle;
            $scope.removeCustomerSubTitleText = $scope.removeCustomerSubTitleText.replace('%CUSTOMERTYPE%', $scope.removePopUpLabel);
            //Deprecating the old popup
           // popupService.openPopupWithTemplateUrl($scope, "app/modules/DCR/DCRRemoveDoc.html", '55%');
        };

        $scope.removeDoctor = function(index) {
           var removedDoctorNames=[];
            var removeDcotorsArray = $filter('filter')($scope.removeDoctorInfoDetail, {
                    'isChecked': true
                }, true),
                counter = removeDcotorsArray.length;
                angular.forEach(removeDcotorsArray, function(value, index) {
                   removedDoctorNames.push(value.name);
                });
            popupService.closePopup();
            $timeout(function() {
                if (counter > 0) {
                    popupService.DCRPopup(counter+ " Doctors were removed from the list ",removedDoctorNames , "EDIT", "DONE", '35%', function() {

                    }, function() {
                        var keyMessagesDeleteCriteria = [],
                            followupActivityDeleteCriteria = [],
                            brandActivityDeleteCriteria = [],
                            jfwDeleteCriteria = [],
                            dropDeleteCriteria = [],
                            junctionDeleteCriteria = [],
                            mtpDeleteCriteria = "",
                            removedIndexes = [],
                            filteredCustomerInNewCustomer = {},
                            filteredCustomerFromReportees = [];

                        angular.forEach($scope.removeDoctorInfoDetail, function(junctionValue, i) {

                            if (junctionValue.isChecked == true) {

                                angular.forEach($scope.docAndDetails[i].dcrKeyMessages, function(value, index) {
                                    if (value._soupEntryId != null && value._soupEntryId != undefined) {
                                        keyMessagesDeleteCriteria.push(value._soupEntryId);
                                    }
                                });

                                angular.forEach($scope.docAndDetails[i].dcrFollowupMessages, function(value, index) {
                                    if (value._soupEntryId != null && value._soupEntryId != undefined) {
                                        followupActivityDeleteCriteria.push(value._soupEntryId);
                                    }
                                });

                                angular.forEach($scope.docAndDetails[i].dcrJFWs, function(value, index) {
                                    if (value._soupEntryId != null && value._soupEntryId != undefined) {
                                        jfwDeleteCriteria.push(value._soupEntryId);
                                    }
                                });

                                angular.forEach(customerBrandActivityObj[i], function(value, index) {
                                    if (value._soupEntryId != null && value._soupEntryId != undefined) {
                                        brandActivityDeleteCriteria.push(value._soupEntryId);
                                    }
                                });

                                angular.forEach($scope.docAndDetails[i].attributes, function(value, index) {
                                    if (value.dcrDropId != null && value.dcrDropId != undefined) {
                                        dropDeleteCriteria.push(value.dcrDropId);
                                    }
                                });

                                if (junctionValue.JunctionId != null && junctionValue.JunctionId != undefined) {
                                    junctionDeleteCriteria.push(junctionValue.JunctionId);
                                }

                                filteredCustomerInNewCustomer = $filter('filter')($rootScope.newCustomersForSelectedDay, {
                                    "Account__c": $scope.docAndDetails[i].Account__c
                                });
                                if (filteredCustomerInNewCustomer.length > 0) {
                                    mtpDeleteCriteria = "" + filteredCustomerInNewCustomer[0]._soupEntryId;
                                    newCustomerCollectionInstance.removeEntitiesByIds([filteredCustomerInNewCustomer[0]._soupEntryId]);
                                }

                                filteredCustomerFromReportees = $filter('getDataBasedOnDateFilter')($scope.customerData_from_dcr.reporteesJFWs, $scope.docAndDetails[i].Account__c, 'DCR_Junction__r.Account__r.Id');
                                if (filteredCustomerFromReportees.length > 0) {
                                    filteredCustomerFromReportees[0].IsActive__c = false;
                                    reporteeJFWCollectionInstance.upsertEntities(filteredCustomerFromReportees);
                                }

                                //remove from MTP
                                var filteredDoc = $filter('getDataBasedOnDateFilter')($rootScope.mtpCustomerDetailsForSelectedDate, $scope.docAndDetails[i].Account__c, 'Assignment__r.Account__c'),
                                    mtpRemovedRecords = [];
                                if (filteredDoc.length > 0) {
                                    angular.forEach(filteredDoc, function(value, index) {
                                        var obj = {};
                                        obj.Id = value.Id;
                                        obj.Date__c = $scope.filterdatetime;
                                        mtpRemovedRecords.push(obj);
                                    });
                                    mtpRemoveConfigCollectionInstance.upsertEntities(mtpRemovedRecords).then(function(response) {
                                        $scope.customerData_from_dcr.mtpRemoveConfig.push(response[0]);
                                    });
                                }

                                removedIndexes.push(i);
                            }
                        });

                        dcrKeyMessageCollectionInstance.removeEntitiesByIds(keyMessagesDeleteCriteria);
                        dcrFollowupActivityCollectionInstance.removeEntitiesByIds(followupActivityDeleteCriteria);
                        dcrBrandActivityCollection.removeEntitiesByIds(brandActivityDeleteCriteria);
                        dcrJFWCollectionInstance.removeEntitiesByIds(jfwDeleteCriteria);
                        dcrDropCollection.removeEntitiesByIds(dropDeleteCriteria);
                        dcrJunctionCollection.removeEntitiesByIds(junctionDeleteCriteria);
                        kpiCollectorService.removeKPIs(junctionDeleteCriteria);

                        for (var i = $scope.docAndDetailsLength - 1; i >= 0; i--) {
                            for (var j = 0; j < removedIndexes.length; j++) {
                                if (removedIndexes[j] == i) {
                                    $scope.docAndDetails.splice(i, 1);
                                    customerBrandActivityObj.splice(i, 1);
                                }
                            }
                        }

                        for (var i = $rootScope.newCustomersForSelectedDay.length - 1; i >= 0; i--) {
                            for (var j = 0; j < removedIndexes.length; j++) {
                                if (removedIndexes[j] == i) {
                                    $rootScope.newCustomersForSelectedDay.splice(i, 1);
                                }
                            }
                        }

                        dcrHelperService.setCustomerDetails($scope.docAndDetails);
                        dcrHelperService.setDCRBrandActivity(customerBrandActivityObj);
                        $scope.docAndDetailsLength = $scope.docAndDetails.length;
                        if ($scope.currentDocAndDetailsIndex > ($scope.docAndDetails.length - 1)) {
                            $scope.currentDocAndDetailsIndex = ($scope.docAndDetails.length > 0) ? ($scope.docAndDetails.length - 1) : 0;
                        }

                        $scope.currentDocAndDetails = $scope.docAndDetails[$scope.currentDocAndDetailsIndex];
                        $timeout(function() {
                            if ($scope.currentDocAndDetails != undefined) {
                                //                        $rootScope.dcrGlobalId = $scope.currentDocAndDetails.DCR__c;
                                $scope.loadJFW();
                            } else {
                                //                        $rootScope.dcrGlobalId = null;
                                $scope.selectedSupervisorIds = [];
                                $("span").remove(".select");
                            }
                        }, 100);

                        //Reset remove 
                        $scope.removeFlag=false;
                    });
                }
            }, 1000);
        };

        $scope.removedDoc = function(index) {
            if ($scope.removeDoctorInfoDetail[index].isChecked == false) {
                $scope.removeDoctorInfoDetail[index].isChecked = true;
            } else {
                $scope.removeDoctorInfoDetail[index].isChecked = false;
            }
        };

        $scope.navigateToFieldWork = function(index) {
            navigationService.navigate('dcrList', {});

        }
        $scope.navigateToEnterCallDetails = function(index) {

            window.ga.trackEvent('Navigate to EnterCallDetails', 'click', 'EnterCallDetails', 20000);

            // $scope.saveDCRSoup(function() {
            //     dcrHelperService.setCustomerDetails($scope.docAndDetails);
            navigationService.navigate('dcrEnterCallDetails', {
                'customerType': $scope.customerType,
                'selectedDate': $scope.currentCalenderDate,

                'customerIndex': index

            });
            //});
        };

        $scope.navigateToOthers = function() {

            window.ga.trackEvent('Navigate To Others', 'click', 'Others', 20000);

            dcrHelperService.setCustomerDetails($scope.docAndDetails);
            navigationService.navigate('dcrCreateOthers');
        };

        $scope.navigateToActivitySelection = function() {

            window.ga.trackEvent('Navigate To Activity Selection', 'click', 'ActivitySelection', 20000);

            popupService.openConfirm($scope.locale.SelectActivity, $scope.locale.NavigateToActivitySelectionAlert, $scope.getLocale().No, $scope.getLocale().Yes, '55%', function() {

            }, function() {
                var dcrSoupEntryId = $rootScope.dcrGlobalId,
                    filteredCustomerInNewCustomer = $filter('filter')($rootScope.newCustomersForSelectedDay, {
                        "Date__c": $scope.filterdatetime
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
                        'Date__c': $scope.filterdatetime
                    }),
                    currentMTPRemoveSoupEntryIds = [];
                angular.forEach(MTPRemoveConfigRecord, function(value, index) {
                    currentMTPRemoveSoupEntryIds.push(value._soupEntryId);
                });

                mtpRemoveConfigCollectionInstance.removeEntitiesByIds(currentMTPRemoveSoupEntryIds);

                //Filtering dcr_drop data using dcr_id
                dcrDrop = $filter('filter')($scope.customerData_from_dcr.dcrDropData, {
                    "DCR__c": dcrSoupEntryId
                }, true);

                //up[dating material in hand quantity
                dcrDrop.forEach(function(value, index) {
                    var record = $filter('filter')(materialLotArray, {
                        'Id': value.Material_Lot__c
                    });
                    record[0].In_Hand_Quantity__c += value.Quantity__c;
                    materialLotCollection.upsertEntities(record);
                });
                // removing material transactions for current dcr
                materialTransactionCollection.fetchAll().then(materialTransactionCollection.fetchRecursiveFromCursor).then(function(materialTransactionList) {
                    var record = $filter('filter')(materialTransactionList, {
                        'Call_Date__c': $scope.filterdatetime
                    });
                    materialTransactionCollection.removeEntities(record);
                });
                // removing dcr_drop for current dcr
                dcrDropCollection.removeEntities(dcrDrop);

                $scope.fetchReporteesJFW().then(function(reporteeJFWList) {
                    reporteeJFWList = $filter('getDataBasedOnDateFilter')(reporteeJFWList, $scope.filterdatetime, 'DCR__r.Date__c');
                    reporteeJFWList = reporteeJFWList.map(function(reportee) {
                        reportee.IsActive__c = true;
                        return reportee;
                    });
                    reporteeJFWCollectionInstance.upsertEntities(reporteeJFWList);
                });
                if (dcrSoupEntryId != undefined) {
                    dcrCollectionInstance.removeEntitiesByIds([dcrSoupEntryId]);
                }

                activitySelectionCollectionInstance.clearSoup();
                navigationService.navigate('dcrActivitySelection', {
                    'dateDCR': $rootScope.DCRDate
                }, true);
            });
        };

        $scope.saveDCRSoup = function(success, failure, index) {

            if ($rootScope.dcrGlobalId != null) {
                success($rootScope.dcrGlobalId);
            } else {
                var dcr__c_obj = {},
                    selectedActivities = statusDCRActivty.getActivityStatus(),
                    today = $filter('date')(new Date(), 'yyyy-MM-dd'),
                    entry = [];

                if (selectedActivities[0] != undefined) {
                    dcr__c_obj.Activity1__c = selectedActivities[0].Id;
                    dcr__c_obj.Activity_Selection__c = "Full Day";
                }

                if (selectedActivities[1] != undefined) {
                    dcr__c_obj.Activity2__c = selectedActivities[1].Id;
                    dcr__c_obj.Activity_Selection__c = "Half Day";
                }

                dcr__c_obj.Date__c = $scope.filterdatetime;
                dcr__c_obj.Division__c = currentUser.Division;
                dcr__c_obj.DCR_Filed_Date__c = today;
                dcr__c_obj.Territory_Code__c = currentTarget.Territory__c + ';';
                dcr__c_obj.User__c = currentUser.Id;
                dcr__c_obj.Deviation_Comment__c = "";
                dcr__c_obj.Summary_Comment__c = "";
                dcr__c_obj.Company_Code__c = currentUser.CompanyName;
                dcr__c_obj.isMobileDCR__c = true;
                dcr__c_obj.Status__c = "Saved";

                entry.push(dcr__c_obj);
                dcrCollectionInstance.upsertEntities(entry).then(function(response) {
                    $rootScope.dcrGlobalId = response[0]._soupEntryId;
                    $scope.docAndDetails[index].DCR__c = response[0]._soupEntryId;
                    if (success)
                        success(response[0]._soupEntryId, index);
                }).catch(function(error) {
                    console.log(error);
                    if (failure)
                        failure();
                });
            }
        };

        $scope.saveDoctorNotesAndObjectives = function(dcr_junction__c_obj, index) {
            if ($scope.customerType === "Doctor") {
                dcr_junction__c_obj.Post_call_Note__c = $scope.docAndDetails[index].lastCallComments;
                dcr_junction__c_obj.Next_Call_Objective__c = $scope.docAndDetails[index].nextCallObjectives;
            }
        };

        $scope.saveDoctorNotesAndObjectivesWithUpsert = function(dcr_junction__c_obj, index) {
            if ($scope.customerType === "Doctor") {
                $scope.saveDoctorNotesAndObjectives(dcr_junction__c_obj, index);
                return dcrJunctionCollection.upsertEntities(dcr_junction__c_obj);
            } else {
                return $q.when();
            }
        };

        $scope.saveDCRJunctionSoup = function(dcrId, success, failure, isFromPOBPopup, index) {

            var dcr_junction__c_obj = {},
                today = $filter('date')(new Date(), 'yyyy-MM-dd'),
                // lastVisitDate = $scope.currentDocAndDetails.lastVisitDate,
                lastVisitDate = new Date($scope.currentCalenderDate),
                entry = [];
            if ($scope.docAndDetails[index].dcrJunction == undefined) {

                dcr_junction__c_obj.Sequence_Number__c = $scope.docAndDetails[index].sortIndex;
                dcr_junction__c_obj.DCR__c = dcrId;
                dcr_junction__c_obj.Local_DCR__c = dcrId;
                dcr_junction__c_obj.Account__c = $scope.docAndDetails[index].Account__c;
                dcr_junction__c_obj.Assignment__c = $scope.docAndDetails[index].assignment__c;
                dcr_junction__c_obj.Patch__c = $scope.docAndDetails[index].patchCode;
                if (lastVisitDate != $scope.locale.NotFound || lastVisitDate != undefined || lastVisitDate != "")
                    dcr_junction__c_obj.Last_Visit_Date__c = lastVisitDate;
                else
                    dcr_junction__c_obj.Last_Visit_Date__c = null;
                if ($scope.customerType != "Doctor") {
                    dcr_junction__c_obj.POB__c = $scope.docAndDetails[index].POB__c;
                    //popupService.closePopup();
                }

                //$scope.saveDoctorNotesAndObjectives(dcr_junction__c_obj);

                if ($scope.customerType != "Doctor") {
                    dcr_junction__c_obj.POB__c = $scope.docAndDetails[index].POB__c;
                    popupService.closePopup();
                }

                angular.forEach($scope.docAndDetails[index].attributes, function(value, index) {
                    if (index <= 9) {
                        dcr_junction__c_obj["Brand" + (index + 1) + "__c"] = value.brandId;
                        dcr_junction__c_obj["Rx_Month" + (index + 1) + "__c"] = value.rxMonth;
                    }
                });
            } else {

                dcr_junction__c_obj = $scope.docAndDetails[index].dcrJunction;
                //if (isFromPOBPopup)
                {
                    if ($scope.customerType != "Doctor") {
                        dcr_junction__c_obj.POB__c = $scope.docAndDetails[index].POB__c;
                        //popupService.closePopup();
                    }
                }
            }
            dcr_junction__c_obj.JFW_None_Check__c = false;
            angular.forEach($scope.selectedSupervisorIds[index], function(value, index) {
                if (value.id == "NONE") {
                    dcr_junction__c_obj.JFW_None_Check__c = true;
                }
            });

            entry.push(dcr_junction__c_obj);

            dcrJunctionCollection.upsertEntities(entry).then(function(response) {
                $scope.docAndDetails[index].dcrJunction = response[0];
                $scope.docAndDetails[index].DCR_Junction__c = response[0]._soupEntryId;
                if (success)
                    success(response[0]._soupEntryId, index);

            }).catch(function(error) {
                console.log(error);
                if (failure)
                    failure();
            });
        };

        var checkIfJFWSaveAllowed = function(index) {

            var isSaveAllowed = true;
            if ($scope.customerType == "Doctor") {
                if ($scope.selectedSupervisorIds[index].length == 0) {
                    isSaveAllowed = false;
                    popupService.openPopup($scope.locale.JFWSelectAlert, $scope.locale.OK, '35%');
                } else {
                    if ($scope.selectedSupervisorIds[index].length > 1) {
                        var FilteredNONERecord = $filter('filter')($scope.selectedSupervisorIds[index], {
                            "id": "NONE"
                        });
                        if (FilteredNONERecord.length > 0) {
                            isSaveAllowed = false;
                            popupService.openPopup($scope.locale.JFWNoneWithOthersSelectionAlert, $scope.locale.OK, '35%');
                        }
                    }
                }
            } else {
                isSaveAllowed = true;
            }
            return isSaveAllowed;
        };

        $scope.save = function(isFromPOBPopup, index) {

            window.ga.trackEvent('Save DCR', 'click', 'Save', 20000);

            var timeout = 0;
            if (isFromPOBPopup) {
                popupService.closePopup();
                timeout = 1000;
            }

            $timeout(function() {
                if (checkIfJFWSaveAllowed(index)) {
                    if ($rootScope.dcrGlobalId == null) {
                        $scope.saveDCRSoup(function(dcrId, index) {
                            $scope.saveDCRJunctionSoup(dcrId, function(dcrJunctionId, index) {
                                kpiCollectorService.saveKPIs(dcrId, dcrJunctionId);
                                $scope.docAndDetails[index].recordType = "DCR";
                                $scope.saveDCRJFW(dcrJunctionId, dcrId, index);
                                $scope.saveDCRDrop(dcrJunctionId, dcrId, index);
                                $rootScope.$broadcast("saveBrand", index);
                            }, undefined, undefined, index);
                        }, undefined, index);
                    } else if ($rootScope.dcrGlobalId != null && $scope.docAndDetails[index].DCR_Junction__c == null) {
                        $scope.docAndDetails[index].DCR__c = $rootScope.dcrGlobalId;
                        $scope.docAndDetails[index].Local_DCR__c = $rootScope.dcrGlobalId;
                        $scope.saveDCRJunctionSoup($rootScope.dcrGlobalId, function(dcrJunctionId, index) {

                            kpiCollectorService.saveKPIs($rootScope.dcrGlobalId, dcrJunctionId);
                            $scope.docAndDetails[index].recordType = "DCR";
                            $scope.saveDCRJFW(dcrJunctionId, $rootScope.dcrGlobalId, index);
                            $scope.saveDCRDrop(dcrJunctionId, $rootScope.dcrGlobalId, index);
                            $rootScope.$broadcast("saveBrand", index);
                        }, undefined, undefined, index);
                    } else {

                        //$scope.saveDoctorNotesAndObjectivesWithUpsert($scope.docAndDetails[index].dcrJunction).then(function() {
                        var currentJFWSoupEntryIds = [];
                        angular.forEach($scope.docAndDetails[index].dcrJFWs, function(value, index) {
                            currentJFWSoupEntryIds.push(value._soupEntryId);
                        });
                        //if (isFromPOBPopup)
                        {
                            $scope.saveDCRJunctionSoup($rootScope.dcrGlobalId, null, null, isFromPOBPopup, index);
                        }
                        dcrJFWCollectionInstance.removeEntitiesByIds(currentJFWSoupEntryIds).then(function() {
                            kpiCollectorService.saveKPIs($rootScope.dcrGlobalId, $scope.docAndDetails[index].DCR_Junction__c);
                            $scope.saveDCRJFW($scope.docAndDetails[index].DCR_Junction__c, $rootScope.dcrGlobalId, index);
                            $rootScope.$broadcast("saveBrand", index);
                        });
                        //});
                    }
                }
            }, timeout);
        };

        $scope.saveDCRJFW = function(dcrJunctionId, dcrId, index) {
            var entry = [];
            angular.forEach($scope.selectedSupervisorIds[index], function(value, index) {
                if (value.id != "NONE") {
                    var dcr_jfw__c_obj = {},
                        fieldActivityRecord = $filter('filter')(statusDCRActivty.getActivityStatus(), {
                            "Name": "Field Work"
                        });
                    if (fieldActivityRecord != undefined && fieldActivityRecord.length > 0) {
                        dcr_jfw__c_obj.Activity_Master__c = fieldActivityRecord[0].Id;
                    }

                    dcr_jfw__c_obj.User1__c = currentUser.Id;
                    dcr_jfw__c_obj.DCR_Junction__c = dcrJunctionId;
                    dcr_jfw__c_obj.DCR__c = dcrId;
                    dcr_jfw__c_obj.User2__c = value.id;
                    dcr_jfw__c_obj.User_Type__c = value.designation;
                    dcr_jfw__c_obj.Sequence_Number__c = index;
                    // local mapping
                    dcr_jfw__c_obj.Local_DCR_Junction__c = dcrJunctionId;
                    dcr_jfw__c_obj.Local_DCR__c = dcrId;

                    entry.push(dcr_jfw__c_obj);

                }
            });

            dcrJFWCollectionInstance.upsertEntities(entry).then(function(response) {
                $scope.docAndDetails[index].dcrJFWs = response;
            }).catch(function(error) {
                console.log(error);
            });

        };

        $scope.saveDCRDrop = function(dcrJunctionId, dcrId, index) {
            var entry = [];

            angular.forEach($scope.docAndDetails[index].attributes, function(value, index) {
                if (value.materialCode != null) {
                    var dcr_drop__c_obj = {};
                    dcr_drop__c_obj.DCR_Junction__c = dcrJunctionId;
                    dcr_drop__c_obj.DCR__c = dcrId;
                    dcr_drop__c_obj.Divisionwise_Brand__c = value.brandId;

                    dcr_drop__c_obj.Material_Lot__c = value.materialCode;
                    dcr_drop__c_obj.Quantity__c = value.quantity;

                    // local mapping
                    dcr_jfw__c_obj.Local_DCR_Junction__c = dcrJunctionId;
                    dcr_jfw__c_obj.Local_DCR__c = dcrId;
                    entry.push(dcr_drop__c_obj);
                }
            });

            dcrDropCollection.upsertEntities(entry).then(function(response) {
                angular.forEach(response, function(value, index) {
                    var index = $scope.getAllIndexes($scope.docAndDetails[index].attributes, "materialCode", value.Material_Lot__c);
                    $scope.docAndDetails[index].attributes[index[0]].dcrDropId = value._soupEntryId;
                });
            }).catch(function(error) {
                console.log(error);
            });
        };

        $scope.updatePOB = function() {
            popupService.openPopupWithTemplateUrl($scope, 'app/modules/DCR/DCRPOBInputPopup.html', '35%')
        };

        $scope.getAllIndexes = function(array, attr, value) {
            var indexes = [],
                i;
            for (i = 0; i < array.length; i++) {
                if (array[i].hasOwnProperty(attr) && array[i][attr] === value)
                    indexes.push(i);
            }
            return indexes;
        };

        $scope.filterCustomer = function(dataSource) {
            var resultArray = [];
            angular.forEach(dataSource, function(value, index) {

                if (value.Assignment__r.Account__r.RecordType.Name == "Other" || value.Assignment__r.Account__r.RecordType.Name == "Hospital" || value.Assignment__r.Account__r.RecordType.Name == "Service Provider") {
                    resultArray.push(dataSource[index]);
                }
            });

            return resultArray;
        };

        $scope.deselectItemsFromList = function(deselected) {
            for (var i = 0; i < $scope.selectedSupervisorIds.length; i++) {
                if ($scope.selectedSupervisorIds[i].id == deselected.id) {
                    $scope.selectedSupervisorIds.splice(i, 1);
                }
            }
        };

        $scope.formatPatch = function(patchName) {
            if (patchName != undefined) {
                var FormattedPatchName = (patchName.length > 25) ? patchName.slice(0, 25) + "..." : patchName;
                return FormattedPatchName;
            }
        };





    }
]);