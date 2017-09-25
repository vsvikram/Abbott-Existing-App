(function(){
  function dcrLeaveCollection(utils, entityCollection, dcrLeaveModel, userCollection, $filter){
    var DcrLeaveCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      DcrLeaveCollection.super.constructor.apply(this, arguments);
    };
    DcrLeaveCollection = utils.extend(DcrLeaveCollection, entityCollection);

    DcrLeaveCollection.prototype.model = dcrLeaveModel;
    var userCollectionInstance = new userCollection();
    DcrLeaveCollection.prototype.prepareServerConfig = function(configPromise){
      return configPromise
        .then(function(config){
            return userCollectionInstance
                .getActiveUser()
                .then(function(user){
                    var today = $filter('date')(new Date(), 'yyyy-MM-dd');
                    var firstDayOfCurrentYear = $filter('date')(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd');
                    config += " WHERE User__c='"+user.Id+"' AND DCR_Filed_Date__c <= "+today+" AND DCR_Filed_Date__c >= "+firstDayOfCurrentYear+" AND Status__c = 'Submitted'";
                    console.log("dcr leave config");
                    console.log(config);
                    return config;
                    //+" AND Status__c = 'Approved'"
                });
        });
    };

    return DcrLeaveCollection;
  }

  abbottApp.factory('dcrLeaveCollection', [
    'utils',
    'entityCollection',
    'dcrLeaveModel',
    'userCollection',
    '$filter',
    dcrLeaveCollection
  ]);
})();