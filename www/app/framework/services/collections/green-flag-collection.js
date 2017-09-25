(function () {
    function greenFlagCollection(utils, Query, entityCollection, greenFlagModel, sfdcAccount) {
        var GreenFlagCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            this.removeUnscopedQuery = utils.bind(this.removeUnscopedQuery, this);
            this.fetchLastDCRDate = utils.bind(this.fetchLastDCRDate, this);
            GreenFlagCollection.super.constructor.apply(this, arguments);
        };
        GreenFlagCollection = utils.extend(GreenFlagCollection, entityCollection);

        GreenFlagCollection.prototype.model = greenFlagModel;

        GreenFlagCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
              .then(function (config) {
                  return sfdcAccount.getCurrentUserId()
                    .then(function (userId) {
                        var userInnerSelect = "SELECT Id FROM User WHERE IsActive = true AND Id = '" + userId + "'";
                        config += " WHERE Status__c = 'Submitted'";
                        config += " AND User__c IN (" + userInnerSelect + ")";
                        config += " AND Date__c != null";
                        config += " AND Date__c >= LAST_YEAR";
                        config += " ORDER BY DCR__c.Date__c ASC";
                        return config;
                    })
              });
        };

        GreenFlagCollection.prototype.removeUnscopedQuery = function (entities) {
            var actualDates = utils.mapFieldFromCollection(entities, 'Date__c');
            var query = this._fetchAllQuery().whereNotIn('Date__c', actualDates);
            return this.instantPromise(query);
        };

        GreenFlagCollection.prototype.fetchLastDCRDate = function () {
            var query = this._fetchAllQuery().orderBy(['Date__c'], Query.DESC).limit(1);
            return this.fetchWithQuery(query)
              .then(this.getEntityFromResponse);
        };

        return GreenFlagCollection;
    }

    abbottApp.factory('greenFlagCollection', [
      'utils',
      'query',
      'entityCollection',
      'greenFlagModel',
      'sfdcAccount',
      greenFlagCollection
    ]);
})();