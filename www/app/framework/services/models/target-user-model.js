(function(){
  function targetUserModel(utils, entityModel){
    var TargetUserModel = function(){
      TargetUserModel.super.constructor.apply(this, arguments);
    };

    TargetUserModel = utils.extend(TargetUserModel, entityModel);
    TargetUserModel.description = 'Target User';
    TargetUserModel.tableSpec = {
      sfdc: 'Target__c',
      local: 'Target_User'
    };

    TargetUserModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'User__r.Name'},
      {sfdc: 'User__c'},
      {sfdc: 'User__r.Username'},
      {sfdc: 'User__r.Designation__c'}
    ];

    TargetUserModel.mapModel();
    return TargetUserModel;
  }

  abbottApp.factory('targetUserModel', [
    'utils',
    'entityModel',
    targetUserModel
  ]);
})();