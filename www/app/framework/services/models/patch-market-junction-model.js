(function(){
  function patchMarketJunctionModel(utils, entityModel){
    var PatchMarketJunctionModel = function(){
      PatchMarketJunctionModel.super.constructor.apply(this, arguments);
    };

    PatchMarketJunctionModel = utils.extend(PatchMarketJunctionModel, entityModel);

    PatchMarketJunctionModel.description = 'Patch Market Junction';
    PatchMarketJunctionModel.tableSpec = {
      sfdc: 'Patch_Market_Junction__c',
      local: 'Patch_Market_Junction__c'
    };

    PatchMarketJunctionModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Market_Name__c'},
      {sfdc: 'Patch_Name__c'},
      {sfdc: 'SFC_Assignment__c'},
      {sfdc: 'SFC_Assignment__r.Market_Type__c'},
      {sfdc: 'SFC_Assignment__r.Active__c'},
      {sfdc: 'SFC_Assignment__r.SFC_Master__c'},
      {sfdc: 'Name'},
      // {sfdc: 'SFC_Assignment__r.Hill_Station_Applicable__c'},
      {sfdc: 'External_Id__c', indexWithType: 'string'}
    ];

    PatchMarketJunctionModel.mapModel();
    return PatchMarketJunctionModel;
  }

  abbottApp.factory('patchMarketJunctionModel', [
    'utils',
    'entityModel',
    patchMarketJunctionModel
  ]);
})();
