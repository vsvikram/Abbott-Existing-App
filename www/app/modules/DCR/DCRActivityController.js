abbottApp.controller('DCRActivityController', ['$scope','$stateParams','$window', '$rootScope', '$filter', 'abbottConfigService', 'dcrHelperService', 'statusDCRActivty', 'utils', 'popupService', '$timeout', 'navigationService', 'TABS_TYPES', 'dcrCollection', 'dcrJFWCollection', 'jfwOtherRolesCollection', 'mtpRemoveConfigCollection', 'dcrBrandActivityCollection', 'brandActivityCollection', 'reporteeJFWCollection', 'dcrDropCollection', 'campaignBrandActivityCollection', 'divisionwiseBrandCollection', 'materialLotCollection', 'campaignCollection', 'dcrJunctionCollection', 'userCollection', 'targetCollection', 'assigmentDetailCollection', 'newCustomerCollection', 'activitySelectionCollection', 'materialTransactionCollection',
function($scope,$stateParams,$window, $rootScope, $filter, abbottConfigService, dcrHelperService, statusDCRActivty, utils, popupService, $timeout, navigationService, TABS_TYPES, dcrCollection, dcrJFWCollection, jfwOtherRolesCollection, mtpRemoveConfigCollection, dcrBrandActivityCollection, brandActivityCollection, reporteeJFWCollection, dcrDropCollection, campaignBrandActivityCollection, divisionwiseBrandCollection, materialLotCollection, campaignCollection, dcrJunctionCollection, userCollection, targetCollection, assigmentDetailCollection, newCustomerCollection, activitySelectionCollection, MaterialTransactionCollection) {
	var isSymposia = false,
	    userType = '',
	    usersList = [],
	    targetsList = [],
	    currentUser = {},
	    currentTarget = {},
	    isChangesDetected = false,
	    appointmentDetails = null,
	    reporteeJFWCollectionInstance = new reporteeJFWCollection(),
	    dcrDropCollectionInstance = new dcrDropCollection(),
	    dcrBrandActivityCollectionInstance = new dcrBrandActivityCollection(),
	    materialTransactionCollectionInstance = new MaterialTransactionCollection(),
	    dcrJunctionCollectionInstance = new dcrJunctionCollection(),
	    dcrCollectionInstance = new dcrCollection(),
	    materialLotCollectionInstance = new materialLotCollection(),
	    mtpRemoveConfigCollectionInstance = new mtpRemoveConfigCollection(),
	    newCustomerCollectionInstance = new newCustomerCollection(),
	    activitySelectionCollectionInstance = new activitySelectionCollection(),
	    dcrJFWCollectionInstance = new dcrJFWCollection(),
	    navigationInitiated = false,
	    materialLotArray = [];
	$scope.activityDetails = [];
	$scope.paginationData = {
		'data' : [],
		paginationIndex : 0
	};

	$scope.releaseResources = function() {
		usersList = [];
		targetsList = [];
		currentUser = {};
		currentTarget = {};
		appointmentDetails = null;
		$scope.customerData_from_dcr.dcrData = [];
		$scope.customerData_from_dcr.dcrJunctionData = [];
		$scope.customerData_from_dcr.dcrDropData = [];
		$scope.customerData_from_dcr.dcrBrandActivityData = [];
		$scope.customerData_from_dcr.dcrJFWData = [];
		$scope.customerData_from_dcr.campaigns = [];
		$scope.customerData_from_dcr.corporateInitiatives = [];
		$scope.customerData_from_dcr.mtpRemoveConfig = [];
		$scope.customerData_from_dcr.brandActivities = [];
		$scope.customerData_from_dcr.reporteesJFWs = [];
		$scope.activityDetails = [];
		$scope.paginationData = {};
		$scope.locale = {};
		$scope.brandData.Materials = [];
		$scope.brandData.Campaigns = [];
		$scope.brandData.Laboratory = [];
		$scope.brandData.Patch = {};
		$scope.Brands = [];
		$scope.b = {};
	};

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
		if (fromState.url == "/dcrCreate" && toState.url != "/addDoc") {
			if ($scope.tabTabType == TABS_TYPES.ACTIVITIES) {
				$scope.releaseResources();
			}
		}
	});

	$scope.init = function() {

		window.ga.trackView('DCRActivity');
		window.ga.trackTiming('DCRActivity Load Start Time', 20000, 'DCRActivityLoadStart', 'DCRActivity load Start');

		$rootScope.dcrGlobalId = null;
		//Loading indicator code
		$scope.transperantConfig = abbottConfigService.getTransparency();
		$scope.transperantConfig.display = true;
		$scope.transperantConfig.showBusyIndicator = true;
		$scope.transperantConfig.showTransparancy = true;
		abbottConfigService.setTransparency($scope.transperantConfig);

		$scope.disableEdit = $rootScope.disablingEdit;
		$scope.locale = abbottConfigService.getLocale();
		$scope.transperantConfig.display = false;
		$scope.prevArrowVisible = false;
		$scope.nextArrowVisible = false;
		$scope.brandData = {
			Materials : [],
			Campaigns : [],
			Laboratory : [],
			Patch : {},
			brandIndex : 0
		};


		$scope.Brands = [{}];
		$rootScope.isNonFieldWork = true;

		$scope.b = $scope.Brands[$scope.brandData.brandIndex];
		$scope.activityType = [];

		$scope.filterdatetime = $filter('date')($scope.currentCalenderDate, 'yyyy-MM-dd');

         //Load the ACtivity accordingly
		 if ($stateParams.dcrActiviyIndex != null) {
                $scope.currentActivityIndex = $stateParams.dcrActiviyIndex;
        }else{
                $scope.currentActivityIndex = 0;
        }
		if (navigationService.isBackOperation()) {
			$scope.currentActivityIndex = dcrHelperService.getCurrentActivityIndex();
		}
		new assigmentDetailCollection().fetchUserAssignmentDetails().then(function(assigments) {
			appointmentDetails = assigments;
			return assigments;
		}).then($scope.loadUserData).then($scope.getDCR__c_data).then($scope.getDCR_Junction__c_data).then($scope.get_DCR_JFW__c_data).then($scope.getOtherJFWs).then($scope.getDCR_Drop__c_data).then($scope.getDCR_Brand_Activity__c_data).then($scope.getBrandData).then($scope.getMaterialData).then($scope.getCorporateInitiative).then($scope.getCampaigns).then($scope.getMTPRemoveConfig).then($scope.getBrandActivities).then($scope.getReporteesJFWs).then($scope.setup);
	};

	$scope.loadUserData = function() {
		var userCollectionInstance = new userCollection(),
		    targetCollectionInstance = new targetCollection();
		return userCollectionInstance.fetchAllCollectionEntities().then(function(allUsers) {
			usersList = allUsers;
		}).then(userCollectionInstance.getActiveUser).then(function(activeUser) {
			currentUser = activeUser;
			userType = activeUser.Designation__c;
		}).then(targetCollectionInstance.fetchAllCollectionEntities).then(function(targets) {
			targetsList = targets;
		}).then(targetCollectionInstance.fetchTarget).then(function(target) {
			currentTarget = target;
		})
	};

	$scope.getLocale = function () {
        return abbottConfigService.getLocale();
    };

	$scope.naviateToActivitySelection = function() {
		popupService.openConfirm($scope.locale.SelectActivity, $scope.locale.NavigateToActivitySelectionAlert, $scope.getLocale().No, $scope.getLocale().Yes, '55%', function() {

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
			navigationService.navigate('dcrActivitySelection', {
				'dateDCR' : $rootScope.DCRDate
			}, true);
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

		var dcrDataForSelectedDay = [],
		    dcrJunctionDataForSelectedDay = [],
		    dcrJunctionDataTemp = [],
		    dcrJunctions = [],
		    dcrJFWs = [],
		    dcrBrandActivities = [],
		    dcrBrandActivitiesDataForSelectedDay = [],
		    dcrDrops = [],
		    allCorporateInitiatives = [];

		if ($scope.disableEdit) {
			//updating soupEntryId with Id value if Id is not null
			$scope.updateSoupEntryId($scope.customerData_from_dcr.dcrData);
			$scope.updateSoupEntryId($scope.customerData_from_dcr.dcrJunctionData);
			$scope.updateSoupEntryId($scope.customerData_from_dcr.dcrJFWData);
			$scope.updateSoupEntryId($scope.customerData_from_dcr.dcrBrandActivityData);
			$scope.updateSoupEntryId($scope.customerData_from_dcr.campaigns);
			$scope.updateSoupEntryId($scope.customerData_from_dcr.corporateInitiatives);
		}

		$scope.BrandsList = dcrHelperService.getBrandsList();
		$scope.MaterialsList = dcrHelperService.getMaterialList();

		dcrDataForSelectedDay = $filter('filter')($scope.customerData_from_dcr.dcrData, {
			"Date__c" : $scope.filterdatetime
		}, true);

		$scope.customerData_from_dcr.reporteesJFWs = $filter('getDataBasedOnDateFilter')($scope.customerData_from_dcr.reporteesJFWs, $scope.filterdatetime, 'DCR__r.Date__c');

		if (dcrDataForSelectedDay.length > 0) {
			$rootScope.dcrGlobalId = dcrDataForSelectedDay[0]._soupEntryId;
			dcrJunctionDataTemp = $filter('filter')($scope.customerData_from_dcr.dcrJunctionData, {
				"DCR__c" : $rootScope.dcrGlobalId
			}, true);

			dcrBrandActivities = $filter('filter')($scope.customerData_from_dcr.dcrBrandActivityData, {
				"DCR__c" : $rootScope.dcrGlobalId
			}, true);
		} else {
			$rootScope.dcrGlobalId = null;
			dcrJunctionDataTemp = [];
			dcrBrandActivities = [];
		}

		for (var i = 0; i < $scope.activitiesSelectedInActivitySelectionPage.length; i++) {
			if ($scope.activitiesSelectedInActivitySelectionPage[i].Name != 'Field Work') {
				//var type = ($scope.activitiesSelectedInActivitySelectionPage[i].Name == 'CME/Symposia' || $scope.activitiesSelectedInActivitySelectionPage[i].Name == 'Camp/Clinic/Activity') ? 'Symposia' : 'NonSymposia',
				var activityName = $scope.activitiesSelectedInActivitySelectionPage[i].Name,
				    type = ((activityName.indexOf("CME/Symposia") > -1) || (activityName.indexOf("Camp/Clinic/Activity") > -1)) ? 'Symposia' : 'NonSymposia',
				    allDcrJFWs = [],
				    allDcrDrops = [],
				    allDcrJunctions = [],
				    activityComment = '';
				if (type == "Symposia") {
					dcrJunctionDataForSelectedDay = $filter('filterNonEmpty')(dcrJunctionDataTemp, 'DCR_Brand_Activity__c');
					//filtered activity records only
					dcrBrandActivities = $filter('filterEmpty')(dcrBrandActivities, 'DCR_Junction__c');
					//filter for Non CME Symposia
					dcrBrandActivitiesDataForSelectedDay = $filter('filterEmpty')(dcrBrandActivities, 'Corporate_Initiative__c');
					//filtered activity records only
					allCorporateInitiatives = $filter('filterNonEmpty')(dcrBrandActivities, 'Corporate_Initiative__c');
					angular.forEach(dcrBrandActivitiesDataForSelectedDay, function(value, index) {

						dcrJFWs = $filter('filter')($scope.customerData_from_dcr.dcrJFWData, {
							"Brand_Activity__c" : value._soupEntryId
						}, true);
						angular.forEach(dcrJFWs, function(value, index) {
							allDcrJFWs.push(value);
						});

						dcrDrops = $filter('filter')($scope.customerData_from_dcr.dcrDropData, {
							"Brand_Activity__c" : value._soupEntryId
						}, true);
						angular.forEach(dcrDrops, function(value, index) {
							allDcrDrops.push(value);
						});

						dcrJunctions = $filter('filter')(dcrJunctionDataForSelectedDay, {
							"DCR_Brand_Activity__c" : value._soupEntryId
						}, true);
						angular.forEach(dcrJunctions, function(value, index) {
							allDcrJunctions.push(value);
						});
					});
				} else {
					if (dcrDataForSelectedDay.length > 0) {
						$scope.b.comments = "";
						dcrJFWs = $filter('filter')($scope.customerData_from_dcr.dcrJFWData, {
							"DCR__c" : $rootScope.dcrGlobalId
						}, true);
						allDcrJFWs = $filter('filterEmpty')(dcrJFWs, 'DCR_Junction__c');
						allDcrJFWs = $filter('filterEmpty')(allDcrJFWs, 'Brand_Activity__c');

						allDcrJFWs = $filter('filter')(allDcrJFWs, {
							"Activity_Master__c" : $scope.activitiesSelectedInActivitySelectionPage[i].Id
						}, true);

						activityComment = dcrDataForSelectedDay[0]['Comment' + (i + 1) + '__c'];
					}

					//Load reportees JFWs
					if (allDcrJFWs.length == 0) {
						angular.forEach($scope.customerData_from_dcr.reporteesJFWs, function(value1, index) {
							if ($scope.activitiesSelectedInActivitySelectionPage[i].Id == value1.Activity_Master__c) {
								allDcrJFWs.push({
									'User2__c' : value1.User1__c,
									'User_Type__c' : value1.User_Type__c
								});
							}
						});
					}
				}

				if ($scope.disableEdit) {
					if (allDcrJunctions.length > 0) {
						if (allDcrJunctions[0].Sequence_Number__c != undefined) {
							allDcrJunctions = $filter('toNumber')(allDcrJunctions, 'Sequence_Number__c');
							allDcrJunctions = $filter('orderBy')(allDcrJunctions, 'Sequence_Number__c');
						} else {
							allDcrJunctions = $filter('orderBy')(allDcrJunctions, 'Name');
						}
					}

					if (allDcrDrops.length > 0) {
						if (allDcrDrops[0].Sequence_Number__c != undefined) {
							allDcrDrops = $filter('toNumber')(allDcrDrops, 'Sequence_Number__c');
							allDcrDrops = $filter('orderBy')(allDcrDrops, 'Sequence_Number__c');
						} else {
							allDcrDrops = $filter('orderBy')(allDcrDrops, 'Name');
						}
					}

					if (dcrBrandActivitiesDataForSelectedDay.length > 0) {
						if (dcrBrandActivitiesDataForSelectedDay[0].Sequence_Number__c != undefined) {
							dcrBrandActivitiesDataForSelectedDay = $filter('toNumber')(dcrBrandActivitiesDataForSelectedDay, 'Sequence_Number__c');
							dcrBrandActivitiesDataForSelectedDay = $filter('orderBy')(dcrBrandActivitiesDataForSelectedDay, 'Sequence_Number__c');
						} else {
							dcrBrandActivitiesDataForSelectedDay = $filter('orderBy')(dcrBrandActivitiesDataForSelectedDay, 'Name');
						}
					}

					if (allDcrJFWs.length > 0) {
						if (allDcrJFWs[0].Sequence_Number__c != undefined) {
							allDcrJFWs = $filter('toNumber')(allDcrJFWs, 'Sequence_Number__c');
							allDcrJFWs = $filter('orderBy')(allDcrJFWs, 'Sequence_Number__c');
						} else {
							allDcrJFWs = $filter('orderBy')(allDcrJFWs, 'Name');
						}
					}
				}

				$scope.activityDetails.push({
					'ActivityName' : $scope.activitiesSelectedInActivitySelectionPage[i].Name,
					'Type' : type,
					'dcrJunctions' : allDcrJunctions,
					'dcrBrandActivities' : dcrBrandActivitiesDataForSelectedDay,
					'allDcrJFWs' : allDcrJFWs,
					'allDcrDrops' : allDcrDrops,
					'corporateInitiatives' : allCorporateInitiatives,
					'activityComment' : activityComment,
					'activityIndex' : '' + (i + 1)
				});
			}
		}
		$scope.currentActivity = $scope.activityDetails[$scope.currentActivityIndex];
		$scope.load(true);
		window.ga.trackTiming('DCRActivity Load Finish Time', 20000, 'DCRActivityLoadFinish', 'DCRActivity load Finish');
	};

	$scope.load = function(onLaunch) {
		if ($scope.currentActivity.Type != 'Symposia') {
			$scope.b.comments = $scope.currentActivity.activityComment;

			if ($scope.currentActivity.allDcrJFWs.length > 0) {
				$scope.loadJFW($scope.currentActivity.allDcrJFWs);
			} else {
				$scope.selectedSupervisorIds = [];
			}
		} else {

			var brandActivities = $scope.currentActivity.dcrBrandActivities,
			    brandData = {
				'Campaigns' : [],
				'Patch' : [],
				'Materials' : [],
				'Laboratory' : []
			};

			if (brandActivities.length > 0) {
				$scope.Brands = [];
			}

			if (!navigationService.isBackOperation()) {
				if (onLaunch) {
					brandData.brandIndex = 0;
				} else {
					brandData.brandIndex = $scope.brandData.brandIndex;
				}
				angular.forEach(brandActivities, function(value, index) {
					var brandActivityDetails = {
						'Materials' : [],
						'Customers' : [],
						'corporateInitiative' : []
					},
					    brandActivityNameArray = [];
					brandActivityDetails.NoOfDoctors = value.Number_of_Patients_Added__c;
					brandActivityDetails.remarks = value.Remarks__c;

					brandActivityDetails.sortIndex = value.Sequence_Number__c;

					brandActivityNameArray = $filter('filter')($scope.customerData_from_dcr.brandActivities, {
						'Id' : value.Brand_Activity__c
					}, true);

					//if ($scope.currentActivity.ActivityName == 'Camp/Clinic/Activity/CME/Symposia') { //changing the activity name to fix binding issue in HTML
						brandActivityDetails.Speaker = value.Name_of_speaker__c;
					//} else {  // commenting as Activity merged now
						brandActivityDetails.Other_Participants__c = value.Other_Participants__c;
						brandActivityDetails.Patients_Initiated__c = value.Patients_Initiated__c;
				//	}

					//get brand name from campaign id
					var brandId = '',
					    brandActivityName = '',
					    brandName = '';
					if (brandActivityNameArray.length > 0) {

						brandActivityName = brandActivityNameArray[0].Name;
						if (brandActivityName != undefined) {
							brandName = brandActivityName.split("_")[1];
						}
						brandActivityDetails.brandName = brandName;
						brandActivityDetails.campaignId = brandActivityNameArray[0].Campaign__r.Id;

						//if(value.Laboratory__c!=null) {
						var campaignRecord = $filter('filter')($scope.customerData_from_dcr.campaigns, {
							'Id' : brandActivityDetails.campaignId
						}, true);
						if (campaignRecord.length > 0) {
							var laboratory = campaignRecord[0].Applicable_Laboratories__c,
							    laboratoryArray = [];
							if (laboratory != null || laboratory != undefined) {
								brandActivityDetails.isApplicableLaboratory = true;
								laboratory = laboratory.split(";");
								for (var i = 0; i < laboratory.length; i++) {
									if (laboratory[i] != "") {
										laboratoryArray.push(laboratory[i]);
									}
								}
								if (!brandData.Laboratory[brandActivityDetails.campaignId])
									brandData.Laboratory[brandActivityDetails.campaignId] = laboratoryArray;
							}
						}
						//}

						//Laboratory CR changes
						brandActivityDetails.laboratoryName = value.Laboratory__c;
						brandActivityDetails.noOfPaients = value.No_of_Patients_Screened__c;
						brandActivityDetails.honorariumAmt = value.Honorarium_Amount__c;
						brandActivityDetails.anyOtherCost = value.Any_other_cost__c;

						brandActivityDetails.dcrCampaignSoupEntryId = value._soupEntryId;

						brandData.Campaigns[brandActivityDetails.brandName] = $filter('filter')($scope.customerData_from_dcr.campaigns, {
							'Applicable_Brands__c' : brandActivityDetails.brandName + ';'
						});

						brandData.Materials[brandActivityDetails.brandName] = $filter('getDataBasedOnDateFilter')($scope.MaterialsList, brandActivityDetails.brandName, 'Brand__c');

						brandId = $scope.getBrandId(brandActivityDetails.brandName);
					}

					var materials = [],
					    jfws = [];
					if (brandId != null) {
						materials = $filter('filter')($scope.currentActivity.allDcrDrops, {
							'Brand_Activity__c' : brandActivityDetails.dcrCampaignSoupEntryId
						}, true);

						jfws = $filter('filter')($scope.currentActivity.allDcrJFWs, {
							'Brand_Activity__c' : brandActivityDetails.dcrCampaignSoupEntryId
						}, true);
						brandActivityDetails.jfws = jfws;
					}

					//get materials from brand id
					angular.forEach(materials, function(materialValue, index) {
						brandActivityDetails.Materials.push({
							'materialCode' : materialValue.Material_Lot__c,
							'Quantity' : materialValue.Quantity__c,
							'oldQuantity' : materialValue.Quantity__c
						});
					});

					var dcrJunctions = $filter('filter')($scope.currentActivity.dcrJunctions, {
						'DCR_Brand_Activity__c' : brandActivityDetails.dcrCampaignSoupEntryId
					}, true),
					    customers = [];

					angular.forEach(dcrJunctions, function(dcrJunctionValue, index) {

						if (userType == 'ZBM') {
							var ABMUsersData = $filter('designationFilter')(targetsList, 'ABM'),
							    matchFound = false;

							if (matchFound == false) {
								angular.forEach(ABMUsersData, function(value, index) {
									var filteredData = $filter('filter')(appointmentDetails[value.Territory__c], {
										'Account__c' : dcrJunctionValue.Account__c
									}, true);
									if (filteredData != undefined && filteredData.length > 0) {
										matchFound = true;
										customers = filteredData;
									}
								});
							}
						} else {
							customers = $filter('filter')(appointmentDetails, {
								'Account__c' : dcrJunctionValue.Account__c
							}, true);
						}

						if (customers.length > 0) {
							brandActivityDetails.Customers.push({
								'patch' : customers[0].Patch_Name__c,
								'patchCode' : customers[0].Patch__c,
								'customerName' : customers[0].Account__r.Name,
								'customerType' : customers[0].Account__r.RecordType.Name,
								'Account__c' : customers[0].Account__c,
								'assignment__c' : customers[0].Id,
								'honorariumAmt' : dcrJunctionValue.HonorariumAmountDCRJunction__c,
								'laboratoryCustomer' : dcrJunctionValue.LaboratoryDCRJunction__c,
								'noOfPaients' : dcrJunctionValue.NoOfPatientsScreenedDCRJunction__c,
								'anyOtherCost' : dcrJunctionValue.AnyOtherCostDCRJunction__c
							});
						}
					});

					var corporateInitiatives = $scope.currentActivity.corporateInitiatives,
					    filteredCorpInitiative = $filter('filter')(corporateInitiatives, {
						"DCR_Junction_Self__c" : brandActivityDetails.dcrCampaignSoupEntryId
					}, true);
					angular.forEach(filteredCorpInitiative, function(item, index) {
						brandActivityDetails.corporateInitiative[item.Corporate_Initiative__c] = true;
					});

					$scope.Brands.push(brandActivityDetails);
				});

				$scope.b = $scope.Brands[$scope.brandData.brandIndex];

				if (brandActivities.length == 0) {
					$scope.b.sortIndex = 0;
				}

				$scope.brandData = brandData;
				$scope.loadJFW($scope.b.jfws);
			} else {
				$scope.Brands = dcrHelperService.getActivityBrandsData();
				$scope.brandData = dcrHelperService.getActivityDetailsData();
				$scope.b = $scope.Brands[$scope.brandData.brandIndex];
				var brandId = $scope.getBrandId($scope.b.brandName);
				$scope.customerData = dcrHelperService.getAddCustomersData();
				var brandDetails = $scope.Brands[$scope.brandData.brandIndex];
				brandDetails.Customers = [];
				angular.forEach($scope.customerData, function(value, index) {
					brandDetails.Customers.push({
						'patch' : value.patch,
						'patchCode' : value.patchCode,
						'customerName' : value.customerName,
						'customerType' : value.customerType,
						'Account__c' : value.Account__c,
						'assignment__c' : value.assignment__c,
						'honorariumAmt' : value.honorariumAmt,
						'laboratoryCustomer' : value.laboratoryCustomer,
						'noOfPaients' : value.noOfPaients,
						'anyOtherCost' : value.anyOtherCost
					});
				});
				$scope.b = brandDetails;
				$scope.selectedSupervisorIds = $scope.b.selectedSupervisorIds;
			}
		}
		if (navigationService.isBackOperation()) {
			navigationService.isBackPressed = false;
			$scope.paginationData = dcrHelperService.getPaginationData();
		} else {
			$scope.setPagination();
		}

		$scope.showArrows();
	};

	$scope.setPagination = function() {
		$scope.paginationData.data = [];
		//		$scope.paginationData.paginationIndex = 0;
		for (var i = 0; i < $scope.activitiesSelectedInActivitySelectionPage.length; i++) {
			if ($scope.activitiesSelectedInActivitySelectionPage[i].Name != 'Field Work') {
				//var type = ($scope.activitiesSelectedInActivitySelectionPage[i].Name == 'CME/Symposia' || $scope.activitiesSelectedInActivitySelectionPage[i].Name == 'Camp/Clinic/Activity') ? 'Symposia' : 'NonSymposia';
				var activityName = $scope.activitiesSelectedInActivitySelectionPage[i].Name,
				    type = ((activityName.indexOf("CME/Symposia") > -1) || (activityName.indexOf("Camp/Clinic/Activity") > -1)) ? 'Symposia' : 'NonSymposia';
				if (type == "Symposia") {
					var symposiaActivityDetails = $scope.Brands;
					//					if ($scope.activityDetails[$scope.currentActivityIndex].Type == 'Symposia') {
					//						symposiaActivityDetails = $scope.Brands;
					//					}

					if (symposiaActivityDetails.length > 0) {
						angular.forEach(symposiaActivityDetails, function(value, index) {
							$scope.paginationData.data.push({
								'type' : 'Symposia',
								'index' : i,
								'name' : $scope.activitiesSelectedInActivitySelectionPage[i].Name
							});
						});
					} else {
						$scope.paginationData.data.push({
							'type' : 'Symposia',
							'index' : i,
							'name' : $scope.activitiesSelectedInActivitySelectionPage[i].Name
						});
					}

				} else {
					$scope.paginationData.data.push({
						'type' : 'nonSymposia',
						'index' : i,
						'name' : $scope.activitiesSelectedInActivitySelectionPage[i].Name
					});
				}
			}
		}
	};

	var resetLaboratoryFields = function() {
		//Reset previous values on change of campaign
		delete $scope.b["noOfPaients"];
		delete $scope.b["honorariumAmt"];
		delete $scope.b["laboratoryName"];
		delete $scope.b["anyOtherCost"];

		angular.forEach($scope.b.Customers, function(value, index) {
			delete value['laboratoryCustomer'];
			delete value['honorariumAmt'];
			delete value['anyOtherCost'];
			delete value['noOfPaients'];
		});
	};

	$scope.onCampaignChange = function(campaignId) {
		var campaignRecord = $filter('filter')($scope.customerData_from_dcr.campaigns, {
			'Id' : campaignId
		}, true),
		    brandActivityRecord = $filter('getDataBasedOnDateFilter')($scope.customerData_from_dcr.brandActivities, campaignId, 'Campaign__r.Id');

		if (campaignRecord.length > 0) {
			$scope.b.campaignId = campaignRecord[0].Id;

			if (brandActivityRecord.length > 0) {
				$scope.b.GovernmentCampaign = brandActivityRecord[0].Government_Doctor__c;
				$scope.b.Institution = brandActivityRecord[0].Institution__c;
				$scope.b.PrivatePermittedPractice = brandActivityRecord[0].Private_Permitted_Practice__c;
			}

			resetLaboratoryFields();
			var laboratory = campaignRecord[0].Applicable_Laboratories__c,
			    laboratoryArray = [];
			if (laboratory != null || laboratory != undefined) {
				laboratory = laboratory.split(";");
				for (var i = 0; i < laboratory.length; i++) {
					if (laboratory[i] != "") {
						laboratoryArray.push(laboratory[i]);
					}
				}
				if (!$scope.brandData.Laboratory[campaignId])
					$scope.brandData.Laboratory[campaignId] = laboratoryArray;
			}
		}
		$scope.b.isApplicableLaboratory = ($scope.brandData.Laboratory[campaignId] && $scope.brandData.Laboratory[campaignId].length > 0) ? true : false;
	};

	$scope.loadJFW = function(dcrJFWs) {
		//Loading JFW
		var userName = '',
		    selectedJFWUsers = [];

		$scope.selectedSupervisorIds = [];
		angular.forEach(dcrJFWs, function(value, index) {
			userName = getJFWUserName(value.User2__c);
			selectedJFWUsers.push({
				"id" : value.User2__c,
				"name" : userName,
				"designation" : value.User_Type__c
			});
		});

		$timeout(function() {
			$scope.selectedSupervisorIds = selectedJFWUsers;
		}, 0);
	};

	var getJFWUserName = function(id) {
		var userWithPassedIdToSupervisors = $filter('filter')(usersList, {
			'Id' : id
		}),
		    userName = '';

		if (userWithPassedIdToSupervisors.length == 0) {
			userWithPassedIdToSupervisors = $filter('filter')(targetsList, {
				'User__c' : id
			});
			if (userWithPassedIdToSupervisors.length > 0) {
				userName = userWithPassedIdToSupervisors[0].User__r.Name;
				return userName;
			} else {
				userWithPassedIdToSupervisors = $filter('filter')($rootScope.listOfOtherJFWs, {
					'User__c' : id
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

	//Get doctor details for the given Brand
	$scope.getCustomerDetails = function() {
		var group = '';
		if (userType == 'ZBM') {
			var ABMUsersData = $filter('designationFilter')(targetsList, 'ABM');
			angular.forEach(ABMUsersData, function(value, index) {
				angular.forEach(appointmentDetails[value.Territory__c], function(item, index) {
					group = item.Patch_Name__c;
					$scope.brandData.Patch[group] = $scope.brandData.Patch[group] || [];
					$scope.brandData.Patch[group].push(item);
				});
			});
		} else {
			angular.forEach(appointmentDetails, function(item, index) {
				group = item.Patch_Name__c;
				$scope.brandData.Patch[group] = $scope.brandData.Patch[group] || [];
				$scope.brandData.Patch[group].push(item);
			});
		}
	};

	//Get materials on change of Brand selection
	$scope.getMaterialCampaign = function(b, oldValue) {

		//Check for duplicate
		if ($scope.Brands) {
			var index = $scope.getAllIndexes($scope.Brands, "brandName", b.brandName);
			if (index.length > 1) {
				b.brandName = oldValue;
				popupService.openPopup($scope.locale.BrandExist, $scope.locale.OK, '35%');
				return;
			}
		}
		delete b["campaignId"];
		var filteredBrands = $filter('getDataBasedOnDateFilter')($scope.MaterialsList, b.brandName, 'Brand__c'),
		    filteredCampaignsOnBrand = [],
		    filteredCorporateInitiativesOnBrand = [];
		if (!$scope.brandData.Materials[b.brandName]) {
			$scope.brandData.Materials[b.brandName] = $filter('orderBy')(filteredBrands, 'Material_Name__c');
		}

		var materialsFromCommonGroup = $scope.getAndInsertMaterialsOfCommonGroup(b.brandName);
		if (materialsFromCommonGroup.length > 0) {
			$scope.brandData.Materials[b.brandName] = materialsFromCommonGroup;
		}

		//Get campaigns for all the brand
		filteredCampaignsOnBrand = $filter('filter')($scope.customerData_from_dcr.campaigns, {
			'Applicable_Brands__c' : b.brandName + ';'
		});
		if (!$scope.brandData.Campaigns[b.brandName])
			$scope.brandData.Campaigns[b.brandName] = $filter('orderBy')(filteredCampaignsOnBrand, 'Name');

		//Reset Laboratory fields on brand change
		resetLaboratoryFields();
		b.isApplicableLaboratory = false;
	};

	$scope.getBrandGroupName = function(brandName) {
		var brandGroupName = null,
		    brandDataArray = $filter('filter')(dcrHelperService.getBrandsList(), {
			'Name' : brandName
		}, true);
		if (brandDataArray.length > 0) {
			brandGroupName = brandDataArray[0].Group_Name__c;
		}
		return brandGroupName;
	};

	$scope.getAndInsertMaterialsOfCommonGroup = function(brandName) {
		var brandGropName = $scope.getBrandGroupName(brandName),
		    brandsWithSameGroupName = (brandGropName != null) ? $filter('filter')(dcrHelperService.getBrandsList(), {
			'Group_Name__c' : brandGropName
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

	/************* Validation to prevent duplicate selection in Material dropdown **************/
	$scope.onMaterialChange = function(materials, materialRows, oldMaterial) {

		var materialArr = $filter('filter')($scope.MaterialsList, {
			"Id" : materialRows.materialCode
		}, true);
		if (materialArr.length > 0) {
			var defaultQuantity = (materialArr[0].Default_Quantity__c != null && materialArr[0].Default_Quantity__c < materialArr[0].In_Hand_Quantity__c) ? materialArr[0].Default_Quantity__c : 0;
			materialRows.oldQuantity = materialArr[0].Default_Quantity__c == null ? 0 : defaultQuantity;
			materialRows.Quantity = materialArr[0].Default_Quantity__c == null ? 0 : defaultQuantity;
		}

		var index = $scope.getAllIndexes(materials, "materialCode", materialRows.materialCode);
		if (index.length > 1) {
			materialRows.materialCode = oldMaterial;
			popupService.openPopup($scope.locale.MaterialExist, $scope.locale.OK, '35%');
			return;
		}
	};

	$scope.onCustomerChange = function(customerRow, oldCustomerAccount) {//selectedCustomer
		var selectedCustomerAccount__c = customerRow.customerAccount.Account__c,
		    oldCustomerAccountObj = (oldCustomerAccount != '') ? JSON.parse(oldCustomerAccount) : '';
		customers = $filter('getDataBasedOnDateFilter')($scope.b.Customers, selectedCustomerAccount__c, 'customerAccount.Account__c');
		if (customers.length > 1) {
			customerRow.customerAccount = oldCustomerAccountObj;
			//			customerRow.customerAccount.Account__r.Name = oldCustomerAccountObj.Account__r.Name;
			popupService.openPopup($scope.locale.CustomerExist, $scope.locale.OK, '35%');
			return;
		}
	};

	$scope.getBrandData = function() {
		var divisionwiseBrandCollectionInstance = new divisionwiseBrandCollection();
		return divisionwiseBrandCollectionInstance.fetchAll().then(divisionwiseBrandCollectionInstance.fetchRecursiveFromCursor).then(function(divisionwiseBrandList) {
			if (divisionwiseBrandList.length && !$scope.disableEdit) {
				divisionwiseBrandList = divisionwiseBrandList.filter(function(brand) {
					return new Date(brand.Effective_From__c) <= new Date($scope.currentCalenderDate) && (new Date(brand.Effective_Till__c) >= new Date($scope.currentCalenderDate) || brand.Effective_Till__c == null);
				});
			}
			divisionwiseBrandList = $filter('orderBy')(divisionwiseBrandList, 'Name');
			dcrHelperService.setBrandsList(divisionwiseBrandList);
			return divisionwiseBrandList;
		});
	};

	$scope.getMaterialData = function() {
		return materialLotCollectionInstance.fetchAll().then(materialLotCollectionInstance.fetchRecursiveFromCursor).then(function(materialLotList) {
			if (materialLotList.length) {
				dcrHelperService.setMaterialList(materialLotList);
				materialLotArray = materialLotList;
			}
			return materialLotList;
		});
	};

	$scope.getCorporateInitiative = function() {
		var campaignCollectionInstance = new campaignCollection();
		return campaignCollectionInstance.fetchAll().then(campaignCollectionInstance.fetchRecursiveFromCursor).then(function(campaignList) {
			campaignList = campaignList.filter(function(campaign) {
				return new Date(campaign.Start_Date__c) <= new Date($scope.currentCalenderDate) && new Date(campaign.End_Date__c) >= new Date($scope.currentCalenderDate);
			});
			campaignList = $filter('orderBy')(campaignList, 'Name');
			$scope.corporateNotAvailable = !campaignList.length;
			$scope.customerData_from_dcr.corporateInitiatives = campaignList;
			return campaignList;
		});
	};

	$scope.getCampaigns = function() {
		var campaignBrandActivityCollectionInstance = new campaignBrandActivityCollection();
		return campaignBrandActivityCollectionInstance.fetchAll().then(campaignBrandActivityCollectionInstance.fetchRecursiveFromCursor).then(function(campaignBrandActivityList) {
			campaignBrandActivityList = $filter('filter')(campaignBrandActivityList, {
				'Activity_Type__c' : 'Out-Clinic'
			});
			campaignBrandActivityList = $filter('filter')(campaignBrandActivityList, {
				'Applicable_Divisons__c' : currentUser.Division
			});
			campaignBrandActivityList = campaignBrandActivityList.filter(function(campaign) {
				return new Date(campaign.Start_Date__c) <= new Date($scope.currentCalenderDate) && new Date(campaign.End_Date__c) >= new Date($scope.currentCalenderDate);
			});
			$scope.customerData_from_dcr.campaigns = campaignBrandActivityList;
			return campaignBrandActivityList;
		});
	};

	$scope.getBrandId = function(brandName) {
		var brandId = null,
		    brandDataArray = $filter('filter')($scope.BrandsList, {
			'Name' : brandName
		}, true);
		if (brandDataArray.length > 0) {
			brandId = brandDataArray[0].Id;
		}
		return brandId;
	};

	//delete customer rows on click of delete icon
	$scope.delCustomerRow = function(b, c) {
		var index = b.Customers.indexOf(c);
		if (index > -1) {
			b.Customers.splice(index, 1);
		}

		var docAndDetails = dcrHelperService.getCustomerDetails();
		for (var i = docAndDetails.length - 1; i >= 0; i--) {
			if (docAndDetails[i].Account__c == c.Account__c) {
				docAndDetails.splice(i, 1);
			}
		}
		dcrHelperService.setCustomerDetails(docAndDetails);
	};

	//delete customer rows on click of delete icon
	$scope.delMaterialRow = function(b, mr) {
		var index = b.Materials.indexOf(mr);
		if (index > -1) {
			b.Materials.splice(index, 1);

			var filteredMaterialArr = $filter('filter')($scope.brandData.Materials[$scope.b.brandName], {
				"Id" : mr.materialCode
			}, true);
			if (filteredMaterialArr.length > 0) {
				filteredMaterialArr[0].In_Hand_Quantity__c += mr.Quantity;
			}
		}
	};

	$scope.addCustomersRows = function(b) {
		if (b.campaignId == undefined) {
			popupService.openPopup($scope.locale.CampaignShouldBeSelectedOnSMESymposia, $scope.locale.OK, '35%');
			return;
		}
		dcrHelperService.setActivityDetailsData($scope.brandData);
		b.selectedSupervisorIds = $scope.selectedSupervisorIds;
		$scope.Brands[$scope.brandData.brandIndex] = b;
		dcrHelperService.setActivityBrandsData($scope.Brands);
		dcrHelperService.setPaginationData($scope.paginationData);
		dcrHelperService.setCurrentActivityIndex($scope.currentActivityIndex);

		$scope.customerData = $scope.b.Customers || [];
		dcrHelperService.setAddCustomersData($scope.customerData);

		navigationService.navigate('addDoc', {
			'selectedTab' : $rootScope.tabTitle
		});
	};

	//Add materials rows on click of add material icon
	$scope.addMaterialRows = function(b) {
		b.Materials = b.Materials || [];
		var keepGoing = true;
		angular.forEach(b.Materials, function(data2, index1) {
			if (keepGoing == true && !data2.materialCode && data2.materialCode == null) {
				popupService.openPopup($scope.locale.AddSequentialMaterials, $scope.locale.OK, '35%');
				keepGoing = false;
			}
		});
		if (keepGoing == true) {
			b.Materials.push({});
		}
	};

	//Adding a new brand
	$scope.addBrand = function() {
	    $scope.addBrandButtonClicked = true;
		var keepGoing = true;
		angular.forEach($scope.Brands, function(data1, index1) {
			if (keepGoing == true && !data1.brandName) {
				popupService.openPopup($scope.locale.AddSequentialBrands, $scope.locale.OK, '35%');
				keepGoing = false;
			}
		});

		if (keepGoing == true) {
			$scope.b.selectedSupervisorIds = $scope.selectedSupervisorIds;
			$scope.Brands.push({
				'sortIndex' : utils.getMax($scope.Brands, 'sortIndex'),
				'isApplicableLaboratory' : false
			});

			$scope.nextButtonClicked(true);
			$scope.setPagination();
		}
	};

	//Removing a existing brand
	$scope.removeBrand = function() {
		if ($scope.Brands.length > 1 || ($scope.Brands.length == 1 && $scope.b.dcrCampaignSoupEntryId != undefined)) {
			popupService.openConfirm($scope.locale.RemoveBrand, $scope.locale.RemoveBrandConfirmation, $scope.getLocale().No, $scope.getLocale().Yes, '35%', function() {

			}, function() {
				if ($scope.Brands) {
					var brandIndex = $scope.brandData.brandIndex;
					brandData = $scope.b,
					paginationIndex = $scope.paginationData.paginationIndex;

					$scope.selectedSupervisorIds = [];
					$scope.prevButtonClicked(true, function(isSameActivity) {
						$scope.deleteBrandData(brandData, function() {
							$scope.Brands.splice(brandIndex, 1);
							if ($scope.Brands.length == 0) {
								$scope.Brands.push({});
							} else {
								$scope.paginationData.data.splice(paginationIndex, 1);
								$scope.showArrows();
							}

							$timeout(function() {
								if (isSameActivity == false) {
									$scope.currentActivityIndex--;
									$scope.currentActivity = $scope.activityDetails[$scope.currentActivityIndex];
									$scope.load();
								} else {
									$scope.b = $scope.Brands[$scope.brandData.brandIndex];
								}
							}, 100);
						});
					});

				}
			});
		}
	};

	$scope.showArrows = function() {
		/*if ($scope.paginationData.data != undefined) {
			if ($scope.paginationData.paginationIndex < $scope.paginationData.data.length - 1) {
				$scope.nextArrowVisible = true;
			} else {
				$scope.nextArrowVisible = false;
			}

			if ($scope.paginationData.paginationIndex > 0) {
				$scope.prevArrowVisible = true;
			} else {
				$scope.prevArrowVisible = false;
			}
		}*/
		//Show arrows only for CampClinic
		if ($scope.Brands != undefined) {
            if ($scope.brandData.brandIndex < $scope.Brands.length - 1) {
                $scope.nextArrowVisible = true;
            } else {
                $scope.nextArrowVisible = false;
            }

            if ($scope.brandData.brandIndex > 0) {
                $scope.prevArrowVisible = true;
            } else {
                $scope.prevArrowVisible = false;
            }
        }
	};

	$scope.navigateToPrevious = function(brandRemoved, callback) {
		navigationInitiated = true;
		$timeout(function() {
			var isSameActivity = true,
			    oldActivityType = $scope.paginationData.data[$scope.paginationData.paginationIndex].type,
			    oldActivityName = $scope.paginationData.data[$scope.paginationData.paginationIndex].name;
			    //Commented for the navigation between the campclinic
		/*	if ($scope.paginationData.paginationIndex > 0) {
				$scope.paginationData.paginationIndex--;
			}

			if (oldActivityName != $scope.paginationData.data[$scope.paginationData.paginationIndex].name) {
				if ($scope.currentActivityIndex > 0) {
					isSameActivity = false;
					if (!brandRemoved) {
						$scope.currentActivityIndex--;
						$scope.currentActivity = $scope.activityDetails[$scope.currentActivityIndex];
						$scope.load();
					}

				}
			} else {*/
				if ($scope.brandData.brandIndex > 0) {
					$scope.b.selectedSupervisorIds = $scope.selectedSupervisorIds;
					$scope.Brands[$scope.brandData.brandIndex] = $scope.b;
					$scope.brandData.brandIndex--;

					$scope.b = $scope.Brands[$scope.brandData.brandIndex];
					if ($scope.b.jfws != undefined) {
						$scope.loadJFW($scope.b.jfws);
					} else {
						if ($scope.b.selectedSupervisorIds != undefined) {
							$scope.selectedSupervisorIds = $scope.b.selectedSupervisorIds;
						} else {
							$scope.selectedSupervisorIds = [];
						}
					}
				}
			//}
			$timeout(function() {
				isChangesDetected = false;
				navigationInitiated = false;
			}, 2000);
			$scope.showArrows();

			if (callback)
				callback(isSameActivity);
		}, 100);
	};

	$scope.prevButtonClicked = function(brandRemoved, callback) {
		if (isChangesDetected && !$scope.disableEdit && $scope.Brands.length > 1) {
			popupService.openConfirm('', $scope.locale.ChangesNotSavedOnCMESymposiaAlert, $scope.getLocale().Cancel, $scope.getLocale().Save, '55%', function() {
				$scope.navigateToPrevious(brandRemoved, callback);
			}, function() {
				$timeout(function() {
					$scope.save(function() {
						$scope.navigateToPrevious(brandRemoved, callback);
					});
				}, 500);
			});
		} else {
			$scope.navigateToPrevious(brandRemoved, callback);
		}
	};

	$scope.navigateToNext = function(isAddBrand) {
		navigationInitiated = true;
		$timeout(function() {
		 //Commented for the navigation between the campclinic
			/*var oldActivityType = $scope.paginationData.data[$scope.paginationData.paginationIndex].type,
			    oldActivityName = $scope.paginationData.data[$scope.paginationData.paginationIndex].name;
			if ($scope.paginationData.paginationIndex < $scope.paginationData.data.length - 1) {
				$scope.paginationData.paginationIndex++;
			}

			if (oldActivityName != $scope.paginationData.data[$scope.paginationData.paginationIndex].name) {
				if ($scope.currentActivityIndex < $scope.activityDetails.length - 1) {
					$scope.currentActivityIndex++;
					$scope.currentActivity = $scope.activityDetails[$scope.currentActivityIndex];
					$scope.load();
				}
			} else {*/
				if ($scope.brandData.brandIndex < $scope.Brands.length - 1) {
					$scope.b.selectedSupervisorIds = $scope.selectedSupervisorIds;
					$scope.Brands[$scope.brandData.brandIndex] = $scope.b;
					if (isAddBrand) {
						$scope.paginationData.paginationIndex += ($scope.Brands.length - 2 - $scope.brandData.brandIndex)
						$scope.brandData.brandIndex = $scope.Brands.length - 1;
					} else {
						$scope.brandData.brandIndex++;
					}

					$scope.b = $scope.Brands[$scope.brandData.brandIndex];
					if ($scope.b.jfws != undefined) {
						$scope.loadJFW($scope.b.jfws);
					} else {
						if ($scope.b.selectedSupervisorIds != undefined) {
							$scope.selectedSupervisorIds = $scope.b.selectedSupervisorIds;
						} else {
							$scope.selectedSupervisorIds = [];
						}
					}
				}
			//}
			$timeout(function() {
				isChangesDetected = false;
				navigationInitiated = false;
			}, 2000);
			$scope.showArrows();
		}, 100);
	};

	$scope.nextButtonClicked = function(isAddBrand) {

		if (isChangesDetected && !$scope.disableEdit) {
			popupService.openConfirm('', $scope.locale.ChangesNotSavedOnCMESymposiaAlert, $scope.getLocale().No, $scope.getLocale().Yes, '55%', function() {
				$scope.navigateToNext(isAddBrand);
			}, function() {
				$timeout(function() {
					$scope.save(function() {
						$scope.navigateToNext(isAddBrand);
					});
				}, 500);
			});
		} else {
			$scope.navigateToNext(isAddBrand);
		}
	};

	$scope.deselectItemsFromList = function(deselected) {
		for (var i = 0; i < $scope.selectedSupervisorIds.length; i++) {
			if ($scope.selectedSupervisorIds[i].id == deselected.id) {
				$scope.selectedSupervisorIds.splice(i, 1);
			}
		}
	};

	$scope.customerData_from_dcr = {
		dcrData : [],
		dcrJunctionData : [],
		dcrDropData : [],
		dcrBrandActivityData : [],
		dcrJFWData : [],
		campaigns : [],
		corporateInitiatives : [],
		mtpRemoveConfig : [],
		brandActivities : [],
		reporteesJFWs : []
	};

	//Fetch DCR__c soup records
	$scope.getDCR__c_data = function() {
		return dcrCollectionInstance.fetchAll().then(dcrCollectionInstance.fetchRecursiveFromCursor).then(function(dcrList) {
			$scope.customerData_from_dcr.dcrData = dcrList;
			return dcrList;
		});
	};

	//Fetch DCR_Junction__c soup records
	$scope.getDCR_Junction__c_data = function() {
		return dcrJunctionCollectionInstance.fetchAll().then(dcrJunctionCollectionInstance.fetchRecursiveFromCursor).then(function(dcrJunctionList) {
			$scope.customerData_from_dcr.dcrJunctionData = dcrJunctionList;
			return dcrJunctionList;
		});
	};

	//Fetch DCR_JFW__c soup records
	$scope.get_DCR_JFW__c_data = function() {
		return dcrJFWCollectionInstance.fetchAll().then(dcrJFWCollectionInstance.fetchRecursiveFromCursor).then(function(dcrJFWList) {
			$scope.customerData_from_dcr.dcrJFWData = dcrJFWList;
			return dcrJFWList;
		});
	};

	$scope.getOtherJFWs = function() {
		var jfwOtherRolesCollectionInstance = new jfwOtherRolesCollection();
		return jfwOtherRolesCollectionInstance.fetchAll().then(jfwOtherRolesCollectionInstance.fetchRecursiveFromCursor).then(function(jfwList) {
			$rootScope.listOfOtherJFWs = jfwList;
			return jfwList;
		});
	};

	//Fetch DCR_Drop__c soup records
	$scope.getDCR_Drop__c_data = function() {
		return dcrDropCollectionInstance.fetchAll().then(dcrDropCollectionInstance.fetchRecursiveFromCursor).then(function(dcrDropList) {
			$scope.customerData_from_dcr.dcrDropData = dcrDropList;
			return dcrDropList;
		});
	};

	//Fetch DCR_Brand_Activity soup records
	$scope.getDCR_Brand_Activity__c_data = function() {
		return dcrBrandActivityCollectionInstance.fetchAll().then(dcrBrandActivityCollectionInstance.fetchRecursiveFromCursor).then(function(dcrBrandActivityList) {
			$scope.customerData_from_dcr.dcrBrandActivityData = dcrBrandActivityList;
			return dcrBrandActivityList;
		});
	};

	$scope.getMTPRemoveConfig = function() {
		return mtpRemoveConfigCollectionInstance.fetchAll().then(mtpRemoveConfigCollectionInstance.fetchRecursiveFromCursor).then(function(mtpRemoveConfigList) {
			$scope.customerData_from_dcr.mtpRemoveConfig = mtpRemoveConfigList;
			return mtpRemoveConfigList;
		});
	};

	$scope.getBrandActivities = function() {
		var brandActivityCollectionInstance = new brandActivityCollection();
		return brandActivityCollectionInstance.fetchAll().then(brandActivityCollectionInstance.fetchRecursiveFromCursor).then(function(brandActivityList) {
			$scope.customerData_from_dcr.brandActivities = brandActivityList;
			return brandActivityList;
		});
	};

	$scope.fetchReporteesJFW = function() {
		return reporteeJFWCollectionInstance.fetchAll().then(reporteeJFWCollectionInstance.fetchRecursiveFromCursor);
	};
	$scope.getReporteesJFWs = function() {
		return $scope.fetchReporteesJFW().then(function(reporteeJFWList) {
			$scope.customerData_from_dcr.reporteesJFWs = reporteeJFWList;
			return reporteeJFWList;
		});
	};

	var checkIfDCRRecordAlreadyPresent = function(accountId, dcrRecords) {
		var foundRecord = $filter('filter')(dcrRecords, {
			'Account__c' : accountId
		}, true);

		if (foundRecord.length > 0) {
			return true;
		}
		return false;
	};

	$scope.saveDCRSoup = function(success, failure) {

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

		if ($rootScope.dcrGlobalId != undefined) {
			dcr__c_obj._soupEntryId = $rootScope.dcrGlobalId;
		}

		dcr__c_obj.Date__c = $scope.filterdatetime;
		dcr__c_obj.Division__c = currentUser.Division;
		dcr__c_obj.DCR_Filed_Date__c = today;
		dcr__c_obj.isMobileDCR__c = true;
		dcr__c_obj.Status__c = "Saved";
		dcr__c_obj.Territory_Code__c = currentTarget.Territory__c + ';';
		dcr__c_obj.User__c = currentUser.Id;
		dcr__c_obj.Company_Code__c = currentUser.CompanyName;

		if ($scope.currentActivity.Type != 'Symposia') {
			if ($scope.activityDetails.length > 1) {
				if ($scope.currentActivityIndex == 0) {
					dcr__c_obj.Comment1__c = $scope.b.comments;
					if ($scope.activityDetails.length > 1) {
						dcr__c_obj.Comment2__c = $scope.activityDetails[1].activityComment;
					}
				} else {
					dcr__c_obj.Comment1__c = $scope.activityDetails[0].activityComment;
					dcr__c_obj.Comment2__c = $scope.b.comments;
				}
			} else {
				dcr__c_obj["Comment" + $scope.currentActivity.activityIndex + "__c"] = $scope.b.comments;
			}
		} else {
			if ($rootScope.dcrGlobalId != undefined) {
				if (success)
					success();

				return;
			}
		}

		entry.push(dcr__c_obj);
		dcrCollectionInstance.upsertEntities(entry).then(function(response) {
			if ($scope.currentActivity.Type != 'Symposia') {
				$scope.currentActivity.activityComment = $scope.b.comments;
			}
			$rootScope.dcrGlobalId = response[0]._soupEntryId;
			$scope.activityDetails[$scope.currentActivityIndex].DCR__c = response[0]._soupEntryId;
			if (success)
				success();

		}).catch(function(error) {
			//			console.log(error);
			if (failure)
				failure();
		});
	};

	$scope.saveDCRJunctionSoup = function(oldDcrCampaignSoupEntryId, success, failure) {

		var currentDCRJunctionsoupEntryIds = [],
		    currentDCRJunctions = [];

		if (oldDcrCampaignSoupEntryId != undefined) {
			currentDCRJunctions = $filter('filter')($scope.currentActivity.dcrJunctions, {
				"DCR_Brand_Activity__c" : oldDcrCampaignSoupEntryId
			}, true);
		}

		angular.forEach(currentDCRJunctions, function(value, index) {
			currentDCRJunctionsoupEntryIds.push(value._soupEntryId);
		});

		dcrJunctionCollectionInstance.removeEntitiesByIds(currentDCRJunctionsoupEntryIds).then(function() {
			var today = $filter('date')(new Date(), 'yyyy-MM-dd'),
			    entry = [],
			    brandId = '';

			angular.forEach($scope.b.Customers, function(value, index) {
				var dcr_junction__c_obj = {};
				dcr_junction__c_obj.DCR__c = $rootScope.dcrGlobalId;
				brandId = $scope.getBrandId($scope.b.brandName);
				dcr_junction__c_obj.Account__c = value.Account__c;
				dcr_junction__c_obj.Assignment__c = value.assignment__c;
				dcr_junction__c_obj.Brand1__c = brandId;
				dcr_junction__c_obj.DCR_Brand_Activity__c = $scope.b.dcrCampaignSoupEntryId;
				dcr_junction__c_obj.Patch__c = value.patchCode;
				dcr_junction__c_obj.Sequence_Number__c = index;

				dcr_junction__c_obj.Local_DCR__c = $rootScope.dcrGlobalId;
				dcr_junction__c_obj.Local_DCR_Brand_Activity__c = $scope.b.dcrCampaignSoupEntryId;

				//Laboratory CR changes
				dcr_junction__c_obj.LaboratoryDCRJunction__c = value.laboratoryCustomer;
				dcr_junction__c_obj.NoOfPatientsScreenedDCRJunction__c = value.noOfPaients;
				dcr_junction__c_obj.HonorariumAmountDCRJunction__c = value.honorariumAmt;
				dcr_junction__c_obj.AnyOtherCostDCRJunction__c = value.anyOtherCost;

				entry.push(dcr_junction__c_obj);
			});

			dcrJunctionCollectionInstance.upsertEntities(entry).then(function(response) {
				angular.forEach(currentDCRJunctionsoupEntryIds, function(value, index) {
					findAndDeleteRecordFromGobal(value, $scope.currentActivity.dcrJunctions);
				});

				angular.forEach(response, function(value, index) {
					$scope.currentActivity.dcrJunctions.push(value);
				});
				if (success)
					success();
			}).catch(function(error) {
				//				console.log(error);
				if (failure)
					failure();
			});
		});
	};

	$scope.saveDCRDrop = function(oldDcrCampaignSoupEntryId, success) {

		var currentDCRDropsoupEntryIds = [],
		    currentDCRDrops = [];

		if (oldDcrCampaignSoupEntryId != undefined) {
			currentDCRDrops = $filter('filter')($scope.currentActivity.allDcrDrops, {
				"Brand_Activity__c" : oldDcrCampaignSoupEntryId
			}, true);
			angular.forEach(currentDCRDrops, function(value, index) {
				currentDCRDropsoupEntryIds.push(value._soupEntryId);
			});
		}

		dcrDropCollectionInstance.removeEntitiesByIds(currentDCRDropsoupEntryIds).then(function() {

			$scope.setupMaterialDrop(currentDCRDrops, false);

			currentDCRDrops.forEach(function(v, i) {
				removeTransactionEntities(v.Material_Lot__c);
			});

			var entry = [],
			    brandId = $scope.getBrandId($scope.b.brandName);

			angular.forEach($scope.b.Materials, function(value, index) {
				var dcr_drop__c_obj = {};

				dcr_drop__c_obj.DCR__c = $rootScope.dcrGlobalId;
				dcr_drop__c_obj.Local_DCR__c = $rootScope.dcrGlobalId;
				dcr_drop__c_obj.Divisionwise_Brand__c = brandId;
				dcr_drop__c_obj.Brand_Activity__c = $scope.b.dcrCampaignSoupEntryId;
				dcr_drop__c_obj.Local_Brand_Activity__c = $scope.b.dcrCampaignSoupEntryId;
				dcr_drop__c_obj.Material_Lot__c = value.materialCode;
				dcr_drop__c_obj.Quantity__c = value.Quantity;
				dcr_drop__c_obj.Sequence_Number__c = index;
				entry.push(dcr_drop__c_obj);
			});

			dcrDropCollectionInstance.upsertEntities(entry).then(function(response) {
				//				console.log(response);
				angular.forEach(currentDCRDropsoupEntryIds, function(value, index) {
					findAndDeleteRecordFromGobal(value, $scope.currentActivity.allDcrDrops);
				});
				var updateMaterialTxArr = [],
				    materialName = '';
				angular.forEach(response, function(value, index) {
					materialName = getMaterialName(value.Material_Lot__c);
					updateMaterialTxArr.push({
						Material_Lot__c : value.Material_Lot__c,
						Material_Name__c : materialName,
						RecordTypeId : '01290000000suxHAAQ',
						quantity__c : value.Quantity__c,
						Account__c : '',
						Call_Date__c : $scope.filterdatetime,
						isSymposia : 'true'
					});
					$scope.currentActivity.allDcrDrops.push(value);
				});
				materialTransactionCollectionInstance.upsertEntities(updateMaterialTxArr);

				$scope.setupMaterialDrop(entry, true);

				if (success)
					success();
			});
		});
	};

	$scope.setupMaterialDrop = function(dcrDrops, flag) {
		var materialLotRecords = [];
		angular.forEach(dcrDrops, function(value, index) {
			var materialLot = $scope.getCalculateInHandQuantity(value, flag);
			if (materialLot.length > 0) {
				materialLotRecords.push(materialLot[0]);
			}
		});
		$scope.updateMaterialLot(materialLotRecords);
	};

	$scope.updateMaterialLot = function(updateMaterialLotArr) {
		materialLotCollectionInstance.upsertEntities(updateMaterialLotArr)
	};

	$scope.saveDCRBrandActivitySoup = function(success, failure) {

		var dcr_brand_activity__c_obj = {},
		    entry = [],
		    oldDcrCampaignSoupEntryId = '';

		dcr_brand_activity__c_obj.DCR__c = $rootScope.dcrGlobalId;
		dcr_brand_activity__c_obj.Local_DCR__c = $rootScope.dcrGlobalId;
		dcr_brand_activity__c_obj.Number_of_Patients_Added__c = $scope.b.NoOfDoctors;
		dcr_brand_activity__c_obj.Remarks__c = $scope.b.remarks;

		//Laboratory CR changes
		dcr_brand_activity__c_obj.Laboratory__c = $scope.b.laboratoryName;
		dcr_brand_activity__c_obj.No_of_Patients_Screened__c = $scope.b.noOfPaients;
		dcr_brand_activity__c_obj.Honorarium_Amount__c = $scope.b.honorariumAmt;
		dcr_brand_activity__c_obj.Any_other_cost__c = $scope.b.anyOtherCost;

		//if ($scope.currentActivity.ActivityName == 'Camp/Clinic/Activity/CME/Symposia') { // Activity name changed. As it is hard coded for any change in activity name, need to chnage it manually in code
			dcr_brand_activity__c_obj.Name_of_speaker__c = $scope.b.Speaker;
		//} else { //commenting as Activity merged now
			dcr_brand_activity__c_obj.Other_Participants__c = $scope.b.Other_Participants__c;
			dcr_brand_activity__c_obj.Patients_Initiated__c = $scope.b.Patients_Initiated__c;
		//}

		var campaignNameArray = $filter('filter')($scope.customerData_from_dcr.campaigns, {
			'Id' : $scope.b.campaignId
		}, true),
		    campaignName = '';

		if (campaignNameArray.length > 0) {
			campaignName = campaignNameArray[0].Name;
		}

		var brandCampaignName = campaignName + "_" + $scope.b.brandName;

		var brandActivityIdArray = $filter('filter')($scope.customerData_from_dcr.brandActivities, {
			"Name" : brandCampaignName
		}, true),
		    brandActivityId = '';

		if (brandActivityIdArray.length > 0) {
			brandActivityId = brandActivityIdArray[0].Id;
			dcr_brand_activity__c_obj.Brand_Activity__c = brandActivityId;
			dcr_brand_activity__c_obj.Local_Brand_Activity__c = brandActivityId;
			dcr_brand_activity__c_obj.Sequence_Number__c = $scope.b.sortIndex;

			var currentDCRBrandActivitiessoupEntryIds = [],
			    currentCorporateInitiativeDCRBrandActivities = [];

			if ($scope.b.campaignId != undefined) {
				if ($scope.b.dcrCampaignSoupEntryId) {
					currentCorporateInitiativeDCRBrandActivities = $filter('filter')($scope.currentActivity.corporateInitiatives, {
						"DCR_Junction_Self__c" : $scope.b.dcrCampaignSoupEntryId
					}, true);
					currentDCRBrandActivitiessoupEntryIds.push($scope.b.dcrCampaignSoupEntryId);

					angular.forEach(currentCorporateInitiativeDCRBrandActivities, function(value, index) {
						currentDCRBrandActivitiessoupEntryIds.push(value._soupEntryId);
					});
				}
			}

			dcrBrandActivityCollectionInstance.removeEntitiesByIds(currentDCRBrandActivitiessoupEntryIds).then(function() {
				angular.forEach(currentDCRBrandActivitiessoupEntryIds, function(value, index) {
					findAndDeleteRecordFromGobal(value, $scope.currentActivity.dcrBrandActivities);
				});

				angular.forEach(currentDCRBrandActivitiessoupEntryIds, function(value, index) {
					findAndDeleteRecordFromGobal(value, $scope.currentActivity.corporateInitiatives);
				});

				entry.push(dcr_brand_activity__c_obj);

				dcrBrandActivityCollectionInstance.upsertEntities(entry).then(function(response) {
					$scope.currentActivity.dcrBrandActivities.push(response[0]);
					oldDcrCampaignSoupEntryId = $scope.b.dcrCampaignSoupEntryId;
					$scope.b.dcrCampaignSoupEntryId = response[0]._soupEntryId;
					if (success)
						success(oldDcrCampaignSoupEntryId);
					if ($scope.b.corporateInitiative) {
						var entry = [],
						//Corporate Initiative Save code
						    records = [],
						    index = 0;

						for (var key in $scope.b.corporateInitiative) {
							var corporateValue = $scope.b.corporateInitiative[key],
							    corporateInitiativeRecord = angular.copy(dcr_brand_activity__c_obj);
							delete corporateInitiativeRecord.Brand_Activity__c;
							if (corporateValue == true) {
								corporateInitiativeRecord.Corporate_Initiative__c = key;
								corporateInitiativeRecord.DCR_Junction_Self__c = $scope.b.dcrCampaignSoupEntryId;
								corporateInitiativeRecord.Local_DCR_Junction_Self__c = $scope.b.dcrCampaignSoupEntryId;
								corporateInitiativeRecord.Sequence_Number__c = index;
								records.push(corporateInitiativeRecord);
								index++;
							}
						}

						if (records.length > 0) {
							dcrBrandActivityCollectionInstance.upsertEntities(records).then(function(data) {
								$scope.currentActivity.corporateInitiatives = data
							}).catch(function() {
								popupService.openPopup($scope.locale.SaveFailed, $scope.locale.OK, '35%');
							});
						}

					}//Check if corporate initiative is there
				}).catch(function(error) {
					popupService.openPopup($scope.locale.SaveFailed, $scope.locale.OK, '35%');
					if (failure)
						failure();
				});
			});
		} else {
			popupService.openPopup($scope.locale.SaveFailed, $scope.locale.OK, '35%');
			return;
		}
	};

	$scope.save = function(callback) {
		//		console.log("in save");
		$scope.saveDCRSoup(function() {
			if ($scope.currentActivity.Type == 'Symposia') {
				if ($scope.validate()) {
					$scope.saveDCRBrandActivitySoup(function(oldDcrCampaignSoupEntryId) {
						$scope.saveDCRJunctionSoup(oldDcrCampaignSoupEntryId, function() {
							$scope.saveDCRJFW(oldDcrCampaignSoupEntryId);
							$scope.saveDCRDrop(oldDcrCampaignSoupEntryId, function() {
								if (callback)
									callback();
								else
									isChangesDetected = false;
								$scope.Brands[$scope.brandData.brandIndex] = $scope.b;
							});
						});
					});
				}
			} else {
				if (callback)
					callback();
				else
					isChangesDetected = false;
				$scope.saveDCRJFW();
			}
		});
	};

	$scope.saveDCRJFW = function(oldDcrCampaignSoupEntryId) {

		var currentJFWSoupEntryIds = [],
		    currentDCRJFWs = [],
		    dcrJunction = $scope.currentActivity.dcrJunctions;

		if ($scope.currentActivity.Type != 'Symposia') {
			currentDCRJFWs = $scope.currentActivity.allDcrJFWs;
		} else {
			if (oldDcrCampaignSoupEntryId != undefined) {
				currentDCRJFWs = $filter('filter')($scope.currentActivity.allDcrJFWs, {
					"Brand_Activity__c" : oldDcrCampaignSoupEntryId
				}, true);
			}
		}

		angular.forEach(currentDCRJFWs, function(value, index) {
			currentJFWSoupEntryIds.push(value._soupEntryId);
		});

		dcrJFWCollectionInstance.removeEntitiesByIds(currentJFWSoupEntryIds).then(function() {
			var entry = [];
			angular.forEach($scope.selectedSupervisorIds, function(value, index) {
				var dcr_jfw__c_obj = {};

				dcr_jfw__c_obj.User1__c = currentUser.Id;
				dcr_jfw__c_obj.DCR__c = $rootScope.dcrGlobalId;
				dcr_jfw__c_obj.Local_DCR__c = $rootScope.dcrGlobalId;
				dcr_jfw__c_obj.User2__c = value.id;
				dcr_jfw__c_obj.User_Type__c = value.designation;
				dcr_jfw__c_obj.Activity_Master__c = $scope.activitiesSelectedInActivitySelectionPage[$scope.currentActivity.activityIndex - 1].Id;
				dcr_jfw__c_obj.Sequence_Number__c = index;
				if ($scope.currentActivity.Type == 'Symposia') {
					dcr_jfw__c_obj.Brand_Activity__c = $scope.b.dcrCampaignSoupEntryId;
					dcr_jfw__c_obj.Local_Brand_Activity__c = $scope.b.dcrCampaignSoupEntryId;
				}

				entry.push(dcr_jfw__c_obj);
			});

			dcrJFWCollectionInstance.upsertEntities(entry).then(function(response) {
				angular.forEach(currentJFWSoupEntryIds, function(value, index) {
					findAndDeleteRecordFromGobal(value, $scope.currentActivity.allDcrJFWs);
				});

				angular.forEach(response, function(value, index) {
					$scope.currentActivity.allDcrJFWs.push(value);
				});

				if ($scope.currentActivity.Type == 'Symposia') {
					$scope.b.jfws = response;
				}
				$timeout(function() {
					popupService.openPopup($scope.locale.DataSaveConfirmation, $scope.locale.OK, '35%',function () {
					    if($scope.addBrandButtonClicked){
					        $scope.addBrandButtonClicked = false;
					    }else{
					        navigationService.navigate('dcrList');
					    }
					});
				}, 1000);

			});
		});
	};
     var customeEventListener = $rootScope.$on('goToDCRList',function(event,obj){
           navigationService.navigate('dcrList');
     });
      $scope.$on('$destroy', function() {
          customeEventListener();
      });

	$scope.deleteBrandData = function(brandData, success) {
		//delete dcr junctions
		var currentDCRJunctionsoupEntryIds = [],
		    currentDCRJunctions = [];

		currentDCRJunctions = $filter('filter')($scope.currentActivity.dcrJunctions, {
			"DCR_Brand_Activity__c" : brandData.dcrCampaignSoupEntryId
		}, true);
		angular.forEach(currentDCRJunctions, function(value, index) {
			currentDCRJunctionsoupEntryIds.push(value._soupEntryId);
		});

		dcrJunctionCollectionInstance.removeEntitiesByIds(currentDCRJunctionsoupEntryIds).then(function() {
			angular.forEach(currentDCRJunctionsoupEntryIds, function(value, index) {
				findAndDeleteRecordFromGobal(value, $scope.currentActivity.dcrJunctions);
			});
		});

		//delete dcr brand activity
		if (brandData.dcrCampaignSoupEntryId != null) {
			dcrBrandActivityCollectionInstance.removeEntitiesByIds([brandData.dcrCampaignSoupEntryId]).then(function() {
				findAndDeleteRecordFromGobal(brandData.dcrCampaignSoupEntryId, $scope.currentActivity.dcrBrandActivities);
			});
		}

		var currentCorporateInitiativeSoupEntryIds = [],
		    currentCorporateInitiativeDCRBrandActivities = $filter('filter')($scope.currentActivity.corporateInitiatives, {
			"Brand_Activity__c" : $scope.b.campaignId
		}, true);

		angular.forEach(currentCorporateInitiativeDCRBrandActivities, function(value, index) {
			currentCorporateInitiativeSoupEntryIds.push(value._soupEntryId);
		});

		if (currentCorporateInitiativeDCRBrandActivities.length > 0) {
			dcrBrandActivityCollectionInstance.removeEntitiesByIds(currentCorporateInitiativeSoupEntryIds).then(function() {
				angular.forEach(currentCorporateInitiativeSoupEntryIds, function(value, index) {
					findAndDeleteRecordFromGobal(value, $scope.currentActivity.corporateInitiatives);
				});
			});
		}

		//delete jfws
		var currentJFWSoupEntryIds = [],
		    currentDCRJFWs = [],
		    dcrJunction = $scope.currentActivity.dcrJunctions;

		currentDCRJFWs = $filter('filter')($scope.currentActivity.allDcrJFWs, {
			"Brand_Activity__c" : brandData.dcrCampaignSoupEntryId
		}, true);
		angular.forEach(currentDCRJFWs, function(value, index) {
			currentJFWSoupEntryIds.push(value._soupEntryId);
		});

		dcrJFWCollectionInstance.removeEntitiesByIds(currentJFWSoupEntryIds).then(function() {
			angular.forEach(currentJFWSoupEntryIds, function(value, index) {
				findAndDeleteRecordFromGobal(value, $scope.currentActivity.allDcrJFWs);
			});
		});

		//delete dcr drop
		var currentDCRDropsoupEntryIds = [],
		    currentDCRDrops = [];
		currentDCRDrops = $filter('filter')($scope.currentActivity.allDcrDrops, {
			"Brand_Activity__c" : brandData.dcrCampaignSoupEntryId
		}, true);
		angular.forEach(currentDCRDrops, function(value, index) {
			currentDCRDropsoupEntryIds.push(value._soupEntryId);
		});

		currentDCRDrops.forEach(function(v, i) {
			removeTransactionEntities(v.Material_Lot__c);
		});

		dcrDropCollectionInstance.removeEntitiesByIds(currentDCRDropsoupEntryIds).then(function() {
			angular.forEach(currentDCRDropsoupEntryIds, function(value, index) {
				findAndDeleteRecordFromGobal(value, $scope.currentActivity.allDcrDrops);
			});
		});

		$timeout(function() {
			if (success)
				success();
		}, 200);
	};

	var findAndDeleteRecordFromGobal = function(soupEntryId, soupArray) {
		var index = $scope.getAllIndexes(soupArray, "_soupEntryId", soupEntryId);
		soupArray.splice(index, 1);
	};

	$scope.getAllIndexes = function(array, attr, value) {
		var indexes = [],
		    i;
		for ( i = 0; i < array.length; i++)
			if (array[i].hasOwnProperty(attr) && array[i][attr] === value)
				indexes.push(i);
		return indexes;
	};

	$scope.validate = function() {
		var popupMsg = '',
		    isValid = false;

		if ($scope.b.brandName == undefined) {
			popupMsg = $scope.locale.BrandShouldNotBeEmptyOnCMESymposia;
		}

		if (popupMsg == '') {
			if ($scope.b.campaignId == undefined) {
				popupMsg = $scope.locale.CampaignShouldBeSelectedOnSMESymposia;
			}
		}

		if (popupMsg == '') {
			if ($scope.b.Materials != undefined) {
				for (var i = 0; i < $scope.b.Materials.length; i++) {
					if (!$scope.b.Materials[i].materialCode && $scope.b.Materials[i].materialCode == null) {
						var emptyMsg = $scope.locale.Material;
						popupMsg = $scope.locale.PleaseSelect + emptyMsg + $scope.locale.Value;
						break;
					} else if (!$scope.b.Materials[i].Quantity && ($scope.b.Materials[i].Quantity == 0 || $scope.b.Materials[i].Quantity == null)) {
						popupMsg = $scope.locale.PleaseSelect + $scope.locale.Quantity + $scope.locale.Value;
						break;
					} else if ($scope.b.Materials[i].Quantity != 0 || $scope.b.Materials[i].Quantity != null) {
						var quantityEntered = $scope.b.Materials[i].Quantity,
						    materialArr = $filter('filter')($scope.brandData.Materials[$scope.b.brandName], {
							"Id" : $scope.b.Materials[i].materialCode
						}, true);
						if (materialArr.length > 0) {
							var inHandQuantity = materialArr[0].In_Hand_Quantity__c;
							if ($scope.b.Materials[i].oldQuantity != undefined) {
								inHandQuantity = materialArr[0].In_Hand_Quantity__c + $scope.b.Materials[i].oldQuantity;
							}
							if (quantityEntered > inHandQuantity) {
								popupMsg = $scope.locale.QuantityLessMsg;
								break;
							} else {
								$scope.b.Materials[i].oldQuantity = $scope.b.Materials[i].Quantity;
							}
						}
					}
				}
			}
		}

		if (popupMsg == '') {
			isValid = true;
		} else {
			popupService.openPopup(popupMsg, $scope.locale.OK, '35%');
		}
		return isValid;
	};

	$scope.getCalculateInHandQuantity = function(item, flag) {
		var filteredMaterialArr = $filter('filter')($scope.brandData.Materials[$scope.b.brandName], {
			"Id" : item.Material_Lot__c
		}, true);

		if (flag == true) {
			filteredMaterialArr[0].In_Hand_Quantity__c -= item.Quantity__c;
		} else {
			filteredMaterialArr[0].In_Hand_Quantity__c += item.Quantity__c;
		}
		return filteredMaterialArr;
	};

	var removeTransactionEntities = function(materialLot) {
		return materialTransactionCollectionInstance.fetchAllWhere({
			"Material_Lot__c" : materialLot,
			"Account__c" : "",
			"isSymposia" : "true"
		}).then(materialTransactionCollectionInstance.fetchRecursiveFromCursor).then(materialTransactionCollectionInstance.removeEntities);
	};

	/**********Function to get Material name based on Material Code****************/
	var getMaterialName = function(materialCode) {
		var materialName = '';

		materialDataArray = $filter('filter')($scope.brandData.Materials[$scope.b.brandName], {
			'Id' : materialCode
		}, true);
		if (materialDataArray.length > 0) {
			materialName = materialDataArray[0].Material_Name__c;
		}
		return materialName;
	};

	$scope.$watch('b', function(newValue, oldValue) {
		if (newValue != oldValue && !jQuery.isEmptyObject(oldValue) && !navigationInitiated) {
			isChangesDetected = true;
		}
	}, true);

	$scope.$watch('selectedSupervisorIds', function(newValue, oldValue) {
		if (newValue != oldValue && !jQuery.isEmptyObject(oldValue) && !navigationInitiated) {
			isChangesDetected = true;
		}
	}, true);

}]);
