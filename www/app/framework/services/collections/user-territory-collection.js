(function(){
  function userTerritoryCollection($q, $rootScope, utils, entityCollection, userTerritoryModel, sfdcAccount){
    var UserTerritoryCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      UserTerritoryCollection.super.constructor.apply(this, arguments);
    };
    UserTerritoryCollection = utils.extend(UserTerritoryCollection, entityCollection);

    UserTerritoryCollection.prototype.model = userTerritoryModel;

    UserTerritoryCollection.prototype.prepareServerConfig = function(configPromise){
      return configPromise
        .then(function(config){
          return sfdcAccount.getCurrentUserId()
            .then(function(userId){
              config += " WHERE userId = '" + userId + "'";
              return config;
            })
        });
    };
   return UserTerritoryCollection;
  }

  abbottApp.factory('userTerritoryCollection', [
    '$q',
    '$rootScope',
    'utils',
    'entityCollection',
    'userTerritoryModel',
    'sfdcAccount',
    userTerritoryCollection
  ]);
})();