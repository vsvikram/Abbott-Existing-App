(function () {
    function attachmentCollection(utils, entityCollection, attachmentModel, sfdcAccount, expenseDetailsCollection) {
        var AttachmentCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            this.onUploadingStarted = utils.bind(this.onUploadingStarted, this);
            this.onUploadingFinished = utils.bind(this.onUploadingFinished, this);
            AttachmentCollection.super.constructor.apply(this, arguments);
        };

        AttachmentCollection = utils.extend(AttachmentCollection, entityCollection);

        AttachmentCollection.prototype.model = attachmentModel;

        AttachmentCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise;
        };

        AttachmentCollection.prototype.updateAttachmentId = function(res){
        this.res = res;
         var self = this;

            if(res.ExpenseDetailsList && res.ExpenseDetailsList.length){
                   return self.fetchEntitiesForUpload().then(function (entities) {
                       var entitiesToUpdate = entities.filter(function (entity) {
                                return typeof entity.Id !== 'number';
                           });
                       if(entitiesToUpdate && entitiesToUpdate.length){
                         angular.forEach(self.res.ExpenseDetailsList,function(value,key){                 
                            angular.forEach(entities,function(entity){
                                if(entity.ParentId == key){
                                    entity.ParentId = value;
                                    console.log(value + 'value-key' + key);
                                }
                            })
                         })
                       }
               });
            }
        };

        AttachmentCollection.prototype.onUploadingStarted = function (entities) {
            if (entities && entities.length) {
                return this.updateRelationFieldByCollectionField(entities, expenseDetailsCollection, 'ParentId').then(function (records) {
                    return records.filter(function (record) {
                        return typeof (record['ParentId']) != 'number';
                    });
                });
            } else {
                return entities;
            }
        };

        AttachmentCollection.prototype.onUploadingFinished = function (entities) {
            var that = this;
            entities = entities.map(function (entity) {
                return angular.extend(entity, that.localModificationForEntity(entity, null, false, false));
            });
            return this.upsertLoadedEntities(entities);
        };

        return AttachmentCollection;
    }

    abbottApp.factory('attachmentCollection', ['utils', 'entityCollection', 'attachmentModel', 'sfdcAccount', 'expenseDetailsCollection', attachmentCollection]);
})();
