(function(){
  function mtpModel(utils, entityModel){
    var MTPModel = function(){
      MTPModel.super.constructor.apply(this, arguments);
    };

    MTPModel = utils.extend(MTPModel, entityModel);
    MTPModel.description = 'MTP';
    MTPModel.tableSpec = {
      sfdc: 'MTP__c',
      local: 'MTP__c'
    };

    MTPModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Date__c'},
      {sfdc: 'Status__c'},
      {sfdc: 'Target__c'}
    ];

    MTPModel.mapModel();
    return MTPModel;
  }

  abbottApp.factory('mtpModel', [
    'utils',
    'entityModel',
    mtpModel
  ]);
})();