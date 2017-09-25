(function(){
  function otherExpensesEarningCollection(utils, entityCollection, otherExpensesEarningModel, otherExpensesCollection, userCollection){
    var OtherExpensesEarningCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      OtherExpensesEarningCollection.super.constructor.apply(this, arguments);
    };
    OtherExpensesEarningCollection = utils.extend(OtherExpensesEarningCollection, entityCollection);

    OtherExpensesEarningCollection.prototype.model = otherExpensesEarningModel;

    OtherExpensesEarningCollection.prototype.prepareServerConfig = function(configPromise){
    return configPromise
     .then(function(config){
         var otherExpensesCollectionInstance = new otherExpensesCollection();
                     return otherExpensesCollectionInstance.fetchAll().then(otherExpensesCollectionInstance.fetchRecursiveFromCursor).then(function(otherExpenses){
                      var expenses = otherExpenses.map(function(otherExpense){
                      return "'" + otherExpense.Id + "'";
                      }).join(',');
                      expenses = expenses || "''";
                      config += "  WHERE Other_Expense__c IN (" + expenses + ")";
                      return config;
               })
     });
    };


    return OtherExpensesEarningCollection;
  }

  abbottApp.factory('otherExpensesEarningCollection', [
    'utils',
    'entityCollection',
    'otherExpensesEarningModel',
    'otherExpensesCollection',
    'userCollection',
    otherExpensesEarningCollection
  ]);
})();