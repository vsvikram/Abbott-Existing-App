(function () {
    function dcrJunctionCollection($q, utils, entityCollection, dcrJunctionModel, sfdcAccount, DCRCollection, $injector, Query) {
        var DcrJunctionCollection = function (forSymposia) {
            this.forSymposia = !!forSymposia;
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            this.uploadEntitiesQuery = utils.bind(this.uploadEntitiesQuery, this);
            this.onUploadingStarted = utils.bind(this.onUploadingStarted, this);
            this.fetchWithSubmittedDcr = utils.bind(this.fetchWithSubmittedDcr, this);
            this.dcrJunctionTodayCount = utils.bind(this.dcrJunctionTodayCount, this);
            DcrJunctionCollection.super.constructor.apply(this, arguments);
        };
        DcrJunctionCollection = utils.extend(DcrJunctionCollection, entityCollection);

        DcrJunctionCollection.prototype.model = dcrJunctionModel;

        DcrJunctionCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
              .then(function (config) {
                  return sfdcAccount.getCurrentUserId()
                    .then(function (userId) {
                        var innerDcrSelect = "SELECT Id FROM DCR__c";
                        innerDcrSelect += " WHERE Status__c = 'Submitted'";
                        innerDcrSelect += " AND Date__c >= LAST_MONTH";
                        innerDcrSelect += " AND Date__c <= THIS_MONTH";
                        innerDcrSelect += " AND User__c = '" + userId + "'";
                        config += " WHERE DCR__c IN (" + innerDcrSelect + ")";
                        config += " ORDER BY Name ASC";
                        return config;
                    })
              });
        };

        DcrJunctionCollection.prototype.uploadEntitiesQuery = function () {
            return DcrJunctionCollection.super.uploadEntitiesQuery.apply(this, arguments)
              .then(function (query) {
                  var clause = this.forSymposia ? 'whereNotNull' : 'whereNull';
                  return query.and()[clause]('DCR_Brand_Activity__c');
              }.bind(this));
        };

        DcrJunctionCollection.prototype.verifyEntitiesFromSalesforce = function () {

        };

        DcrJunctionCollection.prototype.onUploadingStarted = function (entities) {
            var DCRCollection = $injector.get('dcrCollection'),
                dcrCollectionInstance = new DCRCollection;
            if (entities && entities.length) {
                var localDCRIds = entities.map(function (entity) {
                    return entity['Local_DCR__c'];
                });
                return dcrCollectionInstance.fetchAllWhereIn('_soupEntryId', localDCRIds).then(dcrCollectionInstance.fetchRecursiveFromCursor).then(function (dcrs) {
                    if(dcrs && dcrs.length){
                        var dcrList = dcrs;
                        var deferred = this.updateRelationFieldByCollectionField(entities, DCRCollection, 'DCR__c')
                        if (this.forSymposia) {
                            deferred = deferred
                              .then(function (entities) {
                                  var DCRBrandActivityCollection = $injector.get('dcrBrandActivityCollection');
                                  return this.updateRelationFieldByCollectionField(entities, DCRBrandActivityCollection, 'DCR_Brand_Activity__c');
                              }.bind(this))
                        }
                        deferred.then(function (records) {
                           return records.filter(function (record) {
                               var dcr = dcrList.filter(function (dcrRecord) {
                                   return dcrRecord.Id == record.DCR__c;
                               });
                               return typeof (record['DCR__c']) != 'number' && !!dcr && !!dcr.length && dcr[0].Synced != 'true' && dcr[0].isMobileDCR__c == true ;
                           });
                        });
                        return deferred;
                   }else{
                        return this.removeEntities(entities).then(function(){
                            return [];
                        });
                   }
                }.bind(this));
            } else {
                return true;
            }
        };

        DcrJunctionCollection.prototype.fetchWithSubmittedDcr = function () {
            return this.fetchAllWhere({ 'DCR__r.Status__c': 'Submitted' });
        };
        // TODO :remove copypaste
        DcrJunctionCollection.prototype.dcrJunctionTodayCount = function () {
            var that = this;
            return new DCRCollection().getDcrToday()
              .then(function (dcr) {
                  return dcr ? that._dcrJunctionCountByDcr(dcr) : 0;
              });
        };

        DcrJunctionCollection.prototype.dcrJunctionCountByDate = function (date, customerId) {
            var that = this;
            return new DCRCollection().getDcrByDate(date)
              .then(function (dcr) {
                  return dcr ? that._dcrJunctionCountByDcr(dcr, customerId) : 0;
              });
        };

        DcrJunctionCollection.prototype._dcrJunctionCountByDcr = function (dcr, customerId) {
            var that = this,
              whereRule = { 'DCR__c': dcr.__local__ ? dcr._soupEntryId : dcr.Id };
            if (customerId) {
                whereRule.Account__c = customerId;
            }
            return $q.when(dcr)
              .then(function (dcr) {
                  return new Query()
                  .selectCountFrom(that.model.tableSpec.local)
                  .where(whereRule);
              })
              .then(this.fetchWithQuery)
              .then(this.getEntityFromResponse);
        };


        return DcrJunctionCollection;
    }

    abbottApp.factory('dcrJunctionCollection', [
      '$q',
      'utils',
      'entityCollection',
      'dcrJunctionModel',
      'sfdcAccount',
      'dcrCollection',
      '$injector',
      'query',
      dcrJunctionCollection
    ]);
})();