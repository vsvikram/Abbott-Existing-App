(function(){
  function territoryModel(utils, entityModel){
    var TerritoryModel = function(){
      TerritoryModel.super.constructor.apply(this, arguments);
    };

    TerritoryModel = utils.extend(TerritoryModel, entityModel);

    TerritoryModel.description = 'Territory';
    TerritoryModel.tableSpec = {
      sfdc: 'Territory',
      local: 'Territory'
    };

    TerritoryModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Company_Code__c', indexWithType: 'string'},
      {sfdc: 'Description'},
      {sfdc: 'Divison_Code__c'},
      {sfdc: 'HQ__c', indexWithType: 'string'},
      {sfdc: 'Level__c'},
      {sfdc: 'Name'},
      {sfdc: 'Territory_Type__c'},
      {sfdc: 'Zone__c '},
      {sfdc: 'ParentTerritoryId'}
    ];

    TerritoryModel.mapModel();
    return TerritoryModel;
  }

  abbottApp.factory('territoryModel', [
    'utils',
    'entityModel',
    territoryModel
  ]);
})();