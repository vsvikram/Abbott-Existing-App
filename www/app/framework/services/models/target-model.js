(function(){
  function targetModel(utils, entityModel){
    var TargetModel = function(){
      TargetModel.super.constructor.apply(this, arguments);
    };

    TargetModel = utils.extend(TargetModel, entityModel);

    TargetModel.description = 'Target';
    TargetModel.tableSpec = {
      sfdc: '',
      local: 'Target__c'
    };

    TargetModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'User__c', indexWithType: 'string'},
      {sfdc: 'Territory__c'},
      {sfdc: 'User__r.Name'},
      {sfdc: 'User__r.Designation__c', indexWithType: 'string'},
      {sfdc: 'Parent_Territory__c'},
      {sfdc: 'Territory__r.Division_Code__c'},
      {sfdc: 'Territory__r.Territory_Type_c'}
    ];
    
    TargetModel.mapModel();
    return TargetModel;
  }

  abbottApp.factory('targetModel', [
    'utils',
    'entityModel',
    targetModel
  ]);
})();