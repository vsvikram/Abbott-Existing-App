(function(){
  function materialTransactionModel(utils, entityModel){
    var MaterialTransactionModel = function(){
      MaterialTransactionModel.super.constructor.apply(this, arguments);
    };

    MaterialTransactionModel = utils.extend(MaterialTransactionModel, entityModel);
    MaterialTransactionModel.description = 'Material Transaction';
    MaterialTransactionModel.tableSpec = {
      sfdc: 'Material_Transaction__c',
      local: 'Material_Transaction__c'
    };

    MaterialTransactionModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Material_Lot__c', indexWithType: 'string', upload: true},
      {sfdc: 'RecordTypeId', upload: true},
      {sfdc: 'Material_Name__c', upload: true},
      {sfdc: 'quantity__c', upload: true},
      {sfdc: 'Account__c', indexWithType: 'string', upload: true},
      {sfdc: 'Call_Date__c', indexWithType: 'string', upload: true},
      {sfdc: 'isSymposia', indexWithType: 'string'}
    ];

    MaterialTransactionModel.mapModel();
    return MaterialTransactionModel;
  }

  abbottApp.factory('materialTransactionModel', [
    'utils',
    'entityModel',
    materialTransactionModel
  ]);
})();