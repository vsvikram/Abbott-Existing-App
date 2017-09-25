(function(){
  function lastVisitModel(utils, entityModel){
    var LastVisitModel = function(){
      LastVisitModel.super.constructor.apply(this, arguments);
    };

    LastVisitModel = utils.extend(LastVisitModel, entityModel);
    LastVisitModel.description = 'Last Visit';
    LastVisitModel.tableSpec = {
      sfdc: 'Territory_Specfic_Records__c',
      local: 'LastVisit'
    };

    LastVisitModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Last_Visit_Date__c'},
      {sfdc: 'Account__c'}
    ];

    LastVisitModel.mapModel();
    return LastVisitModel;
  }

  abbottApp.factory('lastVisitModel', [
    'utils',
    'entityModel',
    lastVisitModel
  ]);
})();