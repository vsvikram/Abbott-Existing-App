(function(){
  function expenseDetailsModel(utils, entityModel){
    var ExpenseDetailsModel = function(){
      ExpenseDetailsModel.super.constructor.apply(this, arguments);
    };

    ExpenseDetailsModel = utils.extend(ExpenseDetailsModel, entityModel);

    ExpenseDetailsModel.description = 'Expense Details';
    ExpenseDetailsModel.tableSpec = {
      sfdc: 'Expense_Details__c',
      local: 'Expense_Details__c'
    };

    ExpenseDetailsModel.fieldsSpec = [
		{sfdc: 'Id', indexWithType: 'string'},
		{sfdc: 'Distance_One_Way__c', upload: true},
		{sfdc: 'Expense__c', indexWithType: 'string', upload: true},
		/*{sfdc: 'ExpenseDiv__c'},*/
		{sfdc: 'Expense_Type__c', upload: true},
		{sfdc: 'External_Id__c', indexWithType: 'string'},
		{sfdc: 'Fare_Amount__c', upload: true},
		{sfdc: 'Fare_Claimed__c', upload: true},
		{sfdc: 'From_Market__c', upload: true},
		{sfdc: 'Mode_of_Travel__c', upload: true},
		{sfdc: 'To_Market__c', upload: true},
		{sfdc: 'SFC_Assignment__c', indexWithType: 'string', upload: true},
		{sfdc: 'SFC_Code__c'},
		{sfdc: 'Misc_Amount__c',upload: true},
		{sfdc: 'Misc_Description__c', upload: true},
		{sfdc: 'Misc_Detailed_Remarks__c', upload: true},
		{sfdc: 'Misc_Remarks__c'},
		{sfdc: 'Misc_Exp_Wage_Type__c'},
		{sfdc: 'Sent_to_SAP__c'},
		{sfdc: 'ERN_Code__c'},
		{sfdc: 'Wage_Code__c', upload: true},
		{sfdc: 'Wage_Type__c'}
    ];

    ExpenseDetailsModel.mapModel();
    return ExpenseDetailsModel;
  }

  abbottApp.factory('expenseDetailsModel', [
    'utils',
    'entityModel',
    expenseDetailsModel
  ]);
})();
