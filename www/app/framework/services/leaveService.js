abbottApp.service("leaveService",
["$filter",
function($filter){
    this.model = {};
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.holidays = [];
    this.dcrDates = [];
    this.getCurrentMonthYear = function(){
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var monthInText = this.months[month].toUpperCase();
        return monthInText +" "+ year;
    };
    this.getModel = function(){
       return this.model;
    };
    this.setLeaveModel = function(model){
        this.model = model;
        this.calculateOverallLeaves();
        this.setFormattedFrontDate();
        this.sortDetailsByDate();
        this.setLeaveLabels();
        this.setHolidayList();
    };
    this.setFormattedFrontDate = function(){
        for(var group in this.model.leave_matrix){
            for(detail in this.model.leave_matrix[group].details){
                this.model.leave_matrix[group].details[detail].from_date_formatted = new Date(this.model.leave_matrix[group].details[detail].from_date);
            }
        };
    };
    this.setHolidayList = function(){
        var holidayList = [];
        for(var i = 0; i<this.model.hoildayList.length; i++){
            holidayList.push(this.model.hoildayList[i].holidaydate);
        }
        this.holidays = holidayList;
        console.log("holiday list");
        console.log(this.holidays);
    };
    this.deleteCancelledRecords = function(){
        for(var group in this.model.leave_matrix){
            var count = this.model.leave_matrix[group].details.length;
            for(var i = count-1; i >= 0; i--){
                if(this.model.leave_matrix[group].details[i].leave_status == "Cancelled"
                    || this.model.leave_matrix[group].details[i].leave_status == "Rejected"){
                    this.model.leave_matrix[group].details.splice(i,1);
                }
            }
        }
    };
    this.setDCRDates = function(model){
        for(var i = 0; i< model.length; i++){
            this.dcrDates.push(model[i].DCR_Filed_Date__c);
        }
        console.log("DCR dates");
        console.log(this.dcrDates);
    };
    this.sortDetailsByDate = function(){
        for(group in this.model.leave_matrix){
            this.model.leave_matrix[group].details.sort(function(a,b) {
                return (a.from_date < b.from_date) ? 1 : ((b.from_date < a.from_date) ? -1 : 0);
            });
        }
    };
    this.setLeaveLabels = function(){
        var labels = [];
        for(group in this.model.leave_matrix){
            labels.push(group);
        }
        this.model.labels = labels;
        this.model.selectedLabel = null;
    };
    this.assignSelectedLabel = function(selectedLabel){
        this.model.selectedLabel = selectedLabel;
    };
    this.calculateOverallLeaves = function(){
        var overall= {
            closing_balance: 0,
            leaves_claimed: 0,
            leaves_encashment: 0,
            opening_balance: 0,
            pending_for_approval: 0,
            leave_occured_as_date: 0,
            details: []
        };
        for(group in this.model.leave_matrix){
            if(group != "Overall"){
                overall.closing_balance += this.model.leave_matrix[group].closing_balance;
                overall.leaves_claimed += this.model.leave_matrix[group].leaves_claimed;
                overall.leaves_encashment += this.model.leave_matrix[group].leaves_encashment;
                overall.opening_balance += this.model.leave_matrix[group].opening_balance;
                overall.pending_for_approval += this.model.leave_matrix[group].pending_for_approval;
                overall.leave_occured_as_date += this.model.leave_matrix[group].leave_occured_as_date;
            }
        }
        this.model.leave_matrix.Overall = overall;
    };
    this.omitOverallInGroups = function(){
        var filteredLabels = [];
        for(group in this.model.leave_matrix){
            if(this.model.leave_matrix[group].closing_balance > 0 && group != "Overall"){
                filteredLabels.push(group);
            }
        }
        return filteredLabels;
    };
    this.impactLeaveCancellation = function(leaveGroup, leaveId){
        for(group in this.model.leave_matrix){
            if(leaveGroup == group){
                for(record in this.model.leave_matrix[group].details){
                    if(this.model.leave_matrix[group].details[record].id == leaveId){
                        var currentRecord = this.model.leave_matrix[group].details[record];
                        var currentGroup = this.model.leave_matrix[group];
                        /*if(currentRecord.leave_status.toLowerCase() == 'approved' &&
                          currentGroup.leaves_claimed >= currentRecord.number_of_days){
                            var claimedLeaves = currentGroup.leaves_claimed;
                            this.model.leave_matrix[group].leaves_claimed -= parseInt(currentRecord.number_of_days);
                            this.model.leave_matrix[group].closing_balance += parseInt(currentRecord.number_of_days);
                        }else */
                        if(currentRecord.leave_status.toLowerCase() == 'pending'){
                            var pending = currentGroup.pending_for_approval;
                            if(currentGroup.pending_for_approval >= currentRecord.number_of_days){
                                this.model.leave_matrix[group].pending_for_approval -= parseInt(currentRecord.number_of_days);
                            }
                            this.model.leave_matrix[group].closing_balance += parseInt(currentRecord.number_of_days);
                        }
                       this.model.leave_matrix[group].details.splice(record,1);
                       console.log(this.model.leave_matrix[group]);
                    }
                }
            }
        }
        this.calculateOverallLeaves();
    };

    this.setCancellationStatusToPending = function(leaveGroup, leaveId){
        for(group in this.model.leave_matrix){
            if(leaveGroup == group){
                for(record in this.model.leave_matrix[group].details){
                    if(this.model.leave_matrix[group].details[record].id == leaveId){
                       this.model.leave_matrix[group].details[record].leave_status = "Pending Cancellation";
                       this.model.leave_matrix[group].pending_for_approval +=  this.model.leave_matrix[group].details[record].number_of_days;
                       this.model.leave_matrix[group].leaves_claimed -= this.model.leave_matrix[group].details[record].number_of_days;
                    }
                }
            }
        }
        this.calculateOverallLeaves();
    };

    this.checkApplyDateValidation = function(appliedFromDate, appliedToDate, leaveType){
        var errorMessage = null;
        var fDate = this.turnDateFull(appliedFromDate);
        var tDate = this.turnDateFull(appliedToDate);
        var today = new Date();
        var closingBalance =  parseInt(this.model.leave_matrix[leaveType].closing_balance);
        if(!fDate || !tDate){
            errorMessage = "Please enter both Start date and End date";
        }else if(fDate > tDate){
            errorMessage = "End Date must be greater than start date";
        }else if((fDate < this.getFirstDay().currentYear)
                || (tDate < this.getFirstDay().currentYear)
                || (fDate >= this.getFirstDay().nextYear)
                || (tDate >= this.getFirstDay().nextYear))
        {
           errorMessage = "Please enter dates within this year";
        }else if(leaveType == "Sick Leave" && (fDate > today || tDate > today)){
            errorMessage = "Sick leave cannot be applied in the future";

        }else{
            var selectedDatas = this.getIndividualDates(fDate, tDate);
            if(selectedDatas.length <= 0){
                errorMessage = "All the days you have selected for leave, either submitted as DCR or Holidays"
            }else{
                var totalDetails = [];
                for(var catName in this.model.leave_matrix){
                    var category = this.model.leave_matrix[catName];
                    for(var detIndex in category.details){
                        if(category.details[detIndex].leave_status != "Rejected"
                           && category.details[detIndex].leave_status != "Cancelled"){
                                 totalDetails.push(category.details[detIndex]);
                        }
                    }
                }
                console.log("totalDetails");
                console.log(totalDetails);
                var _this = this;
                var matchFound = (function(){
                    for(var i = 0; i<totalDetails.length; i++){
                        var startDetail =  _this.turnDateFull(totalDetails[i].from_date);
                        var endDetail =  _this.turnDateFull(totalDetails[i].to_date);
                        for(var j=0; j< selectedDatas.length; j++){
                            var selectedIndData = _this.turnDateFull(selectedDatas[j]);
                            console.log("")
                            if(selectedIndData.getTime() < startDetail.getTime() ||
                             selectedIndData.getTime() > endDetail.getTime()){
                                console.log(" this is not in the window of unallowed time. "+j);
                                console.log(startDetail +" "+endDetail+" "+selectedIndData);

                            }else{
                                var extraStr = "";
                                if (startDetail == endDetail){
                                    extraStr = $filter('date')(startDetail, 'dd-MM-yyyy');
                                }else{
                                    extraStr = $filter('date')(startDetail, 'dd-MM-yyyy')+ " to "+ $filter('date')(endDetail, 'dd-MM-yyyy');
                                }
                                return "Leave has already been applied on "+extraStr;                                       ;
                            }
                        }
                    }
                    return "not found";
                })();

                if(matchFound != "not found"){
                    errorMessage = matchFound;
                }else{
                    closingBalance = parseInt(closingBalance);
                    var totalDays = selectedDatas.length;
                    if(closingBalance - totalDays < 0){
                        errorMessage = "Insufficient Leave Balance";
                    }else{
                        closingBalance = totalDays
                    }
                }
            }

        }
        console.log(errorMessage);
        console.log(closingBalance);

        return{
            error: errorMessage,
            closingBalance: closingBalance
        }
    };

    this.getIndividualDates = function(from, to){
        var day = 1000*60*60*24;
        var dates = [];
        var diff = (to.getTime()- from.getTime())/day;
        for(var i=0;i<=diff; i++)
        {
           var xx = from.getTime()+day*i;
           var yy = this.turnDateFull(xx);
           var holidayStatus = this.checkIfPresentInHolidays(yy);
           var dcrStatus = this.checkIfPresentInDCR(yy);
           var sundayStatus = this.checkIfSunday(yy)
           if(holidayStatus && dcrStatus && sundayStatus){
            dates.push(yy);
           }
        }
        return dates;
    };
    this.checkIfPresentInHolidays = function(indDate){
        for(var index in this.holidays){
            var holiday = this.turnDateFull(this.holidays[index]);
            if(indDate.getTime() == holiday.getTime()){
                return false;
            }
        }
        return true;
    };
    this.checkIfPresentInDCR = function(indDate){
        for(var index in this.dcrDates){
            var report = this.turnDateFull(this.dcrDates[index]);
            if(indDate.getTime() == report.getTime()){
                return false;
            }

        }
        return true;
    };
    this.checkIfSunday = function(indDate){
        if((indDate+"").toLowerCase().slice(0,3) == "sun"){
            return false;
        }else{
            return true;
        }
    };
    this.turnDateFull = function(date){
        if(!date)
            return null;
        var dat = new Date(date);
        dat.setHours(0,0,0,0);
        return dat;
    };

    this.getFirstDay = function(){
        var today = this.turnDateFull(new Date());
        var thisYear = today.getFullYear();
        var nextYear = parseInt(thisYear) + 1;
        return {
            currentYear: this.turnDateFull(String(thisYear)),
            nextYear: this.turnDateFull(String(nextYear))
        }
    };


}]);