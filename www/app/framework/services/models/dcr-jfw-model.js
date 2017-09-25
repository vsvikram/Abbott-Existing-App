(function(){
  function dcrJFWModel(utils, entityModel){
    var DcrJFWModel = function(){
      DcrJFWModel.super.constructor.apply(this, arguments);
    };

    DcrJFWModel = utils.extend(DcrJFWModel, entityModel);
    DcrJFWModel.description = 'DCR JFW';
    DcrJFWModel.tableSpec = {
      sfdc: 'DCR_JFW__c',
      local: 'DCR_JFW__c'
    };

    DcrJFWModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'DCR__c', indexWithType: 'string', upload: true},
      {sfdc: 'Name', upload: true},
      {sfdc: 'DCR_Junction__c', indexWithType: 'string', upload: true},
      {sfdc: 'Brand_Activity__c', indexWithType: 'string', upload: true},
      {sfdc: 'User1__c', upload: true},
      {sfdc: 'User2__c', upload: true},
      {sfdc: 'User_Type__c', upload: true},
      {sfdc: 'Activity_Master__c', upload: true},
      {sfdc: 'Sequence_Number__c', upload: true}
    ];

    DcrJFWModel.localMappingSpec = [
		{'path': 'Local_DCR__c',  'type': 'string'},
		{'path': 'Local_DCR_Junction__c', 'type': 'string'},
		{'path': 'Local_Brand_Activity__c',  'type': 'string'}
    ];

    DcrJFWModel.mapModel();
    return DcrJFWModel;
  }

  abbottApp.factory('dcrJFWModel', [
    'utils',
    'entityModel',
    dcrJFWModel
  ]);
})();