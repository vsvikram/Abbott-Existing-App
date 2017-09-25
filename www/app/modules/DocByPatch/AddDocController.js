abbottApp.controller('AddDocController', ['$scope', 'navigationService', '$filter', 'abbottConfigService', '$stateParams', 'popupService', 'utils', 'dcrHelperService', 'dcrPatchService', '$rootScope', '$timeout', 'patchCollection', 'newCustomerCollection', 'assigmentDetailCollection', 'userCollection', 'divisionCollection', 'CUSTOMER_TYPES', 'targetCollection','$window',
    function($scope, navigationService, $filter, abbottConfigService, $stateParams, popupService, utils, dcrHelperService, dcrPatchService, $rootScope, $timeout, PatchCollection, NewCustomerCollection, AssigmentDetailCollection, UserCollection, DivisionCollection, CUSTOMER_TYPES, TargetCollection,$window) {

        //For user type
        var patchCollection = new PatchCollection(),
            newCustomerCollection = new NewCustomerCollection(),
            assigmentDetailCollection = new AssigmentDetailCollection(),
            userCollection = new UserCollection(),
            divisionCollection = new DivisionCollection(),
            targetCollection = new TargetCollection(),
            patchData = [],
            currentUser = {},
            targetsList = [],
            divisionInfo = {},
            appointmentDetails = null,
            ABM_Territory__c = '',
            brandList = [];


        $scope.init = function() {

            window.ga.trackView('AddDoc');
            window.ga.trackTiming('Support Load Start Time', 20000, 'supportLoadStart', 'Support Load Start');

            $rootScope.backFromModules = true;
            $scope.docBySearch = "";
            $scope.hospitalArray = [];
            $scope.group_type = "Patch";
            $scope.changeAddType();
            $scope.patchTableShow = 'true';
            $scope.showTableDiv = true;
            $scope.showFilterBar = false;
            $scope.tableHeight = "addDocTableHeight";
            $scope.abmSelected = false;
            $scope.selectedDoctors = [];
            $scope.docAndDetails = dcrHelperService.getCustomerDetails();
            brandList = dcrHelperService.getBrandsList();
            $scope.custType = $stateParams.selectedTab;
            $scope.dcrDate = $stateParams.selectedDate;
            $scope.counter=0;

            if ($scope.custType == "Doctors") {
                $scope.custName = "Doctor";
                $scope.showTop = "Doctor";
            } else if ($scope.custType == "Chemists") {
                $scope.custName = "Chemist";
                $scope.showTop = "Chemist";
            } else if ($scope.custType == "Stockists") {
                $scope.custName = "Stockist";
                $scope.showTop = "Stockist";
            } else if ($scope.custType == "Others") {
                $scope.custName = "Other";
                $scope.showTop = "Customer";
            } else if ($scope.custType == "Activity") {
                $scope.custName = "Customer";
                $scope.showTop = "Customer";
            }

            $scope.TBMUsers = [];
            $scope.locale = abbottConfigService.getLocale();
            $scope.transperantConfig = abbottConfigService.getTransparency();
            $scope.transperantConfig.display = true;
            $scope.transperantConfig.showBusyIndicator = true;
            $scope.transperantConfig.showTransparancy = true;
            abbottConfigService.setTransparency($scope.transperantConfig);

            $scope.loadUserData().then($scope.initMainData).then($scope.getPatchData).then(assigmentDetailCollection.fetchUserAssignmentDetails).then(function(assigmentDetailsList) {

                var existingCustomers = [];
                if ($scope.custType == "Activity") {
                    existingCustomers = dcrHelperService.getAddCustomersData();
                } else {
                    existingCustomers = $scope.docAndDetails;
                }
                if ($scope.userType != 'ZBM') {
                    if ($scope.userType == "TBM") {
                        $scope.patchList = patchData;
                    }
                    appointmentDetails = assigmentDetailsList;

                    if ($scope.custType != "Activity") {


                        appointmentDetails = $filter('getDataBasedOnDateFilter')(appointmentDetails, $scope.custName, 'Account__r.RecordType.Name');


                        appointmentDetails = $scope.dateFilter(appointmentDetails, $scope.dcrDate);

                    }


                    if (appointmentDetails != null && appointmentDetails.length > 0) {
                        var i = 0;
                        while (i < appointmentDetails.length) {
                            var duplicationRemover = $filter('getDataBasedOnDateFilter')(existingCustomers, appointmentDetails[i].Account__c, 'Account__c');
                            if (duplicationRemover.length != 0) {
                                appointmentDetails.splice(i, 1);
                            } else {
                                i++;
                            }
                        }
                        removeInactiveBrands(appointmentDetails);
                        if ($scope.custType == "Activity")
                            appointmentDetails = governmentDoctorsFilter(appointmentDetails);
                        $scope.arrayUsed = appointmentDetails;
                    } else {
                        $scope.showTableDiv = false;
                    }
                } else {
                    appointmentDetails = {};
                    var ABMUsersData = $filter('designationFilter')(targetsList, 'ABM');
                    appointmentDetails = assigmentDetailsList;
                    angular.forEach(ABMUsersData, function(value, index) {
                        if ($scope.custType != "Activity") {
                            appointmentDetails[value.Territory__c] = $filter('getDataBasedOnDateFilter')(appointmentDetails[value.Territory__c], $scope.custName, 'Account__r.RecordType.Name');
                            appointmentDetails[value.Territory__c] = $scope.dateFilter(appointmentDetails[value.Territory__c], $scope.dcrDate);
                        }
                        var i = 0;
                        if (appointmentDetails[value.Territory__c] != undefined) {
                            removeInactiveBrands(appointmentDetails[value.Territory__c]);
                            if ($scope.custType == "Activity")
                                appointmentDetails[value.Territory__c] = governmentDoctorsFilter(appointmentDetails[value.Territory__c]);
                            while (i < appointmentDetails[value.Territory__c].length) {
                                var duplicationRemover = $filter('getDataBasedOnDateFilter')(existingCustomers, appointmentDetails[value.Territory__c][i].Account__c, 'Account__c');
                                if (duplicationRemover.length != 0) {
                                    appointmentDetails[value.Territory__c].splice(i, 1);
                                } else {
                                    i++;
                                }
                            }
                        }
                    });
                }

                $scope.transperantConfig.display = false;
                abbottConfigService.setTransparency($scope.transperantConfig);

            });
        };

        var governmentDoctorsFilter = function(appointmentDetails) {
            var paginationIndex = dcrHelperService.getPaginationData().paginationIndex,
                activityData = dcrHelperService.getActivityBrandsData()[paginationIndex];
            appointmentDetails = $filter('filter')(appointmentDetails, function(value) {
                var brandFound = false;
                for (var i = 1; i <= 10; i++) {
                    brandText = "Brand" + i + "__r";
                    if (value[brandText] != null && value[brandText].Name === activityData.brandName) {
                        brandFound = true;
                        break;
                    }
                }

                if (!brandFound) {
                    return false;
                }
                var governmentCheck = '',
                    institutionCheck = false;
                if (value.Account__r.Is_Government_Doctor__c != null && value.Account__r.Is_Government_Doctor__c == "Yes") {
                    governmentCheck = "Government";
                } else if (value.Account__r.Is_Government_Doctor__c != null && value.Account__r.Is_Government_Doctor__c == "No") {
                    governmentCheck = "Non-Government";
                }

                if (activityData.Institution != null && activityData.Institution.indexOf(value.Account__r.Institution_Name__c) != -1) {
                    institutionCheck = true;
                } else if (activityData.Institution === value.Account__r.Institution_Name__c) {
                    institutionCheck = true;
                }

                if ((activityData.GovernmentCampaign != null && activityData.GovernmentCampaign.indexOf(governmentCheck) != -1) && institutionCheck && value.Account__r.PrivatePermittedPractice__c === activityData.PrivatePermittedPractice)
                    return true;
                else
                    return false;
            });
            return appointmentDetails;
        };

        var removeInactiveBrands = function(customerAppointmentDetails) {
            angular.forEach(customerAppointmentDetails, function(value, index) {
                var brandIdText = '',
                    brandFilter = null;
                for (var i = 1; i <= 10; i++) {
                    brandIdText = "Brand" + i + "__c";
                    brandText = "Brand" + i + "__r";
                    if (value[brandText] != null && value[brandIdText] != null) {
                        brandFilter = $filter('filter')(brandList, {
                            "Id": value[brandIdText]
                        });
                        if (brandFilter && brandFilter.length == 0) {
                            value[brandIdText] = null;
                            value[brandText] = null;
                        }
                    }
                }
            });
        };

        $scope.initMainData = function() {
            $scope.userAccount = currentUser.Id;
            $scope.userType = currentUser.Designation__c;

            $scope.restOfFunction($scope.userAccount);
            $scope.selectedPeople = [];
            $scope.selectedDoctors = [];
            $scope.checked = false;
            if ($scope.MTPDate) {
                $scope.date = $scope.MTPDate._d;
            }

            $scope.DocModel = {
                'id': "",
                'name': ""
            };

            var userDivisionInfo = divisionInfo;
            if ($scope.custName == "Chemist" || $scope.custName == "Stockist") {
                $scope.docAddOption = ['Patch', 'Add By Search'];
            } else {
                if (userDivisionInfo.Hospital_Affiliation__c == true) {
                    $scope.docAddOption = ['Patch', 'Hospital', 'Add By Search'];
                } else {
                    $scope.docAddOption = ['Patch', 'Add By Search'];
                }
            }
        };

        $scope.loadUserData = function() {
            return userCollection.fetchAllCollectionEntities().then(userCollection.getActiveUser).then(function(activeUser) {
                currentUser = activeUser;
            }).then(targetCollection.fetchAllCollectionEntities).then(function(targets) {
                targetsList = targets;
            }).then(divisionCollection.fetchAll).then(divisionCollection.getEntityFromResponse).then(function(division) {
                divisionInfo = division;
            })
        };

        $scope.getPatchData = function() {
            return patchCollection.fetchAll().then(patchCollection.fetchRecursiveFromCursor).then(function(patchList) {
                patchData = patchList;
                return patchList;

                window.ga.trackTiming('Support Load Finish Time', 20000, 'supportLoadFinish', 'Support Load Finish');

            });
        };

        $scope.getBrandText = function(index) {
            var brandIdText = '',
                brandText = '',
                brands = '';
            for (var i = 0; i <= 10; i++) {
                brandIdText = "Brand" + i + "__c";
                brandText = "Brand" + i + "__r";
                if (index[brandText] != null && index[brandIdText] != null) {
                    brands += index[brandText].Name + ", ";
                }
            }
            if (brands != '')
                brands = brands.slice(0, -1);
            return brands;
        };

        $scope.showArray = function() {
            $scope.filteredArraySearch = [];
            $scope.lowerDocSearchFilter = angular.lowercase($scope.docSearchFilter);

            if ($scope.lowerDocSearchFilter != "") {
                for (var i in $scope.arrayUsed) {
                    if ($scope.arrayUsed[i].Account__r.Name.toLowerCase().indexOf($scope.docSearchFilter) != -1 || $scope.arrayUsed[i].Account__r.Name.toLowerCase().indexOf($scope.lowerDocSearchFilter) != -1) {
                        $scope.filteredArraySearch.push($scope.arrayUsed[i]);
                    }
                }
            }

        };
        //Data in user dropdown
        $scope.restOfFunction = function(userAccount) {
            $scope.allChecked = 0;
            if ($scope.userType == "TBM") {
                $scope.ABMZBM = false;
                $scope.showFilterBar = true;
                $scope.showTableDiv = true;
                $scope.tableHeight = "addDocTableHeight";
                $scope.conditionalHeight = "longTable";
            }

            if ($scope.userType == "ABM") {
                $scope.TBMUsers = [];
                $scope.ABMZBM = true;
                $scope.tableHeight = "cutHeight";
                $scope.conditionalHeight = "shortTable";
                var TBMUsersData = $filter('designationFilter')(targetsList, 'TBM');
                $scope.TBMUsers = TBMUsersData;

                //			for(var i in TBMUsersData)
                //			{
                //				if(TBMUsersData[i]!=null){
                //					$scope.TBMUsers.push(TBMUsersData[i].User__r.Name);
                //				}
                //			}
                //			console.log($scope.TBMUsers);
            }

            if ($scope.userType == "ZBM") {
                $scope.ABMUsers = [];
                $scope.ABMZBM = true;
                $scope.tableHeight = "cutHeight";
                $scope.conditionalHeight = "shortTable";

                $scope.ABMUsers = $filter('designationFilter')(targetsList, 'ABM');
                //			for(var i in ABMUsersData)
                //			{
                //				if(ABMUsersData[i]!=null){
                //					$scope.ABMUsers.push(ABMUsersData[i]);
                //				}
                //			}
                if ($scope.ABMUsers.length == 0) {
                    $scope.abmSelected = true;
                    var TBMUsersData = $filter('designationFilter')(targetsList, 'TBM');
                    $scope.TBMUsers = TBMUsersData;
                    //				for(var i in TBMUsersData)
                    //				{
                    //					if(TBMUsersData[i]!=null){
                    //						$scope.TBMUsers.push(TBMUsersData[i].User__r.Name);
                    //					}
                    //				}
                }
            }
        };

        $scope.userChangeRecorded = function(value) {
            reset();
            if ($scope.userType == "ABM") {
                $scope.selectedTBM = value;
                $scope.showFilterBar = true;
                $scope.showTableDiv = true;


                var TBMUserRecords = $filter('getDataBasedOnDateFilter')(targetsList, $scope.selectedTBM.Territory__c, 'Territory__c');
                tbmUserId = '';
                if (TBMUserRecords.length > 0) {

                    tbmUserId = TBMUserRecords[0].User__c;
                    $scope.patchList = $filter('getDataBasedOnDateFilter')(patchData, tbmUserId, 'Target__r.User__c');
                }
                    $scope.arrayUsed = $filter('getDataBasedOnDateFilter')(appointmentDetails, $scope.selectedTBM.Territory__c, 'Target__r.Territory__c');

            } else if ($scope.userType == "ZBM") {
                $scope.tbmSelected = "";
                $scope.selectedABM = value;
                $scope.tableHeight = "cutHeight";
                $scope.conditionalHeight = "shortTable";

                $scope.TBMUsers = [];
                $scope.ABMZBM = true;
                $scope.tableHeight = "cutHeight";
                $scope.conditionalHeight = "shortTable";
                var TBMUsersData = $filter('getDataBasedOnDateFilter')(targetsList, $scope.selectedABM.Territory__c, 'Parent_Territory__c');
                $scope.TBMUsers = TBMUsersData;
            }
            $scope.abmSelected = true;
            $scope.changeAddType();
            dcrPatchService.setPatch($scope.patchList);
            dcrPatchService.setNames($scope.arrayUsed);
        };
        $scope.patchNew = dcrPatchService.getPatch();
        $scope.doctorList = dcrPatchService.getNames();
        $scope.tbmChangeRecorded = function(value) {
            reset();
            //		console.log($scope.tbmSelected);
            if ($scope.userType == "ZBM") {
                $scope.tbmSelected = value;

                $scope.showFilterBar = true;
                $scope.tableHeight = "cutHeight";
                $scope.conditionalHeight = "shortTable";
                $scope.showTableDiv = true;

                var TBMUserRecords = $filter('getDataBasedOnDateFilter')(targetsList, $scope.tbmSelected.Territory__c, 'Territory__c');
                tbmUserId = '';
                if (TBMUserRecords.length > 0) {
                    tbmUserId = TBMUserRecords[0].User__c;
                    $scope.patchList = $filter('getDataBasedOnDateFilter')(patchData, tbmUserId, 'Target__r.User__c');
                }

                //			var userRecord = $filter('getDataBasedOnDateFilter')(abbottConfigService.getSessionToken().user_roles, $scope.selectedABM.Territory__c, 'Territory__c');
                //			if(userRecord.length > 0) {
                ABM_Territory__c = $scope.selectedABM.Territory__c;
                $scope.arrayUsed = $filter('getDataBasedOnDateFilter')(appointmentDetails[value.Territory__c], value.Territory__c, 'Target__r.Territory__c');
                $scope.arrayUsed = $scope.dateFilter($scope.arrayUsed, $scope.dcrDate);
                //			}
            }
            $scope.changeAddType();
            dcrPatchService.setPatch($scope.patchList);
            dcrPatchService.setNames($scope.arrayUsed);
        };
        $scope.patchNew = dcrPatchService.getPatch();
        $scope.doctorList = dcrPatchService.getNames();

        var addDocType = document.getElementById("addDoctorByType");
        $scope.changeAddType = function() {

            $scope.peopleDetails = [];
            $scope.selectedPeople = [];
            $scope.selectedDoctors = [];

            if ($scope.group_type == "Patch") {
                //$scope.firstTimePatch=1;
                $scope.searchTableShow = false;
                $scope.hospitalTableShow = false;
                $scope.patchTableShow = true;
                $scope.docSelectBy = "Patch";
                $scope.docSearchFilter = null;
            }
            if ($scope.group_type == "Add By Search") {
                //$scope.firstTimePatch=2;
                $scope.patchTableShow = false;
                $scope.hospitalTableShow = false;
                $scope.searchTableShow = true;
                $scope.docSelectBy = "Search";
                $scope.docSearchFilter = null;
                $scope.filteredArraySearch = [];
            }
            if ($scope.group_type == "Hospital") {
                //$scope.firstTimePatch=2;
                $scope.patchTableShow = false;
                $scope.searchTableShow = false;
                $scope.hospitalTableShow = true;
                $scope.docSelectBy = "Hospital";
                $scope.docSearchFilter = null;
                for (var i in $scope.arrayUsed) {
                    if ($scope.arrayUsed[i].Hospital_Name__c != null) {
                        $scope.hospitalArray.push($scope.arrayUsed[i]);
                    }
                }
            }
        };

        $scope.peopleDetails = [];

        $scope.onChangePatchValue = function() {

           $scope.counter++;
            $scope.selectedPeople = [];
            $scope.peopleDetails = [];
            $scope.selectedDoctors=[];

        };

        $scope.showValue = function(selectedDoc, ele) {
            if ($scope.selectedPeople.indexOf(selectedDoc) == -1) {
                $scope.selectedPeople.push(selectedDoc);
                $scope.selectedDoctors.push(selectedDoc.Account__r.Name);

                // validate the doctors length. Should be less than 25
                if (selectedDoc.Account__r.RecordType.Name == "Doctor" && ($scope.docAndDetails.length + $scope.selectedPeople.length > 25)) {
                    popupService.openPopup($scope.locale.DoctorLengthLessThan25, $scope.locale.OK, "50%", function() {
                        popupService.closePopup();
                    });
                    $scope.selectedPeople.splice($scope.selectedPeople.indexOf(selectedDoc), 1);
                    ele.selectedValues[selectedDoc.Account__r.Name] = false;
                    return;
                } else {
                    var attributes = [];
                    var brandNameSelected;
                    for (var index = 1; index <= 10; index++) {
                        if (selectedDoc["Brand" + index + "__c"] != undefined) {
                            brandNameSelected = selectedDoc["Brand" + index + "__r"].Name;

                            attributes.push({
                                'brandName': brandNameSelected,
                                'brandId': selectedDoc["Brand" + index + "__c"],
                                'materialCode': null,
                                'materialName': $scope.locale.NoMaterials,
                                'quantity': 0,
                                'rxMonth': 0,
                                'dcrJunction': {},
                                'dcrKeyMessages': [],
                                'dcrFollowupMessages': [],
                                'dcrJFWs': [],
                                'brandIndex': index
                            });
                        }
                    }
                }

                if ($rootScope.lastVisited != undefined) {
                    var lastVisitedData = $rootScope.lastVisited;
                    var lastVisitDateRecords = $filter('getDataBasedOnDateFilter')(lastVisitedData, selectedDoc.Account__c, 'Account__c'),
                        lastVisitDate = $scope.locale.NotFound;
                    if (lastVisitDateRecords.length > 0) {
                        angular.forEach(lastVisitDateRecords, function(value, index) {
                            value.Last_Visit_Date__c = new Date(value.Last_Visit_Date__c);
                        });
                        lastVisitDates = $filter('orderBy')(lastVisitDateRecords, 'Last_Visit_Date__c', true);

                        lastVisitDate = lastVisitDateRecords[0].Last_Visit_Date__c;
                    }
                }

                $scope.peopleDetails.push({
                    'id': selectedDoc.Id,
                    'Account__c': selectedDoc.Account__c,
                    'assignment__c': selectedDoc.Id,
                    'patch': selectedDoc.Patch_Name__c,
                    'patchCode': selectedDoc.Patch__c,
                    'designation': selectedDoc.Speciality__c,
                    'customerCode': selectedDoc.Account__r.Customer_Code__c,
                    'isGovernmentDoctor': selectedDoc.Account__r.Is_Government_Doctor__c,
                    'institutionName': selectedDoc.Account__r.Institution_Name__c,
                    'privatePermittedPractice': selectedDoc.Account__r.PrivatePermittedPractice__c,
                    'customerType': selectedDoc.Account__r.RecordType.Name,
                    'attributes': attributes,
                    'lastVisitDate': lastVisitDate,
                    'customerName': selectedDoc.Account__r.Name,
                    'phone': selectedDoc.Mobile__c
                });
            } else if ($scope.selectedPeople.indexOf(selectedDoc) != -1) {
                $scope.selectedPeople.splice($scope.selectedPeople.indexOf(selectedDoc), 1);
                $scope.peopleDetails = $scope.peopleDetails.filter(function(value) {
                    return value.Account__c != selectedDoc.Account__c;
                })
            }

        };

        $scope.addDoctor = function() {

            window.ga.trackEvent('Navigate To Add doctor', 'click', 'addDoctor', 20000);

            var newCustomers = [];
            if ($scope.selectedPeople.length == 0) {
                popupService.openPopup($scope.locale.NoSelected + $scope.custName, $scope.locale.OK, "50%", function() {
                    popupService.closePopup();
                });
            } else {
                var content = ($scope.custType == $scope.locale.Activity) ? $scope.locale.customers : $scope.custType;
                popupService.DCRPopup($scope.selectedPeople.length + " "+ $scope.custType +  " were added to the list ", $scope.selectedDoctors, "EDIT", "DONE", '50%', function() {}, function() {
                    popupService.closePopup();
                    $timeout(function() {
                        if ($scope.custType == "Activity") {
                            var existingCustomers = dcrHelperService.getAddCustomersData();
                            angular.forEach($scope.peopleDetails, function(value, index) {
                                existingCustomers.push(value);
                            });

                            dcrHelperService.setAddCustomersData(existingCustomers);
                            angular.forEach($scope.peopleDetails, function(value, index) {
                                $scope.docAndDetails.push(value);
                            });
                            dcrHelperService.setCustomerDetails($scope.docAndDetails);
                            //Travel back to orginated page on add (Due to intermediate page)
                            if($rootScope.loggedUserDesignation=='ZBM' || $rootScope.loggedUserDesignation=='ABM'){
                                navigationService.simulateBackOperation();
                                $window.history.go(-2);
                                navigationService.registry.history.pop();
                            }else{
                                navigationService.backFunc();
                            }
                        } else {

                            dcrHelperService.setCurrentCustomerIndex($scope.docAndDetails.length);
                            angular.forEach($scope.peopleDetails, function(value, index) {
                                value.sortIndex = utils.getMax($scope.docAndDetails, 'sortIndex');
                                $scope.docAndDetails.push(value);
                                newCustomers.push(value);
                                $scope.docAndDetails[$scope.docAndDetails.length - 1].name = $scope.selectedPeople[index].Account__r.Name;
                                $scope.docAndDetails[$scope.docAndDetails.length - 1].recordType = "New";
                            });

                            $scope.add(newCustomers);
                        }
                    }, 500);
                });
            }
        };

        $scope.add = function(newCustomers) {

            var dcrMessagesData = [],
                entry = [];

            dcrHelperService.setCustomerDetails($scope.docAndDetails);

            var customerBrandActivities = [];

            customerBrandActivities = dcrHelperService.getDCRBrandActivity();
            customerBrandActivities.push([]);
            dcrHelperService.setDCRBrandActivity(customerBrandActivities);

            //		console.log(dcrHelperService.getCustomerDetails());

            angular.forEach(newCustomers, function(value, index) {
                var customerObj = {};

                customerObj.Account__c = value.Account__c;
                customerObj.Date__c = $scope.dcrDate;
                customerObj.Designation = value.designation;
                customerObj.Name = value.name;
                customerObj.Patch = value.patch;
                customerObj.PatchCode = value.patchCode;
                customerObj.Customer_Code__c = value.customerCode;
                customerObj.Is_Government_Doctor__c = value.isGovernmentDoctor;
                customerObj.Institution_Name__c = value.institutionName;
                customerObj.PrivatePermittedPractice__c = value.privatePermittedPractice;
                customerObj.CustomerType = value.customerType;
                customerObj.Assignment__c = value.assignment__c;
                customerObj.ABM_Territory__c = ABM_Territory__c;
                customerObj.SortIndex = value.sortIndex;
                customerObj.Phone = value.phone;
                entry.push(customerObj);
            });

            newCustomerCollection.upsertEntities(entry).then(function() {
                $rootScope.newCustomersForSelectedDay = $rootScope.newCustomersForSelectedDay.concat(entry);
                
                //Travel back to orginated page on add (Due to intermediate page)         
                if($rootScope.loggedUserDesignation=='ZBM' || $rootScope.loggedUserDesignation=='ABM'){
                    navigationService.simulateBackOperation();
                    $window.history.go(-2);
                    navigationService.registry.history.pop();
                }else{
                    navigationService.backFunc();
                }
            });
        };

        $scope.dateFilter = function(dates, dateDcr) {
            var result = [],
                effectiveDate = null,
                deActivationDate = null,
                DCRDate = null;
            angular.forEach(dates, function(value, index) {
                effectiveDate = new Date(value.Effective_Date__c),
                    deActivationDate = null;
                if (value.Deactivation_Date__c != null) {
                    deActivationDate = new Date(value.Deactivation_Date__c);
                }
                DCRDate = new Date(dateDcr);
                //filtering deactivated doctors
                if ((effectiveDate <= DCRDate) && ((deActivationDate > DCRDate) || (deActivationDate == null))) {
                    result.push(value);
                }
            });
            return result;

        };

        var reset = function() {
            $scope.arrayUsed = [];
            $scope.peopleDetails = [];
            $scope.selectedPeople = [];
            $scope.filteredArraySearch = [];
            $scope.hospitalArray = [];
            $scope.docSearchFilter = null;
            $scope.filteredArrayPatch = [];
            $scope.selectedDoctors = [];
            //currentUser = {};
            //targetsList = [];
            //divisionInfo = {};
            //appointmentDetails = null;
        };
        $scope.navigateToaddDoc = function() {
            if ($scope.selectedABM != null || $scope.selectedTBM != null || $scope.tbmSelected != null) {
                navigationService.navigate('dcrAddDoc', {
                    'selectedTab': $rootScope.tabTitle,
                    'selectedDate': $scope.dcrDate
                });
            }
        };
        $scope.navigateBack=function() {
        if($rootScope.loggedUserDesignation=='ZBM' || $rootScope.loggedUserDesignation=='ABM'){
                            navigationService.simulateBackOperation();
                            $window.history.go(-2);
                            navigationService.registry.history.pop();
                        }else{
                            navigationService.backFunc();
                        }
        }
        $scope.navigateBackPage=function() {

                navigationService.backFunc();
        }
        //On selecting new patch after selecting a doctor in another patch
        $scope.OnPatchChange=function(){
                   if($scope.counter>=1 && $scope.selectedPeople.length!=0){
                     popupService.openPopup("On selecting new patch, existing data will be lost", $scope.locale.OK, "50%", function() {
                                             popupService.closePopup();
                                         });
                    };
        }


        $scope.abwheaderConfig = {
            hambergFlag: true,
            applogoFlag: true,
            syncFlag: true,
            toggleSideMenu: false,
            notifyFlag: true,
            notifyCount: 3,
            searchFlag: false,
            searchHandler: searchHandler
        }

        function searchHandler(searchVal) {
            $scope.searchVal = searchVal;
        }

    }
]);

abbottApp.directive('addBrandText', function() {
    return {
        scope: {
            brand: "="
        },
        link: function(scope, element, attrs) {
            var getBrandText = function(index) {

                var brandIdText = '',
                    brandText = '',
                    brands = '';
                for (var i = 0; i <= 10; i++) {
                    brandIdText = "Brand" + i + "__c";
                    brandText = "Brand" + i + "__r";
                    if (index[brandText] != null && index[brandIdText] != null) {
                        brands += index[brandText].Name + ", ";
                    }
                }
                if (brands != '')
                    brands = brands.slice(0, -2);
                return brands;
            };
            scope.brandList = getBrandText(scope.brand);

        },

        template: "{{brandList}}"
    }
});