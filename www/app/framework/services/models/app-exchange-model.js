(function(){
  function AppExchangeModelFn(utils, entityModel){
    var AppExchangeModel = function(){
      AppExchangeModel.super.constructor.apply(this, arguments);
    };

    AppExchangeModel = utils.extend(AppExchangeModel, entityModel);

    AppExchangeModel.description = 'AppExchange';
    AppExchangeModel.tableSpec = {
      sfdc: 'AppCards__c',
      local: ''
    };

    AppExchangeModel.fieldsSpec = [
		{sfdc: 'Id', indexWithType: 'string'},
		{sfdc: 'Name', indexWithType: 'string'},
		{sfdc: 'AppCard_Image_Link__c', indexWithType: 'string'},
		{sfdc: 'App_Date__c' , indexWithType: 'string'},
		{sfdc: 'App_Name__c' , indexWithType: 'string'},
		{sfdc: 'Category__c' , indexWithType: 'string'},
		{sfdc: 'File_Size__c' , indexWithType: 'string'},
		{sfdc: 'Installed__c' , indexWithType: 'string'},
		{sfdc: 'Rating__c', indexWithType: 'string'}
    ];

    AppExchangeModel.mapModel();
    return AppExchangeModel;
  }

  abbottApp.factory('appExchangeModel', [
    'utils',
    'entityModel',
    AppExchangeModelFn
  ]);
})();
