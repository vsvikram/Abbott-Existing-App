(function(){
  function dcrLockedStatusModel(utils, entityModel){
    var DcrLockedStatusModel = function(){
      DcrLockedStatusModel.super.constructor.apply(this, arguments);
    };

    DcrLockedStatusModel = utils.extend(DcrLockedStatusModel, entityModel);
    DcrLockedStatusModel.description = 'DCR Locked Status';
    DcrLockedStatusModel.tableSpec = {
      sfdc: 'DCR_Locked_Users__c',
      local: 'DCR_Locked_Status'
    };

    DcrLockedStatusModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Status__c', upload: true},
      {sfdc: 'End_Date__c'},
      {sfdc: 'Start_Date__c'},
      {sfdc: 'Unlock_Reason__c', upload: true},
      {sfdc: 'User_Comments__c', upload: true}
    ];

    DcrLockedStatusModel.mapModel();
    return DcrLockedStatusModel;
  }

  abbottApp.factory('dcrLockedStatusModel', [
    'utils',
    'entityModel',
    dcrLockedStatusModel
  ]);
})();