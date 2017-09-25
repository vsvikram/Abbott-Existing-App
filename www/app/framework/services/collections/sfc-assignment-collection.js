(function(){
  function sfcAssignmentCollection(utils, entityCollection, sfcAssignmentModel, sfdcAccount, targetCollection){
    var SFCAssignmentCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      SFCAssignmentCollection.super.constructor.apply(this, arguments);
    };
    SFCAssignmentCollection = utils.extend(SFCAssignmentCollection, entityCollection);

    SFCAssignmentCollection.prototype.model = sfcAssignmentModel;

    SFCAssignmentCollection.prototype.prepareServerConfig = function(configPromise){
      return configPromise
        .then(function(config){
          return sfdcAccount.getCurrentUserId()
            .then(function(userId){
            var targetCollectionInstance = new targetCollection();
            return targetCollectionInstance.fetchAll().then(targetCollectionInstance.fetchRecursiveFromCursor).then(function(targets){
            var targetIdList = targets.map(function(target){
            return "'"+target.Territory__c+"'";
            }).join(',');
            targetIdList = targetIdList || "''";
             config += " WHERE Territory_Code__c  IN ("+targetIdList+ ")";
             config += " AND Active__c = true";
              return config;
              })
           })
        });
    };

    return SFCAssignmentCollection;
  }

  abbottApp.factory('sfcAssignmentCollection', [
    'utils',
    'entityCollection',
    'sfcAssignmentModel',
    'sfdcAccount',
    'targetCollection',
    sfcAssignmentCollection
  ]);
})();
