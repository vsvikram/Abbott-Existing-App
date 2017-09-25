(function(){
  function divisionwiseBrandModel(utils, entityModel){
    var DivisionwiseBrandModel = function(){
      DivisionwiseBrandModel.super.constructor.apply(this, arguments);
    };

    DivisionwiseBrandModel = utils.extend(DivisionwiseBrandModel, entityModel);
    DivisionwiseBrandModel.description = 'Divisionwise Brand';
    DivisionwiseBrandModel.tableSpec = {
      sfdc: 'Divisionwise_Brand__c',
      local: 'Divisionwise_Brand'
    };

    DivisionwiseBrandModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Name'},
      {sfdc: 'Effective_From__c'},
      {sfdc: 'Effective_Till__c'},
      {sfdc: 'Group_Name__c'}
    ];

    DivisionwiseBrandModel.mapModel();
    return DivisionwiseBrandModel;
  }

  abbottApp.factory('divisionwiseBrandModel', [
    'utils',
    'entityModel',
    divisionwiseBrandModel
  ]);
})();