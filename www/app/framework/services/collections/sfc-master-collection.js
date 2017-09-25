(function(){
  function sfcMasterCollection(utils, entityCollection, sfcMasterModel, sfcAssignmentCollection){
    var SFCMasterCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      SFCMasterCollection.super.constructor.apply(this, arguments);
    };
    SFCMasterCollection = utils.extend(SFCMasterCollection, entityCollection);

    SFCMasterCollection.prototype.model = sfcMasterModel;

    SFCMasterCollection.prototype.prepareServerConfig = function(configPromise){
      return configPromise
        .then(function(config){
        var sfcAssignmentCollectionInstance = new sfcAssignmentCollection();
          return sfcAssignmentCollectionInstance.fetchAll()
            .then(sfcAssignmentCollectionInstance.fetchRecursiveFromCursor)
             .then(function(assignments){
             var userAssignments = assignments.map(function(assignment){
                             return "'" + assignment.SFC_Code__c+ "'";
                           }).join(',');
                           userAssignments = userAssignments || "''";
                           config += "  WHERE SFC_Code__c IN (" + userAssignments + ") ";
                           return config;
            })
        });
    };

    return SFCMasterCollection;
  }

  abbottApp.factory('sfcMasterCollection', [
    'utils',
    'entityCollection',
    'sfcMasterModel',
    'sfcAssignmentCollection',
    sfcMasterCollection
  ]);
})();