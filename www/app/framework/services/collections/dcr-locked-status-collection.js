(function () {
    function dcrLockedStatusCollection(utils, entityCollection, dcrLockedStatusModel, sfdcAccount) {
        var DcrLockedStatusCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            this.getDcrLockedStatus = utils.bind(this.getDcrLockedStatus, this);
            DcrLockedStatusCollection.super.constructor.apply(this, arguments);
        };
        DcrLockedStatusCollection = utils.extend(DcrLockedStatusCollection, entityCollection);

        DcrLockedStatusCollection.prototype.model = dcrLockedStatusModel;

        DcrLockedStatusCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
              .then(function (config) {
                  return sfdcAccount.getCurrentUserId()
                    .then(function (userId) {
                        config += " WHERE User__c = '" + userId + "'";
                        config += " ORDER BY CreatedDate DESC";
                        config += " LIMIT 1";
                        return config;
                    })
              });
        };

        DcrLockedStatusCollection.prototype.getDcrLockedStatus = function () {
            return this.fetchAll()
              .then(this.getEntityFromResponse);
        };

        return DcrLockedStatusCollection;
    }

    abbottApp.factory('dcrLockedStatusCollection', [
      'utils',
      'entityCollection',
      'dcrLockedStatusModel',
      'sfdcAccount',
      dcrLockedStatusCollection
    ]);
})();