(function(){
  function territoryCollection(utils, entityCollection,territoryModel,userTerritoryCollection){
    var TerritoryCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      TerritoryCollection.super.constructor.apply(this, arguments);
    };
    TerritoryCollection = utils.extend(TerritoryCollection, entityCollection);

    TerritoryCollection.prototype.model = territoryModel;

    TerritoryCollection.prototype.prepareServerConfig = function(configPromise){
     return configPromise
             .then(function(config){
              var userTerritoryCollectionInstance = new userTerritoryCollection();
              return userTerritoryCollectionInstance.fetchAll()
              .then(userTerritoryCollectionInstance.fetchRecursiveFromCursor)
               .then(function(territories){
               var userTerritories = territories.map(function(territory){
                 return "'" + territory.TerritoryId+ "'";
               }).join(',');
                userTerritories = userTerritories || "''";
                config += " WHERE Id IN (" + userTerritories + ")" ;
                return config;
                })
                });
    };

    return TerritoryCollection;
  }

  abbottApp.factory('territoryCollection', [
    'utils',
    'entityCollection',
    'territoryModel',
    'userTerritoryCollection',
    territoryCollection
  ]);
})();