(function(){
  function expenseTypeModel(utils, entityModel){
    var ExpenseTypeModel = function(){
      ExpenseTypeModel.super.constructor.apply(this, arguments);
    };

    ExpenseTypeModel = utils.extend(ExpenseTypeModel, entityModel);

    ExpenseTypeModel.description = 'Daily Allowance Fare';
    ExpenseTypeModel.tableSpec = {
      sfdc: 'ExpenseType__c',
      local: 'ExpenseType__c'
    };

    ExpenseTypeModel.fieldsSpec = [
		{sfdc: 'Id', indexWithType: 'string'},
		{sfdc: 'ABM_Name__c'},
		{sfdc: 'ABM_Target__c', indexWithType: 'string'},
		{sfdc: 'Activity__c', indexWithType: 'string'},
		{sfdc: 'Activity_Date__c'},
		{sfdc: 'Actual_Amount__c'},
		{sfdc: 'Approved_Amount__c'},
		{sfdc: 'Bill_Invoice_No__c'},
		{sfdc: 'Date_of_Birthday__c'},
		{sfdc: 'Description__c'},
		{sfdc: 'Doctor_Name__c'},
		{sfdc: 'Expense_Header__c'},
		{sfdc: 'External_Id__c', indexWithType: 'string'},
		{sfdc: 'From_Date__c'},
		{sfdc: 'From_Place__c'},
		{sfdc: 'ISR_Name__c'},
		{sfdc: 'Remarks__c'},
		{sfdc: 'Superior_Amount__c'},
		{sfdc: 'TBM_Name__c'},
		{sfdc: 'TBM_Target__c', indexWithType: 'string'},
		{sfdc: 'To_Date__c'}
		{sfdc: 'To_Place__c'}
    ];

    ExpenseTypeModel.mapModel();
    return ExpenseTypeModel;
  }

  abbottApp.factory('expenseTypeModel', [
    'utils',
    'entityModel',
    expenseTypeModel
  ]);
})();