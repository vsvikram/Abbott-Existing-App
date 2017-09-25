//Set the focus if condition is satisfied to set focus of the current date
abbottApp.directive('ngFocusIf', ["$timeout", function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            if(scope.$eval(attrs['ngFocusIf'])) {
                $timeout(function () {
                    element[0].focus();
                }, 0);
            }
        }
    };
}]);
abbottApp.directive('dayCalendar', function ($rootScope,$q,leaveRequestPendingUserCollection,leaveRequestHolidayUserCollection,leaveRequestApprovedUserCollection) {
    return {
        restrict : 'E',
        scope:{
            directiveDayDetails : '=dayDetails'
        },
        templateUrl : 'app/framework/components/MTPDayCalendar/mtpDayCalendarTemplate.html',
        link: function ($scope, $element, $attrs, $ctrl) {
            $scope.currentDate = new Date();
            $scope.currentDayNum = $scope.currentDate.getDate();

            var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            // var date = new Date();
            var cDate = $scope.currentDate.getDate();
            var cYear = $scope.currentDate.getFullYear();
            var cMonth = $scope.currentDate.getMonth();

            //Set Month Data
            var futureMonth = ($attrs.planMonths ? $attrs.planMonths : 2);
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            $scope.monthData = [];

            var leaveRequestPendingUserCollectionInstance = new leaveRequestPendingUserCollection(),
                leaveRequestHolidayUserCollectionInstance = new leaveRequestHolidayUserCollection(),
                leaveRequestApprovedUserCollectionInstance = new leaveRequestApprovedUserCollection();

            //Get the date from string to Date object
            $scope.getDate = function(dateString) {
                    var temparray = [];
                    temparray = dateString.split("-");
                    var year = temparray[0],
                        month = temparray[1],
                        day = temparray[2];
                    return new Date(year, month - 1, day);
                };

            //Get the values of the Leave Request pending
            $scope.pinkColorLeaveRequestPending = [];
            $scope.getPinkColorFlagDetails = function() {
                    return leaveRequestPendingUserCollectionInstance.fetchAll().then(leaveRequestPendingUserCollectionInstance.fetchRecursiveFromCursor).then(function(leaveUserList) {
                        leaveUserList.forEach(function(leaveUser) {
                            var startDate = $scope.getDate(leaveUser.From_Date__c),
                            //TODO
                                endDate = (leaveUser.To_Date__c) ? $scope.getDate(leaveUser.To_Date__c) : $scope.getDate(leaveUser.From_Date__c);
                            for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                                $scope.pinkColorLeaveRequestPending.push(new Date(d));
                            }
                        });
                        return leaveUserList
                    });
            };

            //Get the values of the Holidays list
            $scope.orangeColorLeaveRequestHoliday = [];
            $scope.getOrangeColorFlagDetails = function() {
                return leaveRequestHolidayUserCollectionInstance.fetchAll().then(leaveRequestHolidayUserCollectionInstance.fetchRecursiveFromCursor).then(function(holidayUsersList) {
                    var date = null,
                        day = 0,
                        month = 0,
                        year = 0;
                    holidayUsersList.forEach(function(holidayUser) {
                        //TODO
                        date = $scope.getDate(holidayUser.Date__c);
                        day = date.getDate();
                        month = date.getMonth();
                        year = date.getFullYear();
                        $scope.orangeColorLeaveRequestHoliday.push(new Date(year, month, day));
                    });
                    return holidayUsersList;
                });
            };

            //Get the values of the Approved leave request
            $scope.purpleColorLeaveRequestApproved = [];
            $scope.getPurpleColorFlagDetails = function() {
                /* Query to get purple flags*/
                return leaveRequestApprovedUserCollectionInstance.fetchAll().then(leaveRequestApprovedUserCollectionInstance.fetchRecursiveFromCursor).then(function(approvedUserList) {
                    approvedUserList.forEach(function(approvedUser) {
                        var startDate = $scope.getDate(approvedUser.From_Date__c),
                        //TODO
                            endDate = (approvedUser.To_Date__c) ? $scope.getDate(approvedUser.To_Date__c) : $scope.getDate(approvedUser.From_Date__c),
                            date = null;
                        for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                            date = new Date(d);
                            //Exclude sunday
                            if (0 != "" + date.getDay()) {
                                $scope.purpleColorLeaveRequestApproved.push(date);
                            }
                        }
                    });
                    return approvedUserList;
                });
            };

            for(var i=0,now = new Date(cYear, cMonth, 1);i<futureMonth;i++){
                var tMonth = {}, nextMonth;

                tMonth.monthNumber = now.getMonth();
                tMonth.Year = now.getFullYear();
                tMonth.monthText = months[tMonth.monthNumber];

                $scope.monthData.push(tMonth);

                //Next Month
                if (now.getMonth() == 11) {
                    nextMonth = new Date(now.getFullYear() + 1, 0, 1);
                } else {
                    nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                }
                now = new Date(nextMonth.getFullYear(),nextMonth.getMonth(),1);
            }

            $scope.getLeaveDetails = function(){
                return $q.all([$scope.getOrangeColorFlagDetails(), $scope.getPinkColorFlagDetails(), $scope.getPurpleColorFlagDetails()]);
            };

            // Check date array is available for with the given date
            $scope.isInArray = function(array, value) {
              return !!array.find(item => {return item.getTime() == value.getTime()});
            }

            $scope.$on('setMonthDays',function(event,obj){
                //Reset the values of the days in each months

                $scope.days = [];

                //Construct the Month data with the leave values
                $scope.getLeaveDetails().then(function(){
                    var fYear = obj.fYear,
                        fMonth = obj.fMonth;
                    var date = new Date(fYear, fMonth, 1);

                    while (date.getMonth() === fMonth) {
                        var cDay = {};

                        cDay.day = date.getDate();
                        cDay.date = new Date(fYear,fMonth,cDay.day);
                        cDay.Year = fYear;
                        cDay.month = fMonth;
                        cDay.dayNum = date.getDay();

                        if($scope.isInArray($scope.pinkColorLeaveRequestPending, cDay.date)){
                            cDay.pinkColorLeaveRequestPending = true;
                        }else{
                            cDay.pinkColorLeaveRequestPending = false;
                        }

                        if($scope.isInArray($scope.orangeColorLeaveRequestHoliday, cDay.date)){
                            cDay.orangeColorLeaveRequestHoliday = true;
                        }else{
                            cDay.orangeColorLeaveRequestHoliday = false;
                        }


                        if($scope.isInArray($scope.purpleColorLeaveRequestApproved, cDay.date)){
                            cDay.purpleColorLeaveRequestApproved = true;
                        }else{
                            cDay.purpleColorLeaveRequestApproved = false;
                        }

                        if (cDay.dayNum == 0) {
                            cDay.weekOff = true;
                        } else {
                            cDay.weekOff = false;
                        }
                        cDay.weekDay = weekdays[cDay.dayNum];
                        $scope.days.push(cDay);
                        date.setDate(date.getDate() + 1);
                    }

                });

            });

            $scope.setMonth = function(fMonth,fYear){
                //Reset the values of the days in each months
                var obj = {};
                obj.fMonth = fMonth;
                obj.fYear = fYear;
                $rootScope.$broadcast('setMonthDays', obj);
            }
            //Default selection on the current date and Month
            $scope.setMonth(cMonth,cYear);
            $scope.selectedDate = cDate.toString() + cMonth.toString() + cYear.toString();

            //Send the Date information to the MTP List to show the details of the selected date
            $scope.showDate = function(cal){

                //Select the date of the user
                $scope.selectedDate = cal.date.getDate().toString() + cal.date.getMonth().toString() + cal.date.getFullYear().toString();

                //Send data to the controller
                 $scope.directiveDayDetails(cal);
            }
   		},
    }
});