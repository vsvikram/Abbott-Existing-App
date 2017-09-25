(function(){
  function divisionwiseCompetitorsModel(utils, entityModel){
    var DivisionwiseCompetitorsModel = function(){
      DivisionwiseCompetitorsModel.super.constructor.apply(this, arguments);
    };

    DivisionwiseCompetitorsModel = utils.extend(DivisionwiseCompetitorsModel, entityModel);
    DivisionwiseCompetitorsModel.description = 'Divisionwise Competitor';
    DivisionwiseCompetitorsModel.tableSpec = {
      sfdc: 'Divisionwise_SKU_Competitor__c',
      local: 'DivisionwiseCompetitors'
    };

    DivisionwiseCompetitorsModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Name'},
      {sfdc: 'Divisionwise_Brand__c'},
      {sfdc: 'Material_Code__c'}
    ];

    DivisionwiseCompetitorsModel.mapModel();
    return DivisionwiseCompetitorsModel;
  }

  abbottApp.factory('divisionwiseCompetitorsModel', [
    'utils',
    'entityModel',
    divisionwiseCompetitorsModel
  ]);
})();