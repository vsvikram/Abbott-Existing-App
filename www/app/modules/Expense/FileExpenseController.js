abbottApp.controller('fileExpenseController', ['$stateParams', '$scope', '$rootScope', 'abbottConfigService', 'navigationService', '$filter', 'popupService', 'utils', 'sfcAssignmentCollection', 'sfcMasterCollection', 'sfcFareCollection', 'dcrCollection', 'dcrJunctionCollection', 'userCollection', 'patchMarketJunctionCollection', 'dailyAllowanceFareCollection', 'fullDayActivityCollection', 'halfDayActivityCollection', 'patchMarketJunctionCollection', 'expenseCollection', 'expenseDetailsCollection', 'territoryCollection', 'userTerritoryCollection', 'expenseSAPCodesCollection', 'assigmentDetailCollection', 'leaveRequestHolidayUserCollection', 'leaveRequestCollection', 'otherExpensesEarningCollection', 'divisionCollection', 'attachmentCollection', 'patchCollection', 'MARKET_TYPES', 'EXPENSE_TYPES', 'getDateUtility',
    function($stateParams, $scope, $rootScope, abbottConfigService, navigationService, $filter, popupService, utils, sfcAssignmentCollection, sfcMasterCollection, sfcFareCollection, dcrCollection, dcrJunctionCollection, userCollection, patchMarketJunctionCollection, dailyAllowanceFareCollection, fullDayActivityCollection, halfDayActivityCollection, patchMarketJunctionCollection, expenseCollection, expenseDetailsCollection, territoryCollection, userTerritoryCollection, expenseSAPCodesCollection, assigmentDetailCollection, leaveRequestHolidayUserCollection, leaveRequestCollection, otherExpensesEarningCollection, divisionCollection, attachmentCollection, patchCollection, MARKET_TYPES, EXPENSE_TYPES, getDateUtility) {
        var sfcAssignmentCollectionInstance = new sfcAssignmentCollection(),
            sfcMasterCollectionInstance = new sfcMasterCollection(),
            sfcFareCollectionInstance = new sfcFareCollection(),
            dcrCollectionInstance = new dcrCollection(),
            dcrJunctionCollectionInstance = new dcrJunctionCollection(),
            dailyAllowanceFareCollectionInstance = new dailyAllowanceFareCollection(),
            fullDayActivityCollectionInstance = new fullDayActivityCollection(),
            halfDayActivityCollectionInstance = new halfDayActivityCollection(),
            patchMarketJunctionCollectionInstance = new patchMarketJunctionCollection(),
            expenseCollectionInstance = new expenseCollection(),
            expenseDetailsCollectionInstance = new expenseDetailsCollection(),
            territoryCollectionInstance = new territoryCollection(),
            userTerritoryCollectionInstance = new userTerritoryCollection(),
            expenseSAPCodesCollectionInstance = new expenseSAPCodesCollection(),
            assigmentDetailCollectionInstance = new assigmentDetailCollection(),
            leaveRequestHolidayUserCollectionInstance = new leaveRequestHolidayUserCollection(),
            leaveRequestCollectionInstance = new leaveRequestCollection(),
            otherExpensesEarningCollectionInstance = new otherExpensesEarningCollection(),
            divisionCollectionInstance = new divisionCollection(),
            attachmentCollectionInstance = new attachmentCollection(),
            patchCollectionInstance = new patchCollection();

        $scope.abwheaderConfig = {
            hambergFlag: true,
            applogoFlag: true,
            textFlag: false,
            syncFlag: true,
            toggleSideMenu: false,
            notifyFlag: true,
            notifyCount: 3,
            searchFlag: false,
            searchHandler: searchHandler
        };

        function searchHandler(searchVal) {
            $scope.searchVal = searchVal;
        };

        $rootScope.openPopup = function() {
            $rootScope.showPopup = true;
        };
        var workdayFlag = false;
        var hqFlag = false;
        $scope.buttonDisabled = false;
        $scope.hillStationAllowance = '';
        $rootScope.dcrDate = $stateParams.date;
        $scope.locale = abbottConfigService.getLocale();
        $scope.sfcFares = [];
        $scope.patchList = [];
        $scope.dcr = null;
        $scope.dailyAllowanceFares = null;
        $scope.fareList = [];
        $scope.marketList = [];
        $scope.descriptionList = [];
        $scope.dailyAllowanceList = [];
        $scope.dailyFaresList = [];
        $scope.showSFCList = false;
        $scope.userDetail = '';
        $scope.finalFromMarketList = [];
        $scope.finalToMarketList = [];
        $scope.faresListForABM = [];
        $scope.sfcDisplayList = [];
        $scope.validFares = [];
        $scope.availableMarketType = [];
        $scope.miscData = [{
            'description': '',
            'amount': '',
            'remarks': '',
            'detailedRemarks': ''
        }];
        $scope.addMiscData = function(index) {
            $scope.miscData.push({
                'description': '',
                'amount': '',
                'remarks': '',
                'detailedRemarks': ''
            })
        };
        $scope.removeMiscData = function(index) {
            $scope.miscData.splice(index, 1);
        };
        $scope.sfcFlag = false;
        $scope.flagHillStation = false;
        $scope.expenseStatus = false;
        $scope.expenseDetailStatus = false;
        $scope.fareList = [];
        $scope.expenseId = '';
        $scope.toMarketSet = [];
        $scope.faresList = [];
        $scope.metroFlag = false;
        $scope.selectedOneWay = false;
        $scope.selectedTwoWay = false;
        $scope.miscFlag = false;
        $scope.displayButtons = false;
        $scope.userId = '';
        $scope.stationSelected = null;
        $scope.masterAssignmentList = [];
        $scope.finalRouteList = [];
        $scope.toMarketList = [];
        $scope.finalMarketList = [];
        var dailyfaresRowNumber;
        $scope.SFCData = [{
            'fromMarket': '',
            'toMarket': '',
            'fare': '',
            'modeOfTravel': '',
            'distance': 0,
            'fareClaimedBool': '',
            'sfcId': '',
        }];
        $scope.addSFCFare = function(index) {
            $scope.SFCData.push({
                'fromMarket': '',
                'toMarket': '',
                'fare': '',
                'modeOfTravel': '',
                'distance': 0,
                'fareClaimedBool': '',
                'sfcId': ''
            })
        };
        $scope.removeSFCFare = function(index) {
            $scope.SFCData.splice(index, 1);
        };
        /* Function called on from market dropdown selection */
        $scope.fromMarketChanged = function(index) {
            $scope.SFCData[index].fare = '';
            $scope.SFCData[index].modeOfTravel = '';
            $scope.SFCData[index].distance = '';
            $scope.SFCData[index].sfcId = '';
            if ($scope.SFCData[index].fromMarket != "") {
                if ($scope.SFCData[index].toMarket != "") {
                    angular.forEach($scope.sfcDisplayList, function(sfc) {
                        if ($scope.SFCData[index].toMarket == sfc.toMarket && $scope.SFCData[index].fromMarket != null && $scope.SFCData[index].fromMarket != 'undefined' && $scope.SFCData[index].fromMarket.toUpperCase() == sfc.fromMarket.toUpperCase()) {
                            $scope.SFCData[index].fare = sfc.fare;
                            $scope.SFCData[index].modeOfTravel = sfc.modeOfTravel;
                            $scope.SFCData[index].distance = sfc.distance;
                            $scope.SFCData[index].sfcId = sfc.sfcId;
                        }
                    })
                }
            }
        };
        /* Function called on to market dropdown selection */
        $scope.toMarketChanged = function(index) {
            $scope.SFCData[index].fare = '';
            $scope.SFCData[index].modeOfTravel = '';
            $scope.SFCData[index].distance = '';
            $scope.SFCData[index].sfcId = '';
            var isSelectionValid = true;
            var selectedSFC = $scope.SFCData[index];
            if ($scope.SFCData[index].toMarket != "") {
                angular.forEach($scope.SFCData, function(SFC) {
                    if (SFC !== selectedSFC && SFC.toMarket == selectedSFC.toMarket && SFC.fromMarket.toUpperCase() == selectedSFC.fromMarket.toUpperCase())
                        isSelectionValid = false;
                });
                if (isSelectionValid) {
                    angular.forEach($scope.sfcDisplayList, function(sfc) {
                        $scope.SFCData[index].fromMarket = $scope.SFCData[index].fromMarket || '';
                        if ($scope.SFCData[index].toMarket == sfc.toMarket && $scope.SFCData[index].fromMarket.toUpperCase() == sfc.fromMarket.toUpperCase()) {
                            $scope.SFCData[index].fare = sfc.fare;
                            $scope.SFCData[index].modeOfTravel = sfc.modeOfTravel;
                            $scope.SFCData[index].distance = sfc.distance;
                            $scope.SFCData[index].sfcId = sfc.sfcId;
                        }
                    });
                } else {
                    $scope.SFCData[index].fare = '';
                    $scope.SFCData[index].modeOfTravel = '';
                    $scope.SFCData[index].distance = '';
                    $scope.SFCData[index].sfcId = '';
                    $scope.SFCData[index].toMarket = '';
                }
            }
        };
        var reset = function() {
            $scope.buttonDisabled = false;
            $scope.hillStationAllowance = '';
            $scope.locale = abbottConfigService.getLocale();
            $scope.sfcFares = [];
            $scope.patchList = [];
            $scope.dailyAllowanceFares = null;
            $scope.fareList = [];
            $scope.marketList = [];
            $scope.descriptionList = [];
            $scope.dailyAllowanceList = [];
            $scope.dailyFaresList = [];
            $scope.showSFCList = false;
            $scope.userDetail = '';
            $scope.finalFromMarketList = [];
            $scope.finalToMarketList = [];
            $scope.faresListForABM = [];
            $scope.sfcDisplayList = [];
            $scope.validFares = [];
            $scope.availableMarketType = [];
            $scope.miscData = [{
                'description': '',
                'amount': '',
                'remarks': '',
                'detailedRemarks': ''
            }];
            $scope.sfcFlag = false;
            $scope.flagHillStation = false;
            $scope.expenseStatus = false;
            $scope.expenseDetailStatus = false;
            $scope.fareList = [];
            $scope.expenseId = '';
            $scope.toMarketSet = [];
            $scope.faresList = [];
            $scope.metroFlag = false;
            $scope.selectedOneWay = false;
            $scope.selectedTwoWay = false;
            $scope.miscFlag = false;
            $scope.displayButtons = false;
            $scope.stationSelected = null;
            $scope.masterAssignmentList = [];
            $scope.finalRouteList = [];
            $scope.toMarketList = [];
            $scope.finalMarketList = [];
        };
        /* function called on page load */
        $scope.init = function() {
            window.ga.trackView('ExpenseSubmission');
            window.ga.trackTiming('Expense Submission Page Load Start Time', 20000, 'Expense Submission Load Start', 'ExpenseSubmission Load Starts');
            $scope.transperantConfig = abbottConfigService.getTransparency();
            $scope.transperantConfig.display = true;
            $scope.transperantConfig.showBusyIndicator = true;
            $scope.transperantConfig.showTransparancy = true;
            abbottConfigService.setTransparency($scope.transperantConfig);
            $scope.locale = abbottConfigService.getLocale();
            reset();
            getSFCFares();
            getDCRData();
            getUserDetail().then(getDailyAllowanceFareForDCRActivities).then(getTerritoryAndFaresFromSFC).finally(function() {
                $scope.transperantConfig.display = false;
                window.ga.trackTiming('Expense Submission Page Load Finish Time', 20000, 'Expense Submission Load Finish', 'ExpenseSubmission Load Finishes');
            });
            evaluateMiscellaneousExpenses();
            $scope.expenseDate = $filter('date')(getDateUtility.getDate($rootScope.dcrDate), 'dd/MM/yyyy');
            $scope.expenseDay = $filter('date')(getDateUtility.getDate($rootScope.dcrDate), 'dd');
            $scope.expenseMonth = $filter('date')(getDateUtility.getDate($rootScope.dcrDate), 'MMM');
            $scope.expenseYear = $filter('date')(getDateUtility.getDate($rootScope.dcrDate), 'yyyy');
        };

        var getUserDetail = function() {
            return new userCollection().getActiveUser().then(function(activeUser) {
                $scope.userDetail = activeUser;
            })
            $scope.userDetail = activeUser;
            if ($scope.userDetail.Expense_Company__c == null) {
                $scope.userDetail.Expense_Company__c = $scope.userDetail.CompanyName;
            }
        };
        var getDivisions = function() {
            return divisionCollectionInstance.fetchAll().then(divisionCollectionInstance.fetchRecursiveFromCursor).then(function(division) {
                return division;
            })
            $scope.divisions = division;
        };
        /* get Approved leaves */
        var leavesApprovedUsers = function() {
            return leaveRequestCollectionInstance.fetchAll().then(leaveRequestCollectionInstance.fetchRecursiveFromCursor).then(function(approvedLeaves) {
                $scope.approvedLeaves = approvedLeaves;
                return approvedLeaves;
            })
        };
        /* get holidays */
        var holidayUsers = function() {
            return leaveRequestHolidayUserCollectionInstance.fetchAll().then(leaveRequestHolidayUserCollectionInstance.fetchRecursiveFromCursor).then(function(holidayList) {
                $scope.holidayList = holidayList;
                return holidayList;
            })
        };
        /* get SFC Fares */
        var getSFCFares = function() {
            return sfcAssignmentCollectionInstance.fetchAll().then(sfcAssignmentCollectionInstance.fetchRecursiveFromCursor).then(function(assignments) {
                return sfcFareCollectionInstance.fetchAll().then(sfcFareCollectionInstance.fetchRecursiveFromCursor).then(function(sfcFares) {
                    if (sfcFares) {
                        sfcFares.map(function(fare) {
                            var assignment = $filter('filter')(assignments, {
                                'SFC_Master__c': fare.SFC_Master__c
                            })
                            fare.SFC_Assignment__c = assignment[0].Id;
                            fare.Market_Type__c = assignment[0].Market_Type__c;
                        });
                        $scope.sfcFares = sfcFares;
                    }
                    return sfcFares;
                });
            });
            $scope.sfcFares = sfcFares;
        };
        /* get patches in which user worked for day */
        var getPatchList = function() {
            return dcrCollectionInstance.fetchAll().then(dcrCollectionInstance.fetchRecursiveFromCursor).then(function(dcrList) {
                $scope.dcr = $filter('filter')(dcrList, {
                    'Date__c': $rootScope.dcrDate
                });
                return dcrJunctionCollectionInstance.fetchAll().then(dcrJunctionCollectionInstance.fetchRecursiveFromCursor).then(function(dcrJunctionInfo) {
                    var dcrJunctionByDate = $filter('filter')(dcrJunctionInfo, {
                        'DCR__c': $scope.dcr[0].Id
                    });
                    var dcrJunctionPatchList = dcrJunctionByDate.map(function(dcrJun) {
                        return dcrJun.Patch__c;
                    });
                    return patchMarketJunctionCollectionInstance.fetchAll().then(patchMarketJunctionCollectionInstance.fetchRecursiveFromCursor).then(function(patches) {
                        $scope.patchList = $filter('filter')(patches, function(patch) {
                            return dcrJunctionPatchList.indexOf(patch.Patch_Name__c) != -1;
                        });
                        return $scope.patchList;
                    });
                });
            });
        };

        var getPatchMarketJunctionData = function() {
            return patchMarketJunctionCollectionInstance.fetchAll().then(patchMarketJunctionCollectionInstance.fetchRecursiveFromCursor).then(function(patchData) {
                $scope.patchDataList = patchData;
                return patchData;
            });
        };
        /* fetch DCR activities */
        var getDCRActivities = function() {
            return fullDayActivityCollectionInstance.fetchAll().then(fullDayActivityCollectionInstance.fetchRecursiveFromCursor).then(function(fullDayActivities) {
                return halfDayActivityCollectionInstance.fetchAll().then(halfDayActivityCollectionInstance.fetchRecursiveFromCursor).then(function(halfDayActivities) {
                    fullDayActivities = fullDayActivities.concat(halfDayActivities);
                    fullDayActivities = $filter('filter')(fullDayActivities, function(activity) {
                        return getDateUtility.getDate(activity.Expiration_Date__c) >= getDateUtility.getDate($rootScope.dcrDate);
                    });
                    $scope.Activities = fullDayActivities;
                    return fullDayActivities;
                });
            });
        };
        /* Users can view market type and allowances to select and file expenses*/
        var getDailyAllowanceFareForDCRActivities = function() {
            var marketType = [];
            var div = [];
            var fareIDSet = [];
            var dailyAllowanceFaresList = [];
            var masterList = [];
            var masterList1 = [];
            var masterList2 = [];
            var masterList3 = [];
            var divList = [];
            var fieldWorkFlag = false;

            if ($scope.userDetail.CompanyName == $scope.locale.AHPL_ORGANISATION) {
                marketType = [MARKET_TYPES.HQ, MARKET_TYPES.EX_HQ, MARKET_TYPES.OS, MARKET_TYPES.INCIDENTAL, MARKET_TYPES.TRANSIT, MARKET_TYPES.HILL_STATION, MARKET_TYPES.NOT_APPLICABLE];
            } else if ($scope.userDetail.CompanyName == $scope.locale.AIL_ORGANISATION) {
                marketType = [MARKET_TYPES.HQ, MARKET_TYPES.EX_HQ, MARKET_TYPES.OS, MARKET_TYPES.INCIDENTAL, MARKET_TYPES.TRANSIT, MARKET_TYPES.CYCLE_MEETING, MARKET_TYPES.HILL_STATION, MARKET_TYPES.NOT_APPLICABLE];
            }
            // non field work and half day.
            return getDCRActivities().then(function(activities) {
                return dcrCollectionInstance.fetchAll().then(dcrCollectionInstance.fetchRecursiveFromCursor).then(function(dcrList) {
                    $scope.dcr = $filter('filter')(dcrList, {
                        'Date__c': $rootScope.dcrDate
                    });
                    var dcrActivity1 = $filter('filter')(activities, {
                        'Id': $scope.dcr[0].Activity1__c
                    });
                    var dcrActivity2 = null,
                        activitySelection = $scope.locale.FullDay;
                    if ($scope.dcr[0].Activity2__c != null) {
                        dcrActivity2 = $filter('filter')(activities, {
                            'Id': $scope.dcr[0].Activity2__c
                        });
                        activitySelection = $scope.locale.HalfDay;
                    }
                    if (dcrActivity1 && dcrActivity1.length) {
                        if (dcrActivity1[0].Name != $scope.locale.FieldWork || (dcrActivity2 && dcrActivity2.length && dcrActivity2[0].Name != $scope.locale.FieldWork && activitySelection == $scope.locale.HalfDay)) {
                            if (activities && activities.length) {
                                //AHPL User
                                if ($scope.userDetail.CompanyName == $scope.locale.AHPL_ORGANISATION) {
                                    if (activitySelection == $scope.locale.HalfDay && dcrActivity1[0].Name != $scope.locale.FieldWork) {
                                        angular.forEach(activities, function(activity) {
                                            if (activity.X1758__c == true && activity.Name == dcrActivity1[0].Name && activity.Half_Day__c == true) {
                                                masterList1 = activity;
                                            }
                                        })
                                    }
                                    if (activitySelection == $scope.locale.HalfDay && dcrActivity2[0].Name != $scope.locale.FieldWork) {
                                        angular.forEach(activities, function(activity) {
                                            if (activity.X1758__c == true && activity.Name == dcrActivity2[0].Name && activity.Half_Day__c == true) {
                                                masterList2 = activity;
                                            }
                                        })
                                    }
                                    if (activitySelection == $scope.locale.FullDay && dcrActivity1[0].Name != $scope.locale.FieldWork) {
                                        angular.forEach(activities, function(activity) {
                                            if (activity.X1758__c == true && activity.Name == dcrActivity1[0].Name && activity.Full_Day__c == true) {
                                                masterList3 = activity;
                                            }
                                        })
                                    }
                                }
                                //AIL User
                                else if ($scope.userDetail.CompanyName == $scope.locale.AIL_ORGANISATION) {
                                    if (activitySelection == $scope.locale.HalfDay && dcrActivity1[0].Name != $scope.locale.FieldWork) {
                                        angular.forEach(activities, function(activity) {
                                            if (activity.X1757__c == true && activity.Name == dcrActivity1[0].Name && activity.Half_Day__c == true) {
                                                masterList1 = activity;
                                            }
                                        })
                                    }
                                    if (activitySelection == $scope.locale.HalfDay && dcrActivity2[0].Name != $scope.locale.FieldWork) {
                                        angular.forEach(activities, function(activity) {
                                            if (activity.X1757__c == true && activity.Name == dcrActivity2[0].Name && activity.Half_Day__c == true) {
                                                masterList2 = activity;
                                            }
                                        })
                                    }
                                    if (activitySelection == $scope.locale.FullDay && dcrActivity1[0].Name != $scope.locale.FieldWork) {
                                        angular.forEach(activities, function(activity) {
                                            if (activity.X1757__c == true && activity.Name == dcrActivity1[0].Name && activity.Full_Day__c == true) {
                                                masterList3 = activity;
                                            }
                                        })
                                    }
                                }
                                if (masterList1 && masterList1.length != 0) {
                                    masterList.push(masterList1);
                                }
                                if (masterList2 && masterList2.length != 0) {
                                    masterList.push(masterList2);
                                }
                                if (masterList3 && masterList3.length != 0) {
                                    masterList.push(masterList3);
                                }
                            }
                        }
                    }
                    //tbm User
                    if ($scope.userDetail.Designation__c == $scope.locale.TBM) {
                        return getTerritoryList().then(function(territory) {
                            if ($scope.territoryList == $scope.locale.Metro) {
                                $scope.metroFlag = true;
                            }
                            return getDailyAllowanceFaresList().then(function(dailyAllowances) {
                                var dailyAllowanceFaresList = dailyAllowances.filter(function(dailyAllowances) {
                                    return dailyAllowances.Expense_Daily_Allowance_Master__r.Metro__c === $scope.metroFlag;
                                });
                                /* TBM Non Field Work */
                                if (dcrActivity1 && dcrActivity1.length) {
                                    if (dcrActivity1[0].Name != $scope.locale.FieldWork || (dcrActivity2 && dcrActivity2.length && dcrActivity2[0].Name != $scope.locale.FieldWork && activitySelection == $scope.locale.HalfDay)) {
                                        if (activities && activities.length) {
                                            if (masterList && masterList.length) {
                                                var splitActivity = [];
                                                angular.forEach(masterList, function(activity) {
                                                    if ($scope.userDetail.CompanyName == $scope.locale.AIL_ORGANISATION && activity.Daily_Allowance_Type_1757__c != null && getDateUtility.getDate(activity.Start_Date__c) <= getDateUtility.getDate($rootScope.dcrDate)) {
                                                        if (!!activity.Expiration_Date__c)
                                                            splitActivity = activity.Daily_Allowance_Type_1757__c.split(';');
                                                        else if (getDateUtility.getDate(activity.Expiration_Date__c) >= getDateUtility.getDate($rootScope.dcrDate))
                                                            splitActivity = activity.Daily_Allowance_Type_1757__c.split(';');
                                                    } else if ($scope.userDetail.CompanyName == $scope.locale.AHPL_ORGANISATION && activity.Daily_Allowance_Type_1758__c != null && getDateUtility.getDate(activity.Start_Date__c) <= getDateUtility.getDate($scope.dcrDate)) {
                                                        if (!!activity.Expiration_Date__c)
                                                            splitActivity = activity.Daily_Allowance_Type_1758__c.split(';');
                                                        else if (getDateUtility.getDate(activity.Expiration_Date__c) >= getDateUtility.getDate($rootScope.dcrDate))
                                                            splitActivity = activity.Daily_Allowance_Type_1758__c.split(';');
                                                    }
                                                });
                                                angular.forEach(splitActivity, function(value) {
                                                    // to get market type and allowance id.
                                                    angular.forEach(dailyAllowanceFaresList, function(fares) {
                                                        if (value == fares.Expense_Daily_Allowance_Master__r.Station__c) {
                                                            var fromDate = getDateUtility.getDate(fares.Effective_From_Date__c);
                                                            if (fares.Effective_To_Date__c != null) {
                                                                var toDate = getDateUtility.getDate(fares.Effective_To_Date__c);
                                                                if (getDateUtility.getDate($rootScope.dcrDate) >= fromDate && getDateUtility.getDate($rootScope.dcrDate) <= toDate) {
                                                                    $scope.availableMarketType.push(fares.Expense_Daily_Allowance_Master__r.Station__c);
                                                                    fareIDSet.push(fares.Id);
                                                                }
                                                            } else {
                                                                if (getDateUtility.getDate($rootScope.dcrDate) >= fromDate) {
                                                                    $scope.availableMarketType.push(fares.Expense_Daily_Allowance_Master__r.Station__c);
                                                                    fareIDSet.push(fares.Id);
                                                                }
                                                            }
                                                        }
                                                    });
                                                });
                                                angular.forEach(fareIDSet, function(fareId) {
                                                    angular.forEach(dailyAllowanceFaresList, function(dailyFare) {
                                                        if (dailyFare.Id == fareId) {
                                                            $scope.dailyFaresList.push(dailyFare);
                                                        }
                                                    });
                                                });
                                                angular.forEach(marketType, function(market) {
                                                    angular.forEach($scope.availableMarketType, function(mtype) {
                                                        if (mtype != null && mtype == market) {

                                                            $scope.finalMarketList.push(mtype);
                                                        }
                                                    });
                                                });
                                                var osCount = 0;
                                                angular.forEach($scope.finalMarketList, function(market) {
                                                    angular.forEach($scope.dailyFaresList, function(fare) {
                                                        if (market == fare.Expense_Daily_Allowance_Master__r.Station__c) {
                                                            if (fare.Expense_Daily_Allowance_Master__r.Station__c == MARKET_TYPES.OS) {
                                                                osCount = osCount + 1;
                                                                if (osCount <= 1) {
                                                                    $scope.dailyAllowanceList.push(fare);
                                                                }
                                                            } else {
                                                                $scope.dailyAllowanceList.push(fare);
                                                            }
                                                        }
                                                    });
                                                });
                                                angular.forEach($scope.dailyAllowanceList, function(fare) {
                                                    if (fare.Expense_Daily_Allowance_Master__r.Station__c == MARKET_TYPES.HILL_STATION) {
                                                        $scope.hillStationAllowance = fare.Allowance__c;
                                                    }
                                                });
                                                var dailyAllowanceWithHill = [];
                                                angular.forEach($scope.dailyAllowanceList, function(fare) {
                                                    if (fare.Expense_Daily_Allowance_Master__r.Station__c != MARKET_TYPES.HILL_STATION) {
                                                        var tempWrapper = {};
                                                        tempWrapper.dailyAllowancewithoutHill = fare;
                                                        tempWrapper.hillStationAllowance = $scope.hillStationAllowance;
                                                        dailyAllowanceWithHill.push(tempWrapper);
                                                    }
                                                });
                                                for (var i = 0; i < $scope.dailyAllowanceList.length; i++) {
                                                    if ($scope.dailyAllowanceList[i].Expense_Daily_Allowance_Master__r.Station__c == MARKET_TYPES.HILL_STATION) {
                                                        $scope.dailyAllowanceList.remove(i);
                                                    }
                                                }
                                                angular.forEach($scope.dailyAllowanceList, function(allowance) {
                                                    angular.forEach($scope.availableMarketType, function(market) {
                                                        if (market == allowance.Expense_Daily_Allowance_Master__r.Station__c) {
                                                            $scope.fareList.push({
                                                                'MarketType': allowance.Expense_Daily_Allowance_Master__r.Station__c,
                                                                'Allowance': allowance.Allowance__c,
                                                                'ERNCode': allowance.ERN_Code__c
                                                            });
                                                        }
                                                    });
                                                });
                                                $scope.fareList = $filter('unique')($scope.fareList, 'MarketType');
                                                if ($scope.fareList && $scope.fareList.length) {
                                                    var newList = $filter('orderBy')($scope.fareList, 'Allowance');
                                                    $scope.stationSelected = newList[0];
                                                    $scope.selectedMarket = newList[0].MarketType;
                                                    $scope.selectedFare = newList[0].Allowance;
                                                    $rootScope.ERNCode = newList[0].ERNCode;
                                                    toggleFaresSelection();
                                                }
                                            }
                                        }
                                    }
                                } // TBM Non Field Work ends
                                //Field Work activities
                                if (dcrActivity1 && dcrActivity1.length) {
                                    if (dcrActivity1[0].Name == $scope.locale.FieldWork || (dcrActivity2 && dcrActivity2.length && dcrActivity2[0].Name == $scope.locale.FieldWork && activitySelection == $scope.locale.HalfDay)) {
                                        var patchList = [];
                                        var pmflag = false;
                                        var pMJunctList = [];
                                        var pMMarketList = [];
                                        return getDCRJunctionsData().then(function(junctions) {
                                            angular.forEach(junctions, function(dcrj) {
                                                pmFlag = false;
                                                if (dcrj.Patch__c != null) {
                                                    patchList.push(dcrj.Patch__c);
                                                    pmFlag = true;
                                                }
                                            })
                                            return getPatchMarketJunctionData().then(function(patchData) {
                                                angular.forEach(patchData, function(patch) {
                                                    angular.forEach(patchList, function(dcrPatch) {
                                                        if (patch.Patch_Name__c == dcrPatch) {
                                                            pMJunctList.push(patchData);
                                                            pMMarketList.push(patch.SFC_Assignment__r.Market_Type__c);
                                                        }
                                                    });
                                                });
                                                pmFlag = false;
                                                angular.forEach(pMJunctList, function(pmj) {
                                                    pmFlag = false;
                                                    angular.forEach(junctions, function(dcrj) {
                                                        if (dcrj.Patch__c == pmj.Patch_Name__c && pmj.SFC_Assignment__r.Active__c) {
                                                            pmFlag = true;
                                                        }
                                                    });
                                                });
                                                return getPatchList().then(function(patchList) {
                                                    angular.forEach(pMMarketList, function(patch) {
                                                        angular.forEach(dailyAllowanceFaresList, function(fares) {
                                                            if (patch == fares.Expense_Daily_Allowance_Master__r.Station__c) {
                                                                var fromDate = getDateUtility.getDate(fares.Effective_From_Date__c);
                                                                if (fares.Effective_To_Date__c != null) {
                                                                    var toDate = getDateUtility.getDate(fares.Effective_To_Date__c);
                                                                    if (getDateUtility.getDate($rootScope.dcrDate) >= fromDate && getDateUtility.getDate($rootScope.dcrDate) <= toDate) {
                                                                        $scope.availableMarketType.push(fares.Expense_Daily_Allowance_Master__r.Station__c);
                                                                        fareIDSet.push(fares.Id);
                                                                    }
                                                                } else {
                                                                    if (getDateUtility.getDate($rootScope.dcrDate) >= fromDate) {
                                                                        $scope.availableMarketType.push(fares.Expense_Daily_Allowance_Master__r.Station__c);
                                                                        fareIDSet.push(fares.Id);
                                                                    }
                                                                }
                                                            }
                                                            /* TBM Hill Station*/
                                                            angular.forEach(patchData, function(patch) {
                                                                if (patch.SFC_Assignment__r != null && angular.isDefined(patch.SFC_Assignment__r)) {
                                                                    if (patch.SFC_Assignment__r.Hill_Station_Applicable__c == true) {
                                                                        if (fares.Expense_Daily_Allowance_Master__r.Station__c == MARKET_TYPES.HILL_STATION) {
                                                                            $scope.flagHillStation = true;
                                                                            var fromDate = getDateUtility.getDate(fares.Effective_From_Date__c);
                                                                            if (fares.Effective_To_Date__c != null) {
                                                                                var toDate = getDateUtility.getDate(fares.Effective_To_Date__c);
                                                                                if (getDateUtility.getDate($rootScope.dcrDate) >= fromDate && getDateUtility.getDate($rootScope.dcrDate) <= toDate) {
                                                                                    $scope.availableMarketType.push(fares.Expense_Daily_Allowance_Master__r.Station__c);
                                                                                    fareIDSet.push(fares.Id);
                                                                                }
                                                                            } else {
                                                                                if (getDateUtility.getDate($rootScope.dcrDate) >= fromDate) {
                                                                                    availableMarketType.push(fares.Expense_Daily_Allowance_Master__r.Station__c);
                                                                                    fareIDSet.push(fares.Id);
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            });
                                                            /* TBM Hill Station end*/
                                                        });
                                                    });
                                                    angular.forEach(fareIDSet, function(fareId) {
                                                        angular.forEach(dailyAllowanceFaresList, function(dailyFare) {
                                                            if (dailyFare.Id == fareId) {
                                                                $scope.dailyFaresList.push(dailyFare);
                                                            }
                                                        });
                                                    });
                                                    //

                                                    angular.forEach(marketType, function(market) {
                                                        angular.forEach($scope.availableMarketType, function(mtype) {
                                                            if (mtype != null && mtype == market) {
                                                                $scope.finalMarketList.push(mtype);
                                                            }
                                                        });
                                                    });
                                                    var osCount = 0;
                                                    angular.forEach($scope.finalMarketList, function(market) {
                                                        angular.forEach($scope.dailyFaresList, function(fare) {
                                                            if (market == fare.Expense_Daily_Allowance_Master__r.Station__c) {
                                                                if (fare.Expense_Daily_Allowance_Master__r.Station__c == MARKET_TYPES.OS) {

                                                                    osCount = osCount + 1;
                                                                    if (osCount <= 1) {
                                                                        $scope.dailyAllowanceList.push(fare);
                                                                    }


                                                                } else {
                                                                    $scope.dailyAllowanceList.push(fare);
                                                                }
                                                            }
                                                        });
                                                    });
                                                    angular.forEach($scope.dailyAllowanceList, function(fare) {
                                                        if (fare.Expense_Daily_Allowance_Master__r.Station__c == MARKET_TYPES.HILL_STATION) {
                                                            $scope.hillStationAllowance = fare.Allowance__c;
                                                        }
                                                    });
                                                    var dailyAllowanceWithHill = [];
                                                    angular.forEach($scope.dailyAllowanceList, function(fare) {
                                                        if (fare.Expense_Daily_Allowance_Master__r.Station__c != MARKET_TYPES.HILL_STATION) {
                                                            var tempWrapper = {};
                                                            tempWrapper.dailyAllowancewithoutHill = fare;
                                                            tempWrapper.hillStationAllowance = $scope.hillStationAllowance;
                                                            dailyAllowanceWithHill.push(tempWrapper);

                                                        }
                                                    });
                                                    for (var i = 0; i < $scope.dailyAllowanceList.length; i++) {
                                                        if ($scope.dailyAllowanceList[i].Expense_Daily_Allowance_Master__r.Station__c == MARKET_TYPES.HILL_STATION) {
                                                            $scope.dailyAllowanceList.remove(i);
                                                        }
                                                    }
                                                    angular.forEach($scope.dailyAllowanceList, function(allowance) {
                                                        angular.forEach($scope.availableMarketType, function(market) {
                                                            if (market == allowance.Expense_Daily_Allowance_Master__r.Station__c) {
                                                                $scope.fareList.push({
                                                                    'MarketType': allowance.Expense_Daily_Allowance_Master__r.Station__c,
                                                                    'Allowance': allowance.Allowance__c,
                                                                    'ERNCode': allowance.ERN_Code__c
                                                                })
                                                            }
                                                        });
                                                    });
                                                    $scope.fareList = $filter('unique')($scope.fareList, 'MarketType');
                                                    if ($scope.fareList && $scope.fareList.length) {
                                                        var newList = $filter('orderBy')($scope.fareList, 'Allowance');
                                                        $scope.stationSelected = newList[0];
                                                        $scope.selectedMarket = newList[0].MarketType;
                                                        $scope.selectedFare = newList[0].Allowance;
                                                        $rootScope.ERNCode = newList[0].ERNCode;
                                                        toggleFaresSelection();
                                                    }
                                                });
                                            });
                                        });
                                    }
                                } //Field Work ends
                            });
                        });
                    }
                    //TBM flow ends and ABM flow starts
                    if ($scope.userDetail.Designation__c == $scope.locale.ABM) {
                        return getTerritoryList().then(function(territory) {
                            if ($scope.territoryList == $scope.locale.Metro) {
                                $scope.metroFlag = true;
                            }
                            return getDailyAllowanceFaresList()
                                .then(function(dailyAllowances) {
                                    var dailyAllowanceFaresList = dailyAllowances.filter(function(dailyAllowances) {
                                        return dailyAllowances.Expense_Daily_Allowance_Master__r.Metro__c === $scope.metroFlag;
                                    })

                                    /* ABM Non Field Work */
                                    if (dcrActivity1 && dcrActivity1.length) {
                                        if (dcrActivity1[0].Name != $scope.locale.FieldWork || (dcrActivity2 && dcrActivity2.length && dcrActivity2[0].Name != $scope.locale.FieldWork && activitySelection == $scope.locale.HalfDay)) {
                                            if (activities && activities.length) {
                                                if (masterList && masterList.length) {
                                                    var splitActivity = [];
                                                    angular.forEach(masterList, function(activity) {
                                                        if ($scope.userDetail.CompanyName == $scope.locale.AIL_ORGANISATION && activity.Daily_Allowance_Type_1757__c != null && getDateUtility.getDate(activity.Start_Date__c) <= getDateUtility.getDate($rootScope.dcrDate)) {
                                                            if (!!activity.Expiration_Date__c)
                                                                splitActivity = activity.Daily_Allowance_Type_1757__c.split(';');
                                                            else if (getDateUtility.getDate(activity.Expiration_Date__c) >= getDateUtility.getDate($rootScope.dcrDate))
                                                                splitActivity = activity.Daily_Allowance_Type_1757__c.split(';');


                                                        } else if ($scope.userDetail.CompanyName == $scope.locale.AHPL_ORGANISATION && activity.Daily_Allowance_Type_1758__c != null && getDateUtility.getDate(activity.Start_Date__c) <= getDateUtility.getDate($scope.dcrDate)) {
                                                            if (!!activity.Expiration_Date__c)
                                                                splitActivity = activity.Daily_Allowance_Type_1758__c.split(';');
                                                            else if (getDateUtility.getDate(activity.Expiration_Date__c) >= getDateUtility.getDate($rootScope.dcrDate))
                                                                splitActivity = activity.Daily_Allowance_Type_1758__c.split(';');

                                                        }
                                                    })
                                                    angular.forEach(splitActivity, function(value) {
                                                        $scope.availableMarketType.push(value);
                                                    })
                                                    angular.forEach(dailyAllowances, function(fares) {
                                                        angular.forEach($scope.availableMarketType, function(market) {
                                                            if (market == fares.Expense_Daily_Allowance_Master__r.Station__c) {
                                                                var fromDate = getDateUtility.getDate(fares.Effective_From_Date__c);
                                                                if (fares.Effective_To_Date__c != null) {
                                                                    var toDate = getDateUtility.getDate(fares.Effective_To_Date__c);
                                                                    if (getDateUtility.getDate($rootScope.dcrDate) >= fromDate && getDateUtility.getDate($rootScope.dcrDate) <= toDate) {
                                                                        fareIDSet.push(fares.Id);
                                                                    }
                                                                } else {
                                                                    if (getDateUtility.getDate($rootScope.dcrDate) >= fromDate) {
                                                                        fareIDSet.push(fares.Id);
                                                                    }
                                                                }
                                                            }
                                                        })
                                                    })
                                                    angular.forEach(fareIDSet, function(fareId) {
                                                        angular.forEach(dailyAllowanceFaresList, function(dailyFare) {
                                                            if (dailyFare.Id == fareId) {
                                                                $scope.dailyFaresList.push(dailyFare);
                                                            }
                                                        })
                                                    })
                                                    angular.forEach(marketType, function(market) {
                                                        angular.forEach($scope.availableMarketType, function(mtype) {
                                                            if (mtype != null && mtype == market) {
                                                                $scope.finalMarketList.push(mtype);
                                                            }
                                                        })
                                                    })
                                                    var osCount = 0;
                                                    angular.forEach($scope.finalMarketList, function(market) {
                                                        angular.forEach($scope.dailyFaresList, function(fare) {
                                                            if (market == fare.Expense_Daily_Allowance_Master__r.Station__c) {
                                                                if (fare.Expense_Daily_Allowance_Master__r.Station__c == MARKET_TYPES.OS) {

                                                                    osCount = osCount + 1;
                                                                    if (osCount <= 1) {
                                                                        $scope.dailyAllowanceList.push(fare);
                                                                    }
                                                                } else {
                                                                    $scope.dailyAllowanceList.push(fare);
                                                                }
                                                            }
                                                        })
                                                    })
                                                    angular.forEach($scope.dailyAllowanceList, function(fare) {
                                                        if (fare.Expense_Daily_Allowance_Master__r.Station__c == MARKET_TYPES.HILL_STATION) {
                                                            $scope.hillStationAllowance = fare.Allowance__c;
                                                        }
                                                    })
                                                    var dailyAllowanceWithHill = [];
                                                    angular.forEach($scope.dailyAllowanceList, function(fare) {
                                                        if (fare.Expense_Daily_Allowance_Master__r.Station__c != MARKET_TYPES.HILL_STATION) {
                                                            var tempWrapper = {};
                                                            tempWrapper.dailyAllowancewithoutHill = fare;
                                                            tempWrapper.hillStationAllowance = $scope.hillStationAllowance;
                                                            dailyAllowanceWithHill.push(tempWrapper);

                                                        }
                                                    })
                                                    for (var i = 0; i < $scope.dailyAllowanceList.length; i++) {
                                                        if ($scope.dailyAllowanceList[i].Expense_Daily_Allowance_Master__r.Station__c == MARKET_TYPES.HILL_STATION) {
                                                            $scope.dailyAllowanceList.remove(i);
                                                        }
                                                    }
                                                    angular.forEach($scope.dailyAllowanceList, function(allowance) {
                                                        angular.forEach($scope.availableMarketType, function(market) {
                                                            if (market == allowance.Expense_Daily_Allowance_Master__r.Station__c) {
                                                                $scope.fareList.push({
                                                                    'MarketType': allowance.Expense_Daily_Allowance_Master__r.Station__c,
                                                                    'Allowance': allowance.Allowance__c,
                                                                    'ERNCode': allowance.ERN_Code__c
                                                                })
                                                            }
                                                        })
                                                    })
                                                    $scope.fareList = $filter('unique')($scope.fareList, 'MarketType');
                                                    if ($scope.fareList && $scope.fareList.length) {
                                                        var newList = $filter('orderBy')($scope.fareList, 'Allowance');
                                                        $scope.stationSelected = newList[0];
                                                        $scope.selectedMarket = newList[0].MarketType;
                                                        $scope.selectedFare = newList[0].Allowance;
                                                        $rootScope.ERNCode = newList[0].ERNCode;
                                                        toggleFaresSelection();
                                                    }

                                                }
                                            }
                                        }
                                    }
                                    /*ABM Non Field Work Ends */

                                    if (dcrActivity1 && dcrActivity1.length) {
                                        if (dcrActivity1[0].Name == $scope.locale.FieldWork || (dcrActivity2 && dcrActivity2.length && dcrActivity2[0].Name == $scope.locale.FieldWork && activitySelection == $scope.locale.HalfDay)) {
                                            angular.forEach(dailyAllowances, function(fares) {
                                                var fromDate = getDateUtility.getDate(fares.Effective_From_Date__c);
                                                if (fares.Effective_To_Date__c != null) {
                                                    var toDate = getDateUtility.getDate(fares.Effective_To_Date__c);
                                                    if (getDateUtility.getDate($rootScope.dcrDate) >= fromDate && getDateUtility.getDate($rootScope.dcrDate) <= toDate) {
                                                        $scope.availableMarketType.push(fares.Expense_Daily_Allowance_Master__r.Station__c);
                                                        fareIDSet.push(fares.Id);
                                                    }
                                                } else {
                                                    if (getDateUtility.getDate($rootScope.dcrDate) >= fromDate) {
                                                        $scope.availableMarketType.push(fares.Expense_Daily_Allowance_Master__r.Station__c);
                                                        fareIDSet.push(fares.Id);
                                                    }
                                                }
                                            })
                                            /*  ABM Hill Station */
                                            getPatchList().then(function(patches) {
                                                angular.forEach(patches, function(patch) {
                                                    if (patch.SFC_Assignment__r != null && angular.isDefined(patch.SFC_Assignment__r.Hill_Station_Applicable__c)) {
                                                        if (patch.SFC_Assignment__r.Hill_Station_Applicable__c == true) {
                                                            $scope.flagHillStation = true;
                                                        }
                                                    }
                                                })
                                                angular.forEach(fareIDSet, function(fareId) {
                                                    angular.forEach(dailyAllowanceFaresList, function(dailyFare) {
                                                        if (dailyFare.Id == fareId) {
                                                            $scope.dailyFaresList.push(dailyFare);
                                                        }
                                                    })
                                                })


                                                angular.forEach(marketType, function(market) {
                                                    angular.forEach($scope.availableMarketType, function(mtype) {
                                                        if (mtype != null && mtype == market) {
                                                            $scope.finalMarketList.push(mtype);
                                                        }
                                                    })
                                                })

                                                var osCount = 0;
                                                angular.forEach($scope.finalMarketList, function(market) {
                                                    angular.forEach($scope.dailyFaresList, function(fare) {
                                                        if (market == fare.Expense_Daily_Allowance_Master__r.Station__c) {
                                                            if (fare.Expense_Daily_Allowance_Master__r.Station__c == MARKET_TYPES.OS) {

                                                                osCount = osCount + 1;
                                                                if (osCount <= 1) {
                                                                    $scope.dailyAllowanceList.push(fare);
                                                                }

                                                            } else {
                                                                $scope.dailyAllowanceList.push(fare);
                                                            }
                                                        }
                                                    })
                                                })

                                                angular.forEach($scope.dailyAllowanceList, function(fare) {
                                                    if (fare.Expense_Daily_Allowance_Master__r.Station__c == MARKET_TYPES.HILL_STATION) {
                                                        $scope.hillStationAllowance = fare.Allowance__c;
                                                    }
                                                })
                                                var dailyAllowanceWithHill = [];
                                                angular.forEach($scope.dailyAllowanceList, function(fare) {
                                                    if (fare.Expense_Daily_Allowance_Master__r.Station__c != MARKET_TYPES.HILL_STATION) {
                                                        var tempWrapper = {};
                                                        tempWrapper.dailyAllowancewithoutHill = fare;
                                                        tempWrapper.hillStationAllowance = $scope.hillStationAllowance;
                                                        dailyAllowanceWithHill.push(tempWrapper);

                                                    }
                                                })

                                                for (var i = 0; i < $scope.dailyAllowanceList.length; i++) {
                                                    if ($scope.dailyAllowanceList[i].Expense_Daily_Allowance_Master__r.Station__c == MARKET_TYPES.HILL_STATION) {
                                                        $scope.dailyAllowanceList.remove(i);
                                                    }
                                                }

                                                angular.forEach($scope.dailyAllowanceList, function(allowance) {
                                                    angular.forEach($scope.availableMarketType, function(market) {
                                                        if (market == allowance.Expense_Daily_Allowance_Master__r.Station__c) {
                                                            $scope.fareList.push({
                                                                'MarketType': allowance.Expense_Daily_Allowance_Master__r.Station__c,
                                                                'Allowance': allowance.Allowance__c,
                                                                'ERNCode': allowance.ERN_Code__c
                                                            })
                                                        }
                                                    })
                                                })
                                                $scope.fareList = $filter('unique')($scope.fareList, 'MarketType');
                                                if ($scope.fareList && $scope.fareList.length) {
                                                    var newList = $filter('orderBy')($scope.fareList, 'Allowance');
                                                    $scope.stationSelected = newList[0];
                                                    $scope.selectedMarket = newList[0].MarketType;
                                                    $scope.selectedFare = newList[0].Allowance;
                                                    $rootScope.ERNCode = newList[0].ERNCode;
                                                    toggleFaresSelection();
                                                }
                                            })
                                        }
                                    }

                                    //ABM Hill Station ends
                                })
                        })
                    }
                    // ABM flow ends

                })
            })
        };
        /* get daily allowanace for user */
        var getDailyAllowanceFaresList = function() {
            return dailyAllowanceFareCollectionInstance.fetchAll().then(dailyAllowanceFareCollectionInstance.fetchRecursiveFromCursor).then(function(dailyAllowanceFares) {
                $scope.dailyAllowanceFares = dailyAllowanceFares;
                return dailyAllowanceFares;
            });
        };
        /* get territory list */
        var getTerritoryList = function() {
            return territoryCollectionInstance.fetchAll().then(territoryCollectionInstance.fetchRecursiveFromCursor).then(function(territories) {
                $scope.territoryList = territories[0].Territory_Type__c;
                return territories;
            });

        };
        /* get user territory data*/
        var getUserTerritory = function() {
            return userTerritoryCollectionInstance.fetchAll().then(userTerritoryCollectionInstance.fetchRecursiveFromCursor).then(function(userTerritory) {
                $scope.userTerritoryId = userTerritory[0].TerritoryId;
                return userTerritory;
            });
        };
        /* get SFC Assignments */
        var getSFCAssignments = function() {
            return sfcAssignmentCollectionInstance.fetchAll().then(sfcAssignmentCollectionInstance.fetchRecursiveFromCursor).then(function(assignments) {
                return assignments;
            })
            $scope.assignments = assignments;
        };
        /* show Standard Fare selection section based on market type selection */
        var toggleFaresSelection = function() {
            var tempdivlist = [];
            if ($scope.userDetail.CompanyName != '' && $scope.userDetail.CompanyName != null && ($scope.userDetail.CompanyName == $scope.locale.AIL_ORGANISATION || $scope.userDetail.CompanyName == $scope.locale.AHPL_ORGANISATION)) {
                return getDivisions().then(function(division) {
                    angular.forEach(division, function(div) {
                        if (div.Company_Code__c == $scope.locale.AIL_ORGANISATION || div.Company_Code__c == $scope.locale.AHPL_ORGANISATION && div.Mobile_Claim_applicable__c == true) {
                            tempdivlist.push(div);
                        }
                    })
                    if (angular.isDefined(tempdivlist) && tempdivlist.length != 0) {
                        var tempdesg = [];
                        if (tempdivlist[0].MobileClaimApplicableDesignations__c != '' && tempdivlist[0].MobileClaimApplicableDesignations__c != null) {
                            tempdesg = tempdivlist[0].MobileClaimApplicableDesignations__c.split(';');
                        }
                    }
                    if (angular.isDefined(tempdesg) && tempdesg.length != 0) {
                        if (tempdesg.length > 0 && $scope.userDetail.Designation__c != '' && $scope.userDetail.Designation__c != null) {

                            if ($scope.userDetail.Expense_Designation__c != '' && $scope.userDetail.Expense_Designation__c != null) {
                                angular.forEach(tempdesg, function(temp) {

                                    if (temp == $scope.userDetail.Expense_Designation__c) {
                                        $scope.mobClaimBool = true;
                                    }
                                })
                            } else if ($scope.userDetail.Designation__c != '' && $scope.userDetail.Designation__c != null) {
                                angular.forEach(tempdesg, function(temp) {
                                    if (temp == $scope.userDetail.Expense_Designation__c) {
                                        $scope.mobClaimBool = true;
                                    }
                                })

                            }
                        }
                    }
                    if ($scope.selectedMarket == MARKET_TYPES.HQ || $scope.selectedMarket == MARKET_TYPES.INCIDENTAL || $scope.selectedMarket == MARKET_TYPES.TRANSIT || $scope.selectedMarket == MARKET_TYPES.CYCLE_MEETING || $scope.selectedMarket == MARKET_TYPES.NOT_APPLICABLE) {
                        $scope.sfcFlag = false;

                    } else if ($scope.selectedMarket == MARKET_TYPES.EX_HQ || $scope.selectedMarket == MARKET_TYPES.OS) {
                        $scope.sfcFlag = true;
                    }
                    $scope.miscFlag = true;
                })
            }
        };
        /* on selection of a radio button this function is called */
        $scope.standardFareSelection = function(fares, index) {
            $scope.stationSelected = fares;
            $scope.selectedMarket = fares.MarketType;
            $scope.selectedFare = fares.Allowance;
            $rootScope.ERNCode = fares.ERNCode;
            toggleFaresSelection();
        };
        /* get fares for standard fare chart and populate from market for ABM and TBM and to market for TBM */
        var getTerritoryAndFaresFromSFC = function() {
            var recordList = [];
            $scope.finalRouteList = [];
            $scope.toMarketList = [];
            $scope.routeList = [];
            $scope.fromMarketList = [];
            if ($scope.userDetail.Designation__c == $scope.locale.TBM) {
                var sfcAssignmentIDList = [];
                var sfcMasterIDList = [];
                angular.forEach($scope.patchList, function(patch) {
                    sfcAssignmentIDList.push(patch.SFC_Assignment__c);
                    sfcMasterIDList.push(patch.SFC_Assignment__r.SFC_Master__c);
                })
                return getSFCAssignments().then(function(assignments) {
                    assignments = assignments.filter(function(assignment) {
                        return sfcAssignmentIDList.indexOf(assignment.Id) != -1;
                    });
                    angular.forEach(assignments, function(assignedFareTerm) {
                        angular.forEach($scope.sfcFares, function(assignedFare) {
                            if (assignedFare.SFC_Master__c == assignedFareTerm.SFC_Master__c) {
                                var todaysDate = $rootScope.dcrDate;
                                if (assignedFare.Effective_From_Date__c != null) {
                                    var fromDate = assignedFare.Effective_From_Date__c;
                                    var fDate = getDateUtility.getDate(fromDate);
                                    if (assignedFare.Effective_To_Date__c != null) {
                                        var toDate = getDateUtility.getDate(assignedFare.Effective_To_Date__c);
                                        if (getDateUtility.getDate($rootScope.dcrDate) >= fDate && getDateUtility.getDate($rootScope.dcrDate) <= toDate) {
                                            var expenseSFC = {};
                                            expenseSFC.fare = assignedFare.One_way_Fare__c.toString();
                                            expenseSFC.fromMarket = assignedFareTerm.SFC_Master__r.From_Market__c;
                                            expenseSFC.toMarket = assignedFareTerm.SFC_Master__r.To_Market__c;
                                            expenseSFC.modeOfTravel = assignedFareTerm.Mode_of_Travel__c;
                                            expenseSFC.sfcId = assignedFareTerm.Id;
                                            expenseSFC.ERNCodeString = assignedFare.ERN_Code__c;
                                            expenseSFC.distance = assignedFareTerm.SFC_Master__r.One_way_distance_in_kms__c;
                                            $scope.sfcDisplayList.push(expenseSFC);
                                        }
                                    } else {
                                        if (getDateUtility.getDate($rootScope.dcrDate) >= fDate) {
                                            var expenseSFC = {};
                                            expenseSFC.fare = assignedFare.One_way_Fare__c.toString();
                                            expenseSFC.fromMarket = assignedFareTerm.SFC_Master__r.From_Market__c;
                                            expenseSFC.toMarket = assignedFareTerm.SFC_Master__r.To_Market__c;
                                            expenseSFC.modeOfTravel = assignedFareTerm.Mode_of_Travel__c;
                                            expenseSFC.sfcId = assignedFareTerm.Id;
                                            expenseSFC.ERNCodeString = assignedFare.ERN_Code__c;
                                            expenseSFC.distance = assignedFareTerm.SFC_Master__r.One_way_distance_in_kms__c;
                                            $scope.sfcDisplayList.push(expenseSFC);
                                        }
                                    }
                                }
                            }
                        });
                    });
                    $scope.SFCData = angular.copy($scope.sfcDisplayList);
                });
            }
            // for ABM user prepare fare.
            if ($scope.userDetail.Designation__c == $scope.locale.ABM) {
                var codeList = [];
                var territoryIdList = [];
                var marketList = [];
                var abmSFCAssignList = [];
                var abmSFCCode = [];
                var tbmTerrcode = [];
                var tbmterrList = [];
                var tbmSFCCode = [];
                var tbmSFCAssignList = [];
                var tempSFCMasterIdSet = [];
                var abmTerrId;
                $scope.availableMarketType = $filter('unique')($scope.availableMarketType, 'key');
                return getTerritoryList().then(function(territories) {
                    angular.forEach(territories, function(territory) {
                        var abmTerrId = {};
                        abmTerrId.Id = territory.Id;
                        abmTerrId.Name = territory.Name;
                        codeList.push(abmTerrId);
                    })
                    return getSFCAssignments()
                        .then(function(assignments) {
                            $scope.masterAssignmentList = assignments;
                            angular.forEach(assignments, function(assignment) {
                                angular.forEach(codeList, function(codes) {
                                    angular.forEach($scope.availableMarketType, function(market) {
                                        if (assignment.Territory_Code__c == codes.Name && assignment.Market_Type__c == market && assignment.Active__c == true) {
                                            abmSFCAssignList.push(assignment);
                                        }
                                    })
                                })
                            })
                            angular.forEach(abmSFCAssignList, function(abmSFC) {
                                abmSFCCode.push(abmSFC.SFC_Code__c)
                            })
                            angular.forEach(territories, function(territory) {
                                angular.forEach(codeList, function(code) {
                                    if (territory.ParentTerritoryId == code.Id) {
                                        tbmterrList.push(territory);
                                    }
                                })
                            })
                            angular.forEach(tbmterrList, function(tbmTerr) {
                                tbmTerrcode.push(tbmTerr.Name);
                            })
                            angular.forEach(assignments, function(assignment) {
                                angular.forEach(tbmTerrcode, function(tbmterr) {
                                    angular.forEach(abmSFCCode, function(abmSFC) {
                                        angular.forEach($scope.availableMarketType, function(market) {
                                            if (assignment.Territory_Code__c == tbmterr && assignment.SFC_Master__r.SFC_Code__c != abmSFC && assignment.Market_Type__c == market && assignment.Active__c == true) {
                                                tbmSFCAssignList.push(assignment);
                                            }
                                        })
                                    })
                                })
                            })
                            if (tbmSFCAssignList && tbmSFCAssignList.length) {
                                angular.forEach(tbmSFCAssignList, function(tbmSFC) {
                                    abmSFCAssignList.push(tbmSFC);
                                })
                            }
                            angular.forEach(abmSFCAssignList, function(sfcAssign) {
                                tempSFCMasterIdSet.push(sfcAssign.SFC_Master__c);
                            })
                            return getSFCFares().then(function(sfcFares) {
                                angular.forEach(sfcFares, function(fares) {
                                    $scope.faresListForABM.push(fares);
                                })
                                //$scope.faresListForABM[0].Effective_From_Date__c =  $scope.dcrDate;
                                angular.forEach($scope.faresListForABM, function(assignedFare) {
                                    var todaysDate = $rootScope.dcrDate;
                                    if (assignedFare.Effective_From_Date__c != null) {
                                        var fromDate = assignedFare.Effective_From_Date__c;
                                        var fDate = getDateUtility.getDate(fromDate);
                                        if ((assignedFare.Effective_To_Date__c != null)) {
                                            var toDate = getDateUtility.getDate(assignedFare.Effective_To_Date__c);
                                            if (getDateUtility.getDate($rootScope.dcrDate) >= fDate && getDateUtility.getDate($rootScope.dcrDate) <= toDate) {
                                                $scope.fromMarketList.push(assignedFare.SFC_Master__r.From_Market__c);
                                                $scope.finalFromMarketList.push(assignedFare.SFC_Master__r.From_Market__c);
                                                $scope.finalRouteList.push({
                                                    'fromRoute': assignedFare.SFC_Master__r.From_Market__c,
                                                    'toRoute': assignedFare.SFC_Master__r.To_Market__c
                                                })
                                                var expenseSFC = {};
                                                expenseSFC.fare = assignedFare.One_way_Fare__c.toString();
                                                expenseSFC.fromMarket = assignedFare.SFC_Master__r.From_Market__c;
                                                expenseSFC.toMarket = assignedFare.SFC_Master__r.To_Market__c;
                                                angular.forEach($scope.masterAssignmentList, function(assignment) {
                                                    if (assignment.Id == assignedFare.SFC_Assignment__c) {
                                                        expenseSFC.modeOfTravel = assignment.Mode_of_Travel__c;
                                                        expenseSFC.sfcId = assignment.Id;
                                                    }
                                                })
                                                expenseSFC.ERNCodeString = assignedFare.ERN_Code__c;
                                                expenseSFC.distance = assignedFare.SFC_Master__r.One_way_distance_in_kms__c;
                                                $scope.sfcDisplayList.push(expenseSFC);
                                            }
                                        } else {
                                            if (getDateUtility.getDate($rootScope.dcrDate) >= fDate) {
                                                $scope.fromMarketList.push(assignedFare.SFC_Master__r.From_Market__c);
                                                $scope.finalFromMarketList.push(assignedFare.SFC_Master__r.From_Market__c);
                                                $scope.finalRouteList.push({
                                                    'fromRoute': assignedFare.SFC_Master__r.From_Market__c,
                                                    'toRoute': assignedFare.SFC_Master__r.To_Market__c
                                                })
                                                var expenseSFC = {};
                                                expenseSFC.fare = assignedFare.One_way_Fare__c.toString();
                                                expenseSFC.fromMarket = assignedFare.SFC_Master__r.From_Market__c;
                                                expenseSFC.toMarket = assignedFare.SFC_Master__r.To_Market__c;
                                                angular.forEach($scope.masterAssignmentList, function(assignment) {
                                                    if (assignment.Id == assignedFare.SFC_Assignment__c) {
                                                        expenseSFC.modeOfTravel = assignment.Mode_of_Travel__c;
                                                        expenseSFC.sfcId = assignment.Id;
                                                    }
                                                })
                                                expenseSFC.ERNCodeString = assignedFare.ERN_Code__c;
                                                expenseSFC.distance = assignedFare.SFC_Master__r.One_way_distance_in_kms__c;
                                                $scope.sfcDisplayList.push(expenseSFC);
                                            }
                                        }
                                    }
                                })
                            })
                        })
                })
            };
        };
        /* get description dropdown items */
        var getDescriptionList = function() {
            return expenseSAPCodesCollectionInstance.fetchAll().then(expenseSAPCodesCollectionInstance.fetchRecursiveFromCursor).then(function(sapCodes) {
                $scope.descriptionData = sapCodes;
                return sapCodes;
            })
        };

        var getOtherExpenses = function() {
            return otherExpensesEarningCollectionInstance.fetchAll().then(otherExpensesEarningCollectionInstance.fetchRecursiveFromCursor).then(function(otherExpenses) {
                $scope.otherExpenses = otherExpenses;
                return otherExpenses;
            })
        };
        /* to  prepare miscellaneous data */
        var evaluateMiscellaneousExpenses = function() {
            var leaveDateSet = [];
            var isTaskForce = false;
            return getUserTerritory().then(function(userTerritory) {
                var terrIdList = [];
                angular.forEach(userTerritory, function(ut) {
                    terrIdList.push(ut.TerritoryId);
                })
            }).then(getTerritoryList).then(function(territory) {
                var divCodeList = [];
                angular.forEach(territory, function(terr) {
                    divCodeList.push(terr.Divison_Code__c);
                })
            }).then(holidayUsers).then(function(holidayUsers) {
                var leaveDateSet = [];
                angular.forEach(holidayUsers, function(holiday) {
                    leaveDateSet.push(holiday.Date__c);
                })
            }).then(leavesApprovedUsers).then(function(leaves) {
                angular.forEach(leaves, function(leaveReq) {
                    if (leaveReq.Status__c == $scope.locale.APPROVED || leaveReq.Status__c == $scope.locale.REJECTED_CANCELLATION || leaveReq.Status__c == $scope.locale.MANAGER_APPLIED || leaveReq.Status__c == $scope.locale.HR_APPLIED || leaveReq.Status__c == $scope.locale.HR_UPDATED) {
                        for (var d = leaveReq.From_Date__c; d <= leaveReq.To_Date__c; d++) {
                            leaveDateSet.push(d);
                        }
                    }
                })
                var newDay = getDateUtility.getDate($rootScope.dcrDate);
                var firstDayOfMonth = new Date(newDay.getFullYear(), newDay.getMonth(), 1);
                firstDayOfMonth = getDateUtility.getDate(firstDayOfMonth);
                var lastDayOfMonth = new Date(newDay.getFullYear(), newDay.getMonth() + 1, 0);
                lastDayOfMonth = getDateUtility.getDate(lastDayOfMonth);
                var leaveRangeSet = [];
                lastDayOfMonth = getDateUtility.formatDate(lastDayOfMonth);
                for (var d = $rootScope.dcrDate; d <= lastDayOfMonth; d++) {
                    var dt = new Date(d);
                    if (dt.getDay() == 0) {
                        leaveRangeSet.push(d);
                    }
                }
                angular.forEach(leaveDateSet, function(leave) {
                    if (d == leave) {
                        leaveRangeSet.push(d);
                    }
                })
                var remainingDaysInMonth = getDateUtility.getDate(lastDayOfMonth) - getDateUtility.getDate($rootScope.dcrDate);
                var workingDays = 0;
                if (leaveRangeSet != null)
                    var workingDays = remainingDaysInMonth - leaveRangeSet.length;

                if (workingDays == 0) {
                    workdayFlag = true;
                }
                return getDescriptionList().then(function(sapCodes) {
                    return getOtherExpenses().then(function(otherExpenses) {
                        angular.forEach(otherExpenses, function(otherExp) {
                            angular.forEach(sapCodes, function(desc) {
                                if (getDateUtility.getDate(otherExp.Effective_from_date__c) <= getDateUtility.getDate($rootScope.dcrDate) && getDateUtility.getDate(otherExp.Effective_to_date__c) >= getDateUtility.getDate($rootScope.dcrDate) && otherExp.Other_Expense__r.Expense_Name__c != EXPENSE_TYPES.TASK_FORCE && otherExp.Other_Expense__r.Expense_Name__c != EXPENSE_TYPES.HOTEL_EXPENSE) {
                                    if (otherExp.Other_Expense__r.Expense_Name__c != EXPENSE_TYPES.OTHERS) {
                                        if (otherExp.Other_Expense__r.Expense_Name__c == desc.Value__c) {
                                            var otherExpense = {};
                                            otherExpense.Expense_Name__c = otherExp.Other_Expense__r.Expense_Name__c;
                                            otherExpense.Name = otherExp.Other_Expense__r.Name;
                                            otherExpense.ERN_Type__c = otherExp.ERN_Type__c;
                                            $scope.descriptionList.push(otherExpense);
                                        }
                                    }
                                }
                                if (workdayFlag == true && otherExp.Expense_Name__c == EXPENSE_TYPES.TASK_FORCE) {
                                    if (otherExp.Other_Expense__r.Expense_Name__c == desc.Value__c) {
                                        var otherExpense = {};
                                        otherExpense.Expense_Name__c = otherExp.Other_Expense__r.Expense_Name__c;
                                        otherExpense.Name = otherExp.Other_Expense__r.Name;
                                        otherExpense.ERN_Type__c = otherExp.ERN_Type__c;
                                        $scope.descriptionList.push(otherExpense);
                                    }
                                }
                            })
                        })
                    })
                })
            })
        };
        /* get DCR data */
        var getDCRData = function() {
            return dcrCollectionInstance.fetchAll().then(dcrCollectionInstance.fetchRecursiveFromCursor).then(function(dcrList) {
                $scope.dcr = $filter('filter')(dcrList, {
                    'Date__c': $rootScope.dcrDate
                });
                return $scope.dcr;
            });
        };
        /* getDCR Junctions Data */
        var getDCRJunctionsData = function() {
            return dcrJunctionCollectionInstance.fetchAll().then(dcrJunctionCollectionInstance.fetchRecursiveFromCursor).then(function(dcrJunctionInfo) {
                var dcrJunctionByDate = $filter('filter')(dcrJunctionInfo, {
                    'DCR__c': $scope.dcr[0].Id
                });
                return dcrJunctionByDate;
            });
        };

        var validateExpense = function($event) {
            var sfcValid = true;
            $scope.errorMessages = [];
            if ($scope.SFCData && $scope.SFCData.length && ($scope.SFCData[0].fromMarket == null || $scope.SFCData[0].fromMarket == '') && $scope.sfcFlag) {
                sfcValid = false;
                $scope.errorMessages.push($scope.locale.SelectFromMarket);
            }
            if (!$scope.expenseSubmission.$valid || !sfcValid) {
                $event.preventDefault();
                angular.forEach($scope.expenseSubmission.$error.required, function(errMessage) {
                    if (errMessage.$name.substring(0, 3) == 'SFC') {
                        if ($scope.errorMessages.indexOf($scope.locale.SelectSFC) == -1)
                            $scope.errorMessages.push($scope.locale.SelectSFC);
                    } else if (errMessage.$name.substring(0, 10) == 'fromMarket') {
                        if ($scope.errorMessages.indexOf($scope.locale.SelectFromMarket) == -1)
                            $scope.errorMessages.push($scope.locale.SelectFromMarket);
                    } else if (errMessage.$name.substring(0, 8) == 'toMarket') {
                        if ($scope.errorMessages.indexOf($scope.locale.SelectToMarket) == -1)
                            $scope.errorMessages.push($scope.locale.SelectToMarket);
                    } else if (errMessage.$name.substring(0, 15) == 'detailedRemarks' || errMessage.$name.substring(0, 10) == 'miscAmount') {
                        if ($scope.errorMessages.indexOf($scope.locale.MiscellaneousExpenseRequired) == -1)
                            $scope.errorMessages.push($scope.locale.MiscellaneousExpenseRequired);
                    } else
                        $scope.errorMessages.push($scope.locale.ExpenseSubmissionFailed);
                });
                angular.forEach($scope.expenseSubmission.$error.maxlength, function(errMessage) {
                    if (errMessage.$name.substring(0, 15) == 'detailedRemarks' || errMessage.$name.substring(0, 10) == 'miscAmount') {
                        if ($scope.errorMessages.indexOf($scope.locale.MiscellaneousExpenseRequired) == -1)
                            $scope.errorMessages.push($scope.locale.MiscellaneousExpenseMaxlength);
                    } else
                        $scope.errorMessages.push($scope.locale.ExpenseSubmissionFailed);
                });
                popupService.openConfirmWithTemplateUrl($scope, 'app/modules/Expense/ErrorMessages.html', '80%', '70%')
                return false;
            } else {
                return true;
            }
        };
        /* function called on submitting Expense */
        $scope.submitExpenseForApproval = function($event) {
            if ($scope.isSelectionValid == false)
                $scope.expenseSubmission.$valid = false;
            if (validateExpense($event)) {
                var expenseEntry = [];
                // loader
                $scope.transperantConfig = abbottConfigService.getTransparency();
                $scope.transperantConfig.display = true;
                $scope.transperantConfig.showBusyIndicator = true;
                $scope.transperantConfig.showTransparancy = true;
                abbottConfigService.setTransparency($scope.transperantConfig);
                //Expense
                assigmentDetailCollectionInstance.fetchAll().then(assigmentDetailCollectionInstance.fetchRecursiveFromCursor).then(function(userAssignments) {
                        $scope.userAssignments = userAssignments;
                        return userAssignments;
                    }).then(patchCollectionInstance.fetchAll).then(patchCollectionInstance.fetchRecursiveFromCursor).then(function(userPatchList) {
                        $scope.userPatchList = userPatchList;
                        return userPatchList;
                    })
                    .then(getDCRData).then(function(dcrList) {
                        angular.forEach(dcrList, function(dcr) {
                            $scope.dcrId = dcr.Id;
                            $scope.dcrTerritory = dcr.Territory_Code__c;
                        })
                    }).then(getDCRJunctionsData).then(function(dcrJunctions) {
                        var doctorCount = 0,
                            chemistCount = 0,
                            stockistCount = 0,
                            patches = [],
                            patchList = [],
                            patchName = '',
                            doctorsMet = '',
                            marketType = [],
                            marketTypeList = [],
                            marketTypeName = '';

                        angular.forEach(dcrJunctions, function(junction) {
                            if (junction.Account__c != null) {
                                var customerLst = $filter('filter')($scope.userAssignments, {
                                    Id: junction.Assignment__c
                                });
                                if (junction.Assignment__r == null) {
                                    var assign = $filter('filter')($scope.userAssignments, function(assignment) {
                                        return assignment.Id == junction.Assignment__c;
                                    });
                                    junction.Assignment__r = assign.length ? assign[0] : null;
                                }
                                if (junction.Patch__r == null) {
                                    var patch = $filter('filter')($scope.userPatchList, function(userPatch) {
                                        return userPatch.Id == junction.Patch__c;
                                    })
                                    junction.Patch__r = patch.length ? patch[0] : null;
                                }
                                console.log(customerLst);
                                var customer_type = customerLst.length ? customerLst[0].Account__r.RecordType.Name : '';
                                if (customer_type == $scope.locale.Doctor) {
                                    doctorCount = doctorCount + 1;
                                    if (junction.Assignment__r && junction.Assignment__r.Market_Type__c != undefined) {
                                        if (marketType[junction.Assignment__r.Market_Type__c] == undefined) {
                                            marketType[junction.Assignment__r.Market_Type__c] = 1;
                                            marketTypeList.push(junction.Assignment__r.Market_Type__c);
                                        } else {
                                            marketType[junction.Assignment__r.Market_Type__c]++;
                                        }
                                    }
                                    if (junction.Patch__r && junction.Patch__r.Name != undefined) {
                                        if (patches[junction.Patch__r.Name] == undefined) {
                                            patches[junction.Patch__r.Name] = 1;
                                            patchList.push(junction.Patch__r.Name);
                                        } else {
                                            patches[junction.Patch__r.Name]++;
                                        }
                                    }
                                } else if (customer_type == $scope.locale.Chemist) {
                                    chemistCount = chemistCount + 1;
                                } else if (customer_type == $scope.locale.Stockist) {
                                    stockistCount = stockistCount + 1;
                                }
                            }
                        });
                        patchName = patchList.map(function(pat) {
                            return pat + '(' + patches[pat] + ')'
                        }).join(',');

                        marketTypeName = marketTypeList.map(function(mat) {
                            return mat + '(' + marketType[mat] + ')'
                        }).join(',');

                        if ($scope.selectedMarket != null && angular.isDefined($scope.selectedMarket) && $scope.selectedFare != null && angular.isDefined($scope.selectedFare)) {
                            var expenseObj = {};
                            expenseObj.Expense_Date__c = $rootScope.dcrDate;
                            expenseObj.Station__c = $scope.selectedMarket;
                            expenseObj.DCR__c = $scope.dcrId;
                            expenseObj.Local_DCR__c = $scope.dcrId;
                            expenseObj.Territory__c = $scope.dcrTerritory;
                            if ($scope.flagHillStation == true) {
                                expenseObj.Hill_Station_Allowance__c = $scope.selectedFare;
                                expenseObj.Daily_Allowance_ERN_Type__c = $rootScope.ERNCode;
                            } else {
                                delete expenseObj.Hill_Station_Allowance__c;
                                expenseObj.Daily_Allowance__c = $scope.selectedFare;
                                expenseObj.Daily_Allowance_ERN_Type__c = $rootScope.ERNCode;
                            }
                            expenseObj.Doctors_Met__c = marketTypeName;
                            expenseObj.Doctors_Count__c = doctorCount;
                            expenseObj.Places_Worked__c = patchName;
                            expenseObj.Stockist_Met__c = stockistCount;
                            expenseObj.Chemist_Met__c = chemistCount;
                            expenseObj.isMobileExpense__c = true;
                            expenseObj.Status__c = 'Submitted';
                            expenseEntry.push(expenseObj);
                            $scope.expenseStatus = true;
                            //upsert to expense
                            expenseCollectionInstance.upsertEntities(expenseEntry).then(function(response) {
                                if (response[0].Id == undefined) {
                                    expenseObj.Id = response[0]._soupEntryId;
                                    $rootScope.expenseIdVal = expenseObj.Id;
                                    $scope.expenseId = expenseObj.Id;
                                    expenseObj._soupEntryId = response[0]._soupEntryId;
                                    expenseCollectionInstance.upsertEntities([expenseObj]);
                                    updateExpenseDetails(expenseObj.Id);
                                }
                            });
                        }
                    });
            };
        };

        var updateExpenseDetails = function(expenseId) {
            var expenseDetailsEntry = [];
            //Expense details
            if ($scope.SFCData && $scope.SFCData.length && $scope.sfcFlag == true) {
                $scope.expenseDetailStatus = true;
                angular.forEach($scope.SFCData, function(sfc) {
                    if (sfc.fareClaimedBool != '') {
                        var expenseDetailsObj = {};
                        if (sfc.fareClaimedBool == $scope.locale.OneWay) {
                            expenseDetailsObj.Fare_Claimed__c = $scope.locale.OneWay;
                            expenseDetailsObj.Fare_Amount__c = parseInt(sfc.fare);
                        } else if (sfc.fareClaimedBool == $scope.locale.TwoWay) {
                            expenseDetailsObj.Fare_Claimed__c = $scope.locale.TwoWay;
                            expenseDetailsObj.Fare_Amount__c = (parseInt(sfc.fare)) * 2;
                        } else if (sfc.fareClaimedBool == 'NA') {
                            expenseDetailsObj.Fare_Claimed__c = '';
                            expenseDetailsObj.Fare_Amount__c = 0;
                        }
                        expenseDetailsObj.SFC_Assignment__c = sfc.sfcId;
                        expenseDetailsObj.Expense_Type__c = EXPENSE_TYPES.FARES;
                        expenseDetailsObj.Expense__c = expenseId;
                        expenseDetailsObj.From_Market__c = sfc.fromMarket;
                        expenseDetailsObj.To_Market__c = sfc.toMarket;
                        expenseDetailsObj.Mode_of_Travel__c = sfc.modeOfTravel;
                        expenseDetailsObj.Distance_One_Way__c = sfc.distance;
                        if (sfc.ERNCodeString != null) {
                            expenseDetailsObj.ERN_Code__c = sfc.ERNCodeString;
                        } else {
                            expenseDetailsObj.ERN_Code__c = $scope.locale.DefaultERN;
                        }
                        expenseDetailsEntry.push(expenseDetailsObj);
                    }
                });
            }
            if ($scope.miscData && $scope.miscData.length) {
                angular.forEach($scope.miscData, function(miscDetails) {
                    var expenseDetailsObj = {};
                    if (miscDetails.amount != '' && miscDetails.description != '' && miscDetails.detailedRemarks != '') {
                        $scope.miscFlag = true;

                        angular.forEach($scope.descriptionList, function(desc) {
                            if (desc.Expense_Name__c == miscDetails.description) {
                                $rootScope.ERNCode = desc.ERN_Type__c;
                            } else {
                                $rootScope.ERNCode = $scope.locale.DefaultERN;
                            }
                        });
                        expenseDetailsObj.Expense__c = expenseId;
                        expenseDetailsObj.Expense_Type__c = EXPENSE_TYPES.MISCELLANEOUS;
                        expenseDetailsObj.Misc_Amount__c = parseInt(miscDetails.amount);
                        expenseDetailsObj.Misc_Description__c = miscDetails.description;
                        expenseDetailsObj.Misc_Remarks__c = miscDetails.detailedRemarks;
                        expenseDetailsObj.Misc_Detailed_Remarks__c = miscDetails.detailedRemarks;
                        expenseDetailsObj.ERN_Code__c = $rootScope.ERNCode;
                        console.log(expenseDetailsObj);
                        expenseDetailsEntry.push(expenseDetailsObj);
                    }
                });
            }
            /* upsert to Expense details */
            expenseDetailsCollectionInstance.upsertEntities(expenseDetailsEntry).then(function(response) {
                $scope.transperantConfig.display = false;
                $scope.transperantConfig.showBusyIndicator = false;
                $scope.transperantConfig.showTransparancy = false;
                abbottConfigService.setTransparency($scope.transperantConfig);
                $rootScope.disablingEdit = true;
                $scope.buttonDisabled = true;
                $scope.init();
                popupService.openConfirm('', $scope.locale.WishToFileHotelExpense + ' ' + $scope.expenseDay + ' ' + $scope.expenseMonth + ' ' + $scope.expenseYear + '?', $scope.locale.CANCEL, $scope.locale.PROCEED, '35%', function() {
                    navigationService.navigate('LandingPage');
                }, function() {
                    navigationService.navigate('ExpenseUpload');
                });
            });
        };

        $scope.goToLanding = function() {
            navigationService.navigate('dcrCalendar');
        };
        $scope.closeSFCFares = function() {
            popupService.closePopup();
        };
    }
]);