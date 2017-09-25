(function(){
  function fullDayActivityModel(utils, entityModel){
    var FullDayActivityModel = function(){
      FullDayActivityModel.super.constructor.apply(this, arguments);
    };

    FullDayActivityModel = utils.extend(FullDayActivityModel, entityModel);
    FullDayActivityModel.description = 'Full Day Activity';
    FullDayActivityModel.tableSpec = {
      sfdc: 'Activity_Master__c',
      local: 'FullDayActivity'
    };

    FullDayActivityModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Name'},
      {sfdc: 'X1757__c'},
      {sfdc: 'X1758__c'},
      {sfdc: 'Priority__c'},
      {sfdc: 'Start_Date__c'},
      {sfdc: 'Expiration_Date__c'},
      {sfdc: 'Allowed_Division__c'},
      {sfdc: 'Allowed_Designation__c'},
      {sfdc: 'Daily_Allowance_Type_1757__c'},
      {sfdc: 'Daily_Allowance_Type_1758__c'},
      {sfdc: 'Full_Day__c'}
    ];

    FullDayActivityModel.mapModel();
    return FullDayActivityModel;
  }

  abbottApp.factory('fullDayActivityModel', [
    'utils',
    'entityModel',
    fullDayActivityModel
  ]);
})();