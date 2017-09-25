abbottApp.service('statusDCRActivty', [
  function(){
    var self = this,
        customerToOpenDcrId;

    this.activityStatus = [];
    this.calenderDate;
    this.getActivityStatus = function(){
      return self.activityStatus;
    };

    this.setActivityStatus = function(status){
      self.activityStatus = status;
    };

    this.getCalenderDate = function(){
      return self.calenderDate;
    };

    this.setCalenderDate = function(date){
      self.calenderDate = date;
    };

    this.getCustomerId = function(){
      return customerToOpenDcrId;
    };

    this.setCustomerId = function(customerId){
      return customerToOpenDcrId = customerId;
    };


  }
]);
