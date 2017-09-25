(function(){
  function orderValueCalculationPreferencesCollection(utils, entityCollection, orderValueCalculationPreferencesModel, userCollection, sfdcAccount){
    var OrderValueCalculationPreferencesCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      OrderValueCalculationPreferencesCollection.super.constructor.apply(this, arguments);
    };
    OrderValueCalculationPreferencesCollection = utils.extend(OrderValueCalculationPreferencesCollection, entityCollection);

    OrderValueCalculationPreferencesCollection.prototype.model = orderValueCalculationPreferencesModel;

    OrderValueCalculationPreferencesCollection.prototype.prepareServerConfig = function(configPromise){
      return configPromise
         .then(function(config){
              return new userCollection().getActiveUser()
                 .then(function(activeUser){
                    config += " WHERE Division__c = '"+activeUser.Division + "'";
                    config += " ORDER BY CreatedDate DESC NULLS LAST LIMIT 1";
                    return config;
                 })
            });
         };
    return OrderValueCalculationPreferencesCollection;
  }

  abbottApp.factory('orderValueCalculationPreferencesCollection', [
    'utils',
    'entityCollection',
    'orderValueCalculationPreferencesModel',
    'userCollection',
    orderValueCalculationPreferencesCollection
  ]);
})();
