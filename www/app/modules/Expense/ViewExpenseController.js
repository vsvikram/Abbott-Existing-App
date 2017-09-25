abbottApp.controller('viewExpenseController', ['$stateParams', '$scope', '$rootScope', 'abbottConfigService', 'navigationService', '$filter', 'popupService', 'utils', 'userCollection', 'dcrCollection', 'fullDayActivityCollection', 'halfDayActivityCollection', 'expenseCollection', 'expenseDetailsCollection', 'attachmentCollection', 'EXPENSE_TYPES',
    function($stateParams, $scope, $rootScope, abbottConfigService, navigationService, $filter, popupService, utils, userCollection, dcrCollection, fullDayActivityCollection, halfDayActivityCollection, expenseCollection, expenseDetailsCollection, attachmentCollection, EXPENSE_TYPES) {
        var attachmentCollectionInstance = new attachmentCollection(),
            expenseCollectionInstance = new expenseCollection(),
            expenseDetailsCollectionInstance = new expenseDetailsCollection(),
            dcrCollectionInstance = new dcrCollection(),
            fullDayActivityCollectionInstance = new fullDayActivityCollection(),
            halfDayActivityCollectionInstance = new halfDayActivityCollection();

        $scope.dcrDate = $stateParams.date;

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
        }

        $scope.locale = abbottConfigService.getLocale();
        $scope.expenseStatus = false;
        $scope.expenseDetailStatus = false;
        $scope.expenseId = '';
        $scope.marketList = [];
        $scope.flagHillStation = false;
        var weekDay = [];
        weekDay[0] = "Sunday";
        weekDay[1] = "Monday";
        weekDay[2] = "TuesDay";
        weekDay[3] = "Wednesday";
        weekDay[4] = "Thursday";
        weekDay[5] = "Friday";
        weekDay[6] = "Saturday";
        var months = [];
        var monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
            "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
        ];

        $scope.init = function() {
            window.ga.trackView('ViewExpense');
            window.ga.trackTiming('ViewExpense Page Load Start Time', 20000, 'ViewExpenseStart', 'ViewExpense Load Starts');
            $scope.transperantConfig = abbottConfigService.getTransparency();
            $scope.transperantConfig.display = true;
            $scope.transperantConfig.showBusyIndicator = true;
            $scope.transperantConfig.showTransparancy = true;
            abbottConfigService.setTransparency($scope.transperantConfig);
            $scope.locale = abbottConfigService.getLocale();
            getUserDetail();
            getDCRActivities().then(getDCRData).then(getActivityName).then(getExpenseDataForDay).then(getExpenseDetailDataForDay).finally(function() {
                $scope.transperantConfig.display = false;
                window.ga.trackTiming('ViewExpense Page Load Finish Time', 20000, 'ViewExpenseFinish', 'ViewExpense Load Finishes');
            });
            $scope.expenseDate = $filter('date')($scope.getDate($scope.dcrDate), 'dd.MM.yy');
            var today = new Date($scope.dcrDate);
            $scope.dcrDay = weekDay[today.getDay()];
            $scope.dcrMonth = monthNames[today.getMonth()];
            $scope.dcrYear = today.getFullYear();
        };

        /* format date */
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

        var getUserDetail = function() {
            return new userCollection().getActiveUser().then(function(activeUser) {
                $scope.userDetail = activeUser;
                $scope.userDesignation = activeUser.Designation__c;
                $scope.employeeCode = activeUser.Alias;
            });
        };

        /* fetch DCR activities */
        var getDCRActivities = function() {
            return fullDayActivityCollectionInstance.fetchAll().then(fullDayActivityCollectionInstance.fetchRecursiveFromCursor).then(function(fullDayActivities) {
                return halfDayActivityCollectionInstance.fetchAll().then(halfDayActivityCollectionInstance.fetchRecursiveFromCursor).then(function(halfDayActivities) {
                    fullDayActivities = fullDayActivities.concat(halfDayActivities);
                    fullDayActivities = $filter('filter')(fullDayActivities, function(activity) {
                        return $scope.getDate(activity.Expiration_Date__c) >= $scope.getDate($scope.dcrDate);
                    });
                    $scope.Activities = fullDayActivities;
                    return fullDayActivities;
                });
            });
        };

        /* get DCR data */
        var getDCRData = function() {
            return dcrCollectionInstance.fetchAll().then(dcrCollectionInstance.fetchRecursiveFromCursor).then(function(dcrList) {
                $scope.dcr = $filter('filter')(dcrList, {
                    'Date__c': $scope.dcrDate
                });
                return $scope.dcr;
            });
        };

        var getAttachments = function(expenseDetails) {
            var expenseDetailIds = expenseDetails.map(function(entity) {
                return entity.Id;
            });
            return attachmentCollectionInstance.fetchAllWhereIn('ParentId', expenseDetailIds)
                .then(attachmentCollectionInstance.fetchRecursiveFromCursor)
                .then(function(entities) {
                    $scope.Attachments = entities;
                    return entities;
                });
        };

        /* get Daily expenses */
        var getExpenseDataForDay = function() {
            if ($scope.dcr && $scope.dcr.length) {
                return expenseCollectionInstance.fetchAllWhere({
                    "Expense_Date__c": $scope.dcrDate
                }).then(expenseCollectionInstance.fetchRecursiveFromCursor).then(function(expenseList) {
                    if (expenseList && expenseList.length) {
                        $scope.expenseStatus = true;
                        $scope.expense = expenseList[0];
                        $scope.expenseId = $scope.expense.Id;
                        $scope.expenseData = expenseList[0];
                        $scope.claimedPeriod = $scope.expenseData.Claimed_Period__c;
                        $scope.totalClaimed = $scope.expenseData.Total_Claimed_Expense__c;
                        console.log($scope.expenseData);
                        if ($scope.expenseData.Hill_Station_Allowance__c != null && angular.isDefined($scope.expenseData.Hill_Station_Allowance__c)) {
                            $scope.flagHillStation = true;
                        }
                        $scope.marketList.push({
                            'MarketType': $scope.expenseData.Station__c,
                            'Allowance': $scope.expenseData.Daily_Allowance__c,
                            'HillStationAllowance': $scope.expenseData.Hill_Station_Allowance__c,
                            'ERNCode': $scope.expenseData.Daily_Allowance_ERN_Type__c,
                            'TotalClaimed': $scope.expenseData.Total_Claimed_Expense__c,
                            'FareClaimed': $scope.expenseData.Roll_Claimed_Expense_Fares__c,
                            'MiscClaimed': $scope.expenseData.Roll_Claimed_Expense_Misc__c,
                            'DoctorCount': $scope.expenseData.Doctors_Count__c,
                            'ChemistCount': $scope.expenseData.Chemist_Met__c
                        });
                        if ($scope.expenseData.__locally_deleted__) {
                            popupService.openPopup($scope.locale.markedForDeletion, $scope.locale.OK, '35%', function() {
                                $rootScope.disablingEdit = true;
                                popupService.closePopup();
                            });
                        }
                    }
                    return expenseList;
                });
            }
        };

        /* get Expense Standard Fares and Misc Expenses */
        var getExpenseDetailDataForDay = function(expenseList) {
            if (expenseList && expenseList.length) {
                var expense = expenseList[0];
                return expenseDetailsCollectionInstance.fetchAllWhere({
                    "Expense__c": expense.Id
                }).then(expenseDetailsCollectionInstance.fetchRecursiveFromCursor).then(function(expenseDetailsList) {
                    return getAttachments(expenseDetailsList).then(function() {
                        $scope.expenseDetailsHotelExpenseList = [];
                        if (expenseDetailsList && expenseDetailsList.length) {
                            $scope.expenseDetailStatus = true;
                            expenseDetailsList = expenseDetailsList.map(function(expenseDetail) {
                                expenseDetail.Fare_Claimed__c = expenseDetail.Fare_Claimed__c == null ? '' : expenseDetail.Fare_Claimed__c;
                                return expenseDetail;
                            });
                            $scope.expenseDetailsFareList = $filter('filter')(expenseDetailsList, {
                                'Expense_Type__c': EXPENSE_TYPES.FARES
                            });
                            $scope.expenseDetailsMiscList = $filter('filter')(expenseDetailsList, function(expDetail) {
                                return (expDetail.Expense_Type__c == EXPENSE_TYPES.MISCELLANEOUS && expDetail.Misc_Description__c != EXPENSE_TYPES.HOTEL_EXPENSE && expDetail.Misc_Description__c != EXPENSE_TYPES.MOBILE_EXPENSE);
                            });
                            $scope.expenseDetailsHotelExpenseList = $filter('filter')(expenseDetailsList, function(expDetail) {
                                return (expDetail.Expense_Type__c == EXPENSE_TYPES.MISCELLANEOUS && expDetail.Misc_Description__c == EXPENSE_TYPES.HOTEL_EXPENSE);
                            });
                            $scope.expenseDetailsHotelExpenseList = $scope.expenseDetailsHotelExpenseList.map(function(expense) {
                                var attachment = $filter('filter')($scope.Attachments, {
                                    'ParentId': expense.Id
                                });
                                if (attachment && attachment.length) {
                                    if (attachment[0] && attachment[0].Name) {
                                        expense.Attachment = attachment[0];
                                        var fileName = expense.Attachment.Name;
                                        ext = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
                                        if (ext != 'pdf' || ext != 'PDF')
                                            expense.Attachment.Body = "data:image/" + ext + ";base64," + expense.Attachment.Body;
                                    }
                                }
                                return expense;
                            });

                            $scope.expenseDetailsMobileExpenseList = $filter('filter')(expenseDetailsList, function(expDetail) {
                                return (expDetail.Expense_Type__c == EXPENSE_TYPES.MISCELLANEOUS && expDetail.Misc_Description__c == EXPENSE_TYPES.MOBILE_EXPENSE);
                            });

                            $scope.expenseDetailsMobileExpenseList = $scope.expenseDetailsMobileExpenseList.map(function(expense) {
                                var attachment = $filter('filter')($scope.Attachments, {
                                    'ParentId': expense.Id
                                });
                                if (attachment && attachment.length) {
                                    if (attachment[0] && attachment[0].Name) {
                                        expense.Attachment = attachment[0];
                                        var fileName = expense.Attachment.Name;
                                        ext = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
                                        if (ext != 'pdf' || ext != 'PDF')
                                            expense.Attachment.Body = "data:image/" + ext + ";base64," + expense.Attachment.Body;
                                    }
                                }
                                return expense;
                            });
                            if ($scope.expenseDetailsMiscList && $scope.expenseDetailsMiscList.length) {
                                $scope.miscFiledFlag = true;
                            }
                            if ($scope.expenseDetailsHotelExpenseList && $scope.expenseDetailsHotelExpenseList.length) {
                                $scope.hotelExpenseFlag = true;
                            }
                            if ($scope.expenseDetailsMobileExpenseList && $scope.expenseDetailsMobileExpenseList.length) {
                                $scope.mobileExpenseFlag = true;
                            }
                            $scope.expenseDetailsList = expenseDetailsList;
                            console.log($scope.expenseDetailsList);
                        }
                        return expenseDetailsList;
                    });
                });
            } else {
                return [];
            }
        };

        var getActivityName = function() {
            var dcrActivity2 = null;
            $scope.dcrData = $filter('filter')($scope.dcr, {
                'Date__c': $scope.dcrDate
            });
            var dcrActivity1 = $filter('filter')($scope.Activities, {
                'Id': $scope.dcr[0].Activity1__c
            });
            if ($scope.dcr[0].Activity2__c != null) {
                dcrActivity2 = $filter('filter')($scope.Activities, {
                    'Id': $scope.dcr[0].Activity2__c
                });
            };
            if (dcrActivity1 && dcrActivity1.length) {
                $scope.activityName = dcrActivity1[0].Name;
                if (dcrActivity2 && dcrActivity2.length) {
                    $scope.activityName = dcrActivity1[0].Name + ' , ' + dcrActivity2[0].Name;
                }
            };
        };

        $scope.goToDCR = function() {
            navigationService.navigate('dcrCalendar');
        };

        // Remove Expense for day
        $scope.removeExpense = function() {
            if ($scope.expense.isMobileExpense__c == 'undefined' || !$scope.expense.isMobileExpense__c) {
                popupService.openPopup($scope.locale.ExpenseCannotBeRemoved, $scope.locale.OK, '35%', function() {
                    $rootScope.disablingEdit = true;
                    popupService.closePopup();
                });
            } else {
                popupService.openConfirm($scope.locale.remove, $scope.locale.removeExpenseForDay, $scope.locale.No, $scope.locale.Yes, '35%', function() {}, function() {
                    expenseCollectionInstance.removeExpense([$scope.dcrDate]);
                    popupService.closePopup();
                    navigationService.navigate('dcrCalendar');
                });
            }
        };

    }
]);