(function(){
  function materialLotModel(utils, entityModel){
    var MaterialLotModel = function(){
      MaterialLotModel.super.constructor.apply(this, arguments);
    };

    MaterialLotModel = utils.extend(MaterialLotModel, entityModel);
    MaterialLotModel.description = 'Material Lot';
    MaterialLotModel.tableSpec = {
      sfdc: 'Material_Lot__c',
      local: 'Material_Lot'
    };

    MaterialLotModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Batch_code__c'},
      {sfdc: 'Brand__c'},
      {sfdc: 'Material_Code__c'},
      {sfdc: 'Material_Name__c'},
      {sfdc: 'In_Hand_Quantity__c'},
      {sfdc: 'Active__c'},
      {sfdc: 'Default_Quantity__c'}
    ];

    MaterialLotModel.mapModel();
    return MaterialLotModel;
  }

  abbottApp.factory('materialLotModel', [
    'utils',
    'entityModel',
    materialLotModel
  ]);
})();