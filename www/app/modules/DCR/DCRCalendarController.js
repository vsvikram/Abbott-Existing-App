/**
 * DCR Calendar Controller file
 */
abbottApp.controller('DCRCalendarController', ['$scope', '$rootScope', '$filter', 'abbottConfigService', 'navigationService', 'utils', 'statusDCRActivty', 'popupService', 'activitySelectionCollection', 'mtpCollection', 'mtpAppointmentDetails1Collection', 'dcrCollection', 'greenFlagCollection', 'fullDayActivityCollection', 'halfDayActivityCollection', 'dcrJunctionCollection', 'leaveRequestHolidayUserCollection', 'leaveRequestPendingUserCollection', 'leaveRequestApprovedUserCollection', 'userCollection', 'divisionCollection', 'assigmentDetailCollection', 'expenseCollection', '$q', 'entityCollection', 'sfdcAccount', 'targetCollection','dcrSchedulerSummaryCollection',
    function($scope, $rootScope, $filter, abbottConfigService, navigationService, utils, statusDCRActivty, popupService, ActivitySelectionCollection, MtpCollection, MtpAppointmentDetails1Collection, DcrCollection, GreenFlagCollection, FullDayActivityCollection, HalfDayActivityCollection, DcrJunctionCollection, LeaveRequestHolidayUserCollection, LeaveRequestPendingUserCollection, LeaveRequestApprovedUserCollection, UserCollection, DivisionCollection, assigmentDetailCollection, expenseCollection, $q, entityCollection, sfdcAccount, targetCollection,dcrSchedulerSummaryCollection) {
        var date = new Date(),
            d = date.getDate(),
            dcrData = [],
            greenArray = [],
            activitySelectionData = [],
            weeklyOffDayIndex = 0,
            approvedLeavesData = [],
            appointmentDetails = null,
            currentUser = {},
            currentTarget = {}
        fullDayActivityCollection = new FullDayActivityCollection(),
            halfDayActivityCollection = new HalfDayActivityCollection(),
            greenFlagCollection = new GreenFlagCollection(),
            dcrJunctionCollection = new DcrJunctionCollection(),
            dcrCollection = new DcrCollection(),
            activitySelectionCollection = new ActivitySelectionCollection(),
            leaveRequestHolidayUserCollection = new LeaveRequestHolidayUserCollection(),
            leaveRequestPendingUserCollection = new LeaveRequestPendingUserCollection(),
            leaveRequestApprovedUserCollection = new LeaveRequestApprovedUserCollection(),
            mtpAppointmentDetails1Collection = new MtpAppointmentDetails1Collection(),
            assigmentDetailCollection = new assigmentDetailCollection(),
            userCollection = new UserCollection(),

            targetCollectionInstance = new targetCollection(),
            divisionCollection = new DivisionCollection(),
            mtpCollection = new MtpCollection();
        expenseCollection = new expenseCollection(), $scope.minRedDate = null;
        dcrSchedulerSummaryCollectionInstance =new dcrSchedulerSummaryCollection();
        ec = new entityCollection();
        //ec.store().showInspector();
        /* Array to Store Expense Info */
        $scope.expenseDetail = [];

        //Init function
        $scope.init = function() {
            //console.log($scope.windowWidth)

            window.ga.trackView('DCRCalender');
            window.ga.trackTiming('DCRCalender Load Start Time', 20000, 'DCRCalenderLoadStart', 'DCRCalender load Start');
            //Loading indicator code
            $scope.transperantConfig = abbottConfigService.getTransparency();
            $scope.transperantConfig.display = true;
            $scope.transperantConfig.showBusyIndicator = true;
            $scope.transperantConfig.showTransparancy = true;
            abbottConfigService.setTransparency($scope.transperantConfig);
            $scope.locale = abbottConfigService.getLocale();



            $scope.navigateToDCRListing = function() {

            };

            function retryFailed(currentMonth) {
                //console.log('retry')
                //console.log(currentMonth);
                dcrCollection.getCurrentCalls2($scope.currentMonth).then(function(records) {
                    //console.log(records)
                    var record = records[0];
                    $scope.callsPlanned = record.calldaysCount;
                    $scope.callsDone = record.DoctorCallCount
                })
            }

            $scope.monthChanged = function(view) {

                //console.log(view)
                var currentdate;
                currentdate = $scope.currentdate;
                if (typeof(currentdate) !== 'undefined') {


 
                        dcrSchedulerSummaryCollectionInstance.getData($scope.currentMonth, $scope.currentYear).then(function(records) {
                            console.log(records)
                              
                                for(var z=0;z< records.length;z++)
                                {

                                    switch(records[z].Query_Index)
                                    {
                                        case 1: $scope.callsPlanned =  records[z].Field_2;
                                $scope.callsDone =  records[z].Field_3;

                                break;
                                  case 2: $scope.doctorsDone =  records[z].Field_1;
 

                                break;
                                  case 3: $scope.doctorsPlanned =  records[z].Field_1;
 

                                break;
                                 case 4: $scope.callDays =  records[z].Field_1;
 

                                break;

                                 case 5: $scope.totalCallDays =  records[z].Field_1;
 

                                break;


                                    }
                                }
                              
                            });



 
                }

            };

            function aaa() {
                // console.log('--done')
            }

            $scope.navigateToFileDCR = function() {

                $scope.dayClick();

            };

            $scope.navigateToHome = function() {

                navigationService.navigate('home');

            };


            $scope.locale = abbottConfigService.getLocale();
            $scope.locale.Schedule = 'Schedule';

            $scope.currentYear = $filter('date')($scope.date, 'yyyy');


            var date = new Date();


            var months = [],
                monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];

            var monthNext = [],
                tempMonthObj;
            for (var i = 3; i > 0; i--) {

                tempMonthObj = { index: date.getMonth(), text: monthNames[date.getMonth()] };

                monthNext.push(tempMonthObj)
                //   console.log(monthNames[date.getMonth()] + ' ' + date.getFullYear());
                // Subtract a month each time
                date.setMonth(date.getMonth() + 1);

            }
            date.setMonth(date.getMonth() - 5);

            var monthPrev = []
            for (var i = 0; i < 2; i++) {
                // console.log(monthNames[date.getMonth()] + ' ' + date.getFullYear());
                tempMonthObj = { index: date.getMonth(), text: monthNames[date.getMonth()] };
                monthPrev.push(tempMonthObj)

                // Subtract a month each time
                date.setMonth(date.getMonth() + 1);
            }

            //console.log(monthPrev.concat(monthNext))

            $scope.months = monthPrev.concat(monthNext);



            $rootScope.disablingEdit = false;
            $rootScope.activitySaved = false;
            $scope.events = [];
            //function to calculate window height
            $scope.get_calendar_height = function() {
                return $(window).height();
            };

            $scope.CalendarCountData = {
                dateCount: [],
                dcrIdCount: {}
            };

            $scope.loadUserData()
                .then($scope.getAssignmentDetails)
                .then($scope.getDivisionDetails)
                //.then($scope.initevents)
                .then($scope.getActivitySelectionData)
                .then($scope.getMTPData)
                .then($scope.getMTPAppointments)
                .then($scope.getDCRData)
                .then($scope.getGreenColorFlagDetails)
                .then($scope.getDCRJunctionData)
                .then($scope.getOrangeColorFlagDetails)
                .then($scope.getPinkColorFlagDetails)
                .then($scope.getPurpleColorFlagDetails)
                .then($scope.getExpenseDetails)
                .then($scope.initCalendar)
                .then(function() {
                    $scope.initCalendar();
                    $scope.getLastDCRFiledDate();
                    $('#calendar').fullCalendar('removeEvents');
                    $('#calendar').fullCalendar('addEventSource', $scope.events);
                    //$('#calendar').fullCalendar('changeView', 'basicDay');
                    // $('#calendar').fullCalendar('changeView', 'month');
                })
                .finally(function() {
                    $scope.transperantConfig.display = false;
                });

            //$scope.initCalendar();
            //$scope.loadUserData().then(getDCRMasterDetails).then(getDCRColorDetails).then($scope.initCalendar).then(function () {
            //    $scope.getLastDCRFiledDate();
            //    $('#calendar').fullCalendar('removeEvents');
            //    $('#calendar').fullCalendar('addEventSource', $scope.events);
            //    $('#calendar').fullCalendar('changeView', 'basicDay');
            //    $('#calendar').fullCalendar('changeView', 'month');
            //}).finally(function () {
            //    $scope.transperantConfig.display = false;
            //});
        };

        var getDCRMasterDetails = function() {
            return $q.all([$scope.getAssignmentDetails(), $scope.getDivisionDetails(), $scope.getMTPData(), $scope.getDCRData()]);
        };

        var getDCRColorDetails = function() {
            return $q.all([$scope.getActivitySelectionData(), $scope.getMTPAppointments(), $scope.getGreenColorFlagDetails(), $scope.getDCRJunctionData(), $scope.getOrangeColorFlagDetails(), $scope.getPinkColorFlagDetails(), $scope.getPurpleColorFlagDetails(), $scope.getExpenseDetails()]);
        };

        $scope.getAssignmentDetails = function() {
            return assigmentDetailCollection.fetchUserAssignmentDetails().then(function(assigments) {
                appointmentDetails = assigments;
                return assigments;
            });
        };

        /*  Fetching Expense Details from Expense__c  */

        $scope.getExpenseDetails = function() {
            return expenseCollection.fetchAll().then(expenseCollection.fetchRecursiveFromCursor).then(function(expenseInfo) {
                $scope.expenseDetail = expenseInfo;
                return expenseInfo;
            });
            $scope.expenseDetail = expenseInfo;
        }

        $scope.getDivisionDetails = function() {
            return divisionCollection.fetchAll().then(divisionCollection.getEntityFromResponse).then(function(divisionInfo) {
                var weeklyOffDay = '',
                    nonWeeklyOffDay = [];
                greenArray = [];
                if (divisionInfo) {
                    weeklyOffDay = divisionInfo.Weekly_Off__c;
                    weeklyOffDayIndex = utils.dayOfWeekAsString(weeklyOffDay);
                }

                for (var i = 0; i <= 7; i++) {
                    if (i != weeklyOffDayIndex) {
                        nonWeeklyOffDay.push(i);
                    }
                }

                $scope.events = [{
                    dow: [weeklyOffDayIndex], //weekly off day
                    eventType: 'yellowEvent'
                }, {
                    dow: nonWeeklyOffDay, //Non weekly off days
                    eventType: 'redEvent'
                }];
                return $scope.events;
            });
        };

        $scope.initEvents = function(divisionInfo) {
            var weeklyOffDay = '',
                nonWeeklyOffDay = [];
            greenArray = [];
            if (divisionInfo) {
                weeklyOffDay = divisionInfo.Weekly_Off__c;
                weeklyOffDayIndex = utils.dayOfWeekAsString(weeklyOffDay);
            }

            for (var i = 0; i <= 7; i++) {
                if (i != weeklyOffDayIndex) {
                    nonWeeklyOffDay.push(i);
                }
            }

            $scope.events = [{
                dow: [weeklyOffDayIndex], //weekly off day
                eventType: 'yellowEvent'
            }, {
                dow: nonWeeklyOffDay, //Non weekly off days
                eventType: 'redEvent'
            }];
        };

        $scope.initCalendar = function() {
            //Initialize calendar and put your options and callbacks here

            $scope.gotoMonth = function(month) {

                var tempDate = new Date();
                tempDate.setMonth(month);
                $('#calendar').fullCalendar('gotoDate', tempDate);


            }


            $scope.prev = function() {

                var date1 = $('#calendar').fullCalendar('prev')
            }

            $scope.next = function() {

                var date1 = $('#calendar').fullCalendar('next')
            }




            //            function getMonth() {
            //                var date = $("#calendar").fullCalendar('getDate');
            //
            //
            //                $scope.currentdate = date;
            //                //console.log($scope.currentdate);
            //                if (typeof($scope.currentdate) !== 'undefined') {
            //                    sfdcAccount.refreshSession($scope.monthChanged);
            //                }
            //
            //
            //                //you now have the visible month as an integer from 0-11
            //            }
            //            $scope.dayClick1 = function() {
            //                var date;
            //               // console.log($scope.selectedDateStr);
            //               // console.log($("#calendar").fullCalendar('getDate'));
            //                if (typeof($scope.selectedDateStr) === 'undefined') {
            //                    var date = $("#calendar").fullCalendar('getDate');
            //                } else {
            //                    var date = $scope.selectedDateStr;
            //                }
            //            }

            $scope.dayClick = function() {
                var date;
                //console.log($("#calendar").fullCalendar('getDate'));
                if (typeof($scope.selectedDateStr) === 'undefined') {
                    date = $("#calendar").fullCalendar('getDate');
                    date = (new Date(date._d)).toISOString();
                } else {
                    var date = $scope.selectedDateStr;
                }

                var selectedDateStr = date;
                //console.log(selectedDateStr)
                var temp = selectedDateStr.split('T');
                var tempArr = temp[0].split('-');
                var selectedDate = new Date(tempArr[0], tempArr[1] - 1, tempArr[2]);
                var filteredEventsArray = [],
                    ClickedDate = $filter('date')(selectedDate, 'yyyy-MM-dd'),
                    lastGreenDate = $filter('date')($scope.lastGreenDate, 'yyyy-MM-dd'),
                    minRedDate = $scope.getFormatedDateFromDash($scope.minRedDate),
                    today = new Date();

                if (selectedDate > today) {
                    popupService.openPopup($scope.locale.DCRDateGreaterThanTodayAlert, $scope.locale.OK, '35%');
                    return;
                }

                $rootScope.tabTitle = null;
                var purpleDays = [],
                    greenDays = [],
                    blueDays = [],
                    pinkDays = [];
                for (var i = 0; i < $scope.events.length; i++) {
                    var events = $scope.events[i],
                        startDate = $filter('date')(events.start, 'yyyy-MM-dd');
                    if (events.start != null && startDate === ClickedDate) {
                        switch (events.eventType) {
                            case "purpleEvent":
                                purpleDays.push(events);
                                break;
                            case "greenEvent":
                                greenDays.push(events);
                                break;
                            case "blueEvent":
                                blueDays.push(events);
                                break;
                            case "pinkEvent":
                                pinkDays.push(events);
                                break;
                        }
                    }
                }

                if (weeklyOffDayIndex == "" + selectedDate.getDay()) {
                    for (var i = approvedLeavesData.length - 1; i >= 0; i--) {
                        var tempStartDate = approvedLeavesData[i].From_Date__c.split('-');
                        var tempEndDate = (approvedLeavesData[i].To_Date__c) ? approvedLeavesData[i].To_Date__c.split('-') : approvedLeavesData[i].From_Date__c.split('-');
                        var startDate = new Date(tempStartDate[0], tempStartDate[1] - 1, tempStartDate[2]),
                            endDate = new Date(tempEndDate[0], tempEndDate[1] - 1, tempEndDate[2]);

                        if (startDate <= selectedDate && endDate >= selectedDate) {
                            popupService.openPopup($scope.locale.PurpleDaySelectionAlert, $scope.locale.OK, '55%');
                            return;
                        }
                    }
                }

                if (purpleDays.length > 0) {
                    popupService.openPopup($scope.locale.PurpleDaySelectionAlert, $scope.locale.OK, '55%');
                    return;
                } else if (pinkDays.length > 0) {
                    popupService.openPopup($scope.locale.PinkDaySelectionAlert, $scope.locale.OK, '55%');
                    return;
                } else if (greenDays.length > 0 || blueDays.length > 0) {
                    $rootScope.disablingEdit = true;
                }

                //to check whether mtp generated or not from stp for this month
                var clickedDayMonth = new Date(selectedDate).getMonth(),
                    clickedDayYear = new Date(selectedDate).getFullYear(),
                    currentDayMonth = new Date().getMonth(),
                    currentDayYear = new Date().getFullYear(),
                    mtpDate = '',
                    mtpCountsForCurrentMonth = 0,
                    mtpDateMonth = '',
                    mtpDateYear = '',
                    twoMonthsBackMonth = new Date();
                twoMonthsBackMonth.setDate(1);
                //NEWFIX
                twoMonthsBackMonth.setMonth(twoMonthsBackMonth.getMonth() - 2);

                if (twoMonthsBackMonth.getMonth() == clickedDayMonth) {
                    popupService.openPopup($scope.locale.TwoMonthOldDCRFileAlert, $scope.locale.OK, '55%');
                    return;
                }

                if ($scope.filterData(greenArray, ClickedDate).length == 0) {
                    var pinkDayRecords = $filter('filter')($scope.events, {
                            "eventType": "pinkEvent"
                        }),
                        isShowAlert = false;
                    if (pinkDayRecords.length > 0) {
                        // reverse list based on date and then loop for condition and save pinkdate
                        pinkDayRecords = $filter('orderBy')(pinkDayRecords, 'start', true);
                        var pinkDate = pinkDayRecords[0].start;

                        angular.forEach(pinkDayRecords, function(value, index) {
                            if (value.start < selectedDate) {
                                isShowAlert = true;
                                pinkDate = value.start;
                            }
                        });
                        if (isShowAlert) {
                            var formattedDate = $filter('date')(pinkDate, 'dd/MM/yyyy');
                            message = $scope.locale.DCRFilingRestrictedDueToAppliedLeaveAlert.replace('$DAY$', formattedDate);
                            popupService.openPopup(message, $scope.locale.OK, '55%');
                            return;
                        }
                    }

                    if ($scope.getFormatedDateFromDash(ClickedDate) < $scope.getFormatedDateFromSlash(lastGreenDate)) {
                        popupService.openPopup($scope.locale.NoDCRFiledOn + $filter('date')($scope.getFormatedDateFromDash(ClickedDate), 'd/M/yyyy'), $scope.locale.OK, '35%');
                        return;

                    } else if ($scope.getFormatedDateFromDash(ClickedDate) < $scope.getFormatedDateFromSlash(lastGreenDate) || $scope.getFormatedDateFromDash(ClickedDate) > minRedDate) {
                        popupService.openPopup($scope.locale.DCRSequentially + lastGreenDate.split(' ')[0], $scope.locale.OK, '35%');
                        return;
                    }
                }

                //Check if Approved MTP available for the selected month and year
                if ((currentUser.MTP_Grace_End_Date__c != null && currentUser.MTP_Grace_End_Date__c < ClickedDate || currentUser.MTP_Grace_End_Date__c == null) && $scope.filterData(greenArray, ClickedDate).length == 0 && weeklyOffDayIndex != "" + selectedDate.getDay()) {
                    angular.forEach($scope.mtpData, function(value, index) {
                        var tempDate = value.MTP_Cycle__r.Date__c.split('-');
                        mtpDate = new Date(tempDate[0], tempDate[1] - 1, tempDate[2]);
                        mtpDateMonth = mtpDate.getMonth();
                        mtpDateYear = mtpDate.getFullYear();
                        if ((clickedDayMonth == mtpDateMonth) && (clickedDayYear == mtpDateYear)) {
                            mtpCountsForCurrentMonth++;
                        }
                    });
                    if (mtpCountsForCurrentMonth == 0) {
                        popupService.openPopup($scope.locale.MTPNotApprovedBySupervisor, $scope.locale.OK, '55%');
                        return;
                    }
                }

                $scope.listOfRedDates = [];
                for (var i = 0; i < $scope.events.length; i++) {
                    if ($scope.events.eventType == 'redEvent') {
                        listOfRedDates.push($scope.events.start);
                    }
                }

                for (var i = 0; i < $scope.listOfRedDates.length; i++) {
                    if ($rootScope.lastFilledDCR < $scope.listOfRedDates[i]) {
                        $scope.dateToBeFilled = $rootScope.listOfRedDates[i];
                        break;
                    }
                }

                var dateObj = new Date(selectedDate),
                    dateText = $filter('date')(dateObj, 'yyyy-MM-dd'),
                    records = $filter('filter')(($rootScope.disablingEdit == true) ? dcrData : activitySelectionData, {
                        "Date__c": dateText
                    });

                if (records.length > 0) {
                   /* if (records[0].Activity2__c != undefined) {
                        $scope.navigateToLanding(false, dateText, records[0], selectedDate);

                    } else {
                        $scope.navigateToLanding(true, dateText, records[0], selectedDate);
                    } */
                    //Navigate to activity selection even if it activity is selected
                     navigationService.navigate('dcrActivitySelection', {
                            'dateDCR': selectedDate
                     }, true);
                } else {
                    if ($rootScope.disablingEdit) { //To be changed user should navigate to DCR Landing screen. But in this release we dont have records to be shown in the DCR landing screen hence returning from here
                        popupService.openPopup($scope.locale.DCRDataNotAvailable, $scope.locale.OK, '35%');
                    } else {
                        navigationService.navigate('dcrActivitySelection', {
                            'dateDCR': selectedDate
                        }, true);
                    }
                }
            }

            $('#calendar').fullCalendar({
                header: false,
                height: $scope.get_calendar_height(),
                events: $scope.events,

                fixedWeekCount: false,
                /*Event triggered on click of date*/
                dayClick: function(date, allDay, jsEvent, view) {
                    var selectedDateStr = (new Date(date._d)).toISOString();
                    $scope.selectedDateStr = selectedDateStr;
                    $(".fc-today").removeClass("fc-today");
                    $(".fc-state-highlight").removeClass("fc-state-highlight");
                    $(jsEvent.target).addClass("fc-state-highlight");
                    $(this).addClass("fc-today");
                    var dateSel = $(this).data('date')
                    $(".fc-content-skeleton [data-date='" + dateSel + "']").addClass("fc-today");

                },

                /*Event triggered while rendering of color triangles*/
                eventRender: function(event, element, view) {

                    var eventDate = event.start;
                    var calendarDate = $('#calendar').fullCalendar('getDate');
                    if (eventDate.get('month') !== calendarDate.get('month')) {
                        return false;
                    }


                    $(element).find('span:first').prepend('<div class="' + event.eventType + '" />');
                    // long press event on day box.
                    var date = $filter('date')(new Date(event._start._d), 'yyyy-MM-dd');
                    var dateElements = $("[data-date='" + date + "']");
                    angular.forEach(dateElements, function(ele) {
                        $(ele).hammer({}).on('press', function(ev) {
                            navigateToExpense(date);
                        });
                    });

                },

                /*Event triggered on rendering day numbers*/
                dayRender: function(date, cell) {
                    var count = $scope.events[date.format('YYYY-MM-DD')],
                        offsetHeight = $('.fc-head')[0].offsetHeight + 6,
                        purpleEvent = $filter('filter')($scope.events, {
                            "purpleDate": date.format('YYYY-MM-DD')
                        });

                    $('.fc-day-number').height(($scope.get_calendar_height() - offsetHeight) / 6);
                    if (count && purpleEvent.length == 0)
                        cell.prepend('<span class="event-count">' + count + '</span>');
                    var expenseFiled = $filter('filter')($scope.expenseDetail, {
                        'Expense_Date__c': date.format('YYYY-MM-DD')
                    });
                    if (expenseFiled && expenseFiled.length)
                    cell.prepend('<span class="expenseFiled">E</span>');


                },

                viewRender: function(view, element) {
              //Show current and previous months calendar
                    var currentDate = new Date(),
                        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
                        filterEndDate = $filter('date')(endDate, 'yyyy-MM'),
                        startDate = new Date(currentDate.getFullYear(), (currentDate.getMonth() - 1), 1),
                        filterStartDate = $filter('date')(startDate, 'yyyy-MM'),
                        selectedDate = $('#calendar').fullCalendar('getDate')._d,
                        filterSelectedDate = $filter('date')(selectedDate, 'yyyy-MM');

                    if (filterEndDate == filterSelectedDate) {
                        $('.fc-next-button').addClass("fc-state-disabled");
                        $('.fc-prev-button').removeClass("fc-state-disabled");
                        $scope.prevButton = true;
                        $scope.nextButton = false;
                    } else if (filterStartDate == filterSelectedDate) {
                        $('.fc-next-button').removeClass("fc-state-disabled");
                        $('.fc-prev-button').addClass("fc-state-disabled");
                        $scope.prevButton = false;
                        $scope.nextButton = true;
                    } else {
                        $scope.prevButton = true;
                        $scope.nextButton = true;
                        $('.fc-next-button').removeClass("fc-state-disabled");
                        $('.fc-prev-button').removeClass("fc-state-disabled");
                    }

                    $scope.currentdate = view.intervalStart;



                    if (typeof($scope.currentdate) !== 'undefined') {

                        $scope.currentMonth = new Date($scope.currentdate).getMonth();
                        $scope.currentYear = new Date($scope.currentdate).getFullYear();
                        $scope.calenderTitle = new Date($scope.currentdate)

                    }
                    $scope.monthChanged();
                }
            });

            //Dynamically added back button and "Create DCR" on top header
            //        if ($('.fc-toolbar .fc-left').children('button').length == 0) {
            //            $('.fc-toolbar .fc-left').prepend($('<button type="button" class="fc-back-button-dcr fc-back-cls"><div class="calendarBackText fontRobotoLight">' + $scope.locale.Home + '</div></button>').on('click', function () {
            //                //Call MTP List View screen here when press back from Calendar screen
            //                navigationService.backFunc();
            //            }));
            //            $('.fc-toolbar .fc-right').prepend($('<div class="calendarBackText fontRobotoLight">' + $scope.locale.MyDCR + '</div>'));
            //        }
        };

        var navigateToExpense = function(date) {
            var dcr = $filter('filter')(dcrData, { 'Date__c': date, 'Status__c': 'Submitted' });
            var expenseData = $filter('filter')($scope.expenseDetail, { 'Expense_Date__c': date });
            if (dcr && dcr.length && !expenseData.length){
                navigationService.navigate('Expense', {
                    'date': date
                });
            }
            else if(dcr && dcr.length && expenseData.length){
                navigationService.navigate('ViewExpense', {
                    'date': date
                });
            }
        };

        $scope.loadUserData = function() {
            return userCollection.getActiveUser().then(function(activeUser) {
                currentUser = activeUser;
            }).then(targetCollectionInstance.fetchTarget).then(function(target) {
                currentTarget = target;
                $scope.currentTarget = target;
            })
        };

        $scope.getActivitySelectionData = function() {
            return activitySelectionCollection.fetchAll().then(activitySelectionCollection.fetchRecursiveFromCursor).then(function(activityList) {
                activitySelectionData = activityList;
                return activityList;
            });
        };

        $scope.fetchFullDayActivities = function() {
            return fullDayActivityCollection.fetchAll().then(fullDayActivityCollection.fetchRecursiveFromCursor);
        };

        $scope.fetchHalfDayActivities = function() {
            return halfDayActivityCollection.fetchAll().then(halfDayActivityCollection.fetchRecursiveFromCursor);
        };






        $scope.getGreenColorFlagDetails = function() {

            return greenFlagCollection.fetchAll().then(greenFlagCollection.fetchRecursiveFromCursor).then(function(greenFlagList) {
                var date = null,
                    day = 0,
                    month = 0,
                    year = 0,
                    dcrLast = "",
                    formattedDate = [],
                    fieldworkRecord = [];

                return $scope.fetchFullDayActivities().then(function(fullDayList) {
                    if (fullDayList.length > 0) {
                        fieldworkRecord = $filter('filter')(fullDayList, {
                            'Name': "Field Work"
                        });
                    }
                    dcrLast = greenFlagList[greenFlagList.length - 1].Date__c;

                    if (dcrLast == undefined || dcrLast == '') {
                        $rootScope.lastFilledDCRNotFound = true;
                    } else {
                        $rootScope.lastFilledDCRNotFound = false;
                        $rootScope.lastFilledDCR = $filter('date')(dcrLast, 'd/M/yyyy');
                        $scope.lastGreenDate = $rootScope.lastFilledDCR;
                    }

                    greenFlagList.forEach(function(value) {
                        var tempDate = value.Date__c.split('-'),
                            date = new Date(tempDate[0], tempDate[1] - 1, tempDate[2]),
                            day = date.getDate(),
                            month = date.getMonth(),
                            year = date.getFullYear(),
                            formattedDate = $filter('date')(new Date(date), 'yyyy-MM-dd');

                        var dcrRecords = $filter('filter')(dcrData, {
                                "Date__c": formattedDate
                            }),
                            color = 'green';
                        if (dcrRecords.length > 0 && fieldworkRecord.length > 0) {
                            if (dcrRecords[0].Activity1__c == fieldworkRecord[0].Id || (dcrRecords[0].Activity2__c != undefined && dcrRecords[0].Activity2__c == fieldworkRecord[0].Id)) {
                                color = 'green';
                            } else {
                                color = 'blue';
                            }
                        }

                        $scope.events.push({
                            start: new Date(year, month, day),
                            eventType: color + "Event",
                            fomattedDate: formattedDate
                        });
                    });
                    return greenFlagList;
                });
            });
        };

        $scope.getPinkColorFlagDetails = function() {
            return leaveRequestPendingUserCollection.fetchAll().then(leaveRequestPendingUserCollection.fetchRecursiveFromCursor).then(function(leaveUserList) {
                leaveUserList.forEach(function(leaveUser) {
                    var tempStartDate = leaveUser.From_Date__c.split('-');
                    var tempEndDate = (leaveUser.To_Date__c) ? leaveUser.To_Date__c.split('-') : leaveUser.From_Date__c.split('-');
                    var startDate = new Date(tempStartDate[0], tempStartDate[1] - 1, tempStartDate[2]),
                        endDate = new Date(tempEndDate[0], tempEndDate[1] - 1, tempEndDate[2]);
                    for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                        $scope.events.push({
                            start: new Date(d),
                            eventType: "pinkEvent"
                        });
                    }
                });
                return leaveUserList
            });
        };

        $scope.getOrangeColorFlagDetails = function() {
            return leaveRequestHolidayUserCollection.fetchAll().then(leaveRequestHolidayUserCollection.fetchRecursiveFromCursor).then(function(holidayUsersList) {
                var date = null,
                    day = 0,
                    month = 0,
                    year = 0,
                    formattedDate = [],
                    greenFlagDates = [],
                    orangeDate = null;
                holidayUsersList.forEach(function(holidayUser) {
                    var tempStartDate = holidayUser.Date__c.split('-');
                    date = new Date(tempStartDate[0], tempStartDate[1] - 1, tempStartDate[2]);
                    day = date.getDate();
                    month = date.getMonth();
                    year = date.getFullYear();
                    orangeDate = new Date(year, month, day);
                    formattedDate = $filter('date')(orangeDate, 'yyyy-MM-dd');
                    greenFlagDates = $filter('filter')($scope.events, {
                        "fomattedDate": formattedDate
                    });
                    if (greenFlagDates.length == 0) {
                        $scope.events.push({
                            start: new Date(year, month, day),
                            eventType: "orangeEvent"
                        });
                    }
                });
                return holidayUsersList;
            });
        };

        $scope.getPurpleColorFlagDetails = function() {
            return leaveRequestApprovedUserCollection.fetchAll().then(leaveRequestApprovedUserCollection.fetchRecursiveFromCursor).then(function(approvedUserList) {
                approvedLeavesData = approvedUserList;
                approvedUserList.forEach(function(approvedUser) {
                    var tempStartDate = approvedUser.From_Date__c.split('-');
                    var tempEndDate = (approvedUser.To_Date__c) ? approvedUser.To_Date__c.split('-') : approvedUser.From_Date__c.split('-');
                    var startDate = new Date(tempStartDate[0], tempStartDate[1] - 1, tempStartDate[2]),
                        endDate = new Date(tempEndDate[0], tempEndDate[1] - 1, tempEndDate[2]),
                        date = null;
                    for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                        date = new Date(d);
                        if (weeklyOffDayIndex != "" + date.getDay()) {
                            var formattedDate = $filter('date')(new Date(date), 'yyyy-MM-dd');
                            $scope.events.push({
                                start: date,
                                purpleDate: formattedDate,
                                eventType: "purpleEvent"
                            });
                        }
                    }
                });
                return approvedUserList;
            });
        };

        $scope.getMTPData = function() {
            return mtpCollection.fetchAll().then(mtpCollection.fetchRecursiveFromCursor).then(function(mtpList) {
                mtpList = mtpList.map(function(mtp) {
                    return mtp.Date__c
                });
                $scope.CalendarCountData.dateCount = mtpList;
                return mtpList;
            });
        };

        $scope.getMTPAppointments = function() {
            return mtpAppointmentDetails1Collection.fetchAll().then(mtpAppointmentDetails1Collection.fetchRecursiveFromCursor).then(function(mtpAppDetailsList) {
                $scope.mtpData = mtpAppDetailsList;
                if (mtpAppDetailsList.length) {

                    for (var i = mtpAppDetailsList.length - 1; i >= 0; i--) {
                        var docAssigns = $filter('filter')(appointmentDetails, {
                            'Id': mtpAppDetailsList[i].Assignment__c
                        });
                        if (docAssigns && docAssigns.length) {
                            var deActivationDate = null;
                            if (docAssigns[0].Deactivation_Date__c != null) {
                                deActivationDate = new Date(docAssigns[0].Deactivation_Date__c);
                            }
                            DCRDate = new Date(mtpAppDetailsList[i].MTP_Cycle__r.Date__c);
                            //filtering deactivated doctors
                            if (deActivationDate != null && deActivationDate <= DCRDate) {
                                mtpAppDetailsList.splice(i, 1);
                            }
                        }
                    }
                    $scope.CalendarCountData.dateCount.forEach(function(date) {
                        var appointmentsCountFilter = $filter('getDataBasedOnDateFilter')(mtpAppDetailsList, date, 'MTP_Cycle__r.Date__c');
                        if (!$scope.events[date])
                            $scope.events[date] = appointmentsCountFilter.length;
                    });
                }
                return mtpAppDetailsList;
            });
        };

        $scope.getDCRData = function() {
            return dcrCollection.fetchAll().then(dcrCollection.fetchRecursiveFromCursor).then(function(dcrList) {

                //console.log(JSON.stringify(dcrList));

                dcrData = dcrList;
                return dcrList;
            });
        };

        $scope.getDCRJunctionData = function() {
            angular.forEach(dcrData, function(value, key) {
                var tempStartDate = value.Date__c.split('-');
                date = new Date(tempStartDate[0], tempStartDate[1] - 1, tempStartDate[2]);
                var formattedDate = $filter('date')(date, 'yyyy-MM-dd'),
                    greenFlagDates = $filter('filter')($scope.events, {
                        "fomattedDate": formattedDate
                    });
                if (greenFlagDates.length > 0)
                    $scope.CalendarCountData.dcrIdCount[formattedDate] = value.Id;
            });

            return dcrJunctionCollection.fetchAll().then(dcrJunctionCollection.fetchRecursiveFromCursor).then(function(dcrJunctionList) {
                if (dcrJunctionList.length) {
                    for (var key in $scope.CalendarCountData.dcrIdCount) {
                        var DCRCountFilter = $filter('filter')(dcrJunctionList, {
                            "DCR__c": $scope.CalendarCountData.dcrIdCount[key]
                        }, true);
                        DCRCountFilter = $filter('filterEmpty')(DCRCountFilter, 'DCR_Brand_Activity__c');
                        DCRCountFilter = $filter('filterNonEmpty')(DCRCountFilter, 'Account__c');
                        $scope.events[key] = DCRCountFilter.length;
                    }
                }
                return dcrJunctionList;
            });
        };

        $scope.navigateToLanding = function(isFullDay, date, dcrObj, dateObj) {
            var activity1Record = [],
                activity2Record = [];

            if (isFullDay) {
                $scope.fetchFullDayActivities().then(function(fulldayList) {
                    $scope.selectedActivityForFullDay = {};
                    activity1Record = $filter('filter')(fulldayList, {
                        "Id": dcrObj.Activity1__c
                    });

                    $scope.selectedActivityForFullDay.Name = activity1Record[0].Name;
                    $scope.selectedActivityForFullDay.Id = activity1Record[0].Id;
                    statusDCRActivty.setActivityStatus([$scope.selectedActivityForFullDay]);
                    statusDCRActivty.setCalenderDate(date);
                    navigationService.navigate('dcrCreate', {
                        'dateDCR': dateObj
                    }, true);
                    //navigationService.navigate("dcrCreate"); dateObj
                });
            } else {
                $scope.fetchHalfDayActivities().then(function(halfdayList) {
                    $scope.selectedActivityForHalfDayFirstHalf = {};
                    $scope.selectedActivityForHalfDaySecondHalf = {};
                    activity1Record = $filter('filter')(halfdayList, {
                        "Id": dcrObj.Activity1__c
                    });
                    activity2Record = $filter('filter')(halfdayList, {
                        "Id": dcrObj.Activity2__c
                    });

                    $scope.selectedActivityForHalfDayFirstHalf.Name = activity1Record[0].Name;
                    $scope.selectedActivityForHalfDayFirstHalf.Id = activity1Record[0].Id;
                    $scope.selectedActivityForHalfDaySecondHalf.Name = activity2Record[0].Name;
                    $scope.selectedActivityForHalfDaySecondHalf.Id = activity2Record[0].Id;
                    statusDCRActivty.setActivityStatus([$scope.selectedActivityForHalfDayFirstHalf, $scope.selectedActivityForHalfDaySecondHalf]);
                    statusDCRActivty.setCalenderDate(date);
                    navigationService.navigate('dcrCreate', {
                        'dateDCR': dateObj
                    }, true);
                });
            }
        };

        $scope.getLastDCRFiledDate = function() {
            var lastGreenDateTemp = $scope.lastGreenDate.split(' ')[0];
            lastGreenDateDay = lastGreenDateTemp.split('/')[0],
                lastGreenDateMonth = lastGreenDateTemp.split('/')[1],
                lastGreenDateYear = lastGreenDateTemp.split('/')[2],
                lastGreenDateString = '' + lastGreenDateYear + '-' + lastGreenDateMonth + '-' + lastGreenDateDay,
                //date = new Date(lastGreenDateString),
                date = new Date(lastGreenDateYear, lastGreenDateMonth - 1, lastGreenDateDay),
                allevents = $scope.events,
                yellowArray = [],
                pinkArray = [],
                PurpleArray = [],
                orangeArray = [],
                greenArray = [];

            for (var i in allevents) {
                switch (allevents[i].eventType) {
                    case "greenEvent":
                    case "blueEvent":
                        greenArray.push(allevents[i]);
                        break;
                    case "orangeEvent":
                        orangeArray.push(allevents[i]);
                        break;
                    case "purpleEvent":
                        PurpleArray.push(allevents[i]);
                        break;
                    case "pinkEvent":
                        pinkArray.push(allevents[i]);
                        break;
                    case "yellowEvent":
                        yellowArray.push(allevents[i]);
                        break;
                    default:
                        break;
                }
            }
            if (/iPhone/.test(navigator.userAgent)) {
                date = new Date(lastGreenDateYear, lastGreenDateMonth - 1, lastGreenDateDay)
            }

            $scope.minRedDate = $scope.findMinRed(date, orangeArray, PurpleArray, pinkArray, yellowArray);
            //    console.log('min red date is ' + $scope.minRedDate);
            window.ga.trackTiming('DCRCalender Load Finish Time', 20000, 'DCRCalenderLoadFinish', 'DCRCalender load Finish');
        };

        $scope.findMinRed = function(lastDCRDate, orangeArray, PurpleArray, pinkArray, yellowArray) {
            var i = 1,
                count = orangeArray.length + PurpleArray.length + pinkArray.length + yellowArray.length;
            while (i <= count) {
                var a = 0;
                a = parseInt(i);
                var minRedDate = new Date(lastDCRDate.getFullYear(), lastDCRDate.getMonth(), lastDCRDate.getDate() + a);
                minRedDateFormatted = $filter('date')(new Date(minRedDate), 'yyyy-MM-dd');

                var filteredOrange = $scope.filterData(orangeArray, minRedDateFormatted),
                    filteredpurple = $scope.filterData(PurpleArray, minRedDateFormatted),
                    filteredpink = $scope.filterData(pinkArray, minRedDateFormatted),
                    isWeeklyOff = false;

                if (yellowArray.length > 0) {
                    if (weeklyOffDayIndex == "" + minRedDate.getDay()) {
                        isWeeklyOff = true;
                    }
                }

                if (((filteredOrange.length == 0) && (filteredpurple.length == 0) && (filteredpink.length == 0) && !isWeeklyOff) && (new Date(minRedDateFormatted).getDay() != 0)) {
                    return minRedDateFormatted;
                } else
                    i++;

            }
        };

        $scope.filterData = function(dataArray, oldDate) {
            var filteredArray = [];
            for (var i in dataArray) {
                var newDate = $filter('date')(new Date(dataArray[i].start), 'yyyy-MM-dd');
                if (oldDate == newDate)
                    filteredArray.push(dataArray[i]);
            }
            return filteredArray;
        };

        $scope.getFormatedDateFromSlash = function(dateString) {
            temparray = [];
            temparray = dateString.split(" ")[0];
            temparray = temparray.split("/");
            var day = temparray[0],
                month = temparray[1],
                year = temparray[2];
            var dateString = year + '-' + month + '-' + day;
            var formatedDate = new Date(dateString);
            if (/iPhone/.test(navigator.userAgent)) {
                formatedDate = new Date(year, month - 1, day)
            }
            //return new Date(formatedDate.getFullYear(), formatedDate.getMonth(), formatedDate.getDate());
            return new Date(year, month - 1, day);
        };

        $scope.getFormatedDateFromDash = function(dateString) {
            temparray = [];
            temparray = dateString.split("-");
            var year = temparray[0],
                month = temparray[1],
                day = temparray[2];
            var dateString = year + '-' + month + '-' + day;
            var formatedDate = new Date(dateString);
            //return new Date(formatedDate.getFullYear(), formatedDate.getMonth(), formatedDate.getDate());
            return new Date(year, month - 1, day);
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

    }
]);