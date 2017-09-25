(function () {
    function dailyAllowanceMasterCollection(utils, entityCollection, dailyAllowanceMasterModel, divisionCollection, userCollection) {
        var DailyAllowanceMasterCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            DailyAllowanceMasterCollection.super.constructor.apply(this, arguments);
        };
        DailyAllowanceMasterCollection = utils.extend(DailyAllowanceMasterCollection, entityCollection);

        DailyAllowanceMasterCollection.prototype.model = dailyAllowanceMasterModel;

        DailyAllowanceMasterCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise.then(function (config) {
                var divisionCollectionInstance = new divisionCollection();
                return new userCollection().getActiveUser().then(function (activeUser) {
                    return divisionCollectionInstance.fetchAll().then(divisionCollectionInstance.fetchRecursiveFromCursor).then(function (divisions) {
                        var division = divisions.map(function (divData) {
                            return "'" + divData.Name + "'";
                        }).join(',');
                        division = division || "''";
                        config += "  WHERE Division_Code__c IN (" + division + ")";
                        config += "  AND Active__c = true";
                        config += "  AND Level__c = '" + activeUser.Expense_Designation__c + "'";
                        return config;
                    })
                })
            });
        };

        return DailyAllowanceMasterCollection;
    }


    abbottApp.factory('dailyAllowanceMasterCollection', ['utils', 'entityCollection', 'dailyAllowanceMasterModel', 'divisionCollection', 'userCollection', dailyAllowanceMasterCollection]);
})();