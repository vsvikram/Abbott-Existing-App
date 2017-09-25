(function(){
  function expenseSAPCodeModel(utils, entityModel){
    var ExpenseSAPCodeModel = function(){
      ExpenseSAPCodeModel.super.constructor.apply(this, arguments);
    };

    ExpenseSAPCodeModel = utils.extend(ExpenseSAPCodeModel, entityModel);

    ExpenseSAPCodeModel.description = 'Expense SAP Codes';
    ExpenseSAPCodeModel.tableSpec = {
      sfdc: 'Expense_SAP_Codes__c',
      local: 'Expense_SAP_Codes__c'
    };

    ExpenseSAPCodeModel.fieldsSpec = [
		{sfdc: 'Id', indexWithType: 'string'},
		{sfdc: 'AHPL__c'},
		{sfdc: 'AIL__c'},
		{sfdc: 'Priority__c'},
		{sfdc: 'Value__c'},
		{sfdc: 'Wage_Type__c '},
		{sfdc: 'Name '}
    ];

    ExpenseSAPCodeModel.mapModel();
    return ExpenseSAPCodeModel;
  }

  abbottApp.factory('expenseSAPCodeModel', [
    'utils',
    'entityModel',
    expenseSAPCodeModel
  ]);
})();