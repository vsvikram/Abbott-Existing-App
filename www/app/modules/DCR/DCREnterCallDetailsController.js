abbottApp.controller('DCREnterCallDetailsController', ['$scope', '$filter', '$stateParams', 'navigationService', 'abbottConfigService', 'dcrHelperService', 'popupService', 'utils', '$rootScope', 'divisionwiseBrandCollection', 'brandActivityCollection', 'materialLotCollection', 'materialTransactionCollection', 'campaignBrandActivityCollection', 'userCollection', 'dcrDropCollection', 'dcrBrandActivityCollection', 'dcrJunctionCollection', '$timeout',
    function($scope, $filter, $stateParams, navigationService, abbottConfigService, dcrHelperService, popupService, utils, $rootScope, DivisionwiseBrandCollection, BrandActivityCollection, MaterialLotCollection, MaterialTransactionCollection, CampaignBrandActivityCollection, userCollection, DcrDropCollection, DcrBrandActivityCollection, DcrJunctionCollection, $timeout) {
        var brandActivities = [],
            materialsList = [],
            campaignsList = [],
            formattedDate = '',
            brandActivityCollection = new BrandActivityCollection(),
            materialLotCollection = new MaterialLotCollection(),
            materialTransactionCollection = new MaterialTransactionCollection(),
            campaignBrandActivityCollection = new CampaignBrandActivityCollection(),
            dcrDropCollection = new DcrDropCollection(),
            dcrBrandActivityCollection = new DcrBrandActivityCollection(),
            dcrJunctionCollection = new DcrJunctionCollection(),
            divisionwiseBrandCollection = new DivisionwiseBrandCollection();


        $scope.locale = abbottConfigService.getLocale();
        $scope.isEditable = false;
        $scope.buttonText = $scope.locale.Edit;
        $scope.iconCls = 'editIcon';
        $scope.showDelete = false;
        $scope.Campaigns = [];
        $scope.Laboratory = [];
        $scope.Materials = [];
        $scope.rows = [];
        $scope.noDataFoundHtml = false;
        $scope.delBrandRows = [],
            $scope.currentIndex;
        var brandActivities = [],
            materials = [],
            attributesArray = [],
            governmentFilteredCampaigns = [];


        $scope.releaseResources = function() {
            $scope.Brands = [];
            $scope.Campaigns = [];
            $scope.Laboratory = [];
            $scope.Materials = [];
            $scope.rows = [];
            $scope.delBrandRows = [];
            brandActivities = [];
            campaignsList = [];
            $scope.locale = {};
            $scope.customerDetails = [];
            $scope.dcrBrandActivityObj = [];
            materialsList = [];
        };

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options) {

            if ((fromState.url == "/dcrEnterCallDetails") || (fromState.url == "/DCRcreateDoctorChemistStockists")) {

                $scope.releaseResources();
            }
        });


        $scope.initforParent = function() {
            window.ga.trackView('DCREnterCallDetails');
            window.ga.trackTiming('DCREnterCallDetails Load Start Time', 20000, 'DCREnterCallDetailsStart', 'DCREnterCallDetails Load Start');
            $rootScope.backFromModules = true;
            $scope.disableEdit = $rootScope.disablingEdit;


            if (typeof($stateParams.customerType) !== 'undefined') {
                $scope.customerType = $stateParams.customerType;
                $scope.selectedDCRDate = $stateParams.selectedDate;
                $scope.currentIndex = $stateParams.customerIndex;
                $scope.customerDetails = dcrHelperService.getCustomerDetails()[$scope.currentIndex];
                attributesArray = $scope.customerDetails.attributes;
                $scope.dcrBrandActivityObj = dcrHelperService.getDCRBrandActivity();
            }

            formattedDate = $filter('date')($scope.selectedDCRDate, 'yyyy-MM-dd');
            $scope.headerTitle = ($scope.customerType == 'Doctor') ? $scope.locale.EnterCallDetails : $scope.locale.AddInput;
            materialsList = [];
            campaignsList = [];
            //Loading indicator code
            $scope.transperantConfig = abbottConfigService.getTransparency();
            $scope.transperantConfig.display = true;
            $scope.transperantConfig.showBusyIndicator = true;
            $scope.transperantConfig.showTransparancy = true;
            abbottConfigService.setTransparency($scope.transperantConfig);

            //Pre-populate doctor details on initialise
            if ($scope.customerDetails) {
                $scope.doctorName = $scope.customerDetails.name;
                $scope.doctorLocation = "(" + $scope.customerDetails.patch + ")";
                $scope.doctorDesg = $scope.customerDetails.designation;
                var lastVisitDate = $scope.customerDetails.lastVisitDate,
                    finalLastVisit = (lastVisitDate != "Not Found") ? $filter('date')(lastVisitDate, 'd/M/yyyy') : lastVisitDate;
                $scope.lastVisitDate = finalLastVisit;
                $scope.DCR_Junction__c = $scope.customerDetails.DCR_Junction__c;
                $scope.DCR__c = $scope.customerDetails.DCR__c || $rootScope.dcrGlobalId;
                $scope.Local_DCR_Junction__c = $scope.customerDetails.DCR_Junction__c;
                $scope.Local_DCR__c = $scope.customerDetails.DCR__c || $rootScope.dcrGlobalId;
            }

            $scope.filterdatetime = $filter('date')(new Date(), 'yyyy-MM-dd');

            new userCollection().getActiveUser().then(function(activeUser) {
                $scope.division = activeUser.Division;
                return activeUser;
            }).then(divisionwiseBrandCollection.fetchAll).then(divisionwiseBrandCollection.fetchRecursiveFromCursor).then(function(brandList) {
                if (brandList.length != 0 && !$scope.disableEdit) {
                    brandList = brandList.filter(function(brand) {
                        return new Date(brand.Effective_From__c) <= new Date($scope.selectedDCRDate) && (new Date(brand.Effective_Till__c) >= new Date($scope.selectedDCRDate) || brand.Effective_Till__c == null)
                    });
                }
                $scope.Brands = $filter('orderBy')(brandList, 'Name');
                return brandList;
            }).then($scope.getBrandActivities).then(materialLotCollection.fetchAll).then(materialLotCollection.fetchRecursiveFromCursor).then(function(materialList) {
                materialsList = materialList;
                return materialList;
            }).then(campaignBrandActivityCollection.fetchAll).then(campaignBrandActivityCollection.fetchRecursiveFromCursor).then(function(campList) {
                campaignsList = campList;
                return campList;
            }).then(function() {
                $scope.getInitialMatCampaigns();
                execute();
            });
        };

        $scope.init = function() {

            if (typeof($scope.currentIndex) !== 'undefined') {
                return;
            }
            window.ga.trackView('DCREnterCallDetails');
            window.ga.trackTiming('DCREnterCallDetails Load Start Time', 20000, 'DCREnterCallDetailsStart', 'DCREnterCallDetails Load Start');
            $rootScope.backFromModules = true;
            $scope.disableEdit = $rootScope.disablingEdit;
            $scope.customerDetails = dcrHelperService.getCustomerDetails()[dcrHelperService.getCurrentCustomerIndex()];
            $scope.currentIndex = dcrHelperService.getCurrentCustomerIndex();
            attributesArray = $scope.customerDetails.attributes;

            $scope.dcrBrandActivityObj = dcrHelperService.getDCRBrandActivity();
            //$scope.customerType = $stateParams.customerType;
            $scope.selectedDCRDate = $scope.currentCalenderDate;
            if (typeof($stateParams.customerType) !== 'undefined') {
                $scope.customerType = $stateParams.customerType;
                $scope.selectedDCRDate = $stateParams.selectedDate;
                $scope.currentIndex = $stateParams.customerIndex;
            }


            formattedDate = $filter('date')($scope.selectedDCRDate, 'yyyy-MM-dd');
            $scope.headerTitle = ($scope.customerType == 'Doctor') ? $scope.locale.EnterCallDetails : $scope.locale.AddInput;

            //Loading indicator code
            $scope.transperantConfig = abbottConfigService.getTransparency();
            $scope.transperantConfig.display = true;
            $scope.transperantConfig.showBusyIndicator = true;
            $scope.transperantConfig.showTransparancy = true;
            abbottConfigService.setTransparency($scope.transperantConfig);

            //Pre-populate doctor details on initialise
            if ($scope.customerDetails) {
                $scope.doctorName = $scope.customerDetails.name;
                $scope.doctorLocation = "(" + $scope.customerDetails.patch + ")";
                $scope.doctorDesg = $scope.customerDetails.designation;
                var lastVisitDate = $scope.customerDetails.lastVisitDate,
                    finalLastVisit = (lastVisitDate != "Not Found") ? $filter('date')(lastVisitDate, 'd/M/yyyy') : lastVisitDate;
                $scope.lastVisitDate = finalLastVisit;
                $scope.DCR_Junction__c = $scope.customerDetails.DCR_Junction__c;

                $scope.DCR__c = $scope.customerDetails.DCR__c || $rootScope.dcrGlobalId;
                $scope.Local_DCR_Junction__c = $scope.customerDetails.DCR_Junction__c;
                $scope.Local_DCR__c = $scope.customerDetails.DCR__c || $rootScope.dcrGlobalId;
            }

            $scope.filterdatetime = $filter('date')(new Date(), 'yyyy-MM-dd');

            // new userCollection().getActiveUser().then(function(activeUser) {
            //  $scope.division = activeUser.Division;
            //  return activeUser;
            // }).then(divisionwiseBrandCollection.fetchAll).then(divisionwiseBrandCollection.fetchRecursiveFromCursor).then(function(brandList) {
            //  if (brandList.length != 0 && !$scope.disableEdit) {
            //      brandList = brandList.filter(function(brand) {
            //          return new Date(brand.Effective_From__c) <= new Date($scope.selectedDCRDate) && (new Date(brand.Effective_Till__c) >= new Date($scope.selectedDCRDate) || brand.Effective_Till__c == null)
            //      });
            //  }
            //  $scope.Brands = $filter('orderBy')(brandList, 'Name');
            //  return brandList;
            // }).then($scope.getBrandActivities).then(materialLotCollection.fetchAll).then(materialLotCollection.fetchRecursiveFromCursor).then(function(materialList) {
            //  materialsList = materialList;
            //  return materialList;
            // }).then(campaignBrandActivityCollection.fetchAll).then(campaignBrandActivityCollection.fetchRecursiveFromCursor).then(function(campList) {
            //  campaignsList = campList;
            //  return campList;
            // }).then(function() {
            $scope.getInitialMatCampaigns();
            execute();
            //});
        };

        $scope.getBrandActivities = function() {

            return brandActivityCollection.fetchAll().then(brandActivityCollection.fetchRecursiveFromCursor).then(function(activitiesList) {
                brandActivities = activitiesList;

                governmentFilteredCampaigns = $filter('filter')(brandActivities, function(value) {
                    var governmentCheck = '',
                        institutionCheck = false;
                    if ($scope.customerDetails.isGovernmentDoctor != null && $scope.customerDetails.isGovernmentDoctor == "Yes") {
                        governmentCheck = "Government"
                    } else if ($scope.customerDetails.isGovernmentDoctor != null && $scope.customerDetails.isGovernmentDoctor == "No") {
                        governmentCheck = "Non-Government"
                    }
                    if (value.Institution__c != null && value.Institution__c.indexOf($scope.customerDetails.institutionName) != -1) {
                        institutionCheck = true;
                    } else if (value.Institution__c === $scope.customerDetails.institutionName) {
                        institutionCheck = true;
                    }
                    if (value.Government_Doctor__c != null && value.Government_Doctor__c.indexOf(governmentCheck) != -1 && institutionCheck && value.Private_Permitted_Practice__c === $scope.customerDetails.privatePermittedPractice)
                        return true;
                    else
                        return false;
                });
                return activitiesList;

            });
        };

        var execute = function() {
            $scope.transperantConfig.display = false;
            var attributes = attributesArray,
                dcrBrandActivityObj = [],
                dcrBrandActivityNonEmptyObj = [];

            dcrBrandActivityObj = ($scope.customerType == 'Doctor') ? dcrHelperService.getDCRBrandActivity()[dcrHelperService.getCurrentCustomerIndex()] : undefined;

            if (dcrBrandActivityObj != undefined) {
                dcrBrandActivityNonEmptyObj = $filter('filterNonEmpty')(dcrBrandActivityObj, 'Brand_Activity__c');
            }

            angular.forEach(attributes, function(item, index) {
                var index = $scope.getAllIndexes($scope.rows, "brandName", item.brandName),
                    campaignsArr = $scope.Campaigns[item.brandName];
                if (index.length == 0) {
                    var temp = [],
                        campaigns = [];
                    if (item.materialCode != null)
                        temp.push({
                            materialName: item.materialName,
                            materialCode: item.materialCode,
                            dcrDropId: item.dcrDropId,
                            Quantity: item.quantity,
                            OldQuantity: item.quantity,
                            status_m: 'u',
                            sortIndex: item.sortIndex
                        });

                    if (dcrBrandActivityObj != undefined) {
                        angular.forEach(dcrBrandActivityNonEmptyObj, function(campgnArr, index) {
                            var filteredBrandActivityRecord = $filter('getDataBasedOnDateFilter')(brandActivities, campgnArr.Brand_Activity__c, 'Id'),
                                filteredBrandActivityArr = [],
                                brandName = '',
                                brandActivityId = '',
                                campaignId = '',
                                campaignName = '',
                                applicableLaboratory = false;

                            if (filteredBrandActivityRecord.length > 0) {
                                campaignName = filteredBrandActivityRecord[0].Name.split("_")[0];
                                brandName = filteredBrandActivityRecord[0].Name.split("_")[1];
                                if (brandName == item.brandName) {
                                    brandActivityId = filteredBrandActivityRecord[0].Id;
                                    campaignId = filteredBrandActivityRecord[0].Campaign__r.Id;
                                    filteredBrandActivityArr = $filter('filter')(campaignsArr, {
                                        "Id": campaignId
                                    });
                                    //if(campgnArr.Laboratory__c!=null && campgnArr.Laboratory__c!="None") {
                                    var laboratory = filteredBrandActivityArr[0].Applicable_Laboratories__c,
                                        laboratoryArray = [];
                                    if (laboratory != null || laboratory != undefined) {
                                        applicableLaboratory = true;
                                        laboratory = laboratory.split(";");
                                        for (var i = 0; i < laboratory.length; i++) {
                                            //$scope.Laboratory.push(laboratory[i]);
                                            if (laboratory[i] != "")
                                                laboratoryArray.push(laboratory[i]);
                                        }
                                        if (!$scope.Laboratory[campaignId])
                                            $scope.Laboratory[campaignId] = laboratoryArray;
                                    }
                                    //}
                                }
                            }

                            if (filteredBrandActivityArr.length > 0) {
                                campaigns.push({
                                    campaignId: campaignId,
                                    brandActivityId: brandActivityId,
                                    _soupEntryId: campgnArr._soupEntryId,
                                    campaignName: campaignName,
                                    status_c: 'u',
                                    laboratoryName: campgnArr.Laboratory__c,
                                    noOfPaients: campgnArr.No_of_Patients_Screened__c,
                                    isApplicableLaboratory: applicableLaboratory
                                });
                            }
                        });
                    }

                    $scope.rows.push({
                        brandName: item.brandName,
                        brandId: item.brandId,
                        materialRows: temp,
                        campaignRows: campaigns,
                        rx: (item.rxMonth) ? item.rxMonth : 0,
                        status_b: 'u',
                        show: true
                    });
                } else {
                    if (item.materialCode != null)
                        $scope.rows[index].materialRows.push({
                            materialName: item.materialName,
                            materialCode: item.materialCode,
                            dcrDropId: item.dcrDropId,
                            Quantity: item.quantity,
                            OldQuantity: item.quantity,
                            status_m: 'u',
                            sortIndex: item.sortIndex
                        });
                }
            });

        };

        //Add brands on click of add brand icon
        $scope.addBrandPopup = function() {
            popupService.brandSelectionPopup($scope.Brands, $scope.addBrandDoctor, '35%', $scope.locale.ADD, $scope.locale.CANCEL);
        };


        $scope.addBrandDoctor = function(brandValue) {
            if (typeof(brandValue) === 'undefined') {
                return;
            }

            var filteredRowsArr = $filter('filter')($scope.rows, {
                "status_b": "d"
            });
            if ($scope.rows.length - filteredRowsArr.length >= 10) {
                popupService.openPopup($scope.locale.AddBrandLimit, $scope.locale.OK, '35%');
                return;
            }
            $scope.buttonText = $scope.locale.Done;
            $scope.iconCls = 'doneIcon';
            $scope.isEditable = false;
            $scope.noDataFoundHtml = false;
            var keepGoing = true;

            angular.forEach($scope.rows, function(data1, index1) {
                if (keepGoing == true && data1.status_b != 'd' && !data1.brandName) {
                    popupService.openPopup($scope.locale.AddSequentialBrands, $scope.locale.OK, '35%');
                    keepGoing = false;
                }
            });



            if (keepGoing == true) {
                $scope.rows.push({
                    materialRows: [],
                    campaignRows: [],
                    status_b: 'a',
                    rx: 0,
                    brandName: brandValue,
                    show: true

                });

            }
            var brandAlreadyExists = false;

            var brandAlreadyExists = $scope.getMaterialCampaign($scope.rows[$scope.rows.length - 1], brandValue);

            if (brandAlreadyExists == true) {

                $scope.rows.pop();

            }

        };

        $scope.addBrand = function() {
            var filteredRowsArr = $filter('filter')($scope.rows, {
                "status_b": "d"
            });
            if ($scope.rows.length - filteredRowsArr.length >= 10) {
                popupService.openPopup($scope.locale.AddBrandLimit, $scope.locale.OK, '35%');
                return;
            }
            $scope.buttonText = $scope.locale.Done;
            $scope.iconCls = 'doneIcon';
            $scope.isEditable = false;
            $scope.noDataFoundHtml = false;
            var keepGoing = true;

            angular.forEach($scope.rows, function(data1, index1) {
                if (keepGoing == true && data1.status_b != 'd' && !data1.brandName) {
                    popupService.openPopup($scope.locale.AddSequentialBrands, $scope.locale.OK, '35%');
                    keepGoing = false;
                }
            });

            if (keepGoing == true) {
                $scope.rows.push({
                    materialRows: [],
                    campaignRows: [],
                    status_b: 'a',
                    rx: 0
                });
            }
        };

        var getSortIndex = function(r, arrayName) {
            var index = $scope.getAllIndexes($scope.rows, "brandId", r.brandId),
                rowIndex = 0,
                sortIndex = 0,
                maxIndex = utils.getMax(r[arrayName], 'sortIndex');
            if (index.length > 0) {
                rowIndex = index[0];
            }

            if (maxIndex == 1) {
                var tempSortIndex = 0,
                    tempRowIndex = 0,
                    diff = 0;
                //check for the correction in the rowIndex
                for (var i = rowIndex - 1; i > -1; i--) {
                    if ($scope.rows[i][arrayName].length > 0) {
                        tempSortIndex = $scope.rows[i][arrayName][0].sortIndex;
                        tempRowIndex = Math.floor(tempSortIndex / 1000);
                        if (tempRowIndex >= rowIndex) {
                            diff = rowIndex - i;
                            rowIndex = tempRowIndex + diff;
                            break;
                        }
                    }
                }
                sortIndex = (rowIndex * 1000) + maxIndex;
            } else {
                sortIndex = maxIndex;
            }
            return sortIndex;
        };

        //Add materials rows on click of add material icon
        $scope.addMaterialRow = function(r) {
            var keepGoing = true,
                sortIndex = getSortIndex(r, 'materialRows');

            angular.forEach(r.materialRows, function(data2, index1) {
                if (keepGoing == true && data2.status_m != 'd' && !data2.materialCode && data2.materialCode == null) {
                    popupService.openPopup($scope.locale.AddSequentialMaterials, $scope.locale.OK, '35%');
                    keepGoing = false;
                }
            });
            if (keepGoing == true) {
                r.materialRows.push({
                    status_m: 'a',
                    OldQuantity: 0,
                    sortIndex: sortIndex
                });
            }
        };

        //Add campaign rows on click of add campaign icon
        $scope.addCampaignRow = function(r) {
            var keepGoing = true,
                sortIndex = getSortIndex(r, 'campaignRows');
            angular.forEach(r.campaignRows, function(data3, index1) {
                if (keepGoing == true && data3.status_c != 'd' && !data3.campaignId && data3.campaignId == null) {
                    popupService.openPopup($scope.locale.AddSequentialCampaigns, $scope.locale.OK, '35%');
                    keepGoing = false;
                }
            });

            if (!r.campaignRows)
                r["campaignRows"] = [];
            if (keepGoing == true) {
                r.campaignRows.push({
                    status_c: 'a',
                    sortIndex: sortIndex,
                    isApplicableLaboratory: false
                });
            }
        };

        //delete material rows on click of delete material icon
        $scope.delMaterialRow = function(r, mr) {
            var array = r.materialRows,
                index = array.indexOf(mr);
            if (index > -1) {
                if (array[index].status_m == 'u')
                    array[index].status_m = 'd';
                else
                    array.splice(index, 1);
            }
        };
        //delete campaign rows on click of delete campaign icon
        $scope.delCampaignRow = function(r, mc) {
            var array = r.campaignRows,
                index = array.indexOf(mc);
            if (index > -1) {
                if (array[index].status_c == 'u')
                    array[index].status_c = 'd';
                else
                    array.splice(index, 1);
            }
        };

        $scope.getInitialMatCampaigns = function() {
            if ($scope.customerDetails && attributesArray.length != 0)
                angular.forEach(attributesArray, function(item, index) {
                    $scope.getMaterialCampaign(item, "");
                });
            window.ga.trackTiming('DCREnterCallDetails Load Finish Time', 20000, 'DCREnterCallDetailsFinish', 'DCREnterCallDetails Load Finish');
        };

        //Get materials on change of Brand selection

        $scope.getMaterialCampaign = function(r, oldValue) {
            //Check if brand already exist
            var preDCRJunctionObj = $scope.customerDetails['preDCRJunction'],
                brandIdText = '',
                rxKeyName = '',
                rxValue = 0;

            if ($scope.rows) {
                var index = $scope.getAllNonDeletedIndexes($scope.rows, "brandName", r.brandName, 'status_b');
                if (index.length > 1) {
                    r.brandName = oldValue;

                    popupService.openPopup($scope.locale.BrandExist, $scope.locale.OK, '35%');
                    return true;
                }
            }

            if ($scope.Brands.length > 0)
                r.brandId = $scope.getBrandId(r.brandName);

            //Pre populating RX/Month
            for (var i = 1; i <= 10; i++) {
                brandIdText = "Brand" + i + "__c";
                rxKeyName = "Rx_Month" + i + "__c";
                if (preDCRJunctionObj && preDCRJunctionObj[brandIdText] == r.brandId) {
                    rxValue = preDCRJunctionObj[rxKeyName];
                    break;
                }
            }

            r.rx = rxValue;

            //On change of brands reset all the fields
            if (r.status_b == "u" && oldValue != "") {
                r.status_b = "ub";
                r.oldBrandName = oldValue;
                r.oldBrandId = $scope.getBrandId(oldValue);
                r.oldMaterialRows = r.materialRows;
                r.oldCampaignRows = r.campaignRows;
                //r.oldRx = r.rx;
                //r.rx = rxValue;
                r.materialRows = [];
                r.campaignRows = [];
            }

            if (typeof($scope.materialsList) !== 'undefined') {
                materialsList = $scope.materialsList;
            }


            if (materialsList.length) {
                var filteredBrands = $filter('getDataBasedOnDateFilter')(materialsList, r.brandName, 'Brand__c');
                $scope.Materials[r.brandName] = $filter('orderBy')(filteredBrands, 'Material_Name__c');
                materials = $scope.Materials;
                var materialsFromCommonGroup = $scope.getAndInsertMaterialsOfCommonGroup(r.brandName);
                if (materialsFromCommonGroup != null && materialsFromCommonGroup.length > 0) {
                    $scope.Materials[r.brandName] = materialsFromCommonGroup;
                }
            } else {
                $scope.Materials[r.brandName] = [];
            }

            if ($scope.customerType == 'Doctor') {

                if (campaignsList.length) {
                    var filteredCampaign = [];
                    for (var i = 0; i < campaignsList.length; i++) {
                        var matchRecord = $filter('getDataBasedOnDateFilter')(governmentFilteredCampaigns, campaignsList[i].Id, 'Campaign__r.Id');
                        if (matchRecord.length > 0)
                            filteredCampaign.push(campaignsList[i]);
                    }

                    var filteredOnType = $filter('filter')(filteredCampaign, {
                            'Activity_Type__c': 'In-Clinic'
                        }),
                        filteredOnBrands = $filter('filter')(filteredOnType, {
                            "Applicable_Brands__c": r.brandName + ';'
                        }),
                        filteredOnDivision = $filter('filter')(filteredOnBrands, {
                            'Applicable_Divisons__c': $scope.division
                        }),
                        filteredOnStartDate = [];
                    for (var i = 0; i < filteredOnDivision.length; i++) {
                        if (new Date(filteredOnDivision[i].Start_Date__c) <= new Date($scope.selectedDCRDate) && new Date(filteredOnDivision[i].End_Date__c) >= new Date($scope.selectedDCRDate)) {
                            filteredOnStartDate.push(filteredOnDivision[i]);
                        }
                    }
                    $scope.Campaigns[r.brandName] = $filter('orderBy')(filteredOnStartDate, 'Name');
                }
            }
        };

        $scope.getAndInsertMaterialsOfCommonGroup = function(brandName) {
            var brandGropName = $scope.getBrandGroupName(brandName),
                brandsWithSameGroupName = (brandGropName != null) ? $filter('filter')($scope.Brands, {
                    'Group_Name__c': brandGropName
                }) : null,
                originalMaterials = [];

            if (brandsWithSameGroupName != null) {
                brandsWithSameGroupName = $filter('unique')(brandsWithSameGroupName, 'Name');
                angular.forEach(brandsWithSameGroupName, function(value, index) {
                    var materials = $filter('getDataBasedOnDateFilter')(dcrHelperService.getMaterialList(), value.Name, 'Brand__c');
                    angular.forEach(materials, function(value1, index1) {
                        originalMaterials.push(value1);
                    });
                });
                originalMaterials = $filter('orderBy')(originalMaterials, 'Material_Name__c');
            }
            return originalMaterials;
        };

        //Common function get index of a value in array
        $scope.getAllIndexes = function(array, attr, value) {
            var indexes = [],
                i;
            for (i = 0; i < array.length; i++) {
                if (array[i].hasOwnProperty(attr) && array[i][attr] === value)
                    indexes.push(i);
            }
            return indexes;
        };

        $scope.getAllNonDeletedIndexes = function(array, attr, value, key) {
            var indexes = [],
                i;
            for (i = 0; i < array.length; i++) {
                if (array[i].hasOwnProperty(attr) && array[i][attr] === value && array[i][key] != 'd')
                    indexes.push(i);
            }
            return indexes;
        };

        //Function called on Brand checkbox check
        $scope.brandChecked = function(ele, r, isChecked) {

            var index = ele.$index;

            // if (isChecked == true)
            //    { 

            $scope.delBrandRows.push(index);
            //}
            // else {console.log('b');
            //     var delIndex = $scope.delBrandRows.indexOf(index);
            //     $scope.delBrandRows.splice(delIndex, 1);
            // }
            $scope.deleteMarked(r);

        };
        $scope.deleteMarked = function(r) {

            var counter = 0;
            for (var i = 0; i < $scope.rows.length; i++) {
                if ($scope.rows[i].status_b != 'd') {
                    counter++;
                }
            }
            if ($scope.delBrandRows.length == counter) {
                popupService.openPopup($scope.locale.BrandDeleteLimit, $scope.locale.OK, '35%');
                return;
            }

            popupService.openConfirm($scope.locale.RemoveBrand, $scope.locale.RemoveBrandConfirmation, abbottConfigService.getLocale().No, abbottConfigService.getLocale().Yes, '35%', function() {

            }, function() {
                if ($scope.delBrandRows.length > 0) {

                    r.show = false;
                    var attributesArr = $scope.rows;
                    for (var i = attributesArr.length - 1; i >= 0; i--) {
                        if (attributesArr[i].show == false && $scope.rows[i].status_b == 'u') {
                            $scope.rows[i].status_b = 'd';
                        } else if (attributesArr[i].show == false && $scope.rows[i].status_b == 'a') {
                            attributesArr.splice(i, 1);
                        }
                    }
                }
                $scope.delBrandRows = [];

                $scope.buttonText = $scope.locale.Done;
                $scope.iconCls = 'doneIcon';
                $scope.isEditable = false;
            });

        }

        //Change button icons and text to edit, done or delete
        $scope.editBrandDetails = function() {
            $scope.noDataFoundHtml = false;
            switch ($scope.buttonText) {
                case $scope.locale.Edit:
                    $scope.buttonText = $scope.locale.Done;
                    $scope.iconCls = 'doneIcon';
                    $scope.isEditable = false;
                    break;
                case $scope.locale.Done:
                    var keepGoing = true;
                    //Remove empty rows from enter call details list
                    angular.forEach($scope.rows, function(data1, index1) {
                        if (keepGoing == true && data1.status_b != 'd') {
                            if (data1.oldBrandName != null && !data1.brandName) {
                                data1.status_b = 'd';
                            } else if (!data1.brandName) {
                                $scope.rows.splice(index1, 1);
                            }
                            angular.forEach(data1.materialRows, function(data2, index2) {
                                if (keepGoing == true && data2.status_m != 'd') {
                                    if (!data2.materialCode || data2.materialCode == null) {
                                        data1.materialRows.splice(index2, 1);
                                    } else if (!data2.Quantity || data2.Quantity == 0) {
                                        popupService.openPopup($scope.locale.PleaseSelect + $scope.locale.Quantity + $scope.locale.Value, $scope.locale.OK, '35%');
                                        keepGoing = false;
                                    }
                                }
                            });

                            angular.forEach(data1.campaignRows, function(data3, index3) {
                                if ((!data3.campaignId || data3.campaignId == null) && data3.brandActivityId != null) {
                                    data3.status_c = 'd';
                                } else if ((!data3.campaignId || data3.campaignId == null) && !data3.brandActivityId) {
                                    data1.campaignRows.splice(index3, 1);
                                }
                            });
                        }
                    });
                    if (keepGoing) {
                        $scope.buttonText = $scope.locale.Edit;
                        $scope.iconCls = 'editIcon';
                        $scope.isEditable = false;
                    }
                    break;
                case $scope.locale.Delete:
                    var counter = 0;
                    for (var i = 0; i < $scope.rows.length; i++) {
                        if ($scope.rows[i].status_b != 'd') {
                            counter++;
                        }
                    }
                    if ($scope.delBrandRows.length == counter) {
                        popupService.openPopup($scope.locale.BrandDeleteLimit, $scope.locale.OK, '35%');
                        return;
                    }

                    popupService.openConfirm($scope.locale.RemoveBrand, $scope.locale.RemoveBrandConfirmation, $scope.getLocale().No, $scope.getLocale().Yes, '35%', function() {

                    }, function() {
                        if ($scope.delBrandRows.length > 0) {
                            var attributesArr = $scope.rows;
                            for (var i = attributesArr.length - 1; i >= 0; i--) {
                                if (attributesArr[i].checked == true && $scope.rows[i].status_b == 'u') {
                                    $scope.rows[i].status_b = 'd';
                                } else if (attributesArr[i].checked == true && $scope.rows[i].status_b == 'a') {
                                    attributesArr.splice(i, 1);
                                }
                            }
                        }
                        $scope.delBrandRows = [];

                        $scope.buttonText = $scope.locale.Done;
                        $scope.iconCls = 'doneIcon';
                        $scope.isEditable = false;
                    });
                    break;
                default:
                    return;
            }
        };

        $scope.saveDCRJunctionSoup = function(success, failure) {

            if ($scope.customerDetails.dcrJunction == undefined) {
                var dcr_junction__c_obj = {},
                    today = $filter('date')(new Date(), 'yyyy-MM-dd'),
                    lastVisitDate = $scope.customerDetails.lastVisitDate,
                    entry = [];

                dcr_junction__c_obj.Sequence_Number__c = $scope.customerDetails.sortIndex;
                dcr_junction__c_obj.DCR__c = $scope.customerDetails.DCR__c;
                dcr_junction__c_obj.Local_DCR__c = $scope.customerDetails.DCR__c;
                dcr_junction__c_obj.Account__c = $scope.customerDetails.Account__c;
                dcr_junction__c_obj.Assignment__c = $scope.customerDetails.assignment__c;
                dcr_junction__c_obj.Patch__c = $scope.customerDetails.patchCode;

                if (lastVisitDate != $scope.locale.NotFound && lastVisitDate != undefined && lastVisitDate != "") {
                    dcr_junction__c_obj.Last_Visit_Date__c = lastVisitDate;
                } else {
                    dcr_junction__c_obj.Last_Visit_Date__c = null;
                }

                entry.push(dcr_junction__c_obj);

                dcrJunctionCollection.upsertEntities(entry).then(function(response) {

                    $scope.customerDetails.dcrJunction = response[0];
                    $scope.customerDetails.DCR_Junction__c = response[0]._soupEntryId;
                    $scope.DCR_Junction__c = $scope.customerDetails.DCR_Junction__c;
                    if (success)
                        success();

                }).catch(function(error) {
                    //              console.log(error);
                    if (failure)
                        failure();
                });
            } else {
                success();
            }
        };

        // Save doctor details on click of save button
        // Check if there are empty values
        $scope.collapseClick = function(index) {
            $scope.$parent.isCollapsed = !$scope.$parent.isCollapsed;
            $scope.$parent.setActive(index);

            if (!$scope.$parent.isCollapsed) { $scope.init(index); }
        }


        var checkEvent = $scope.$on("saveBrand", function(arg, index) {
            if ($scope.currentIndex == index) {
                $timeout(function() {
                    $scope.saveEnterCallDetailsBrands(index);
                }, 200);
            }
        });

        $scope.saveEnterCallDetails = function(index) {
            $scope.$parent.save(undefined, index);
        }

        $scope.saveEnterCallDetailsBrands = function(index) {

            if ($scope.DCR_Junction__c === null) {

                $scope.customerDetails = $scope.docAndDetails[$scope.currentIndex];
                attributesArray = $scope.customerDetails.attributes;
                $scope.doctorName = $scope.customerDetails.name;
                $scope.doctorLocation = "(" + $scope.customerDetails.patch + ")";
                $scope.doctorDesg = $scope.customerDetails.designation;
                $scope.DCR_Junction__c = $scope.customerDetails.DCR_Junction__c;
                $scope.DCR__c = $scope.customerDetails.DCR__c || $rootScope.dcrGlobalId;
                $scope.Local_DCR_Junction__c = $scope.customerDetails.DCR_Junction__c;
                $scope.Local_DCR__c = $scope.customerDetails.DCR__c || $rootScope.dcrGlobalId;

            }

            //$scope.$parent.save(undefined,index);
            $scope.saveDCRJunctionSoup(function() {

                var keepGoing = true,
                    popupMsg = "";

                angular.forEach($scope.rows, function(data1, index1) {


                    if (keepGoing == true && data1.status_b != 'd') {
                        if (!data1.brandName) {
                            keepGoing = false;
                            popupMsg = $scope.locale.PleaseSelect + $scope.locale.Brand + $scope.locale.Value;
                        }
                        angular.forEach(data1.materialRows, function(data2, index2) {

                            if (keepGoing == true && data2.status_m != 'd') {
                                if (!data2.materialCode && data2.materialCode == null) {
                                    var emptyMsg = ($scope.customerType == 'Doctor') ? $scope.locale.Material : $scope.locale.Input;
                                    popupMsg = $scope.locale.PleaseSelect + emptyMsg + $scope.locale.Value;
                                    keepGoing = false;
                                } else if (!data2.Quantity && (data2.Quantity == 0 || data2.Quantity == null)) {
                                    popupMsg = $scope.locale.PleaseSelect + $scope.locale.Quantity + $scope.locale.Value;
                                    keepGoing = false;
                                } else if (data2.Quantity != 0 || data2.Quantity != null) {
                                    var quantityEntered = data2.Quantity,
                                        materialArr = $filter('filter')($scope.Materials[data1.brandName], {
                                            "Id": data2.materialCode
                                        }, true);
                                    if (materialArr.length > 0) {
                                        var inHandQuantity = materialArr[0].In_Hand_Quantity__c + data2.OldQuantity;
                                        if (quantityEntered > inHandQuantity) {
                                            popupMsg = $scope.locale.QuantityLessMsg;
                                            keepGoing = false;
                                        }
                                    }
                                }
                            }
                        });
                        angular.forEach(data1.campaignRows, function(data3, index3) {
                            if ((!data3.campaignId || data3.campaignId == null) && data3.brandActivityId != null) {
                                data3.status_c = 'd';
                            } else if ((!data3.campaignId || data3.campaignId == null) && !data3.brandActivityId) {
                                data1.campaignRows.splice(index3, 1);
                            }
                        });
                    }
                });
                if (keepGoing) {
                    $scope.buttonText = $scope.locale.Edit;
                    $scope.iconCls = 'editIcon';
                    $scope.isEditable = false;
                    $scope.callSaveUpdateQueries();
                    popupService.openPopup($scope.locale.DataSaveConfirmation, $scope.locale.OK, '35%');
                    if (typeof($stateParams.customerType) !== 'undefined') {
                        navigationService.navigate('DCRcreateDoctorChemistStockists');
                    }
                    //navigationService.onBackKeyDown();
                } else
                    popupService.openPopup(popupMsg, $scope.locale.OK, '35%');
            });

        };

        // Call update, delete and add on Brand Materials and Campaign
        $scope.callSaveUpdateQueries = function() {
            var promise = $timeout();
            //Delete Old Brand
            angular.forEach($scope.rows, function(item, index) {

                promise = promise.then(function() {
                    if (item.status_b == 'ub' || item.oldBrandId != null) {
                        $scope.deleteBrand(item.oldBrandId, true);
                    }

                    switch (item.status_b) {
                        case 'ub':
                            //Delete Old Brand
                            //$scope.deleteBrand(item.oldBrandId, true);

                            //Delete Material
                            if (item.oldMaterialRows && item.oldMaterialRows.length > 0) {
                                var deleteMaterialArr = [],
                                    updateMaterialLotArr = [],
                                    materialName = '';
                                angular.forEach(item.oldMaterialRows, function(val, index) {
                                    materialName = $scope.getMaterialName(val.materialCode, item.brandName);
                                    if (val.dcrDropId)
                                        deleteMaterialArr.push(val.dcrDropId);
                                    var materialLot = $scope.getCalculateInHandQuantity(item, val, false);
                                    if (materialLot.length > 0)
                                        updateMaterialLotArr.push(materialLot[0]);
                                });
                                $scope.deleteBrandMaterials(deleteMaterialArr, updateMaterialLotArr);
                            }

                            //Delete Old Campaign
                            if ($scope.customerType == 'Doctor' && item.oldCampaignRows && item.oldCampaignRows.length > 0) {
                                var deleteCampaignArr = [];
                                angular.forEach(item.oldCampaignRows, function(campaign, index) {
                                    deleteCampaignArr.push(campaign._soupEntryId);
                                });
                                $scope.deleteBrandCampaign(item.oldCampaignRows, deleteCampaignArr);
                            }

                            $scope.addBrandRx(item, function() {});

                        case 'u':
                            $scope.updateBrands(item);
                            break;
                        case 'a':
                            $scope.addBrandRx(item, function() {
                                //Query to insert new materials for a newly added brand
                                if (item.materialRows && item.materialRows.length > 0) {
                                    angular.forEach(item.materialRows, function(material, index) {
                                        $scope.addBrandMaterials(item, material);
                                    });
                                }
                            });

                            //Query to insert new campaigns for a newly added brand
                            if ($scope.customerType == 'Doctor' && item.campaignRows.length > 0)
                                angular.forEach(item.campaignRows, function(campaign, index) {
                                    $scope.addBrandCampaign(campaign);
                                });
                            break;
                        case 'd':
                            //Delete Brand
                            $scope.deleteBrand(item.brandId, false);

                            //Delete Material
                            if (item.materialRows && item.materialRows.length > 0) {
                                var deleteMaterialArr = [],
                                    updateMaterialLotArr = [];
                                angular.forEach(item.materialRows, function(val, index) {
                                    if (val.dcrDropId)
                                        deleteMaterialArr.push(val.dcrDropId);
                                    var materialLot = $scope.getCalculateInHandQuantity(item, val, false);
                                    if (materialLot.length > 0)
                                        updateMaterialLotArr.push(materialLot[0]);
                                });
                                $scope.deleteBrandMaterials(deleteMaterialArr, updateMaterialLotArr);

                                //var updateMaterialLotArr = $scope.getCalculateInHandQuantity(data, item, true);
                            }
                            //Delete Campaign
                            if ($scope.customerType == 'Doctor' && item.campaignRows && item.campaignRows.length > 0) {
                                var deleteCampaignArr = [];
                                angular.forEach(item.campaignRows, function(campaign, index) {
                                    deleteCampaignArr.push(campaign._soupEntryId);
                                });
                                $scope.deleteBrandCampaign(item.campaignRows, deleteCampaignArr);
                            }
                            break;
                        default:
                            break;
                    }

                    return $timeout(200);
                });
            });
        };

        $scope.updateBrands = function(data) {

            if ($scope.customerType == 'Doctor')
                $scope.updateRxMonth(data)
            //Code to update, delete, and add new materials of a existing brand
            if (data.materialRows && data.materialRows.length > 0) {
                angular.forEach(data.materialRows, function(item, index) {
                    switch (item.status_m) {
                        case 'u':
                            $scope.updateMaterials(data, item);
                            break;
                        case 'a':
                            $scope.addMaterials(data, item);
                            break;
                        case 'd':
                            $scope.deleteMaterials(data, item, item.dcrDropId);
                            break;
                        default:
                            break;
                    }
                });
            }

            //Code to update, delete, and add new campaign of a existing brand
            if ($scope.customerType == 'Doctor' && data.campaignRows && data.campaignRows.length > 0) {

                angular.forEach(data.campaignRows, function(item, index) {
                    switch (item.status_c) {
                        case 'u':
                            $scope.updateCampaign(data, item);
                            break;
                        case 'a':
                            $scope.addCampaign(item);
                            break;
                        case 'd':
                            $scope.deleteCampaign(item.brandActivityId, item._soupEntryId);
                            break;
                        default:
                            break;
                    }
                });
            }
        };

        /*****************************************User Adds new Brand ****************************************/
        $scope.addBrandMaterials = function(data, item) {
            var updateBrandMaterialArr = [],
                updateMaterialTxArr = [],
                updateBrandMaterialArr = [{
                    Material_Lot__c: item.materialCode,
                    Quantity__c: (item.Quantity) ? item.Quantity : 0,
                    DCR_Junction__c: $scope.DCR_Junction__c,
                    DCR__c: $scope.DCR__c,
                    Divisionwise_Brand__c: data.brandId,
                    Sequence_Number__c: item.sortIndex
                }],
                materialName = $scope.getMaterialName(item.materialCode, data.brandName),
                customerType = $scope.customerType;
            //User Edits Material / quantity / Rx/Month related to a Brand on the screen(Done Button)

            dcrDropCollection.upsertEntities(updateBrandMaterialArr).then(function(response) {

                //          console.log("Success: Add Material in DCR_Drop__c", response);
                var record = response[0],
                    filteredAttributesArr = $filter('filter')(attributesArray, {
                        "brandId": data.brandId
                    }, true);
                if (filteredAttributesArr[0].materialCode == null) {
                    filteredAttributesArr[0].quantity = record.Quantity__c;
                    filteredAttributesArr[0].materialName = materialName;
                    filteredAttributesArr[0].dcrDropId = record._soupEntryId;
                    filteredAttributesArr[0].materialCode = record.Material_Lot__c;
                    filteredAttributesArr[0].sortIndex = record.Sequence_Number__c;
                } else {
                    //              console.log("materialName : "+materialName+" brandName : "+data.brandName);
                    var index = $scope.getBrandIndexFromArray(attributesArray, data.brandId);
                    if (customerType == 'Doctor') {
                        //attributeArray.push({brandId:data.brandId, rxMonth:data.rx, brandName: data.brandName, quantity:record.Quantity__c, materialName:materialName, dcrDropId:record._soupEntryId, materialCode:record.Material_Lot__c});
                        attributesArray.splice(index, 0, {
                            brandId: data.brandId,
                            rxMonth: data.rx,
                            brandName: data.brandName,
                            quantity: record.Quantity__c,
                            materialName: materialName,
                            dcrDropId: record._soupEntryId,
                            materialCode: record.Material_Lot__c,
                            sortIndex: record.Sequence_Number__c
                        });
                    } else {
                        //attributeArray.push({brandId:data.brandId, brandName: data.brandName, quantity:record.Quantity__c, materialName:materialName, dcrDropId:record._soupEntryId, materialCode:record.Material_Lot__c});
                        attributesArray.splice(index, 0, {
                            brandId: data.brandId,
                            brandName: data.brandName,
                            quantity: record.Quantity__c,
                            materialName: materialName,
                            dcrDropId: record._soupEntryId,
                            materialCode: record.Material_Lot__c,
                            sortIndex: record.Sequence_Number__c
                        });
                    }
                }
            }).catch(function(error) {
                //          console.log("Error: Add Material in DCR_Drop__c", error);
            });

            var updateMaterialLotArr = $scope.getCalculateInHandQuantity(data, item, true);

            //Update In Hand quantity in Material Lot
            materialLotCollection.upsertEntities(updateMaterialLotArr);
            updateMaterialTxArr = [{
                Material_Lot__c: item.materialCode,
                Material_Name__c: materialName,
                RecordTypeId: '01290000000suxHAAQ',
                quantity__c: (item.Quantity) ? item.Quantity : 0,
                Account__c: $scope.customerDetails.Account__c,
                Call_Date__c: formattedDate
            }];

            //Update In Hand Quantity in Material Transaction
            materialTransactionCollection.upsertEntities(updateMaterialTxArr);
        };

        $scope.addBrandRx = function(data, callback) { //Chemist support done

            if ($scope.customerType == 'Doctor') {
                var updateJunction = [],
                    dcrJunctionObj = $scope.customerDetails.dcrJunction;
                dcrJunction = $scope.addBrandToDCRJunction(dcrJunctionObj, data.brandId, data.rx);
                updateJunction = [dcrJunction];
                dcrJunctionCollection.upsertEntities(updateJunction).then(function(response) {
                    //              console.log("Success: Add Rx in DCR_Junction__c", response);
                    attributesArray.push({
                        brandId: data.brandId,
                        rxMonth: data.rx,
                        brandName: data.brandName,
                        quantity: 0,
                        materialName: $scope.locale.NoMaterials,
                        materialCode: null
                    });
                    callback();
                    //$scope.addBrandMaterials();
                }, function(error) {
                    //              console.log("Error: Add Rx in DCR_Junction__c", error);
                });
            } else {
                attributesArray.push({
                    brandId: data.brandId,
                    brandName: data.brandName,
                    quantity: 0,
                    materialName: $scope.locale.NoMaterials,
                    materialCode: null
                });
                callback();
            }
        };

        $scope.addBrandToDCRJunction = function(dcrJunctionObj, brandId, rxValue) {
            for (var i = 1; i <= 10; i++) {
                var brand = "Brand" + i + "__c",
                    rxKeyName = "Rx_Month" + i + "__c";
                if (dcrJunctionObj[brand] == null) {
                    dcrJunctionObj[brand] = brandId;
                    dcrJunctionObj[rxKeyName] = rxValue;
                    break;
                }
            }
            return dcrJunctionObj;
        };

        $scope.addBrandCampaign = function(item) {
            var dcrBrandActivity = {},
                dcrBrandActivityObj = $scope.dcrBrandActivityObj;
            dcrBrandActivity.DCR_Junction__c = $scope.DCR_Junction__c;
            dcrBrandActivity.DCR__c = $scope.DCR__c;
            dcrBrandActivity.Brand_Activity__c = item.brandActivityId;

            dcrBrandActivity.Local_DCR_Junction__c = $scope.DCR_Junction__c;
            dcrBrandActivity.Local_DCR__c = $scope.DCR__c;
            dcrBrandActivity.Local_Brand_Activity__c = item.brandActivityId;

            dcrBrandActivity.Sequence_Number__c = item.sortIndex;

            //Laboratory CR changes
            dcrBrandActivity.Laboratory__c = item.laboratoryName;
            dcrBrandActivity.No_of_Patients_Screened__c = item.noOfPaients;

            dcrBrandActivityCollection.removeEntitiesByIds([dcrBrandActivity]).then(function(response) {

                //          console.log("Success: Add Campaign in DCR_Brand_Activity__c", response);
                dcrBrandActivity._soupEntryId = response[0]._soupEntryId;
                dcrBrandActivityObj[$scope.currentIndex].push(dcrBrandActivity);
                dcrHelperService.setDCRBrandActivity(dcrBrandActivityObj);
            });
        };

        /************************************** User deletes existing Brand*********************************************/
        /*Query for Deleting existing Brand*/
        $scope.deleteBrand = function(brandId, isBrandUpdate) { //Chemist support done

            if ($scope.customerType == 'Doctor') {
                //Delete Brand fron DCR Junction
                var dcrJunctionObj = $scope.customerDetails.dcrJunction,
                    updateJunction = [];
                for (var i = 1; i <= 10; i++) {
                    var brand = "Brand" + i + "__c",
                        rxKeyName = "Rx_Month" + i + "__c",
                        pobKeyName = "POB" + i + "__c",
                        brandComp1KeyName = "Brand" + i + "_Competitor1__c",
                        brandComp1RxMonthKeyName = "Brand" + i + "_Comp1_Rx_Month__c",
                        brandComp2KeyName = "Brand" + i + "_Competitor2__c",
                        brandComp2RxMonthKeyName = "Brand" + i + "_Comp2_Rx_Month__c",
                        brandComp3KeyName = "Brand" + i + "_Competitor3__c",
                        brandComp3RxMonthKeyName = "Brand" + i + "_Comp3_Rx_Month__c",
                        brandComp4KeyName = "Brand" + i + "_Competitor4__c",
                        brandComp4RxMonthKeyName = "Brand" + i + "_Comp4_Rx_Month__c";

                    if (dcrJunctionObj[brand] == brandId) {
                        dcrJunctionObj[brand] = null;
                        delete dcrJunctionObj[rxKeyName];
                        delete dcrJunctionObj[pobKeyName];
                        delete dcrJunctionObj[brandComp1KeyName];
                        delete dcrJunctionObj[brandComp1RxMonthKeyName];
                        delete dcrJunctionObj[brandComp2KeyName];
                        delete dcrJunctionObj[brandComp2RxMonthKeyName];
                        delete dcrJunctionObj[brandComp3KeyName];
                        delete dcrJunctionObj[brandComp3RxMonthKeyName];
                        delete dcrJunctionObj[brandComp4KeyName];
                        delete dcrJunctionObj[brandComp4RxMonthKeyName];

                        if (i < 10 && !isBrandUpdate) {
                            for (var j = i; j <= 9; j++) {
                                dcrJunctionObj["Brand" + j + "__c"] = dcrJunctionObj["Brand" + (j + 1) + "__c"];
                                dcrJunctionObj["Rx_Month" + j + "__c"] = dcrJunctionObj["Rx_Month" + (j + 1) + "__c"];
                                dcrJunctionObj["POB" + j + "__c"] = dcrJunctionObj["POB" + (j + 1) + "__c"];
                                dcrJunctionObj["Brand" + j + "_Competitor1__c"] = dcrJunctionObj["Brand" + (j + 1) + "_Competitor1__c"];
                                dcrJunctionObj["Brand" + j + "_Comp1_Rx_Month__c"] = dcrJunctionObj["Brand" + (j + 1) + "_Comp1_Rx_Month__c"];
                                dcrJunctionObj["Brand" + j + "_Competitor2__c"] = dcrJunctionObj["Brand" + (j + 1) + "_Competitor2__c"];
                                dcrJunctionObj["Brand" + j + "_Comp2_Rx_Month__c"] = dcrJunctionObj["Brand" + (j + 1) + "_Comp2_Rx_Month__c"];
                                dcrJunctionObj["Brand" + j + "_Competitor3__c"] = dcrJunctionObj["Brand" + (j + 1) + "_Competitor3__c"];
                                dcrJunctionObj["Brand" + j + "_Comp3_Rx_Month__c"] = dcrJunctionObj["Brand" + (j + 1) + "_Comp3_Rx_Month__c"];
                                dcrJunctionObj["Brand" + j + "_Competitor4__c"] = dcrJunctionObj["Brand" + (j + 1) + "_Competitor4__c"];
                                dcrJunctionObj["Brand" + j + "_Comp4_Rx_Month__c"] = dcrJunctionObj["Brand" + (j + 1) + "_Comp4_Rx_Month__c"];

                                dcrJunctionObj["Brand" + (j + 1) + "__c"] = null;
                                dcrJunctionObj["Rx_Month" + (j + 1) + "__c"] = null;
                                dcrJunctionObj["POB" + (j + 1) + "__c"] = null;
                                dcrJunctionObj["Brand" + (j + 1) + "_Competitor1__c"] = null;
                                dcrJunctionObj["Brand" + (j + 1) + "_Comp1_Rx_Month__c"] = null;
                                dcrJunctionObj["Brand" + (j + 1) + "_Competitor2__c"] = null;
                                dcrJunctionObj["Brand" + (j + 1) + "_Comp2_Rx_Month__c"] = null;
                                dcrJunctionObj["Brand" + (j + 1) + "_Competitor3__c"] = null;
                                dcrJunctionObj["Brand" + (j + 1) + "_Comp3_Rx_Month__c"] = null;
                                dcrJunctionObj["Brand" + (j + 1) + "_Competitor4__c"] = null;
                                dcrJunctionObj["Brand" + (j + 1) + "_Comp4_Rx_Month__c"] = null;
                            }
                        }
                        break;
                    }
                }

                updateJunction = [dcrJunctionObj];

                dcrJunctionCollection.upsertEntities(updateJunction).then(function(response) {

                    //              console.log("Success: Delete Brand from DCR_Junction__c", response);

                    for (var i = attributesArray.length - 1; i >= 0; i--) {
                        if (attributesArray[i].brandId == brandId)
                            attributesArray.splice(i, 1);
                    }
                });
            } else {
                for (var i = attributesArray.length - 1; i >= 0; i--) {
                    if (attributesArray[i].brandId == brandId)
                        attributesArray.splice(i, 1);
                }
            }
        };

        $scope.deleteBrandMaterials = function(deleteMaterialArr, updateMaterialLotArr) {
            dcrDropCollection.removeEntitiesByIds(deleteMaterialArr);

            //Update In Hand quantity in Material Lot

            materialLotCollection.upsertEntities(updateMaterialLotArr);

            //Update In Hand Quantity in Material Transaction

            updateMaterialLotArr.forEach(function(entity) {
                removeTransactionEntities(entity.Id, $scope.customerDetails.Account__c);
            });
        };

        $scope.deleteBrandCampaign = function(campaignRows, deleteCampaign) {
            dcrBrandActivityCollection.removeEntitiesByIds(deleteCampaign).then(function(response) {
                //          console.log("Success: Delete Campaign in DCR_Brand_Activity__c", response);
                var dcrBrandActivityObj = dcrHelperService.getDCRBrandActivity()[$scope.currentIndex];
                angular.forEach(campaignRows, function(item, index) {
                    var brandCampaignArray = $scope.getAllIndexes(dcrBrandActivityObj, "Brand_Activity__c", item.brandActivityId);
                    dcrBrandActivityObj.splice(brandCampaignArray[0], 1);
                });
                dcrHelperService.setDCRBrandActivity(dcrBrandActivityObj);
            }, function(error) {
                //          console.log("Error: Delete Campaign in DCR_Brand_Activity__c", error);
            });
        };

        /*****************************************Update already existing Brands ****************************************/

        /****************** Update for Materials******************/
        $scope.updateMaterials = function(data, item) {

            var updateBrandMaterialArr = [],
                updateMaterialTxArr = [],
                updateBrandMaterialArr = [{
                    Material_Lot__c: item.materialCode,
                    Quantity__c: (item.Quantity) ? item.Quantity : 0,
                    _soupEntryId: item.dcrDropId,
                    DCR_Junction__c: $scope.DCR_Junction__c,
                    DCR__c: $scope.DCR__c,
                    Divisionwise_Brand__c: data.brandId,
                    Sequence_Number__c: item.sortIndex
                }],
                materialName = $scope.getMaterialName(item.materialCode, data.brandName);

            //User Edits Material / quantity / Rx/Month related to a Brand on the screen(Done Button)

            dcrDropCollection.upsertEntities(updateBrandMaterialArr).then(function(response) {

                //          console.log("Success: Update Material in DCR_Drop__c", response);

                var record = response[0];

                filteredAttributesArr = $filter('filter')(attributesArray, {
                    "dcrDropId": record._soupEntryId
                }, true);
                filteredAttributesArr[0].quantity = record.Quantity__c;
                filteredAttributesArr[0].materialName = materialName;
                filteredAttributesArr[0].materialCode = record.Material_Lot__c;
                filteredAttributesArr[0].sortIndex = record.Sequence_Number__c;

            }, function(error) {
                //          console.log("Error: Update Material in DCR_Drop__c", error);
            });

            var updateMaterialLotArr = $scope.getCalculateInHandQuantity(data, item, true);
            //Update In Hand quantity in Material Lot

            materialLotCollection.upsertEntities(updateMaterialLotArr);

            //nishma
            getMaterialEntityFromSoup(item.materialCode, $scope.customerDetails.Account__c).then(function(soupId) {
                updateMaterialTxArr = [{
                    _soupEntryId: soupId,
                    Material_Lot__c: item.materialCode,
                    Material_Name__c: materialName,
                    RecordTypeId: '01290000000suxHAAQ',
                    quantity__c: (item.Quantity) ? item.Quantity : 0,
                    Account__c: $scope.customerDetails.Account__c,
                    Call_Date__c: formattedDate
                }];
                //Update In Hand Quantity in Material Transaction

                materialTransactionCollection.upsertEntities(updateMaterialTxArr);
            });

        };

        $scope.updateRxInDCRJunction = function(dcrJunctionObj, brandId, rxValue) {
            for (var i = 1; i <= 10; i++) {
                var brand = "Brand" + i + "__c",
                    rxKeyName = "Rx_Month" + i + "__c";
                if (dcrJunctionObj[brand] == brandId) {
                    dcrJunctionObj[rxKeyName] = rxValue;
                    break;
                }
            }
            return dcrJunctionObj;
        };

        $scope.addMaterials = function(data, item) {
            var updateJunction = [],
                updateBrandMaterialArr = [],
                updateMaterialTxArr = [],
                materialName = $scope.getMaterialName(item.materialCode, data.brandName),
                updateBrandMaterialArr = [{
                    Material_Lot__c: item.materialCode,
                    Quantity__c: (item.Quantity) ? item.Quantity : 0,
                    DCR_Junction__c: $scope.DCR_Junction__c,
                    DCR__c: $scope.DCR__c,
                    Divisionwise_Brand__c: data.brandId,
                    Sequence_Number__c: item.sortIndex
                }];

            //User Edits Material / quantity / Rx/Month related to a Brand on the screen(Done Button)

            dcrDropCollection.upsertEntities(updateBrandMaterialArr).then(function(response) {

                var record = response[0];
                filteredAttributesArr = $filter('filter')(attributesArray, {
                    "brandId": data.brandId
                }, true);
                if (filteredAttributesArr[0].materialCode == null) {
                    filteredAttributesArr[0].quantity = record.Quantity__c;
                    filteredAttributesArr[0].materialName = materialName;
                    filteredAttributesArr[0].dcrDropId = record._soupEntryId;
                    filteredAttributesArr[0].materialCode = record.Material_Lot__c;
                    filteredAttributesArr[0].sortIndex = record.Sequence_Number__c;
                    if ($scope.customerType == 'Doctor') {
                        filteredAttributesArr[0].rxMonth = data.rx;
                    }
                } else {
                    var index = $scope.getBrandIndexFromArray(attributesArray, data.brandId);
                    if ($scope.customerType == 'Doctor') {
                        attributesArray.splice(index, 0, {
                            brandId: data.brandId,
                            rxMonth: data.rx,
                            brandName: data.brandName,
                            quantity: record.Quantity__c,
                            materialName: materialName,
                            dcrDropId: record._soupEntryId,
                            materialCode: record.Material_Lot__c,
                            sortIndex: record.Sequence_Number__c
                        });
                    } else {
                        attributesArray.splice(index, 0, {
                            brandId: data.brandId,
                            brandName: data.brandName,
                            quantity: record.Quantity__c,
                            materialName: materialName,
                            dcrDropId: record._soupEntryId,
                            materialCode: record.Material_Lot__c,
                            sortIndex: record.Sequence_Number__c
                        });
                    }
                }
            });

            var updateMaterialLotArr = $scope.getCalculateInHandQuantity(data, item, true);
            //Update In Hand quantity in Material Lot

            materialLotCollection.upsertEntities(updateMaterialLotArr);
            updateMaterialTxArr = [{
                Material_Lot__c: item.materialCode,
                Material_Name__c: materialName,
                RecordTypeId: '01290000000suxHAAQ',
                quantity__c: (item.Quantity) ? item.Quantity : 0,
                Account__c: $scope.customerDetails.Account__c,
                Call_Date__c: formattedDate
            }];

            //Update In Hand Quantity in Material Transaction
            materialTransactionCollection.upsertEntities(updateMaterialTxArr);



        };

        $scope.updateRxMonth = function(data) {
            var updateJunction = [],
                dcrJunctionObj = $scope.customerDetails.dcrJunction,
                dcrJunction = $scope.updateRxInDCRJunction(dcrJunctionObj, data.brandId, data.rx),
                updateJunction = [dcrJunction]

            dcrJunctionCollection.upsertEntities(updateJunction).then(function(response) {

                var filteredAttributesArr = $filter('getDataBasedOnDateFilter')(attributesArray, data.brandId, 'brandId');
                angular.forEach(filteredAttributesArr, function(item, index) {
                    item.rxMonth = data.rx;
                });
            });
        };

        $scope.deleteMaterials = function(data, item, deleteMaterialArr) {
            var updateMaterialLotArr = $scope.getCalculateInHandQuantity(data, item, false),
                updateMaterialTxArr = [],
                materialName = $scope.getMaterialName(item.materialCode, data.brandName);
            dcrDropCollection.removeEntitiesByIds([deleteMaterialArr]).then(function(response) {
                var materialIndex = $scope.getAllIndexes(attributesArray, "dcrDropId", deleteMaterialArr)[0],
                    filteredAttributesArr = $filter('filter')(attributesArray, {
                        "brandId": data.brandId
                    }, true);
                //materialAttr = data.materialRows;
                if (filteredAttributesArr.length > 1) {
                    attributesArray.splice(materialIndex, 1);
                } else {
                    attributesArray[materialIndex].materialName = $scope.locale.NoMaterials;
                    attributesArray[materialIndex].materialCode = null;
                    attributesArray[materialIndex].quantity = 0;
                }

            });

            //Update In Hand quantity in Material Lot

            materialLotCollection.upsertEntities(updateMaterialLotArr);

            removeTransactionEntities(item.materialCode, $scope.customerDetails.Account__c);

            //Update In Hand Quantity in Material Transaction
            //materialTransactionCollection.removeEntitiesByIds(updateMaterialTxArr);
        };

        /****************** Update for Campaigns******************/
        $scope.deleteCampaign = function(brandActivityId, deleteCampaign) {
            dcrBrandActivityCollection.removeEntitiesByIds([deleteCampaign]).then(function(response) {
                //          console.log("Success: Delete in DCR_Brand_Activity__c", response);
                var dcrBrandActivities = dcrHelperService.getDCRBrandActivity()[$scope.currentIndex],
                    brandCampaignArray = $scope.getAllIndexes(dcrBrandActivities, "Brand_Activity__c", brandActivityId);
                if (brandCampaignArray.length > 0) {
                    dcrBrandActivities.splice(brandCampaignArray[0], 1);
                }
                $scope.dcrBrandActivityObj[$scope.currentIndex] = dcrBrandActivities;
                dcrHelperService.setDCRBrandActivity($scope.dcrBrandActivityObj);
            });
        };

        $scope.addCampaign = function(item) {
            var dcrBrandActivity = {},
                dcrBrandActivityObj = $scope.dcrBrandActivityObj;

            dcrBrandActivity.DCR_Junction__c = $scope.DCR_Junction__c;
            dcrBrandActivity.DCR__c = $scope.DCR__c;
            dcrBrandActivity.Brand_Activity__c = item.brandActivityId;

            dcrBrandActivity.Local_DCR_Junction__c = $scope.DCR_Junction__c;
            dcrBrandActivity.Local_DCR__c = $scope.DCR__c;
            dcrBrandActivity.Local_Brand_Activity__c = item.brandActivityId;

            dcrBrandActivity.Sequence_Number__c = item.sortIndex;

            //Laboratory CR changes
            dcrBrandActivity.Laboratory__c = item.laboratoryName;
            dcrBrandActivity.No_of_Patients_Screened__c = item.noOfPaients;

            dcrBrandActivityCollection.upsertEntities([dcrBrandActivity]).then(function(response) {

                dcrBrandActivity._soupEntryId = response[0]._soupEntryId;
                dcrBrandActivityObj[$scope.currentIndex].push(dcrBrandActivity);
                dcrHelperService.setDCRBrandActivity(dcrBrandActivityObj);
            });
        };

        $scope.updateCampaign = function(data, item) {
            var dcrBrandActivityArr = dcrHelperService.getDCRBrandActivity()[$scope.currentIndex],
                filteredBrandActivityArr = $filter('filter')(dcrBrandActivityArr, {
                    "_soupEntryId": item._soupEntryId
                }, true);
            if (filteredBrandActivityArr.length > 0) {
                filteredBrandActivityArr[0].Brand_Activity__c = item.brandActivityId;

                //Laboratory CR changes
                filteredBrandActivityArr[0].Laboratory__c = item.laboratoryName;
                filteredBrandActivityArr[0].No_of_Patients_Screened__c = item.noOfPaients;

                dcrBrandActivityCollection.upsertEntities(filteredBrandActivityArr);
            }
        };

        /************* Validation to prevent duplicate selection in Material and Campaigns dropdown **************/
        $scope.onMaterialChange = function(brandRows, materials, oldMaterial) {
            var index = $scope.getAllNonDeletedIndexes(brandRows.materialRows, "materialCode", materials.materialCode, "status_m");
            if (index.length > 1) {
                materials.materialCode = oldMaterial;
                var msgText = ($scope.customerType == 'Doctor') ? $scope.locale.MaterialExist : $scope.locale.InputExist;
                popupService.openPopup(msgText, $scope.locale.OK, '35%');
                return;
            }

            materials.materialName = $scope.getMaterialName(materials.materialCode, brandRows.brandName);
            var materialArr = $filter('filter')($scope.Materials[brandRows.brandName], {
                "Id": materials.materialCode
            }, true);
            if (materialArr.length > 0) {
                var defaultQuantity = (materialArr[0].Default_Quantity__c != null && materialArr[0].Default_Quantity__c < materialArr[0].In_Hand_Quantity__c) ? materialArr[0].Default_Quantity__c : 0;
                brandRows.materialRows[brandRows.materialRows.length - 1].OldQuantity = defaultQuantity;
                brandRows.materialRows[brandRows.materialRows.length - 1].Quantity = defaultQuantity;
            }
        };

        $scope.onCampaignChange = function(brandRows, campaignRows, oldCampaign) {
            var filteredBrandActivityRecord = $filter('getDataBasedOnDateFilter')(brandActivities, campaignRows.campaignId, 'Campaign__r.Id'),
                brandName = '',
                brandActivityId = '',
                campaignName = '',
                index = $scope.getAllNonDeletedIndexes(brandRows.campaignRows, "campaignId", campaignRows.campaignId, "status_c"),
                campaignRecord = $filter('filter')($scope.Campaigns[brandRows.brandName], {
                    'Id': campaignRows.campaignId
                }, true);

            if (index.length > 1) {
                campaignRows.campaignId = oldCampaign;
                popupService.openPopup($scope.locale.CampaignExist, $scope.locale.OK, '35%');
                return;
            }

            for (var i = 0; i < filteredBrandActivityRecord.length; i++) {
                brandName = filteredBrandActivityRecord[i].Name.split("_")[1];
                campaignName = filteredBrandActivityRecord[i].Name.split("_")[0];
                if (brandName == brandRows.brandName) {
                    brandActivityId = filteredBrandActivityRecord[i].Id;
                    campaignRows.campaignName = campaignName;
                    campaignRows.brandActivityId = brandActivityId;
                    break;
                }
            }
            delete campaignRows["noOfPaients"];
            delete campaignRows["laboratoryName"];

            //getApplicableLaboratory(campaignRecord);
            if (campaignRecord.length > 0) {
                var laboratory = campaignRecord[0].Applicable_Laboratories__c,
                    laboratoryArray = [];
                if (laboratory != null || laboratory != undefined) {
                    laboratory = laboratory.split(";");
                    for (var i = 0; i < laboratory.length; i++) {
                        //$scope.Laboratory.push(laboratory[i]);
                        if (laboratory[i] != "")
                            laboratoryArray.push(laboratory[i]);
                    }
                    if (!$scope.Laboratory[campaignRows.campaignId]) {
                        $scope.Laboratory[campaignRows.campaignId] = laboratoryArray;
                    }
                    campaignRows.isApplicableLaboratory = ($scope.Laboratory[campaignRows.campaignId].length > 0) ? true : false;
                }
            }
            campaignRows.isApplicableLaboratory = ($scope.Laboratory[campaignRows.campaignId] && $scope.Laboratory[campaignRows.campaignId].length > 0) ? true : false;
            //      else {
            //          campaignRows.isApplicableLaboratory = false;
            //      }
        };

        /**********Function to get Material name based on Material Code****************/
        $scope.getMaterialName = function(materialCode, brandName) {
            var materialName = '';

            materialDataArray = $filter('filter')(materials[brandName], {
                'Id': materialCode
            }, true);
            if (materialDataArray.length > 0) {
                materialName = materialDataArray[0].Material_Name__c;
            }
            return materialName;
        };

        $scope.getCampaignName = function(campaignId, brandName) {
            var campaignName = '';
            campaignDataArray = $filter('filter')($scope.Campaigns[brandName], {
                'Id': campaignId
            }, true);
            if (campaignDataArray.length > 0) {
                campaignName = campaignDataArray[0].Name;
            }
            return campaignName;
        };

        $scope.getBrandId = function(brandName) {
            var brandId = null,
                brandDataArray = $filter('filter')($scope.Brands, {
                    'Name': brandName
                }, true);
            if (brandDataArray.length > 0) {
                brandId = brandDataArray[0].Id;
            }
            return brandId;
        };

        $scope.getBrandGroupName = function(brandName) {
            var brandGroupName = null,
                brandDataArray = $filter('filter')($scope.Brands, {
                    'Name': brandName
                }, true);
            if (brandDataArray.length > 0) {
                brandGroupName = brandDataArray[0].Group_Name__c;
            }
            return brandGroupName;
        };

        $scope.getCalculateInHandQuantity = function(data, item, flag) {
            var brandName = (data.status_b == 'ub' && data.oldBrandName) ? data.oldBrandName : data.brandName,
                filteredMaterialArr = $filter('filter')(materials[brandName], {
                    "Id": item.materialCode
                }, true);
            if (filteredMaterialArr.length > 0)
                filteredMaterialArr[0].In_Hand_Quantity__c += (flag) ? item.OldQuantity - item.Quantity : item.OldQuantity;
            return filteredMaterialArr;
        };

        $scope.getBrandIndexFromArray = function(attributeArray, brandId) {
            var index = $scope.getAllIndexes(attributeArray, "brandId", brandId),
                length = index.length;
            return index[length - 1] + 1;
        };

        var removeTransactionEntities = function(materialLot, account) {
            return materialTransactionCollection.fetchAllWhere({
                "Material_Lot__c": materialLot,
                "Account__c": account
            }).then(materialTransactionCollection.fetchRecursiveFromCursor).then(materialTransactionCollection.removeEntities);
        };

        var getMaterialEntityFromSoup = function(materialLot, account) {
            return materialTransactionCollection.fetchAllWhere({
                "Material_Lot__c": materialLot,
                "Account__c": account
            }).then(materialTransactionCollection.fetchRecursiveFromCursor).then(function(entity) {
                if (entity && entity.length > 0)
                    return entity[0]._soupEntryId;
                else
                    return true;
            });
        };

        $scope.backButton = function() {
            navigationService.backFunc();
        }

    }
]);