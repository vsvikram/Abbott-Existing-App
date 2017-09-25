(function(){
  function reporteeJFWCollection(utils, entityCollection, reporteeJFWModel, sfdcAccount){
    var ReporteeJFWCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      ReporteeJFWCollection.super.constructor.apply(this, arguments);
    };
    ReporteeJFWCollection = utils.extend(ReporteeJFWCollection, entityCollection);

    ReporteeJFWCollection.prototype.model = reporteeJFWModel;

    ReporteeJFWCollection.prototype.prepareServerConfig = function(configPromise){
      return configPromise
        .then(function(config){
          return sfdcAccount.getCurrentUserId()
            .then(function(userId){
              var dcrInnerSelect = "SELECT Id FROM DCR__c";
              dcrInnerSelect += " WHERE Status__c = 'Submitted'";
              dcrInnerSelect += " AND Date__c >= LAST_MONTH";
              dcrInnerSelect += " AND Date__c <= THIS_MONTH";
              config += " WHERE DCR__c IN (" + dcrInnerSelect + ")";
              config += " AND User2__c = '" + userId + "'";
              config += " AND DCR_Junction__r.Account__r.Id != null";
              return config;
            })
        });
    };

    return ReporteeJFWCollection;
  }

  abbottApp.factory('reporteeJFWCollection', [
    'utils',
    'entityCollection',
    'reporteeJFWModel',
    'sfdcAccount',
    reporteeJFWCollection
  ]);
})();