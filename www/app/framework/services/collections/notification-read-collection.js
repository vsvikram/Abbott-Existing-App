(function () {
    function notificationReadCollection(Query, utils, entityCollection, notificationReadModel, sfdcAccount, syncLog, $cordovaAppVersion, $cordovaDevice) {
        var NotificationReadCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            NotificationReadCollection.super.constructor.apply(this, arguments);
        };
        NotificationReadCollection = utils.extend(NotificationReadCollection, entityCollection);

        NotificationReadCollection.prototype.model = notificationReadModel;

        NotificationReadCollection.prototype.prepareServerConfig = function (configPromise) {
                    return configPromise.then(function (config) {
                        return sfdcAccount.getCurrentUserId().then(function (userId) {
                            config += " WHERE User__c = '" + userId + "' ";
                            return config;
                        });
                    });
                };

        return NotificationReadCollection;
    }

    abbottApp.factory('notificationReadCollection', [
      'query',
      'utils',
      'entityCollection',
      'notificationReadModel',
      'sfdcAccount',
      'syncLog',
      '$cordovaAppVersion',
      '$cordovaDevice',
      notificationReadCollection
    ]);
})();