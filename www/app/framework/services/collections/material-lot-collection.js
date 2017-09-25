(function(){
  function materialLotCollection(utils, entityCollection, materialLotModel, sfdcAccount){
    var MaterialLotCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      MaterialLotCollection.super.constructor.apply(this, arguments);
    };
    MaterialLotCollection = utils.extend(MaterialLotCollection, entityCollection);

    MaterialLotCollection.prototype.model = materialLotModel;

    MaterialLotCollection.prototype.prepareServerConfig = function(configPromise){
      return configPromise
        .then(function(config){
          return sfdcAccount.getCurrentUserId()
            .then(function(userId){
              config += " WHERE Owner.Id='" + userId + "'";
              return config;
            })
        });
    };

    return MaterialLotCollection;
  }

  abbottApp.factory('materialLotCollection', [
    'utils',
    'entityCollection',
    'materialLotModel',
    'sfdcAccount',
    materialLotCollection
  ]);
})();