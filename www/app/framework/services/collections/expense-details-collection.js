(function () {
    function expenseDetailsCollection(utils, entityCollection, expenseDetailsModel, expenseCollection) {
        var ExpenseDetailsCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            this.onUploadingStarted = utils.bind(this.onUploadingStarted, this);
            ExpenseDetailsCollection.super.constructor.apply(this, arguments);
        };
        ExpenseDetailsCollection = utils.extend(ExpenseDetailsCollection, entityCollection);

        ExpenseDetailsCollection.prototype.model = expenseDetailsModel;

        ExpenseDetailsCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise.then(function (config) {
                var expenseCollectionInstance = new expenseCollection();
                return expenseCollectionInstance.fetchAll().then(expenseCollectionInstance.fetchRecursiveFromCursor).then(function (expenses) {
                    var userExpenses = expenses.filter(function (entity) {
                        return typeof entity.Id !== 'number';
                    }).map(function (expense) {
                        return "'" + expense.Id + "'";
                    }).join(',');
                    userExpenses = userExpenses || "''";
                    config += "  WHERE Expense__c IN (" + userExpenses + ")";
                    return config;
                })
            });
        };

        ExpenseDetailsCollection.prototype.onUploadingStarted = function (entities) {
            var deferred = this.updateRelationFieldByCollectionField(entities, expenseCollection, 'Expense__c').then(function (records) {
                return records.filter(function (record) {
                    return typeof (record['Expense__c']) != 'number';
                });
            });
            return deferred;
        };

        return ExpenseDetailsCollection;
    };

    abbottApp.factory('expenseDetailsCollection', ['utils', 'entityCollection', 'expenseDetailsModel', 'expenseCollection', expenseDetailsCollection]);
})();