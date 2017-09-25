(function(){
  function dcrLockingModel(utils, entityModel){
    var DcrLockingModel = function(){
      DcrLockingModel.super.constructor.apply(this, arguments);
    };

    DcrLockingModel = utils.extend(DcrLockingModel, entityModel);
    DcrLockingModel.description = 'DCR Locking';
    DcrLockingModel.tableSpec = {
      sfdc: 'DCR_locking__c',
      local: 'DCR_locking__c'
    };

    DcrLockingModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Division__c'},
      {sfdc: 'Level__c'},
      {sfdc: 'DCR_Locking_Days__c'},
      {sfdc: 'Company_Code__c'},
      {sfdc: 'Type__c'}
    ];

    DcrLockingModel.mapModel();
    return DcrLockingModel;
  }

  abbottApp.factory('dcrLockingModel', [
    'utils',
    'entityModel',
    dcrLockingModel
  ]);
})();