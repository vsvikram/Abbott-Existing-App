(function(){
  function patchModel(utils, entityModel){
    var PatchModel = function(){
      PatchModel.super.constructor.apply(this, arguments);
    };

    PatchModel = utils.extend(PatchModel, entityModel);
    PatchModel.description = 'Patch';
    PatchModel.tableSpec = {
      sfdc: 'Patch__c',
      local: 'Patches__c'
    };

    PatchModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'City__c'},
      {sfdc: 'Name'},
      {sfdc: 'State__c'},
      {sfdc: 'Territory_Code__c'},
      {sfdc: 'Customer_Count__c'},
      {sfdc: 'Target__r.User__c'}
    ];

    PatchModel.mapModel();
    return PatchModel;
  }

  abbottApp.factory('patchModel', [
    'utils',
    'entityModel',
    patchModel
  ]);
})();