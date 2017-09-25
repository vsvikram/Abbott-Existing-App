(function(){
  function leaveRequestModel(utils, entityModel){
    var LeaveRequestModel = function(){
      LeaveRequestModel.super.constructor.apply(this, arguments);
    };

    LeaveRequestModel = utils.extend(LeaveRequestModel, entityModel);
    LeaveRequestModel.description = 'Leave Request';
    LeaveRequestModel.tableSpec = {
      sfdc: 'Leave_Request__c',
      local: 'Leave_Request__c'
    };

    LeaveRequestModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Status__c'},
      {sfdc: 'From_Date__c', indexWithType: 'string'},
      {sfdc: 'To_Date__c', indexWithType: 'string'},
      {sfdc: 'Total_Number_of_Days__c'},
      {sfdc: 'User__c'},
      {sfdc: 'Approved_Rejected_Date__c'},
      {sfdc: 'CreatedDate'},
      {sfdc: 'Leave_Type__c'}
    ];

    LeaveRequestModel.mapModel();
    return LeaveRequestModel;
  }

  abbottApp.factory('leaveRequestModel', [
    'utils',
    'entityModel',
    leaveRequestModel
  ]);
})();