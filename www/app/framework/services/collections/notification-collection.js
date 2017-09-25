(function () {
    function notificationCollection(Query, utils, entityCollection, notificationModel, sfdcAccount, syncLog, $cordovaAppVersion, $cordovaDevice) {
        var NotificationCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            NotificationCollection.super.constructor.apply(this, arguments);
        };
        NotificationCollection = utils.extend(NotificationCollection, entityCollection);

        NotificationCollection.prototype.model = notificationModel;

        NotificationCollection.prototype.prepareServerConfig = function (configPromise) {
                    return configPromise.then(function (config) {
                        return sfdcAccount.getCurrentUserId().then(function (userId) {
                            config += " WHERE ((Name_of_User__c = '" + userId + "' AND Category__c = 'SMS') OR Category__c ='App') AND CreatedDate>=LAST_N_DAYS:30 ORDER BY CreatedDate DESC";
                            return config;
                        });
                    });
                };

        return NotificationCollection;
    }

    abbottApp.factory('notificationCollection', [
      'query',
      'utils',
      'entityCollection',
      'notificationModel',
      'sfdcAccount',
      'syncLog',
      '$cordovaAppVersion',
      '$cordovaDevice',
      notificationCollection
    ]);
})();