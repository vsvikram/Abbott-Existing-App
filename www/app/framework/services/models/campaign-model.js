(function(){
  function campaignModel(utils, entityModel){
    var CampaignModel = function(){
      CampaignModel.super.constructor.apply(this, arguments);
    };

    CampaignModel = utils.extend(CampaignModel, entityModel);
    CampaignModel.description = 'Campaign';
    CampaignModel.tableSpec = {
      sfdc: 'Campaign__c',
      local: 'Campaigns'
    };

    CampaignModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Name'},
      {sfdc: 'Division__c'},
      {sfdc: 'Active__c'},
      {sfdc: 'Activity_Type__c'},
      {sfdc: 'Applicable_Brands__c'},
      {sfdc: 'Start_Date__c'},
      {sfdc: 'End_Date__c'}
    ];

    CampaignModel.mapModel();
    return CampaignModel;
  }

  abbottApp.factory('campaignModel', [
    'utils',
    'entityModel',
    campaignModel
  ]);
})();