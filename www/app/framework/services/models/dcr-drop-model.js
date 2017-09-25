(function(){
  function dcrDropModel(utils, entityModel){
    var DcrDropModel = function(){
      DcrDropModel.super.constructor.apply(this, arguments);
    };

    DcrDropModel = utils.extend(DcrDropModel, entityModel);
    DcrDropModel.description = 'DCR Drop';
    DcrDropModel.tableSpec = {
      sfdc: 'DCR_Drop__c',
      local: 'DCR_Drop__c'
    };

    DcrDropModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'DCR__c', indexWithType: 'string', upload: true},
      {sfdc: 'Name', upload: true},
      {sfdc: 'DCR_Junction__c', indexWithType: 'string', upload: true},
      {sfdc: 'Divisionwise_Brand__c', upload: true},
      {sfdc: 'Brand_Activity__c', indexWithType: 'string', upload: true},
      {sfdc: 'Material_Lot__c', upload: true},
      {sfdc: 'Quantity__c', upload: true},
      {sfdc: 'Sequence_Number__c', upload: true}
    ];

    DcrDropModel.localMappingSpec = [
		{'path': 'Local_DCR__c',  'type': 'string'},
		{'path': 'Local_DCR_Junction__c', 'type': 'string'},
		{'path': 'Local_Brand_Activity__c',  'type': 'string'}
    ];

    DcrDropModel.mapModel();
    return DcrDropModel;
  }

  abbottApp.factory('dcrDropModel', [
    'utils',
    'entityModel',
    dcrDropModel
  ]);
})();