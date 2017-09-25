(function(){
  function expenseStatementModel(utils, entityModel){
    var ExpenseStatementModel = function(){
      ExpenseStatementModel.super.constructor.apply(this, arguments);
    };

    ExpenseStatementModel = utils.extend(ExpenseStatementModel, entityModel);

    ExpenseStatementModel.description = 'Daily Allowance Fare';
    ExpenseStatementModel.tableSpec = {
      sfdc: 'Expense_Statement__c',
      local: 'Expense_Statement__c'
    };

    ExpenseStatementModel.fieldsSpec = [
		{sfdc: 'Id', indexWithType: 'string'},
		{sfdc: 'External_Id__c', indexWithType: 'string'},
		{sfdc: 'Claimed_Allowance_Amount__c'},
		{sfdc: 'Claimed_amount_by_EMP__c'},
		{sfdc: 'claimed_Fare_Amount__c'},
		{sfdc: 'Claimed_Misc_Amount__c'},
		{sfdc: 'Claimed_Period__c'},
		{sfdc: 'Designation__c'},
		{sfdc: 'Display_designation__c'},
		{sfdc: 'Division__c'},
		{sfdc: 'EmpCodeNMonthNYear__c'},
		{sfdc: 'Employee_Code__c'},
		{sfdc: 'Employee_Name__c'},
        {sfdc: 'Expense_Submission_Date__c'},
        {sfdc: 'Month__c'},
        {sfdc: 'Territory_Code__c'},
        {sfdc: 'User__c'},
        {sfdc: 'Year__c'}
    ];

    ExpenseStatementModel.mapModel();
    return ExpenseStatementModel;
  }

  abbottApp.factory('expenseStatementModel', [
    'utils',
    'entityModel',
    expenseStatementModel
  ]);
})();