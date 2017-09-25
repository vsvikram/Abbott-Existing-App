abbottApp.controller('summaryController', ['$scope', '$filter', '$rootScope', 'dcrHelperService', 'navigationService', 'abbottConfigService', 'popupService', 'statusDCRActivty', '$timeout', 'TABS_TYPES', 'utils', 'mtpRemoveConfigCollection', 'dcrCollection', 'dcrJFWCollection', 'dcrJunctionCollection', 'newCustomerCollection', 'mtpAppointmentDetails1Collection', 'campaignCollection', 'campaignBrandActivityCollection', 'dcrBrandActivityCollection', 'brandActivityCollection', 'reporteeJFWCollection', 'userCollection', 'assigmentDetailCollection', 'targetCollection', 'greenFlagCollection', 'activitySelectionCollection', 'materialLotCollection', 'materialTransactionCollection', 'dcrDropCollection',
function ($scope, $filter, $rootScope, dcrHelperService, navigationService, abbottConfigService, popupService, statusDCRActivty, $timeout, TABS_TYPES, utils, mtpRemoveConfigCollection, dcrCollection, dcrJFWCollection, dcrJunctionCollection, newCustomerCollection, mtpAppointmentDetails1Collection, campaignCollection, campaignBrandActivityCollection, dcrBrandActivityCollection, brandActivityCollection, reporteeJFWCollection, userCollection, assigmentDetailCollection, targetCollection, greenFlagCollection, activitySelectionCollection, materialLotCollection, MaterialTransactionCollection, dcrDropCollection) {
    $scope.transperantConfig.display = false;
    var strTemp = "",
       usersList = [],
       targetsList = [],
       currentUser = {},
       dcrData = [],
       dcrJunctionData = [],
       dcrJFWData = [],
       mtpRemoveConfigData = [],
       campaignsData = [],
       corporateInitiativesData = [],
       dcrBrandActivityData = [],
       brandActivities = [],
       dcrCollectionInstance = new dcrCollection(),
       newCustomerCollectionInstance = new newCustomerCollection(),
       mtpRemoveConfigCollectionInstance = new mtpRemoveConfigCollection(),
       greenFlagCollectionInstance = new greenFlagCollection(),
       activitySelectionCollectionInstance = new activitySelectionCollection(),
       materialLotCollectionInstance = new materialLotCollection(),
       materialTransactionCollectionInstance = new MaterialTransactionCollection(),
       dcrDropCollectionInstance = new dcrDropCollection(),
       appointmentDetails = null,
       userType = '',
       dcrDropData = [],
       materialLotArray = [],
       JFWCount = 0,
       junctionCount = 0;
    $scope.locale = abbottConfigService.getLocale();

    $scope.releaseResources = function () {
        dcrData = [];
        dcrJunctionData = [];
        dcrJFWData = [];
        dcrDropData = [];
        materialLotArray = [];
        mtpRemoveConfigData = [];
        campaignsData = [];
        corporateInitiativesData = [];
        dcrBrandActivityData = [];
        brandActivities = [];
        usersList = [];
        targetsList = [];
        currentUser = {};
        appointmentDetails = null;
        $scope.detailInfoDoctors = [];
        $scope.detailInfoChemists = [];
        $scope.detailInfoStockists = [];
        $scope.detailInfoOthers = [];
        $scope.JFWNamesOther = [];
        $scope.JFWNamesDoctor = [];
        $scope.JFWNamesStockist = [];
        $scope.JFWNamesChemist = [];
        $scope.activityArray = [];
        $scope.JFWNames = [];
    };

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
        if (fromState.url == "/dcrCreate") {
            if ($scope.tabTabType == TABS_TYPES.SUMMARY) {
                $scope.releaseResources();
            }
        }
    });

    $scope.init = function () {

        window.ga.trackView('Summary');
        window.ga.trackTiming('Summary Load Start Time', 20000, 'summaryLoadStart', 'Summary Tab Load Start');

        $scope.detailInfoDoctors = [];
        $scope.detailInfoChemists = [];
        $scope.detailInfoStockists = [];
        $scope.detailInfoOthers = [];
        $scope.JFWNamesOther = [];
        $scope.JFWNamesDoctor = [];
        $scope.JFWNamesStockist = [];
        $scope.JFWNamesChemist = [];
        $scope.transperantConfig = abbottConfigService.getTransparency();
        $scope.transperantConfig.display = true;
        $scope.transperantConfig.showBusyIndicator = true;
        $scope.transperantConfig.showTransparancy = true;
        abbottConfigService.setTransparency($scope.transperantConfig);

        $scope.activityArray = [];
        $scope.JFWNames = [];

        $scope.disableEdit = $rootScope.disablingEdit;
        $scope.filterdatetime = $filter('date')($scope.currentCalenderDate, 'yyyy-MM-dd');

        $scope.loadUserData()
      .then($scope.getDCR__c_data)
      .then($scope.getDCR_Junction__c_data)
      .then($scope.get_DCR_JFW__c_data)
      .then($scope.getNewCustomers)
      .then($scope.getMTPCustomerAppointments)
      .then($scope.getMTPRemoveConfig)
      .then($scope.getCorporateInitiative)
      .then($scope.getCampaigns)
      .then($scope.getDCR_Brand_Activity__c_data)
      .then($scope.getBrandActivities)
      .then($scope.getMaterialData)
        .then($scope.getDCR_Drop__c_data)
      .then(new assigmentDetailCollection().fetchUserAssignmentDetails)
      .then($scope.setup);
    };

    $scope.loadUserData = function () {
        var userCollectionInstance = new userCollection(),
          targetCollectionInstance = new targetCollection();
        return userCollectionInstance.fetchAllCollectionEntities().then(function (allUsers) {
            usersList = allUsers;
        }).then(userCollectionInstance.getActiveUser).then(function (activeUser) {
            currentUser = activeUser;
            userType = activeUser.Designation__c;
        }).then(targetCollectionInstance.fetchAllCollectionEntities).then(function (targets) {
            targetsList = targets;
        })
    };

    $scope.getMTPRemoveConfig = function () {
        return mtpRemoveConfigCollectionInstance.fetchAll().then(mtpRemoveConfigCollectionInstance.fetchRecursiveFromCursor).then(function (mtpRemoveConfigList) {
            mtpRemoveConfigData = mtpRemoveConfigList;
            return mtpRemoveConfigList;
        });
    };

    //Fetch DCR__c soup records
    $scope.getDCR__c_data = function () {
        return dcrCollectionInstance.fetchAll().then(dcrCollectionInstance.fetchRecursiveFromCursor).then(function (dcrList) {
            dcrData = dcrList;
            return dcrList;
        });
    };

    //Fetch DCR_JFW__c soup records
    $scope.get_DCR_JFW__c_data = function () {
        var dcrJFWCollectionInstance = new dcrJFWCollection();
        return dcrJFWCollectionInstance.fetchAll().then(dcrJFWCollectionInstance.fetchRecursiveFromCursor).then(function (dcrJFWList) {
            dcrJFWData = dcrJFWList;
            return dcrJFWList;
        });
    };

    //Fetch DCR_Junction__c soup records
    $scope.getDCR_Junction__c_data = function () {
        var dcrJunctionCollectionInstance = new dcrJunctionCollection();
        return dcrJunctionCollectionInstance.fetchAll().then(dcrJunctionCollectionInstance.fetchRecursiveFromCursor).then(function (dcrJunctionList) {
            dcrJunctionData = dcrJunctionList;
            return dcrJunctionList;
        });
    };

    $scope.getNewCustomers = function () {
        return newCustomerCollectionInstance.fetchAll().then(newCustomerCollectionInstance.fetchRecursiveFromCursor).then(function (newCustomerList) {
            $rootScope.newCustomersForSelectedDay = newCustomerList;
            return newCustomerList;
        });
    };

    $scope.getMTPCustomerAppointments = function () {
        var mtpAppointmentDetails1CollectionInstance = new mtpAppointmentDetails1Collection();
        return mtpAppointmentDetails1CollectionInstance.fetchAll().then(mtpAppointmentDetails1CollectionInstance.fetchRecursiveFromCursor).then(function (mtpAppointmentDetails1List) {
            $rootScope.mtpCustomerDetailsForSelectedDate = mtpAppointmentDetails1List;
            return mtpAppointmentDetails1List;
        });
    };

    $scope.getCorporateInitiative = function () {
        var campaignCollectionInstance = new campaignCollection();
        return campaignCollectionInstance.fetchAll().then(campaignCollectionInstance.fetchRecursiveFromCursor).then(function (campaignList) {
            corporateInitiativesData = campaignList;
            return campaignList;
        });
    };

    $scope.getCampaigns = function () {
        var campaignBrandActivityCollectionInstance = new campaignBrandActivityCollection();
        return campaignBrandActivityCollectionInstance.fetchAll().then(campaignBrandActivityCollectionInstance.fetchRecursiveFromCursor).then(function (campaignBrandActivityList) {
            campaignsData = $filter('getDataBasedOnDateFilter')(campaignBrandActivityList, 'Out-Clinic', 'Activity_Type__c');
            return campaignsData;
        });
    };

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

    //Fetch DCR_Drop__c soup records
    $scope.getDCR_Drop__c_data = function () {
        return dcrDropCollectionInstance.fetchAll()
          .then(dcrDropCollectionInstance.fetchRecursiveFromCursor)
          .then(function (dcrDropList) {
              dcrDropData = dcrDropList;
              return dcrDropList;
          });
    };

    //Fetch DCR_Brand_Activity soup records
    $scope.getDCR_Brand_Activity__c_data = function () {
        var dcrBrandActivityCollectionInstance = new dcrBrandActivityCollection();
        return dcrBrandActivityCollectionInstance.fetchAll().then(dcrBrandActivityCollectionInstance.fetchRecursiveFromCursor).then(function (dcrBrandActivityList) {
            dcrBrandActivityData = dcrBrandActivityList;
            return dcrBrandActivityList;
        });
    };

    $scope.getBrandActivities = function () {
        var brandActivityCollectionInstance = new brandActivityCollection();
        return brandActivityCollectionInstance.fetchAll().then(brandActivityCollectionInstance.fetchRecursiveFromCursor).then(function (brandActivityList) {
            brandActivities = brandActivityList;
            return brandActivityList;
        });
    };

    var dcrDataForSelectedDay = [],
       dcrJunctionDataForSelectedDay = [],
       dcrJFWDataForSelectedDay = [],
       dcrJunctionDataTemp = [],
       newCustomersFiltered = [],
       mtpRecord = {},
       name = '',
       customerCode = '',
       designation = '',
       customerType = '',
       mobileNumber ='',
       dcrJFWs ='',
       dcrJFWNames =''

    $scope.updateSoupEntryId = function (data) {
        angular.forEach(data, function (value, index) {
            if (value.Id != null) {
                value._soupEntryId = value.Id;
            }
        });
    };

    $scope.setup = function (appointmentDetails) {

        //Filtered based on date
        $rootScope.mtpCustomerDetailsForSelectedDate = $filter('getDataBasedOnDateFilter')($rootScope.mtpCustomerDetailsForSelectedDate, $scope.filterdatetime, 'MTP_Cycle__r.Date__c');
        // remove deactivated doctors
        for (var i = $rootScope.mtpCustomerDetailsForSelectedDate.length - 1; i >= 0; i--) {
            var docAssigns = $filter('filter')(appointmentDetails, { 'Id': $rootScope.mtpCustomerDetailsForSelectedDate[i].Assignment__c });
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

        if ($scope.disableEdit) {
            //updating soupEntryId with Id value if Id is not null
            $scope.updateSoupEntryId(dcrData);
            $scope.updateSoupEntryId(dcrJunctionData);
            $scope.updateSoupEntryId(dcrJFWData);
            $scope.updateSoupEntryId(dcrBrandActivityData);
            $scope.updateSoupEntryId(campaigns);
            $scope.updateSoupEntryId(corporateInitiatives);
        }

        $rootScope.dcrGlobalId = null;
        dcrDataForSelectedDay = $filter('filter')(dcrData, {
            "Date__c": $scope.filterdatetime
        });
        angular.forEach(dcrDataForSelectedDay, function (value, index) {
            $scope.deviation = value.Deviation_Comment__c;
            $scope.summary = value.Summary_Comment__c;

            dcrJunctionData = $filter('filterEmpty')(dcrJunctionData, 'DCR_Brand_Activity__c');
            //filter for CME Symposia
            dcrJunctionData = $filter('filterNonEmpty')(dcrJunctionData, 'Account__c');
            //Non empty Account records

            dcrJunctionDataTemp = $filter('getDataBasedOnDateFilter')(dcrJunctionData, value._soupEntryId, 'DCR__c');

            angular.forEach(dcrJunctionDataTemp, function (value, index) {
                dcrJunctionDataForSelectedDay.push(value);
            });
            $rootScope.dcrGlobalId = value._soupEntryId;
        });

        $rootScope.newCustomersForSelectedDay = $filter('filter')($rootScope.newCustomersForSelectedDay, {
            "Date__c": $scope.filterdatetime
        });

        $scope.checkIfAllMTPsFiledToDCR();

        if (dcrJunctionDataForSelectedDay.length > 0) {
            if (dcrJunctionDataForSelectedDay[0].Sequence_Number__c != undefined) {
                dcrJunctionDataForSelectedDay = $filter('toNumber')(dcrJunctionDataForSelectedDay, 'Sequence_Number__c');
                dcrJunctionDataForSelectedDay = $filter('orderBy')(dcrJunctionDataForSelectedDay, 'Sequence_Number__c');
            } else {
                dcrJunctionDataForSelectedDay = $filter('orderBy')(dcrJunctionDataForSelectedDay, 'Name');
            }
        }






        angular.forEach(dcrJunctionDataForSelectedDay, function (value, index) {
            $scope.docFlag = 0;
            $scope.chemFlag = 0;
            $scope.stockFlag = 0;
            $scope.otherFlag = 0;

            if (value.Account__c != undefined) {
                dcrJFWDataForSelectedDay = $filter('filter')(dcrJFWData, {
                    "DCR_Junction__c": value._soupEntryId
                }, true);
                dcrJFWDataForSelectedDay = $filter('filterEmpty')(dcrJFWDataForSelectedDay, 'Brand_Activity__c');
                if (dcrJFWDataForSelectedDay.length > 0) {
                    if (dcrJFWDataForSelectedDay[0].Sequence_Number__c != undefined) {
                        dcrJFWDataForSelectedDay = $filter('toNumber')(dcrJFWDataForSelectedDay, 'Sequence_Number__c');
                        dcrJFWDataForSelectedDay = $filter('orderBy')(dcrJFWDataForSelectedDay, 'Sequence_Number__c');
                    } else {
                        dcrJFWDataForSelectedDay = $filter('orderBy')(dcrJFWDataForSelectedDay, 'Name');
                    }
                }

                newCustomersFiltered = $filter('filter')($rootScope.newCustomersForSelectedDay, {
                    "Account__c": value.Account__c
                });

                if (newCustomersFiltered.length > 0) {
                    name = newCustomersFiltered[0].Name;
                    customerCode = newCustomersFiltered[0].Customer_Code__c;
                    patch = newCustomersFiltered[0].Patch;
                    designation = newCustomersFiltered[0].Designation;
                    customerType = newCustomersFiltered[0].CustomerType;
                    mobileNumber = newCustomersFiltered[0].Phone;

                } else {

                    if (!$scope.disableEdit) {
                        mtpRecord = $filter('getDataBasedOnDateFilter')($rootScope.mtpCustomerDetailsForSelectedDate, value.Account__c, "Assignment__r.Account__c");
                        if (mtpRecord.length > 0) {
                            name = mtpRecord[0].Assignment__r.Account__r.Name;
                            customerCode = mtpRecord[0].Assignment__r.Account__r.Customer_Code__c;
                            patch = mtpRecord[0].Patch__r.Name;
                            designation = mtpRecord[0].Assignment__r.Account__r.Speciality__c;
                            customerType = mtpRecord[0].Assignment__r.Account__r.RecordType.Name;
                            mobileNumber =  mtpRecord[0].Assignment__r.Account__r.RecordType.Phone;
                        }
                    } else {
                        if (userType != 'ZBM') {
                            mtpRecord = $filter('filter')(appointmentDetails, {
                                "Account__c": dcrJunctionDataForSelectedDay[index].Account__c
                            });
                        } else {
                            var ABMUsersData = $filter('designationFilter')(targetsList, 'ABM');
                            for (var i = 0; i < ABMUsersData.length; i++) {
                                mtpRecord = $filter('filter')(appointmentDetails[ABMUsersData[i].Territory__c], {
                                    "Account__c": dcrJunctionDataForSelectedDay[index].Account__c
                                });
                                if (mtpRecord != undefined && mtpRecord.length > 0) {
                                    break;
                                }
                            }
                        }

                        if (mtpRecord && mtpRecord.length > 0) {
                            name = mtpRecord[0].Account__r.Name;
                            customerCode = mtpRecord[0].Account__r.Customer_Code__c;
                            patch = mtpRecord[0].Patch_Name__c;
                            designation = mtpRecord[0].Speciality__c;
                            customerType = mtpRecord[0].Account__r.RecordType.Name;
                            mobileNumber =  mtpRecord[0].Account__r.RecordType.Phone;
                        }
                    }
                }

                if (customerType == 'Doctor') {
                    if (designation == null) {
                        designation = $scope.locale.None;
                    }

                    for (var j = 0; j < $scope.detailInfoDoctors.length; j++) {
                        if (customerCode == $scope.detailInfoDoctors[j].customerCode) {
                            $scope.docFlag = 1;
                            break;
                        }
                    }


                    if ($scope.docFlag == 0) {
                        $scope.detailInfoDoctors.push({
                            'name': name,
                            'customerCode': customerCode,
                            'designation': designation,
                            'customerType': customerType,
                            'dcrJFWs': dcrJFWDataForSelectedDay,
                            'patch': patch,
                            'mobileNumber': mobileNumber,
                            'dcrJFWNames' : getDCRJFWNames(dcrJFWDataForSelectedDay)
                        });
                    }

                }
                if (customerType == 'Chemist') {
                    if (designation == null) {
                        designation = $scope.locale.None;
                    }

                    for (var j = 0; j < $scope.detailInfoChemists.length; j++) {
                        if (customerCode == $scope.detailInfoChemists[j].customerCode) {
                            $scope.chemFlag = 1;
                            break;
                        }
                    }



                    if ($scope.chemFlag == 0) {
                        $scope.detailInfoChemists.push({
                            'name': name,
                            'customerCode': customerCode,
                            'designation': designation,
                            'customerType': customerType,
                            'dcrJFWs': dcrJFWDataForSelectedDay,
                            'patch': patch,
                            'dcrJFWNames' : getDCRJFWNames(dcrJFWDataForSelectedDay)
                        });
                    }
                }
                if (customerType == 'Stockist') {
                    if (designation == null) {
                        designation = $scope.locale.None;
                    }
                    for (var j = 0; j < $scope.detailInfoStockists.length; j++) {
                        if (customerCode == $scope.detailInfoStockists[j].customerCode) {
                            $scope.stockFlag = 1;
                            break;
                        }
                    }



                    if ($scope.stockFlag == 0) {
                        $scope.detailInfoStockists.push({
                            'name': name,
                            'customerCode': customerCode,
                            'designation': designation,
                            'customerType': customerType,
                            'dcrJFWs': dcrJFWDataForSelectedDay,
                            'patch': patch,
                            'dcrJFWNames' : getDCRJFWNames(dcrJFWDataForSelectedDay)
                        });
                    }
                }
                if (customerType == 'Other') {
                    if (designation == null) {
                        designation = $scope.locale.None;
                    }
                    for (var j = 0; j < $scope.detailInfoOthers.length; j++) {
                        if (customerCode == $scope.detailInfoOthers[j].customerCode) {
                            $scope.otherFlag = 1;
                            break;
                        }
                    }



                    if ($scope.otherFlag == 0) {
                        $scope.detailInfoOthers.push({
                            'name': name,
                            'customerCode': customerCode,
                            'designation': designation,
                            'customerType': customerType,
                            'dcrJFWs': dcrJFWDataForSelectedDay,
                            'patch': patch,
                            'dcrJFWNames' : getDCRJFWNames(dcrJFWDataForSelectedDay)
                        });
                    }
                }
            }
        });



        for (var i in $scope.detailInfoDoctors) {
            strTemp = "";
            for (var j in $scope.detailInfoDoctors[i].dcrJFWs) {
                var userObjDoctors = getJFWUserName($scope.detailInfoDoctors[i].dcrJFWs[j].User2__c)[0],
                designation = (userObjDoctors != undefined && userObjDoctors.Designation) ? "(" + userObjDoctors.Designation + ")" : '',
                strTemp = strTemp + ", " + ((userObjDoctors != undefined && userObjDoctors.Name) ? userObjDoctors.Name : '') + designation;
            }
            strTemp = strTemp.substring(2, strTemp.length);

            $scope.JFWNamesDoctor.push(strTemp);
        }

        for (var i in $scope.detailInfoChemists) {
            strTemp = "";
            for (var j in $scope.detailInfoChemists[i].dcrJFWs) {
                var userObjChemist = getJFWUserName($scope.detailInfoChemists[i].dcrJFWs[j].User2__c)[0],
                designation = (userObjChemist != undefined && userObjChemist.Designation) ? "(" + userObjChemist.Designation + ")" : '',
                strTemp = strTemp + ", " + ((userObjChemist != undefined && userObjChemist.Name) ? userObjChemist.Name : '') + designation;
            }
            strTemp = strTemp.substring(2, strTemp.length);
            $scope.JFWNamesChemist.push(strTemp);
        }


        for (var i in $scope.detailInfoStockists) {
            strTemp = "";
            for (var j in $scope.detailInfoStockists[i].dcrJFWs) {
                var userObjStockist = getJFWUserName($scope.detailInfoStockists[i].dcrJFWs[j].User2__c)[0],
                designation = (userObjStockist != undefined && userObjStockist.Designation) ? "(" + userObjStockist.Designation + ")" : '',
                strTemp = strTemp + ", " + ((userObjStockist != undefined && userObjStockist.Name) ? userObjStockist.Name : '') + designation;
            }
            strTemp = strTemp.substring(2, strTemp.length);
            $scope.JFWNamesStockist.push(strTemp);
        }


        for (var i in $scope.detailInfoOthers) {
            strTemp = "";
            for (var j in $scope.detailInfoOthers[i].dcrJFWs) {
                var userObjOthers = getJFWUserName($scope.detailInfoOthers[i].dcrJFWs[j].User2__c)[0],
                designation = (userObjOthers != undefined && userObjOthers.Designation) ? "(" + userObjOthers.Designation + ")" : '',
                strTemp = strTemp + ", " + ((userObjOthers != undefined && userObjOthers.Name) ? userObjOthers.Name : '') + designation;
            }
            strTemp = strTemp.substring(2, strTemp.length);
            $scope.JFWNamesOther.push(strTemp);
        }

        if (statusDCRActivty.getActivityStatus().length > 0) {
            $scope.activityArray = statusDCRActivty.getActivityStatus();
        }
        $scope.activityString = "";
        for (var i = 0; i < $scope.activityArray.length; i++) {
            $scope.activityString = $scope.activityString + $scope.activityArray[i].Name + ", ";
        }
        $scope.activityString = $scope.activityString.substring(0, $scope.activityString.length - 2);

        $scope.activityDetailsData = {};
        if (($scope.activityString.indexOf("CME/Symposia") > -1) || ($scope.activityString.indexOf("Camp/Clinic/Activity") > -1)) {
            var dcrBrandActivities = $filter('filter')(dcrBrandActivityData, {
                "DCR__c": $rootScope.dcrGlobalId
            }, true);

            dcrBrandActivities = $filter('filterEmpty')(dcrBrandActivities, 'DCR_Junction__c');

            var campaigns = $filter('filterEmpty')(dcrBrandActivities, 'Corporate_Initiative__c'),
             corporateInitiatives = $filter('filterNonEmpty')(dcrBrandActivities, 'Corporate_Initiative__c'),
             brandActivityName = '',
             brandName = '',
             campaignName = '';

            if (campaigns.length > 0) {
                if (campaigns[0].Sequence_Number__c != undefined) {
                    campaigns = $filter('toNumber')(campaigns, 'Sequence_Number__c');
                    campaigns = $filter('orderBy')(campaigns, 'Sequence_Number__c');
                } else {
                    campaigns = $filter('orderBy')(campaigns, 'Name');
                }
            }

            if (corporateInitiatives.length > 0) {
                if (corporateInitiatives[0].Sequence_Number__c != undefined) {
                    corporateInitiatives = $filter('toNumber')(corporateInitiatives, 'Sequence_Number__c');
                    corporateInitiatives = $filter('orderBy')(corporateInitiatives, 'Sequence_Number__c');
                } else {
                    corporateInitiatives = $filter('orderBy')(corporateInitiatives, 'Name');
                }
            }

            angular.forEach(campaigns, function (value, index) {
                var brandNameArray = $filter('filter')(brandActivities, {
                    'Id': value.Brand_Activity__c
                }, true),
                campaignId = '';
                if (brandNameArray.length > 0) {
                    campaignId = brandNameArray[0].Campaign__r.Id;
                    brandActivityName = brandNameArray[0].Name;
                    if (brandActivityName != undefined) {
                        campaignName = brandActivityName.split("_")[0];
                        brandName = brandActivityName.split("_")[1];
                    }
                }

                if ($scope.activityDetailsData[brandName] == undefined) {
                    $scope.activityDetailsData[brandName] = {};
                }

                $scope.activityDetailsData[brandName].campaign = campaignName;
                angular.forEach(corporateInitiatives, function (value1, index) {
                    if (value._soupEntryId == value1.DCR_Junction_Self__c) {
                        var corporateInitiativeArray = $filter('filter')(corporateInitiativesData, {
                            'Id': value1.Corporate_Initiative__c
                        }, true);

                        if ($scope.activityDetailsData[brandName].corpInitiative == undefined) {
                            $scope.activityDetailsData[brandName].corpInitiative = [];
                        }
                        angular.forEach(corporateInitiativeArray, function (corpInitvalue, index) {
                            $scope.activityDetailsData[brandName].corpInitiative.push({
                                "id": corpInitvalue.Id,
                                "name": corpInitvalue.Name
                            });
                        });
                    }
                });

            });
        }
        var dcrJFWCollectionInstance = new dcrJFWCollection();
        dcrJFWCollectionInstance.fetchAllWhereIn('DCR__c',[$rootScope.dcrGlobalId]).then(dcrJFWCollectionInstance.fetchRecursiveFromCursor).then(function(entities){
            JFWCount = entities && entities.length? entities.length : 0;
        });
        var dcrJunctionCollectionInstance= new dcrJunctionCollection();
         dcrJunctionCollectionInstance.fetchAllWhereIn('DCR__c',[$rootScope.dcrGlobalId]).then(dcrJunctionCollectionInstance.fetchRecursiveFromCursor).then(function(entities){
             junctionCount = entities && entities.length? entities.length : 0;
         });
        $scope.activityDetailsDataLength = Object.keys($scope.activityDetailsData).length;
        $scope.transperantConfig.display = false;

        window.ga.trackTiming('Summary Load Finish Time', 20000, 'summaryLoadFinish', 'Summary Tab Load Finish');
    };
     var getDCRJFWNames = function (_dcrJFWs) {
        var strTemp = "";
        var arrTemp = [];
        for (var j in _dcrJFWs) {
            var userObj = getJFWUserName(_dcrJFWs[j].User2__c)[0];
            var designation = (userObj != undefined && userObj.Designation) ? "(" + userObj.Designation + ")" : '';
            strTemp = strTemp + ", " + ((userObj != undefined && userObj.Name) ? userObj.Name : '') + designation;
        }
        strTemp = strTemp.substring(2, strTemp.length);
        arrTemp.push(strTemp);
        return arrTemp.join();
    }
    var getJFWUserName = function (id) {
        var userWithPassedIdToSupervisors = $filter('filter')(usersList, {
            'Id': id
        }),
          userObj = [];

        if (userWithPassedIdToSupervisors.length == 0) {
            userWithPassedIdToSupervisors = $filter('filter')(targetsList, {
                'User__c': id
            });
            if (userWithPassedIdToSupervisors.length > 0) {
                userObj.push({
                    "Name": userWithPassedIdToSupervisors[0].User__r.Name,
                    "Designation": userWithPassedIdToSupervisors[0].User__r.Designation__c
                });
            } else {
                userWithPassedIdToSupervisors = $filter('filter')($rootScope.listOfOtherJFWs, {
                    'User__c': id
                });
                if (userWithPassedIdToSupervisors.length > 0) {
                    userObj.push({
                        "Name": userWithPassedIdToSupervisors[0].User__r.Name,
                        "Designation": userWithPassedIdToSupervisors[0].User__r.Designation__c
                    });
                }
            }
        } else {
            userObj.push({
                "Name": userWithPassedIdToSupervisors[0].Name,
                "Designation": userWithPassedIdToSupervisors[0].Designation__c
            });
        }
        return userObj;
    };

    $scope.saveSummary = function () {

        window.ga.trackEvent('Save Summary', 'click', 'save and Submit Summary', 20000);
        if (dcrNotFiledToDCR) {
            popupService.openPopup($scope.locale.DCRFilingPendingFor + " " + dcrPendingCustomerCount + " " + $scope.locale.customers, $scope.locale.OK, '35%', function () {
                popupService.closePopup();
            });
            return;
        }

        popupService.openConfirm("", $scope.locale.DCRSubmitConfirmation + " " + $filter('date')($scope.currentCalenderDate, 'd MMM yyyy')+"?", $scope.locale.No, $scope.locale.Yes, '35%', function () {

                }, function () {
                    popupService.closePopup();
                    $timeout(function () {
                        $scope.submitSummary();
                    }, 1000);
                });

    };

    var dcrNotFiledToDCR = false,
       dcrPendingCustomerCount = 0;
    $scope.checkIfAllMTPsFiledToDCR = function () {

        var fieldActivityRecord = $filter('filter')(statusDCRActivty.getActivityStatus(), {
            "Name": "Field Work"
        });
        if (fieldActivityRecord != undefined && fieldActivityRecord.length > 0) {
            angular.forEach($rootScope.mtpCustomerDetailsForSelectedDate, function (value, index) {

                var MTPRemoveConfigRecord = $filter('filter')(mtpRemoveConfigData, {
                    'Id': value.Id
                }),
                isMTPRemoved = false;
                if (MTPRemoveConfigRecord != undefined && MTPRemoveConfigRecord.length > 0) {
                    isMTPRemoved = true;
                }

                if (!isMTPRemoved) {
                    var records = $filter('filter')(dcrJunctionDataForSelectedDay, {
                        "Account__c": value.Assignment__r.Account__c
                    });
                    if (records.length == 0) {
                        if (dcrNotFiledToDCR == false) {
                            dcrNotFiledToDCR = true;
                        }
                        dcrPendingCustomerCount++;
                    }
                }
            });

            for (var index = $rootScope.newCustomersForSelectedDay.length - 1; index >= 0; index--) {

                var duplicationRemover = [],
            value = $rootScope.newCustomersForSelectedDay[index];
                duplicationRemover = $filter('getDataBasedOnDateFilter')($rootScope.newCustomersForSelectedDay, value.Account__c, 'Account__c');
                if (duplicationRemover.length > 1) {
                    $rootScope.newCustomersForSelectedDay.splice(index, 1);
                } else {
                    var records = $filter('filter')(dcrJunctionDataForSelectedDay, { "Account__c": value.Account__c });
                    if (records.length == 0) {
                        if (dcrNotFiledToDCR == false) {
                            dcrNotFiledToDCR = true;
                        }
                        dcrPendingCustomerCount++;
                    }
                }
            }
        } else {
            dcrNotFiledToDCR = false;
        }
    };

    //Fetch DCR__c soup records
    $scope.submitSummary = function () {
        if ($scope.validate()) {
            var dcr__c_obj = dcrDataForSelectedDay[0],
             today = $filter('date')(new Date(), 'yyyy-MM-dd'),
             entry = [];

            if (dcr__c_obj != undefined && dcr__c_obj != null) {
                dcr__c_obj.Deviation_Comment__c = $scope.deviation;
                dcr__c_obj.Summary_Comment__c = $scope.summary;
                dcr__c_obj.Detailed_Summary__c = '';
                var cnt = 1;
                if ($scope.detailInfoDoctors && $scope.detailInfoDoctors.length) {
                    dcr__c_obj.Detailed_Summary__c += "  LIST OF DOCTORs:";
                    angular.forEach($scope.detailInfoDoctors, function (junction, i) {
                        dcr__c_obj.Detailed_Summary__c += "  " + cnt++ + " " + junction.name + " " + junction.customerCode + " " + junction.customerType;
                    });
                }
                if ($scope.detailInfoChemists && $scope.detailInfoChemists.length) {
                    dcr__c_obj.Detailed_Summary__c += "  LIST OF CHEMISTs:";
                    angular.forEach($scope.detailInfoChemists, function (junction, i) {
                        dcr__c_obj.Detailed_Summary__c += "  " + cnt++ + " " + junction.name + " " + junction.customerCode + " " + junction.customerType;
                    });
                }
                if ($scope.detailInfoStockists && $scope.detailInfoStockists.length) {
                    dcr__c_obj.Detailed_Summary__c += "  LIST OF STOCKISTs:";
                    angular.forEach($scope.detailInfoStockists, function (junction, i) {
                        dcr__c_obj.Detailed_Summary__c += "  " + cnt++ + " " + junction.name + " " + junction.customerCode + " " + junction.customerType;
                    });
                }
                if ($scope.detailInfoOthers && $scope.detailInfoOthers.length) {
                    dcr__c_obj.Detailed_Summary__c += "  LIST OF OTHERs:";
                    angular.forEach($scope.detailInfoOthers, function (junction, i) {
                        dcr__c_obj.Detailed_Summary__c += "  " + cnt++ + ". " + junction.name + " " + junction.customerCode + " " + junction.customerType;
                    });
                }
                dcr__c_obj.DCR_Junction_Count__c = junctionCount;
                dcr__c_obj.DCR_JFW_Count__c = JFWCount;

                dcr__c_obj.isMobileDCR__c = true;
                dcr__c_obj.Status__c = "Submitted";
                dcr__c_obj.DCRSubmitDate__c = today;
                dcr__c_obj.Id = dcr__c_obj._soupEntryId;
                dcr__c_obj.Synced = "false";
                //TODO
                //   dcr__c_obj.Company_Code__c = sessionToken.user[0].CompanyName;
                dcr__c_obj.Company_Code__c = currentUser.CompanyName;
                entry.push(dcr__c_obj);
                dcrCollectionInstance.upsertEntities(entry).then(function (response) {
                    if (response[0].Id == undefined) {
                        dcr__c_obj.Id = response[0]._soupEntryId;
                        dcr__c_obj._soupEntryId = response[0]._soupEntryId;
                        dcr__c_obj.Synced = "false";
                        dcrCollectionInstance.upsertEntities([dcr__c_obj]);
                    }
                });

                var greenFlagObj = {};
                greenFlagObj.Date__c = $scope.filterdatetime;
                greenFlagObj.Status__c = "Submitted";
                greenFlagObj.DCR_Filed_Date__c = today;
                greenFlagCollectionInstance.upsertEntities([greenFlagObj]).then(function () {
                   if(userType == 'ABM' || userType == 'TBM'){
                           var msg =  $scope.locale.FileExpenseConfirmation + " " + $filter('date')($scope.currentCalenderDate, 'd/M/yyyy');
                           popupService.openConfirm($scope.locale.DCRSubmittedSuccessfully,
                               msg,
                               $scope.locale.FILELATER,
                               $scope.locale.FILENOW,
                               '35%', function () {
                                   $rootScope.disablingEdit = true;
                                   //$scope.init();
                                   popupService.closePopup();
                                   navigationService.navigate('dcrCalendar');
                               }, function () {
                                   $rootScope.disablingEdit = true;
                                   //$scope.init();
                                   popupService.closePopup();
                                   $scope.navigateToExpense();
                               });
                        }
                       else{
                        popupService.openPopup($scope.locale.DCRSubmittedSuccessfully, $scope.locale.OK, '35%', function() {
                               $rootScope.disablingEdit = true;
                               $scope.init();
                               popupService.closePopup();
                               navigationService.navigate('dcrCalendar');
                           });
                       }
                       /* popup for navigation to expense page ends */
                   }).catch(function () {
                    popupService.openPopup($scope.locale.FailedToSubmitDCR, $scope.locale.OK, '35%', function () {
                        popupService.closePopup();
                    });
                });
            }else{
                popupService.openPopup("Selected activity should not contain empty values", $scope.locale.OK, '35%');
            }
        }
    };

    $scope.validate = function () {

        var isSubmitAllowed = true;

        var fieldWorkActivityRecord = $filter('filter')(statusDCRActivty.getActivityStatus(), {
            "Name": "Field Work"
        });
        if (fieldWorkActivityRecord.length > 0) {
            if ($scope.detailInfoDoctors.length == 0 && $scope.detailInfoChemists.length == 0 && $scope.detailInfoStockists.length == 0 && $scope.detailInfoOthers.length == 0) {
                isSubmitAllowed = false;
                popupService.openPopup($scope.locale.EmptyDCRSubmitAlert, $scope.locale.OK, '35%');
                return isSubmitAllowed;
            }
        }

        var symposiaActivityRecord = $filter('filter')(statusDCRActivty.getActivityStatus(), {
            "Name": "CME/Symposia"
        });
        if (symposiaActivityRecord.length > 0) {
            if (jQuery.isEmptyObject($scope.activityDetailsData)) {
                isSubmitAllowed = false;
                popupService.openPopup($scope.locale.BrandShouldNotBeEmptyOnCMESymposia + " " + $scope.locale.textIn + " " + symposiaActivityRecord[0].Name, $scope.locale.OK, '35%');
                return isSubmitAllowed;
            }
        }

        symposiaActivityRecord = $filter('filter')(statusDCRActivty.getActivityStatus(), {
            "Name": "Camp/Clinic/Activity"
        });
        if (symposiaActivityRecord.length > 0) {
            if (jQuery.isEmptyObject($scope.activityDetailsData)) {
                isSubmitAllowed = false;
                popupService.openPopup($scope.locale.BrandShouldNotBeEmptyOnCMESymposia + " " + $scope.locale.textIn + " " + symposiaActivityRecord[0].Name, $scope.locale.OK, '35%');
                return isSubmitAllowed;
            }
        }
        return isSubmitAllowed;
    };

    $scope.navigateToActivitySelection = function () {
        popupService.openConfirm($scope.locale.SelectActivity, $scope.locale.NavigateToActivitySelectionAlert, $scope.locale.No, $scope.locale.Yes, '55%', function () {

        }, function () {
            var dcrSoupEntryId = $rootScope.dcrGlobalId,
             filteredCustomerInNewCustomer = $filter('filter')($rootScope.newCustomersForSelectedDay, {
                 "Date__c": $scope.filterdatetime
             }),
             soupArray = [];
            angular.forEach(filteredCustomerInNewCustomer, function (value, index) {
                soupArray.push(value._soupEntryId);
            });
            if (soupArray != undefined && soupArray.length > 0) {
                newCustomerCollectionInstance.removeEntitiesByIds(soupArray);
            }

            var MTPRemoveConfigRecord = $filter('filter')(mtpRemoveConfigData, {
                'Date__c': $scope.filterdatetime
            }),
             currentMTPRemoveSoupEntryIds = [];
            angular.forEach(MTPRemoveConfigRecord, function (value, index) {
                currentMTPRemoveSoupEntryIds.push(value._soupEntryId);
            });

            mtpRemoveConfigCollectionInstance.removeEntitiesByIds(currentMTPRemoveSoupEntryIds);

            //Filtering dcr_drop data using dcr_id
            dcrDrop = $filter('filter')(dcrDropData, {
                "DCR__c": dcrSoupEntryId
            }, true);

            //up[dating material in hand quantity
            dcrDrop.forEach(function (value, index) {
                var record = $filter('filter')(materialLotArray, {
                    'Id': value.Material_Lot__c
                });
                record[0].In_Hand_Quantity__c += value.Quantity__c;
                materialLotCollectionInstance.upsertEntities(record);
            });
            // removing material transactions for current dcr
            materialTransactionCollectionInstance.fetchAll().then(materialTransactionCollectionInstance.fetchRecursiveFromCursor).then(function (materialTransactionList) {
                var record = $filter('filter')(materialTransactionList, {
                    'Call_Date__c': $scope.filterdatetime
                });
                materialTransactionCollectionInstance.removeEntities(record);
            });
            // removing dcr_drop for current dcr
            dcrDropCollectionInstance.removeEntities(dcrDrop);

            var reporteeJFWCollectionInstance = new reporteeJFWCollection();
            reporteeJFWCollectionInstance.fetchAll().then(reporteeJFWCollectionInstance.fetchRecursiveFromCursor).then(function (reporteeList) {
                if (reporteeList) {
                    reporteeList = $filter('getDataBasedOnDateFilter')(reporteeList, $scope.filterdatetime, 'DCR__r.Date__c');
                    reporteeList = reporteeList.map(function (reportee) {
                        reportee.IsActive__c = true;
                        return reportee;
                    });
                    reporteeJFWCollectionInstance.upsertEntities(reporteeList);
                }
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

    $scope.navigateToExpense = function () {
        console.log($scope.filterdatetime);
        navigationService.navigate('Expense', {
            'date': $scope.filterdatetime
        });
    };
}]);
