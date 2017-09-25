(function () {
    function associatedAppCollection(Query, utils, entityCollection, associatedAppModel, sfdcAccount, syncLog, $cordovaAppVersion, $cordovaDevice) {
        var AssociatedAppCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);

            AssociatedAppCollection.super.constructor.apply(this, arguments);
        };
        AssociatedAppCollection = utils.extend(AssociatedAppCollection, entityCollection);

        AssociatedAppCollection.prototype.model = associatedAppModel;

        AssociatedAppCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise.then(function (config) {
                return config += " WHERE Status__c = true";
            });
        };

        return AssociatedAppCollection;
    }

    abbottApp.factory('associatedAppCollection', [
      'query',
      'utils',
      'entityCollection',
      'associatedAppModel',
      'sfdcAccount',
      'syncLog',
      '$cordovaAppVersion',
      '$cordovaDevice',
      associatedAppCollection
    ]);
})();