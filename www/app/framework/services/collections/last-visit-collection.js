(function () {
    function lastVisitCollection(utils, entityCollection, lastVisitModel, sfdcAccount) {
        var LastVisitCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            LastVisitCollection.super.constructor.apply(this, arguments);
        };
        LastVisitCollection = utils.extend(LastVisitCollection, entityCollection);

        LastVisitCollection.prototype.model = lastVisitModel;

        LastVisitCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
              .then(function (config) {
                  return sfdcAccount.getCurrentUserId()
                    .then(function (userId) {
                        config += " WHERE Target__r.User__c='" + userId + "'";
                        config += " ORDER BY Name ASC";
                        return config;
                    })
              });
        };

        return LastVisitCollection;
    }

    abbottApp.factory('lastVisitCollection', [
      'utils',
      'entityCollection',
      'lastVisitModel',
      'sfdcAccount',
      lastVisitCollection
    ]);
})();