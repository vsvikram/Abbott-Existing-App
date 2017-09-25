(function(){
  function greenFlagModel(utils, entityModel){
    var GreenFlagModel = function(){
      GreenFlagModel.super.constructor.apply(this, arguments);
    };

    GreenFlagModel = utils.extend(GreenFlagModel, entityModel);
    GreenFlagModel.description = 'Green Flag';
    GreenFlagModel.tableSpec = {
      sfdc: 'DCR__c',
      local: 'get_greenFlagQuery'
    };

    GreenFlagModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Date__c', indexWithType: 'string'}
    ];

    GreenFlagModel.mapModel();
    return GreenFlagModel;
  }

  abbottApp.factory('greenFlagModel', [
    'utils',
    'entityModel',
    greenFlagModel
  ]);
})();