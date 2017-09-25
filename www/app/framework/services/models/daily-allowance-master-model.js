(function(){
  function dailyAllowanceMasterModel(utils, entityModel){
    var DailyAllowanceMasterModel = function(){
      DailyAllowanceMasterModel.super.constructor.apply(this, arguments);
    };

    DailyAllowanceMasterModel = utils.extend(DailyAllowanceMasterModel, entityModel);

    DailyAllowanceMasterModel.description = 'Daily Allowance Master';
    DailyAllowanceMasterModel.tableSpec = {
      sfdc: 'Expense_Daily_Allowance_Master__c',
      local: 'Expense_Daily_Allowance_Master__c'
    };

    DailyAllowanceMasterModel.fieldsSpec = [
		{sfdc: 'Id', indexWithType: 'string'},
		{sfdc: 'Active__c'},
		{sfdc: 'Division_Code__c'},
		{sfdc: 'External_Id__c', indexWithType: 'string'},
		{sfdc: 'Level__c'},
		{sfdc: 'Metro__c'},
		{sfdc: 'Station__c'}
    ];

    DailyAllowanceMasterModel.mapModel();
    return DailyAllowanceMasterModel;
  }

  abbottApp.factory('dailyAllowanceMasterModel', [
    'utils',
    'entityModel',
    dailyAllowanceMasterModel
  ]);
})();