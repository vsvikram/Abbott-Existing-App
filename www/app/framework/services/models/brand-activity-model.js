(function(){
  function brandActivityModel(utils, entityModel){
    var BrandActivityModel = function(){
      BrandActivityModel.super.constructor.apply(this, arguments);
    };

    BrandActivityModel = utils.extend(BrandActivityModel, entityModel);
    BrandActivityModel.description = 'Brand Activity';
    BrandActivityModel.tableSpec = {
      sfdc: 'Brand_Activity__c',
      local: 'BrandActivities'
    };

    BrandActivityModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Name'},
      {sfdc: 'Government_Doctor__c'},
      {sfdc: 'Institution__c'},
      {sfdc: 'Private_Permitted_Practice__c'},
      {sfdc: 'Campaign__r.Id'}
    ];

    BrandActivityModel.mapModel();
    return BrandActivityModel;
  }

  abbottApp.factory('brandActivityModel', [
    'utils',
    'entityModel',
    brandActivityModel
  ]);
})();