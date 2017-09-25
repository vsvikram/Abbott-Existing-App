(function(){
  function patchMarketJunctionCollection(utils, entityCollection, patchMarketJunctionModel, sfcAssignmentCollection){
    var PatchMarketJunctionCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      PatchMarketJunctionCollection.super.constructor.apply(this, arguments);
    };
    PatchMarketJunctionCollection = utils.extend(PatchMarketJunctionCollection, entityCollection);

    PatchMarketJunctionCollection.prototype.model = patchMarketJunctionModel;

    PatchMarketJunctionCollection.prototype.prepareServerConfig = function(configPromise){
     return configPromise
             .then(function(config){
             var sfcAssignmentCollectionInstance = new sfcAssignmentCollection();
               return sfcAssignmentCollectionInstance.fetchAll()
                 .then(sfcAssignmentCollectionInstance.fetchRecursiveFromCursor)
                  .then(function(assignments){
                  var userAssignments = assignments.map(function(assignment){
                                  return "'" + assignment.Id+ "'";
                                }).join(',');
                                config += "  WHERE 	SFC_Assignment__c IN (" + userAssignments + ")";
                                return config;
                 })
             });
    };

    return PatchMarketJunctionCollection;
  }

  abbottApp.factory('patchMarketJunctionCollection', [
    'utils',
    'entityCollection',
    'patchMarketJunctionModel',
    'sfcAssignmentCollection',
    patchMarketJunctionCollection
  ]);
})();