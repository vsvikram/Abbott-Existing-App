(function () {
    function dcrKeyMessageCollection(utils, entityCollection, dcrKeyMessageModel, DCRJunctionCollection) {
        var DcrKeyMessageCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            this.onUploadingStarted = utils.bind(this.onUploadingStarted, this);
            DcrKeyMessageCollection.super.constructor.apply(this, arguments);
        };
        DcrKeyMessageCollection = utils.extend(DcrKeyMessageCollection, entityCollection);

        DcrKeyMessageCollection.prototype.model = dcrKeyMessageModel;

        DcrKeyMessageCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
              .then(function (config) {
                  var junctionCollection = new DCRJunctionCollection();
                  return junctionCollection.fetchWithSubmittedDcr()
                    .then(junctionCollection.fetchRecursiveFromCursor)
                    .then(function (dcrJunctions) {
                        if (dcrJunctions && dcrJunctions.length) {
                            var dcrIds = this.mapEcranisedFields(dcrJunctions, 'DCR__c');
                            var dcrIdsString = utils.uniqueElements(dcrIds).join(',');
                            config += " WHERE DCR_Junction__c IN (select id from DCR_Junction__c where DCR__c in (" + dcrIdsString + "))";
                        } else {
                            config += " LIMIT 0";
                        }
                        return config;
                    }.bind(this))
              }.bind(this));
        };

        DcrKeyMessageCollection.prototype.onUploadingStarted = function (entities) {
            return this.updateRelationFieldByCollectionField(entities, DCRJunctionCollection, 'DCR_Junction__c')
              .then(function (records) {
                  return records.filter(function (record) {
                      return typeof (record['DCR_Junction__c']) != 'number';
                  });
              })
        };

        return DcrKeyMessageCollection;
    }

    abbottApp.factory('dcrKeyMessageCollection', [
      'utils',
      'entityCollection',
      'dcrKeyMessageModel',
      'dcrJunctionCollection',
      dcrKeyMessageCollection
    ]);
})();