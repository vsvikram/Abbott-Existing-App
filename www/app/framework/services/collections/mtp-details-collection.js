(function(){
  function mtpDetailsCollection(utils, entityCollection, mtpDetailsModel, sfdcAccount){
    var MTPDetailsCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      MTPDetailsCollection.super.constructor.apply(this, arguments);
    };
    MTPDetailsCollection = utils.extend(MTPDetailsCollection, entityCollection);

    MTPDetailsCollection.prototype.model = mtpDetailsModel;

    MTPDetailsCollection.prototype.prepareServerConfig = function(configPromise){
      return configPromise
        .then(function(config){
         return sfdcAccount.getCurrentUserId()
            .then(function(userId){
              var innerMTPSelect = "SELECT Id FROM MTP__c";
              innerMTPSelect += " WHERE Target__r.User__c = '" + userId + "'";
              innerMTPSelect += " AND Status__c = 'Approved'";
              innerMTPSelect += " AND Date__c <= THIS_MONTH AND Date__c >= LAST_MONTH";
              config += " WHERE Activity_Master__r.Name != null";
              config += " AND MTP_Cycle__c IN (" + innerMTPSelect + ")";
              return config;
            })
        });
    };

    return MTPDetailsCollection;
  }

  abbottApp.factory('mtpDetailsCollection', [
    'utils',
    'entityCollection',
    'mtpDetailsModel',
    'sfdcAccount',
    mtpDetailsCollection
  ]);
})();