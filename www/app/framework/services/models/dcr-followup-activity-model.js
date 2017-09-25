(function(){
  function dcrFollowupActivityModel(utils, entityModel){
    var DcrFollowupActivityModel = function(){
      DcrFollowupActivityModel.super.constructor.apply(this, arguments);
    };

    DcrFollowupActivityModel = utils.extend(DcrFollowupActivityModel, entityModel);
    DcrFollowupActivityModel.description = 'DCR Followup Activity';
    DcrFollowupActivityModel.tableSpec = {
      sfdc: 'DCR_Followup_Activity__c',
      local: 'DCR_Followup_Activity__c'
    };

    DcrFollowupActivityModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'DCR_Junction__c', indexWithType: 'string', upload: true},
      {sfdc: 'Name', upload: true},
      {sfdc: 'Date__c', upload: true},
      {sfdc: 'Comment__c', upload: true},
      {sfdc: 'Subject__c', upload: true},
      {sfdc: 'Sequence_Number__c', upload: true}
    ];

    DcrFollowupActivityModel.localMappingSpec = [
		{'path': 'Local_DCR_Junction__c', 'type': 'string'}
    ];

    DcrFollowupActivityModel.mapModel();
    return DcrFollowupActivityModel;
  }

  abbottApp.factory('dcrFollowupActivityModel', [
    'utils',
    'entityModel',
    dcrFollowupActivityModel
  ]);
})();