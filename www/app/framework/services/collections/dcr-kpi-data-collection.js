(function () {
    function dcrKpiDataCollection(utils, entityCollection, dcrKpiDataModel, DCRCollection, DCRJunctionCollection) {
        var DcrKpiDataCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            DcrKpiDataCollection.super.constructor.apply(this, arguments);
        };
        DcrKpiDataCollection = utils.extend(DcrKpiDataCollection, entityCollection);

        DcrKpiDataCollection.prototype.model = dcrKpiDataModel;

        DcrKpiDataCollection.prototype.onUploadingStarted = function (entities) {
            var that = this,
              dcrCollection = new DCRCollection();
            return dcrCollection.fetchAllWhere({ Status__c: 'Submitted' })
            .then(dcrCollection.fetchRecursiveFromCursor)
            .then(function (dcrEntities) {
                return dcrEntities.map(function (entity) { return entity._soupEntryId });
            })
            .then(function (submittedDCRIds) {
                entities = entities.filter(function (entity) {
                    return submittedDCRIds.indexOf(entity.DCR__c) != -1
                });
                return that.updateRelationFieldByCollectionField(entities, DCRCollection, 'DCR__c')
                  .then(function () {
                      return that.updateRelationFieldByCollectionField(entities, DCRJunctionCollection, 'DCR_Junction__c')
                  });
            });
        };

        return DcrKpiDataCollection;
    }

    abbottApp.factory('dcrKpiDataCollection', [
      'utils',
      'entityCollection',
      'dcrKpiDataModel',
      'dcrCollection',
      'dcrJunctionCollection',
      dcrKpiDataCollection
    ]);
})();