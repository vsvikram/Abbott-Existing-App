(function(){
  function leaveRequestHolidayUserModel(utils, entityModel){
    var LeaveRequestHolidayUserModel = function(){
      LeaveRequestHolidayUserModel.super.constructor.apply(this, arguments);
    };

    LeaveRequestHolidayUserModel = utils.extend(LeaveRequestHolidayUserModel, entityModel);
    LeaveRequestHolidayUserModel.description = 'Leave Request Holiday User';
    LeaveRequestHolidayUserModel.externalId = 'Date__c';
    LeaveRequestHolidayUserModel.tableSpec = {
      sfdc: 'Holiday_Master__c',
      local: 'LeaveRequestHoliday_User'
    };

    LeaveRequestHolidayUserModel.fieldsSpec = [
      {sfdc: 'count(State__r.Name)'},
      {sfdc: 'Date__c', indexWithType: 'string'}
    ];

    LeaveRequestHolidayUserModel.mapModel();
    return LeaveRequestHolidayUserModel;
  }

  abbottApp.factory('leaveRequestHolidayUserModel', [
    'utils',
    'entityModel',
    leaveRequestHolidayUserModel
  ]);
})();