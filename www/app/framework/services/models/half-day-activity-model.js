(function(){
  function halfDayActivityModel(utils, entityModel){
    var HalfDayActivityModel = function(){
      HalfDayActivityModel.super.constructor.apply(this, arguments);
    };

    HalfDayActivityModel = utils.extend(HalfDayActivityModel, entityModel);
    HalfDayActivityModel.description = 'Half Day Activity';
    HalfDayActivityModel.tableSpec = {
      sfdc: 'Activity_Master__c',
      local: 'HalfDayActivity'
    };

    HalfDayActivityModel.fieldsSpec = [
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
	  {sfdc: 'Half_day__c'}
    ];

    HalfDayActivityModel.mapModel();
    return HalfDayActivityModel;
  }

  abbottApp.factory('halfDayActivityModel', [
    'utils',
    'entityModel',
    halfDayActivityModel
  ]);
})();
