(function(){
  function dcrUnlockReasonModel(utils, entityModel){
    var DcrUnlockReasonModel = function(){
      DcrUnlockReasonModel.super.constructor.apply(this, arguments);
    };

    DcrUnlockReasonModel = utils.extend(DcrUnlockReasonModel, entityModel);
    DcrUnlockReasonModel.description = 'DCR Unlock Reason';
    DcrUnlockReasonModel.tableSpec = {
      sfdc: 'DCR_Unlock_Reasons__c',
      local: 'DCR_Unlock_Reasons__c'
    };

    DcrUnlockReasonModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Reason__c'}
    ];

    DcrUnlockReasonModel.mapModel();
    return DcrUnlockReasonModel;
  }

  abbottApp.factory('dcrUnlockReasonModel', [
    'utils',
    'entityModel',
    dcrUnlockReasonModel
  ]);
})();