(function () {
    function expenseSAPCodesCollection(utils, entityCollection, expenseSAPCodeModel, userCollection) {
        var ExpenseSAPCodesCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            ExpenseSAPCodesCollection.super.constructor.apply(this, arguments);
        };
        ExpenseSAPCodesCollection = utils.extend(ExpenseSAPCodesCollection, entityCollection);

        ExpenseSAPCodesCollection.prototype.model = expenseSAPCodeModel;

        ExpenseSAPCodesCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
                    .then(function (config) {
                        return new userCollection().getActiveUser().then(function (activeUser) {
                            config += " WHERE Priority__c != null";
                            if (activeUser.CompanyName == '1757')
                                config += " AND AIL__c = true";
                            else
                                config += " AND AHPL__c = true";
                            config += " order by Priority__c";
                            return config;
                        });
                    });
        };

        return ExpenseSAPCodesCollection;
    }

    abbottApp.factory('expenseSAPCodesCollection', [
      'utils',
      'entityCollection',
      'expenseSAPCodeModel',
      'userCollection',
      expenseSAPCodesCollection
    ]);
})();