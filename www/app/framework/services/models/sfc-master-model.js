(function(){
  function sfcMasterModel(utils, entityModel){
    var SFCMasterModel = function(){
      SFCMasterModel.super.constructor.apply(this, arguments);
    };

    SFCMasterModel = utils.extend(SFCMasterModel, entityModel);

    SFCMasterModel.description = 'SFC Master';
    SFCMasterModel.tableSpec = {
      sfdc: 'SFC_Master__c',
      local: 'SFC_Master__c'
    };

    SFCMasterModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Combination__c', indexWithType: 'string'},
      {sfdc: 'Count__c'},
      {sfdc: 'Duplicate__c'},
      {sfdc: 'External_ID__c', indexWithType: 'string'},
      {sfdc: 'From_Market__c', indexWithType: 'string'},
      {sfdc: 'FromMarketNToMarketNState__c', indexWithType: 'string'},
      {sfdc: 'One_way_distance_in_kms__c'},
      {sfdc: 'SFC_Code__c', indexWithType: 'string'},
      {sfdc: 'State__c', indexWithType: 'string'},
      {sfdc: 'To_Market__c', indexWithType: 'string'}
    ];
    
    SFCMasterModel.mapModel();
    return SFCMasterModel;
  }

  abbottApp.factory('sfcMasterModel', [
    'utils',
    'entityModel',
    sfcMasterModel
  ]);
})();