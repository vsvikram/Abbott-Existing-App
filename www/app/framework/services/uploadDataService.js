(function () {
    function uploadDataService(
            $q,
            utils,
            sfdcAccount,
            dcrCollection,
            dcrBrandActivityCollection,
            dcrJunctionCollection,
            dcrDropCollection,
            materialTransactionCollection,
            dcrKeyMessageCollection,
            dcrFollowupActivityCollection,
            dcrJFWCollection,
            dcrKpiDataCollection,
            expenseCollection,
            expenseDetailsCollection,
            entityCollection) {

       var UploadDataService = function () {
            this.uploadData = {};
             this.syncUp = utils.bind(this.syncUp, this);
             this._addToUploadCollection = utils.bind(this._addToUploadCollection, this);
             this._uploadToSFDC = utils.bind(this._uploadToSFDC, this);
             this.getEntitiesForCollection = utils.bind(this.getEntitiesForCollection, this);
             this.generateSyncLogs = utils.bind(this.generateSyncLogs, this);
        };

        UploadDataService = utils.extend(UploadDataService, entityCollection);

        UploadDataService.prototype._addToUploadCollection = function (object, entities) {
            this.uploadData[object] = entities;
            return entities;
        };

        UploadDataService.prototype.syncUp = function () {
                    counter = 0;
                    return $q.all([this.getEntitiesForCollection(dcrCollection),
                    this.getEntitiesForCollection(dcrJunctionCollection),
                    this.getEntitiesForCollection(dcrBrandActivityCollection),
                    this.getEntitiesForCollection(dcrJunctionCollection,true),
                    this.getEntitiesForCollection(dcrBrandActivityCollection,true),
                    this.getEntitiesForCollection(dcrDropCollection),
                    this.getEntitiesForCollection(materialTransactionCollection),
                    this.getEntitiesForCollection(dcrKeyMessageCollection),
                    this.getEntitiesForCollection(dcrFollowupActivityCollection),
                    this.getEntitiesForCollection(dcrJFWCollection),
                    this.getEntitiesForCollection(dcrKpiDataCollection),
                    this.getEntitiesForCollection(expenseCollection),
                    this.getEntitiesForCollection(expenseDetailsCollection)
                    ])
                    .then(this._uploadToSFDC);
                };

         UploadDataService.prototype.generateSyncLogs = function(){
          var generateLogs = true;
                     if (generateLogs) {
                         var data = '...';
                         // your data, could be useful JSON.stringify to convert an object to JSON string
                         window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (directoryEntry) {
                             directoryEntry.getFile('abbott_log.txt', {
                                 create: true
                             }, function (fileEntry) {
                                 fileEntry.createWriter(function (fileWriter) {
                                     fileWriter.onwriteend = function (result) {
                                         //console.log( 'done.' );
                                     };
                                     fileWriter.onerror = function (error) {
                                         console.log(error);
                                     };
                                     fileWriter.write(data);
                                 }, function (error) {
                                     console.log(error);
                                 });
                             }, function (error) {
                                 console.log(error);
                             });
                         }, function (error) {
                             console.log(error);
                         });
                     }
          };

        UploadDataService.prototype.getEntitiesForCollection = function (collection, isSymposia) {
            var collectionInstance = new collection(isSymposia);
            return collectionInstance.fetchEntitiesForUpload()
                .then(function(entities){
                if(entities && entities.length){
                    return entities.map(function(entity){
                        var updateEntity = collectionInstance.model.getAttributes(entity);
                        if(typeof updateEntity.Id === 'undefined')
                            updateEntity.Id = entity.Id;
                        if(typeof updateEntity.Id === 'undefined')
                            updateEntity.Id = entity._soupEntryId;
                        return updateEntity;
                    });
                    }
                })

                .then(function (entities) {
                    var objectName = collectionInstance.model.tableSpec.sfdc.replace('__c','');
                    if(isSymposia)
                        objectName +='_Symposia';
                        this.generateSyncLogs();
                    return this._addToUploadCollection(objectName, entities);
                }.bind(this));
        };

        UploadDataService.prototype.apexrest = '/v1/mobileSyncService';

        UploadDataService.prototype._uploadToSFDC = function () {
            var deferred = $q.defer();
            var payLoad = {'mobileDataWrapper':this.uploadData};
            sfdcAccount.getSfdcClient()
              .apexrest(this.apexrest, 'POST', JSON.stringify(payLoad), {}, deferred.resolve, deferred.reject);
            return deferred.promise;
        };

        return new UploadDataService;
    }

    abbottApp.service('uploadDataService', [
      '$q',
      'utils',
      'sfdcAccount',
      'dcrCollection',
      'dcrBrandActivityCollection',
      'dcrJunctionCollection',
      'dcrDropCollection',
      'materialTransactionCollection',
      'dcrKeyMessageCollection',
      'dcrFollowupActivityCollection',
      'dcrJFWCollection',
      'dcrKpiDataCollection',
      'expenseCollection',
      'expenseDetailsCollection',
      'entityCollection',
       uploadDataService
    ]);

})();