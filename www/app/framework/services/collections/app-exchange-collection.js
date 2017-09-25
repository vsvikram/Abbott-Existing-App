(function () {
    function AppExchangeCollectionFn(utils, entityCollection, appExchangeModel) {
        var AppExchangeCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            AppExchangeCollection.super.constructor.apply(this, arguments);
        };
        AppExchangeCollection = utils.extend(AppExchangeCollection, entityCollection);

        AppExchangeCollection.prototype.model = appExchangeModel;

        AppExchangeCollection.prototype.prepareServerConfig = function (configPromise) {
           return configPromise.then(function (config) {
                                   return config;
                               });
        };

        return AppExchangeCollection;
    }

    abbottApp.factory('appExchangeCollection', [
      'utils',
      'entityCollection',
      'appExchangeModel',
      AppExchangeCollectionFn
    ]);
})();
