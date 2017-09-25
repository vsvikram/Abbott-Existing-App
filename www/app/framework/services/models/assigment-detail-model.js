(function(){
  function assigmentDetailModel(utils, entityModel){
    var AssigmentDetailModel = function(){
      AssigmentDetailModel.super.constructor.apply(this, arguments);
    };

    AssigmentDetailModel = utils.extend(AssigmentDetailModel, entityModel);
    AssigmentDetailModel.description = 'Assignment Detail';
    AssigmentDetailModel.tableSpec = {
      sfdc: 'Assignment__c',
      local: 'Assignment__Details'
    };

    AssigmentDetailModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Target__r.User__r.Name'},
      {sfdc: 'Target__r.Territory__c'},
      {sfdc: 'Account__c'},
      {sfdc: 'Assignment__c'},
      {sfdc: 'Patch__c'},
      {sfdc: 'Market_Type__c'},
      {sfdc: 'Patch_Name__c'},
      {sfdc: 'Account__r.Is_Government_Doctor__c'},
      {sfdc: 'Account__r.Institution_Name__c'},
      {sfdc: 'Account__r.PrivatePermittedPractice__c'},
      {sfdc: 'Account__r.Customer_Code__c'},
      {sfdc: 'Account__r.RecordType.Name'},
      {sfdc: 'Account__r.Name'},
      {sfdc: 'Speciality__c'},
      {sfdc: 'Hospital_Name__c'},
      {sfdc: 'Brand1__c'},
      {sfdc: 'Brand2__c'},
      {sfdc: 'Brand3__c'},
      {sfdc: 'Brand4__c'},
      {sfdc: 'Brand5__c'},
      {sfdc: 'Brand6__c'},
      {sfdc: 'Brand7__c'},
      {sfdc: 'Brand8__c'},
      {sfdc: 'Brand9__c'},
      {sfdc: 'Brand10__c'},
      {sfdc: 'Brand1__r.Name'},
      {sfdc: 'Brand2__r.Name'},
      {sfdc: 'Brand3__r.Name'},
      {sfdc: 'Brand4__r.Name'},
      {sfdc: 'Brand5__r.Name'},
      {sfdc: 'Brand6__r.Name'},
      {sfdc: 'Brand7__r.Name'},
      {sfdc: 'Brand8__r.Name'},
      {sfdc: 'Brand9__r.Name'},
      {sfdc: 'Brand10__r.Name'},
      {sfdc: 'Effective_Date__c'},
      {sfdc: 'Deactivation_Date__c'},
      {sfdc: 'Preferred_STP_Date__c'},
      {sfdc: 'Mobile__c'}
    ];

    AssigmentDetailModel.mapModel();
    return AssigmentDetailModel;
  }

  abbottApp.factory('assigmentDetailModel', [
    'utils',
    'entityModel',
    assigmentDetailModel
  ]);
})();