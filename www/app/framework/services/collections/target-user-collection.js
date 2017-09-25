(function(){
  function targetUserCollection(utils, entityCollection, targetUserModel, sfdcAccount){
    var TargetUserCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      TargetUserCollection.super.constructor.apply(this, arguments);
    };
    TargetUserCollection = utils.extend(TargetUserCollection, entityCollection);

    TargetUserCollection.prototype.model = targetUserModel;

    TargetUserCollection.prototype.prepareServerConfig = function(configPromise){
      return configPromise
        .then(function(config){
          return sfdcAccount.getCurrentUserId()
            .then(function(userId){
              var userInnerSelect = "SELECT Id FROM User WHERE IsActive = true AND Id = '" + userId + "'";
              config += " WHERE User__c IN (" + userInnerSelect + ")";
              return config;
            })
        });
    };

    return TargetUserCollection;
  }

  abbottApp.factory('targetUserCollection', [
    'utils',
    'entityCollection',
    'targetUserModel',
    'sfdcAccount',
    targetUserCollection
  ]);
})();