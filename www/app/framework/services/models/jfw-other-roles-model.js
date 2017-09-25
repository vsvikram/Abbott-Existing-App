(function(){
  function jfwOtherRolesModel(utils, entityModel){
    var JFWOtherRolesModel = function(){
      JFWOtherRolesModel.super.constructor.apply(this, arguments);
    };

    JFWOtherRolesModel = utils.extend(JFWOtherRolesModel, entityModel);
    JFWOtherRolesModel.description = 'JFW Other Roles';
    JFWOtherRolesModel.tableSpec = {
      sfdc: 'JFW__c',
      local: 'JFW_Other_Roles'
    };

    JFWOtherRolesModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'User__c'},
      {sfdc: 'User__r.Name'},
      {sfdc: 'User__r.Designation__c'}
    ];

    JFWOtherRolesModel.mapModel();
    return JFWOtherRolesModel;
  }

  abbottApp.factory('jfwOtherRolesModel', [
    'utils',
    'entityModel',
    jfwOtherRolesModel
  ]);
})();