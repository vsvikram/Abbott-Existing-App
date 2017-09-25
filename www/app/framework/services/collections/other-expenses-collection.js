(function(){
  function otherExpensesCollection(utils, entityCollection, otherExpensesModel, userCollection){
    var OtherExpensesCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      OtherExpensesCollection.super.constructor.apply(this, arguments);
    };
    OtherExpensesCollection = utils.extend(OtherExpensesCollection, entityCollection);

    OtherExpensesCollection.prototype.model = otherExpensesModel;

    OtherExpensesCollection.prototype.prepareServerConfig = function(configPromise){
    return configPromise
     .then(function(config){
        return new userCollection().getActiveUser()
             .then(function(activeUser){
                  config += " WHERE Designations_Applicable__c INCLUDES ('"+activeUser.Designation__c+"')";
                  config += " AND Divisions_Applicable__c INCLUDES ('"+ activeUser.Division+ "')";
                  return config;
               })
     });
    };


    return OtherExpensesCollection;
  }

  abbottApp.factory('otherExpensesCollection', [
    'utils',
    'entityCollection',
    'otherExpensesModel',
    'userCollection',
    otherExpensesCollection
  ]);
})();