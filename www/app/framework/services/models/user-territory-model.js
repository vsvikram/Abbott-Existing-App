(function(){
  function userTerritoryModel(utils, entityModel){
    var UserTerritoryModel = function(){
      UserTerritoryModel.super.constructor.apply(this, arguments);
    };

    UserTerritoryModel = utils.extend(UserTerritoryModel, entityModel);

    UserTerritoryModel.description = 'User Territory';
    UserTerritoryModel.tableSpec = {
      sfdc: 'UserTerritory',
      local: 'UserTerritory'
    };

    UserTerritoryModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'IsActive'},
      {sfdc: 'TerritoryId'},
      {sfdc: 'UserId'}
    ];

    UserTerritoryModel.mapModel();
    return UserTerritoryModel;
  }

  abbottApp.factory('userTerritoryModel', [
    'utils',
    'entityModel',
    userTerritoryModel
  ]);
})();