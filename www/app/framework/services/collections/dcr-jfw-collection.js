(function () {
    function dcrJFWCollection(utils, entityCollection, dcrJFWModel, sfdcAccount, DCRCollection, DCRJunctionCollection, DCRBrandActivityCollection, $injector) {
        var DcrJFWCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            this.onUploadingStarted = utils.bind(this.onUploadingStarted, this);
            DcrJFWCollection.super.constructor.apply(this, arguments);
        };
        DcrJFWCollection = utils.extend(DcrJFWCollection, entityCollection);

        DcrJFWCollection.prototype.model = dcrJFWModel;

        DcrJFWCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
              .then(function (config) {
                  return sfdcAccount.getCurrentUserId()
                    .then(function (userId) {
                        var dcrInnerSelect = "SELECT Id FROM DCR__c";
                        dcrInnerSelect += " WHERE Status__c = 'Submitted'";
                        dcrInnerSelect += " AND Date__c >= LAST_MONTH";
                        dcrInnerSelect += " AND Date__c <= THIS_MONTH";
                        dcrInnerSelect += " AND User__c = '" + userId + "'";
                        config += " WHERE DCR__c IN (" + dcrInnerSelect + ")";
                        return config;
                    })
              });
        };

        DcrJFWCollection.prototype.onUploadingStarted = function (entities) {
            var DCRCollection = $injector.get('dcrCollection'),
            dcrCollectionInstance = new DCRCollection;
            if (entities && entities.length) {
                var localDCRIds = entities.map(function (entity) {
                    return entity['Local_DCR__c'];
                });
                return dcrCollectionInstance.fetchAllWhereIn('_soupEntryId', localDCRIds).then(dcrCollectionInstance.fetchRecursiveFromCursor).then(function (dcrs) {
                    if (dcrs && dcrs.length) {
                        var dcrList = dcrs;
                        var deferred = this.updateRelationFieldByCollectionField(entities, DCRCollection, 'DCR__c')
                         .then(function (entities) {
                             return this.updateRelationFieldByCollectionField(entities, DCRJunctionCollection, 'DCR_Junction__c')
                         }.bind(this))
                         .then(function (entities) {
                             return this.updateRelationFieldByCollectionField(entities, DCRBrandActivityCollection, 'Brand_Activity__c')
                         }.bind(this))
                        .then(function (records) {
                            return records.filter(function (record) {
                                var dcr = dcrList.filter(function (dcrRecord) {
                                    return dcrRecord.Id == record.DCR__c;
                                });
                                return typeof (record['DCR__c']) != 'number' && !!dcr && !!dcr.length && dcr[0].Synced != 'true' && dcr[0].isMobileDCR__c == true ;
                            });
                        });
                        return deferred;
                    } else {
                        return this.removeEntities(entities).then(function(){
                            return [];
                        });
                    }
                }.bind(this))
            }
            else {
                return true;
            }
        };

        return DcrJFWCollection;
    }

    abbottApp.factory('dcrJFWCollection', [
      'utils',
      'entityCollection',
      'dcrJFWModel',
      'sfdcAccount',
      'dcrCollection',
      'dcrJunctionCollection',
      'dcrBrandActivityCollection',
      '$injector',
      dcrJFWCollection
    ]);
})();