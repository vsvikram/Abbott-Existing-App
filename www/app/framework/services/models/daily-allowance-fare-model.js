(function(){
  function dailyAllowanceFareModel(utils, entityModel){
    var DailyAllowanceFareModel = function(){
      DailyAllowanceFareModel.super.constructor.apply(this, arguments);
    };

    DailyAllowanceFareModel = utils.extend(DailyAllowanceFareModel, entityModel);

    DailyAllowanceFareModel.description = 'Daily Allowance Fare';
    DailyAllowanceFareModel.tableSpec = {
      sfdc: 'Expense_Daily_Allowance_Fares__c',
      local: 'Expense_Daily_Allowance_Fares__c'
    };

    DailyAllowanceFareModel.fieldsSpec = [
		{sfdc: 'Id', indexWithType: 'string'},
		{sfdc: 'Allowance__c'},
		{sfdc: 'Effective_From_Date__c'},
		{sfdc: 'Effective_To_Date__c'},
		{sfdc: 'ERN_Code__c', indexWithType: 'string'},
		{sfdc: 'Expense_Daily_Allowance_Master__c', indexWithType: 'string'},
		{sfdc: 'External_Id__c', indexWithType: 'string'},
		{sfdc: 'Expense_Daily_Allowance_Master__r.Station__c'},
		{sfdc: 'Expense_Daily_Allowance_Master__r.Level__c'},
		{sfdc: 'Expense_Daily_Allowance_Master__r.Active__c'},
		{sfdc: 'Expense_Daily_Allowance_Master__r.Metro__c'},
		{sfdc: 'Expense_Daily_Allowance_Master__r.Division_Code__c'}
    ];

    DailyAllowanceFareModel.mapModel();
    return DailyAllowanceFareModel;
  }

  abbottApp.factory('dailyAllowanceFareModel', [
    'utils',
    'entityModel',
    dailyAllowanceFareModel
  ]);
})();
