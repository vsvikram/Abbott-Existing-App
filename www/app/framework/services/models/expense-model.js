(function(){
  function expenseModel(utils, entityModel){
    var ExpenseModel = function(){
      ExpenseModel.super.constructor.apply(this, arguments);
    };

    ExpenseModel = utils.extend(ExpenseModel, entityModel);

    ExpenseModel.description = 'Expense';
    ExpenseModel.tableSpec = {
      sfdc: 'Expense__c',
      local: 'Expense__c'
    };

    ExpenseModel.fieldsSpec = [
		{sfdc: 'Id', indexWithType: 'string'},
		{sfdc: 'ABM_Name__c'},
		{sfdc: 'From_Market__c'},
		{sfdc: 'To_Market__c'},
		{sfdc: 'Admin_Activity__c'},
		{sfdc: 'Fare_Wage_Type__c'},
		{sfdc: 'Allowance_Wage_Type__c'},
		{sfdc: 'External_Id__c', indexWithType: 'string'},
		{sfdc: 'Claimed_Period__c'},
		{sfdc: 'Daily_Allowance__c', upload:true},
		{sfdc: 'Day__c'},
		{sfdc: 'DCR__c',indexWithType: 'string', upload: true},
		//{sfdc: 'DcrDiv__c'},
		{sfdc: 'Designation__c'},
		{sfdc: 'Expense_Date__c', indexWithType: 'string', upload: true},
		{sfdc: 'Expense_Total__c'},
		{sfdc: 'Misc_Expense_Head__c'},
		{sfdc: 'Misc_Expense_wage_Type__c'},
		{sfdc: 'Mis_Exp_Remarks_By_TBM__c'},
		{sfdc: 'SFC_Code__c'},
		{sfdc: 'Emp_Code__c'},
		{sfdc: 'Territory__c'},
		{sfdc: 'Employee_Name__c', indexWithType: 'string'},
		{sfdc: 'Total_Claimed_Expense__c'},
		{sfdc: 'Total_Daily_Allowance__c'},
		{sfdc: 'Total_Expense__c'},
		{sfdc: 'Total_Misc_Allowance__c'},
		{sfdc: 'Expense_Statement_Status__c'},
		{sfdc: 'Station__c', upload: true},
		{sfdc: 'Total_Expense_Fare__c'},
		{sfdc: 'Expense_Statement__c', indexWithType: 'string'},
		{sfdc: 'User__c'},
		{sfdc: 'Doctors_Met__c',upload: true},
		{sfdc: 'Doctors_Count__c',upload: true},
		{sfdc: 'Places_Worked__c',upload: true},
		{sfdc: 'Stockist_Met__c',upload: true},
		{sfdc: 'Chemist_Met__c',upload: true},
		{sfdc: 'Daily_Allowance_ERN_Type__c'},
		{sfdc: 'Hill_Station_Allowance__c', upload: true},
		{sfdc: 'isMobileExpense__c', upload: true},
		{sfdc: 'Status__c', upload: true, indexWithType: 'string'},
		{sfdc: 'Roll_Claimed_Expense_Fares__c'},
		{sfdc: 'Roll_Claimed_Expense_Misc__c'}
    ];

    ExpenseModel.localMappingSpec = [
    		{'path': 'Local_DCR__c',  'type': 'string', indexWithType: 'string'}
    	];

    ExpenseModel.mapModel();
    return ExpenseModel;
  }

  abbottApp.factory('expenseModel', [
    'utils',
    'entityModel',
    expenseModel
  ]);
})();
