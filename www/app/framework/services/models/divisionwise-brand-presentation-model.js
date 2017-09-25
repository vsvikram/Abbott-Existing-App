(function(){
  function divisionwiseBrandPresentationModel(utils, entityModel){
    var DivisionwiseBrandPresentationModel = function(){
      DivisionwiseBrandPresentationModel.super.constructor.apply(this, arguments);
    };

    DivisionwiseBrandPresentationModel = utils.extend(DivisionwiseBrandPresentationModel, entityModel);
    DivisionwiseBrandPresentationModel.description = 'Divisionwise Brand Presentation';
    DivisionwiseBrandPresentationModel.tableSpec = {
      sfdc: 'DivisionwiseBrandPresentation__c',
      local: 'Divisionwise_Brand_Presentation'
    };

    DivisionwiseBrandPresentationModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'DivisionwiseBrand__c', indexWithType: 'string'},
      {sfdc: 'Presentation__c'}
    ];

    DivisionwiseBrandPresentationModel.mapModel();
    return DivisionwiseBrandPresentationModel;
  }

  abbottApp.factory('divisionwiseBrandPresentationModel', [
    'utils',
    'entityModel',
    divisionwiseBrandPresentationModel
  ]);
})();