(function () {
    function dcrFollowupActivityCollection(utils, entityCollection, dcrFollowupActivityModel, DCRJunctionCollection) {
        var DcrFollowupActivityCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            DcrFollowupActivityCollection.super.constructor.apply(this, arguments);
        };
        DcrFollowupActivityCollection = utils.extend(DcrFollowupActivityCollection, entityCollection);

        DcrFollowupActivityCollection.prototype.model = dcrFollowupActivityModel;

        DcrFollowupActivityCollection.prototype.prepareServerConfig = function (configPromise) {
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

        DcrFollowupActivityCollection.prototype.onUploadingStarted = function (entities) {
            return this.updateRelationFieldByCollectionField(entities, DCRJunctionCollection, 'DCR_Junction__c')
              .then(function (records) {
                  return records.filter(function (record) {
                      return typeof (record['DCR_Junction__c']) != 'number';
                  });
              });
        };

        return DcrFollowupActivityCollection;
    }

    abbottApp.factory('dcrFollowupActivityCollection', [
      'utils',
      'entityCollection',
      'dcrFollowupActivityModel',
      'dcrJunctionCollection',
      dcrFollowupActivityCollection
    ]);
})();