(function(){
  function sfcAssignmentModel(utils, entityModel){
    var SFCAssignmentModel = function(){
      SFCAssignmentModel.super.constructor.apply(this, arguments);
    };

    SFCAssignmentModel = utils.extend(SFCAssignmentModel, entityModel);

    SFCAssignmentModel.description = 'SFC Assignment';
    SFCAssignmentModel.tableSpec = {
      sfdc: 'SFC_Assignment__c',
      local: 'SFC_Assignment__c'
    };

    SFCAssignmentModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Active__c'},
      {sfdc: 'Division_Code__c'},
      {sfdc: 'Division_Name__c'},
      {sfdc: 'Market_Type__c'},
      {sfdc: 'SFC_Code__c', indexWithType: 'string'},
      {sfdc: 'SFC_Master__c', indexWithType: 'string'},
      {sfdc: 'Target__c', indexWithType: 'string'},
      {sfdc: 'Territory_Code__c', indexWithType: 'string'},
      {sfdc: 'Territory_Name__c'},
     // {sfdc: 'Hill_Station_Applicable__c'},
      {sfdc: 'User__c'},
      {sfdc: 'SFC_Master__r.From_Market__c'},
      {sfdc: 'SFC_Master__r.To_Market__c'},
      {sfdc: 'SFC_Master__r.One_way_distance_in_kms__c'},
      {sfdc: 'Mode_of_Travel__c'}
    ];
    
    SFCAssignmentModel.mapModel();
    return SFCAssignmentModel;
  }

  abbottApp.factory('sfcAssignmentModel', [
    'utils',
    'entityModel',
    sfcAssignmentModel
  ]);
})();