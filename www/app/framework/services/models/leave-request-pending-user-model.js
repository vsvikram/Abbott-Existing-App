(function(){
  function leaveRequestPendingUserModel(utils, entityModel){
    var LeaveRequestPendingUserModel = function(){
      LeaveRequestPendingUserModel.super.constructor.apply(this, arguments);
    };

    LeaveRequestPendingUserModel = utils.extend(LeaveRequestPendingUserModel, entityModel);
    LeaveRequestPendingUserModel.description = 'Leave Request Pending User';
    LeaveRequestPendingUserModel.tableSpec = {
      sfdc: 'Leave_Request__c',
      local: 'LeaveRequestPending_User'
    };

    LeaveRequestPendingUserModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Status__c'},
      {sfdc: 'From_Date__c', indexWithType: 'string'},
      {sfdc: 'To_Date__c', indexWithType: 'string'},
      {sfdc: 'Total_Number_of_Days__c'}
    ];

    LeaveRequestPendingUserModel.mapModel();
    return LeaveRequestPendingUserModel;
  }

  abbottApp.factory('leaveRequestPendingUserModel', [
    'utils',
    'entityModel',
    leaveRequestPendingUserModel
  ]);
})();