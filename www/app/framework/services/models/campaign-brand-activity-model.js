(function(){
  function campaignBrandActivityModel(utils, entityModel){
    var CampaignBrandActivityModel = function(){
      CampaignBrandActivityModel.super.constructor.apply(this, arguments);
    };

    CampaignBrandActivityModel = utils.extend(CampaignBrandActivityModel, entityModel);
    CampaignBrandActivityModel.description = 'Campaign Brand Activity';
    CampaignBrandActivityModel.tableSpec = {
      sfdc: 'Campaign__c',
      local: 'Campaign_brand_activity'
    };

    CampaignBrandActivityModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Name'},
      {sfdc: 'Applicable_Brands__c'},
      {sfdc: 'Start_Date__c'},
      {sfdc: 'End_Date__c'},
      {sfdc: 'Applicable_Divisons__c'},
      {sfdc: 'Status__c'},
      {sfdc: 'Type__c'},
      {sfdc: 'Activity_Type__c'},
      {sfdc: 'Applicable_Laboratories__c'}
    ];

    CampaignBrandActivityModel.mapModel();
    return CampaignBrandActivityModel;
  }

  abbottApp.factory('campaignBrandActivityModel', [
    'utils',
    'entityModel',
    campaignBrandActivityModel
  ]);
})();