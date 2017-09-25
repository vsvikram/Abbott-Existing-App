(function(){
  function presentationCollection($q, utils, entityCollection, presentationModel, presentationFileManager){
    var PresentationCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      PresentationCollection.super.constructor.apply(this, arguments);
    };
    PresentationCollection = utils.extend(PresentationCollection, entityCollection);

    PresentationCollection.prototype.model = presentationModel;

    PresentationCollection.prototype.onDownloadingFinished = function(records){
      var that = this;
      return this.fetchAllCollectionEntities()
      .then(function(dbEntities){
        var remoteRecordsIds = records.map(function(record){
            return record.Id;
          }),
          unusedEntities = dbEntities.filter(function(dbEntity){
            return remoteRecordsIds.indexOf(dbEntity.Id) == -1
          }),
          idsForRemove = unusedEntities.map(function(entity){
            return entity._soupEntryId;
          }),
          presentationsIds = unusedEntities.map(function(entity){
            return entity.Id;
          });
        return that.removeEntitiesByIds(idsForRemove)
        .then(function(){
          return $q.when(presentationsIds.map(function(presentationId){
            return presentationFileManager.getDirectory(presentationFileManager.getPathToPresentation(presentationId))
              .then(presentationFileManager.removeDirectory);
          }));
        })
        .then(function(){
          return records;
        });
      });
    };

    PresentationCollection.prototype.prepareServerConfig = function(configPromise){
      return configPromise
        .then(function(config){
          config += " WHERE DownloadUrl__c != NULL";
          config += " AND RelatedBrandsCount__c > 0";
          return config;
        });
    };

    return PresentationCollection;
  }

  abbottApp.factory('presentationCollection', [
    '$q',
    'utils',
    'entityCollection',
    'presentationModel',
    'presentationFileManager',
    presentationCollection
  ]);
})();