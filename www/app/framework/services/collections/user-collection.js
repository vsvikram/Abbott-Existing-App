(function(){
  function userCollection($q, $rootScope, utils, entityCollection, userModel, sfdcAccount){
    var UserCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      this.fetchJfwUsersFromServer = utils.bind(this.fetchJfwUsersFromServer, this);
      this.fetchFromSalesforce = utils.bind(this.fetchFromSalesforce, this);
      this.getActiveUser = utils.bind(this.getActiveUser, this);
      UserCollection.super.constructor.apply(this, arguments);
    };
    UserCollection = utils.extend(UserCollection, entityCollection);

    UserCollection.prototype.model = userModel;

    UserCollection.prototype.apexrest = '/jfw';

    UserCollection.prototype.prepareServerConfig = function(configPromise){
      return configPromise
        .then(function(config){
          return sfdcAccount.getCurrentUserId()
            .then(function(userId){
              config += " WHERE Id = '" + userId + "'";
              return config;
            })
        });
    };

    UserCollection.prototype.fetchJfwUsersFromServer = function(){
      var deferred = $q.defer();
      sfdcAccount.getSfdcClient()
        .apexrest(this.apexrest, 'GET', null, {}, deferred.resolve, deferred.reject);
      return deferred.promise;
    };

    UserCollection.prototype.fetchFromSalesforce = function(query){
      return this.fetchJfwUsersFromServer()
        .then(function(jfwUsers){
          return UserCollection.super.fetchFromSalesforce.call(this, query)
            .then(function(response){
              $rootScope.clmEnabled = response.records[0].CLM_User__c && $rootScope.platform === "iOS" && isiPad;
              response.records = response.records.concat(jfwUsers);
              return response
            });
        }.bind(this));
    };

    UserCollection.prototype.getActiveUser = function(){
      var that = this;
      return sfdcAccount.getCurrentUserId()
        .then(function(userId){
          return that.fetchAllLike({Id: userId})
        }).then(this.getEntityFromResponse);
    };

    return UserCollection;
  }

  abbottApp.factory('userCollection', [
    '$q',
    '$rootScope',
    'utils',
    'entityCollection',
    'userModel',
    'sfdcAccount',
    userCollection
  ]);
})();