(function(){
  function mtpDetailsModel(utils, entityModel){
    var MTPDetailsModel = function(){
      MTPDetailsModel.super.constructor.apply(this, arguments);
    };

    MTPDetailsModel = utils.extend(MTPDetailsModel, entityModel);
    MTPDetailsModel.description = 'MTP Details';
    MTPDetailsModel.tableSpec = {
      sfdc: 'MTP_Junction__c',
      local: 'MTPDetails'
    };

    MTPDetailsModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'MTP_Cycle__r.date__c'},
      {sfdc: 'Activity_Master__r.Name'}
    ];

    MTPDetailsModel.mapModel();
    return MTPDetailsModel;
  }

  abbottApp.factory('mtpDetailsModel', [
    'utils',
    'entityModel',
    mtpDetailsModel
  ]);
})();