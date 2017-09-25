(function(){
  function leaveRequestApprovedUserModel(utils, entityModel){
    var LeaveRequestApprovedUserModel = function(){
      LeaveRequestApprovedUserModel.super.constructor.apply(this, arguments);
    };

    LeaveRequestApprovedUserModel = utils.extend(LeaveRequestApprovedUserModel, entityModel);
    LeaveRequestApprovedUserModel.description = 'Leave Request Approved User';
    LeaveRequestApprovedUserModel.tableSpec = {
      sfdc: 'Leave_Request__c',
      local: 'LeaveRequestApproved_User'
    };

    LeaveRequestApprovedUserModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Status__c'},
      {sfdc: 'From_Date__c', indexWithType: 'string'},
      {sfdc: 'To_Date__c', indexWithType: 'string'},
      {sfdc: 'Total_Number_of_Days__c'}
    ];

    LeaveRequestApprovedUserModel.mapModel();
    return LeaveRequestApprovedUserModel;
  }

  abbottApp.factory('leaveRequestApprovedUserModel', [
    'utils',
    'entityModel',
    leaveRequestApprovedUserModel
  ]);
})();