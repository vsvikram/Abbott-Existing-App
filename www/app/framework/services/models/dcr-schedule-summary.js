(function(){
  function dcrSchedulerSummaryModel(utils, entityModel){
    var DcrSchedulerSummaryModel = function(){
      DcrSchedulerSummaryModel.super.constructor.apply(this, arguments);
    };

    DcrSchedulerSummaryModel = utils.extend(DcrSchedulerSummaryModel, entityModel);

    DcrSchedulerSummaryModel.description = 'DCR Scheduler Summary';

    DcrSchedulerSummaryModel.tableSpec = {
      sfdc: '',
      local: 'DCR__Scheduler_Summary'
    };

    DcrSchedulerSummaryModel.fieldsSpec = [

      {sfdc: 'Query_Index', indexWithType: 'string'},
      {sfdc: 'Month', indexWithType: 'string'},
      {sfdc: 'Year', indexWithType: 'string'},
      {sfdc: 'Field_1', indexWithType: 'string'},
      {sfdc: 'Field_2', indexWithType: 'string'} ,
      {sfdc: 'Field_3', indexWithType: 'string'}
    ];


   DcrSchedulerSummaryModel.localMappingSpec = [
		{'path': 'Synced',  'type': 'string'}
	];

    DcrSchedulerSummaryModel.mapModel();
    return DcrSchedulerSummaryModel;
  }

  abbottApp.factory('dcrSchedulerSummaryModel', [
    'utils',
    'entityModel',
    dcrSchedulerSummaryModel
  ]);
})();