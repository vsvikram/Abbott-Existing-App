(function(){
  function mtpCollection(utils, entityCollection, mtpModel, sfdcAccount){
    var MTPCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      MTPCollection.super.constructor.apply(this, arguments);
    };
    MTPCollection = utils.extend(MTPCollection, entityCollection);

    MTPCollection.prototype.model = mtpModel;

    MTPCollection.prototype.prepareServerConfig = function(configPromise){
      return configPromise
        .then(function(config){
          return sfdcAccount.getCurrentUserId()
            .then(function(userId){
              config += " WHERE Target__r.User__c = '" + userId + "'";
              config += " AND (Date__c = LAST_MONTH OR Date__c = THIS_MONTH)";
              return config;
            })
        });
    };

    return MTPCollection;
  }

  abbottApp.factory('mtpCollection', [
    'utils',
    'entityCollection',
    'mtpModel',
    'sfdcAccount',
    mtpCollection
  ]);
})();