(function(){
  function otherExpensesEarningModel(utils, entityModel){
    var OtherExpensesEarningModel = function(){
      OtherExpensesEarningModel.super.constructor.apply(this, arguments);
    };

    OtherExpensesEarningModel = utils.extend(OtherExpensesEarningModel, entityModel);

    OtherExpensesEarningModel.description = 'Other Expense Earning Type';
    OtherExpensesEarningModel.tableSpec = {
      sfdc: 'Other_Expense_Earning_Type__c',
      local: 'Other_Expense_Earning_Type__c'
    };

    OtherExpensesEarningModel.fieldsSpec = [
      {sfdc: 'Id',indexWithType: 'string'},
      {sfdc: 'Name',indexWithType: 'string'},
      {sfdc: 'Effective_from_date__c'},
      {sfdc: 'Effective_to_date__c'},
      {sfdc: 'ERN_Type__c'},
      {sfdc: 'Other_Expense__c',indexWithType: 'string'},
      {sfdc: 'Other_Expense__r.Expense_Name__c'},
      {sfdc: 'Other_Expense__r.Name'},
      {sfdc: 'Other_Expense__r.Designations_Applicable__c'},
      {sfdc: 'Other_Expense__r.Divisions_Applicable__c'}
    ];

    OtherExpensesEarningModel.mapModel();
    return OtherExpensesEarningModel;
  }

  abbottApp.factory('otherExpensesEarningModel', [
    'utils',
    'entityModel',
    otherExpensesEarningModel
  ]);
})();