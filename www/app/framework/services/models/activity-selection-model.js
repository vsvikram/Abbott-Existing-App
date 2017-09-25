(function(){
  function activitySelectionModel(utils, entityModel){
    var ActivitySelectionModel = function(){
      ActivitySelectionModel.super.constructor.apply(this, arguments);
    };

    ActivitySelectionModel = utils.extend(ActivitySelectionModel, entityModel);
    ActivitySelectionModel.description = 'Activity Selection';
    ActivitySelectionModel.tableSpec = {
      sfdc: '',
      local: 'ActivitySelection'
    };

    ActivitySelectionModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Activity1__c'},
      {sfdc: 'Activity2__c'},
      {sfdc: 'Date__c', indexWithType: 'string'},
      {sfdc: 'Activity_Selection__c'}
    ];

    ActivitySelectionModel.mapModel();
    return ActivitySelectionModel;
  }

  abbottApp.factory('activitySelectionModel', [
    'utils',
    'entityModel',
    activitySelectionModel
  ]);
})();