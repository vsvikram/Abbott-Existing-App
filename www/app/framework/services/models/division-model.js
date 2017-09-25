(function(){
  function divisionModel(utils, entityModel){
    var DivisionModel = function(){
      DivisionModel.super.constructor.apply(this, arguments);
    };

    DivisionModel = utils.extend(DivisionModel, entityModel);
    DivisionModel.description = 'Division';
    DivisionModel.tableSpec = {
      sfdc: 'Division__c',
      local: 'Division__c'
    };

    DivisionModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Mobile_DCR_Allowed_Till__c'},
      {sfdc: 'Name'},
      {sfdc: 'Weekly_Off__c'},
      {sfdc: 'Hospital_Affiliation__c'},
      {sfdc: 'Mobile_SFE_Allowed__c'},
      {sfdc: 'Mobile_Login__c'},
      {sfdc: 'Division_Name__c'},
      {sfdc: 'Mobile_Claim_applicable__c'},
      {sfdc: 'MobileClaimApplicableDesignations__c '},
      {sfdc: 'Company_Code__c '}
    ];

    DivisionModel.mapModel();
    return DivisionModel;
  }

  abbottApp.factory('divisionModel', [
    'utils',
    'entityModel',
    divisionModel
  ]);
})();