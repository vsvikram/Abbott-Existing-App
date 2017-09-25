(function () {
    function dcrLockingCollection(utils, entityCollection, dcrLockingModel, userCollection) {
        var DcrLockingCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            DcrLockingCollection.super.constructor.apply(this, arguments);
        };
        DcrLockingCollection = utils.extend(DcrLockingCollection, entityCollection);

        DcrLockingCollection.prototype.model = dcrLockingModel;

        DcrLockingCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
              .then(function (config) {
                  return new userCollection().getActiveUser()
                    .then(function (activeUser) {
                        config += " WHERE Division__c = '" + activeUser.Division + "'";
                        config += " AND Level__c = '" + activeUser.Designation__c + "'";
                        config += " AND Type__c = 'DCR locking days'";
                        return config;
                    })
              });
        };

        return DcrLockingCollection;
    }

    abbottApp.factory('dcrLockingCollection', [
      'utils',
      'entityCollection',
      'dcrLockingModel',
      'userCollection',
      dcrLockingCollection
    ]);
})();