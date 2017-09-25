(function(){
  function reporteeJFWModel(utils, entityModel){
    var ReporteeJFWModel = function(){
      ReporteeJFWModel.super.constructor.apply(this, arguments);
    };

    ReporteeJFWModel = utils.extend(ReporteeJFWModel, entityModel);
    ReporteeJFWModel.description = 'Reportee JFW';
    ReporteeJFWModel.tableSpec = {
      sfdc: 'DCR_JFW__c',
      local: 'ReporteesJFW'
    };

    ReporteeJFWModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'User1__c'},
      {sfdc: 'User1__r.Designation__c'},
      {sfdc: 'Activity_Master__c'},
      {sfdc: 'DCR__r.Date__c'},
      {sfdc: 'DCR_Junction__r.Account__r.Id'},
      {sfdc: 'DCR_Junction__r.Sequence_Number__c'},
      {sfdc: 'DCR_Junction__r.Name'}
    ];

    ReporteeJFWModel.mapModel();
    return ReporteeJFWModel;
  }

  abbottApp.factory('reporteeJFWModel', [
    'utils',
    'entityModel',
    reporteeJFWModel
  ]);
})();