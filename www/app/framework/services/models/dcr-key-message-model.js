(function(){
  function dcrKeyMessageModel(utils, entityModel){
    var DcrKeyMessageModel = function(){
      DcrKeyMessageModel.super.constructor.apply(this, arguments);
    };

    DcrKeyMessageModel = utils.extend(DcrKeyMessageModel, entityModel);
    DcrKeyMessageModel.description = 'DCR Key Message';
    DcrKeyMessageModel.tableSpec = {
      sfdc: 'DCR_Key_Message__c',
      local: 'DCR_Key_Message__c'
    };

    DcrKeyMessageModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Name', upload: true},
      {sfdc: 'Key_Message__c', upload: true},
      {sfdc: 'DCR_Junction__c', indexWithType: 'string', upload: true},
      {sfdc: 'Sequence_Number__c', upload: true}
    ];

	DcrKeyMessageModel.localMappingSpec = [
		{'path': 'Local_DCR_Junction__c', 'type': 'string'}
	];

    DcrKeyMessageModel.mapModel();
    return DcrKeyMessageModel;
  }

  abbottApp.factory('dcrKeyMessageModel', [
    'utils',
    'entityModel',
    dcrKeyMessageModel
  ]);
})();