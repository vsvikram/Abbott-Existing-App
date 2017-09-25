(function(){
  function patchCollection(utils, entityCollection, patchModel, targetCollection){
    var PatchCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      PatchCollection.super.constructor.apply(this, arguments);
    };
    PatchCollection = utils.extend(PatchCollection, entityCollection);

    PatchCollection.prototype.model = patchModel;

    PatchCollection.prototype.prepareServerConfig = function(configPromise){
      return configPromise
        .then(function(config){
          var targetCollectionInstance = new targetCollection();
          return targetCollectionInstance.fetchTargetsByDesignation('TBM')
            .then(targetCollectionInstance.fetchRecursiveFromCursor)
            .then(function(targets){
              var territoryIds = targets.map(function(target){
                return "'" + target.Territory__c + "'";
              }).join(',');
              config += " WHERE Target__r.Territory__c IN (" + territoryIds + ")";
              return config;
            })
        });
    };

    return PatchCollection;
  }

  abbottApp.factory('patchCollection', [
    'utils',
    'entityCollection',
    'patchModel',
    'targetCollection',
    patchCollection
  ]);
})();