(function(){
  function userModel(utils, entityModel){
    var UserModel = function(){
      UserModel.super.constructor.apply(this, arguments);
    };

    UserModel = utils.extend(UserModel, entityModel);

    UserModel.description = 'User';
    UserModel.tableSpec = {
      sfdc: 'User',
      local: 'User__c'
    };

    UserModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'IsActive'},
      {sfdc: 'Name'},
      {sfdc: 'Username'},
      {sfdc: 'CompanyName'},
      {sfdc: 'Division'},
      {sfdc: 'Designation__c'},
      {sfdc: 'MTP_Grace_End_Date__c'},
      {sfdc: 'Mobile_SFE_Display__c'},
      {sfdc: 'Mobile_Login__c'},
      {sfdc: 'HQ__c'},
      {sfdc: 'CLM_User__c'},
      {sfdc: 'Expense_Company__c'},
      {sfdc: 'Expense_Designation__c'},
      {sfdc: 'Alias'}
    ];

    UserModel.mapModel();
    return UserModel;
  }

  abbottApp.factory('userModel', [
    'utils',
    'entityModel',
     userModel
  ]);
})();