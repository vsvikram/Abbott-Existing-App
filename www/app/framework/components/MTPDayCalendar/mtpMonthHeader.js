abbottApp.directive('mtpMonthHeader', function ($rootScope,navigationService,leaveRequestPendingUserCollection,leaveRequestHolidayUserCollection,leaveRequestApprovedUserCollection) {
    return {
        restrict : 'E',
        templateUrl : 'app/framework/components/MTPDayCalendar/mtpMonthHeader.html',
        link: function ($scope, $element, $attrs, $ctrl) {
            $scope.currentDate = new Date();
            $scope.currentDayNum = $scope.currentDate.getDate();

            var cYear = $scope.currentDate.getFullYear();
            var cMonth = $scope.currentDate.getMonth();

            //Set Month Data
            var futureMonth = ($attrs.planMonths ? $attrs.planMonths : 2);
            var months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

            $scope.monthData = [];

            //Construct the Month data considering the Dec from Previous year and Jan Next year
            for(var i=0,now = new Date(cYear, cMonth-1, 1);i<futureMonth;i++){
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

            //Set month data
            $scope.setMonth = function(fMonth,fYear){
                //Reset the values of the days in each months
                var obj = {};
                obj.fMonth = fMonth;
                obj.fYear = fYear;
                $rootScope.$broadcast('setMonthDays', obj);
                $scope.selectedMonth = fMonth.toString() + fYear.toString();
            }

            //Default selection of the month
            $scope.selectedMonth = cMonth.toString() + cYear.toString();
            $scope.backButton = function() {
                navigationService.backFunc();
            }
   		},
    }
});