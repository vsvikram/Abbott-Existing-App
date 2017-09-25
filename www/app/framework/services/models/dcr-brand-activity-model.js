(function(){
  function dcrBrandActivityModel(utils, entityModel){
    var DcrBrandActivityModel = function(){
      DcrBrandActivityModel.super.constructor.apply(this, arguments);
    };

    DcrBrandActivityModel = utils.extend(DcrBrandActivityModel, entityModel);
    DcrBrandActivityModel.description = 'DCR Brand Activity';
    DcrBrandActivityModel.tableSpec = {
      sfdc: 'DCR_Brand_Activity__c',
      local: 'DCR_Brand_Activity__c'
    };

    DcrBrandActivityModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Name', upload: true},
      {sfdc: 'Patients_Initiated__c', upload: true},
      {sfdc: 'Brand_Activity__c', upload: true},
      {sfdc: 'Corporate_Initiative__c', indexWithType: 'string', upload: true},
      {sfdc: 'DCR__c', indexWithType: 'string', upload: true},
      {sfdc: 'DCR_Junction__c', indexWithType: 'string', upload: true},
      {sfdc: 'DCR_Junction_Self__c', indexWithType: 'string', upload: true},
      {sfdc: 'Name_of_speaker__c', upload: true},
      {sfdc: 'Number_of_Patients_Added__c', upload: true},
      {sfdc: 'Other_Participants__c', upload: true},
      {sfdc: 'Remarks__c', upload: true},
      {sfdc: 'Sequence_Number__c', upload: true},
      {sfdc: 'No_of_Patients_Screened__c', upload: true},
      {sfdc: 'Laboratory__c', upload: true},
      {sfdc: 'Honorarium_Amount__c', upload: true},
      {sfdc: 'Any_other_cost__c', upload: true}
    ];

	DcrBrandActivityModel.localMappingSpec = [
		{'path': 'Local_DCR__c',  'type': 'string'},
    	{'path': 'Local_DCR_Junction__c', 'type': 'string'},
    	{'path': 'Local_DCR_Junction_Self__c', 'type': 'string'},
		{'path': 'Local_Brand_Activity__c',  'type': 'string'}
	];

    DcrBrandActivityModel.getAttributes = function(entity){
      var attributes = {};
      this.uploadableFields.forEach(function(attrKey){
        attributes[attrKey] = entity[attrKey];
      });
      if(typeof(attributes['DCR_Junction_Self__c']) == 'number'){
        delete attributes['DCR_Junction_Self__c'];
      }
      return attributes;
    };

    DcrBrandActivityModel.mapModel();
    return DcrBrandActivityModel;
  }

  abbottApp.factory('dcrBrandActivityModel', [
    'utils',
    'entityModel',
    dcrBrandActivityModel
  ]);
})();