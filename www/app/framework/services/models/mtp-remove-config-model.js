(function(){
  function mtpRemoveConfigModel(utils, entityModel){
    var MTPRemoveConfigModel = function(){
      MTPRemoveConfigModel.super.constructor.apply(this, arguments);
    };

    MTPRemoveConfigModel = utils.extend(MTPRemoveConfigModel, entityModel);
    MTPRemoveConfigModel.description = 'MTP Remove Config';
    MTPRemoveConfigModel.tableSpec = {
      sfdc: '',
      local: 'MTPRemoveConfig'
    };

    MTPRemoveConfigModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Date__c', indexWithType: 'string'}
    ];

    MTPRemoveConfigModel.mapModel();
    return MTPRemoveConfigModel;
  }

  abbottApp.factory('mtpRemoveConfigModel', [
    'utils',
    'entityModel',
    mtpRemoveConfigModel
  ]);
})();