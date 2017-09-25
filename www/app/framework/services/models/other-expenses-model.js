(function(){
  function otherExpensesModel(utils, entityModel){
    var OtherExpensesModel = function(){
      OtherExpensesModel.super.constructor.apply(this, arguments);
    };

    OtherExpensesModel = utils.extend(OtherExpensesModel, entityModel);

    OtherExpensesModel.description = 'Other Expense';
    OtherExpensesModel.tableSpec = {
      sfdc: 'Other_Expense__c',
      local: 'Other_Expense__c'
    };

    OtherExpensesModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Applicable_Entities__c'},
      {sfdc: 'Designations_Applicable__c'},
      {sfdc: 'Divisions_Applicable__c'},
      {sfdc: 'Expense_Name__c'},
      {sfdc: 'Max_End_Date__c'},
      {sfdc: 'Max_Start_Date__c'},
      {sfdc: 'Name', indexWithType: 'string'}
    ];

    OtherExpensesModel.mapModel();
    return OtherExpensesModel;
  }

  abbottApp.factory('otherExpensesModel', [
    'utils',
    'entityModel',
    otherExpensesModel
  ]);
})();