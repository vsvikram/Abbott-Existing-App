(function () {
    function keyMessageCollection(utils, entityCollection, keyMessageModel) {
        var KeyMessageCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            KeyMessageCollection.super.constructor.apply(this, arguments);
        };
        KeyMessageCollection = utils.extend(KeyMessageCollection, entityCollection);

        KeyMessageCollection.prototype.model = keyMessageModel;

        KeyMessageCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
              .then(function (config) {
                  config += " WHERE Active__c = true";
                  return config;
              });
        };

        return KeyMessageCollection;
    }

    abbottApp.factory('keyMessageCollection', [
      'utils',
      'entityCollection',
      'keyMessageModel',
      keyMessageCollection
    ]);
})();