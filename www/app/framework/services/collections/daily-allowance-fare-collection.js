(function () {
    function dailyAllowanceFareCollection(utils, entityCollection, dailyAllowanceFareModel, dailyAllowanceMasterCollection, otherExpensesEarningCollection, userCollection) {
        var DailyAllowanceFareCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            DailyAllowanceFareCollection.super.constructor.apply(this, arguments);
        };
        DailyAllowanceFareCollection = utils.extend(DailyAllowanceFareCollection, entityCollection);

        DailyAllowanceFareCollection.prototype.model = dailyAllowanceFareModel;

        DailyAllowanceFareCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
                    .then(function (config) {
                        var dailyAllowanceMasterCollectionInstance = new dailyAllowanceMasterCollection();
                        return new userCollection().getActiveUser()
                         .then(function (activeUser) {
                           //  return dailyAllowanceMasterCollectionInstance.fetchAll()
                            //   .then(dailyAllowanceMasterCollectionInstance.fetchRecursiveFromCursor)
                               //  .then(function (dailyAllowances) {
                                  //   var userAllowances = dailyAllowances.map(function (dailyAllowance) {
                                    //     return "'" + dailyAllowance.Id + "'";
                                   //  }).join(',');
                                  //   userAllowances = userAllowances || "''";
                                   //  config += "  WHERE Expense_Daily_Allowance_Master__c IN (" + userAllowances + ")";
                                     config += " WHERE Expense_Daily_Allowance_Master__r.Active__c = true";
                                     config += " AND Expense_Daily_Allowance_Master__r.Level__c = '" + activeUser.Expense_Designation__c + "'";
                                     config += " AND Expense_Daily_Allowance_Master__r.Division_Code__c = '" + activeUser.Division + "'";
                                     config += " AND (Effective_To_Date__c = NULL OR Effective_To_Date__c >= LAST_MONTH)"
                                     return config;
                                // })
                         })
                    });
        };

        return DailyAllowanceFareCollection;
    }

    abbottApp.factory('dailyAllowanceFareCollection', [
      'utils',
      'entityCollection',
      'dailyAllowanceFareModel',
      'dailyAllowanceMasterCollection',
      'otherExpensesEarningCollection',
      'userCollection',
      dailyAllowanceFareCollection
    ]);
})();

