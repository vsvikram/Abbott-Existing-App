(function(){
  function sfdcAccount($q, utils, abbottConfigService){
    var SFDCAccount = function(){
      this.accountManager = utils.bind(this.accountManager, this);
      this.oauthManager = utils.bind(this.oauthManager, this);
      this.getCurrentUser = utils.bind(this.getCurrentUser, this);
      this.getCurrentUserId = utils.bind(this.getCurrentUserId, this);
      this.authenticate = utils.bind(this.authenticate, this);
      this.logout = utils.bind(this.logout, this);
      this.getSfdcClient = utils.bind(this.getSfdcClient, this);
      this.handleRefreshSession = utils.bind(this.handleRefreshSession, this);
    };

    SFDCAccount.prototype.accountManager = function(){
      return cordova.require('com.salesforce.plugin.sfaccountmanager');
    };

    SFDCAccount.prototype.oauthManager = function(){
      return cordova.require('com.salesforce.plugin.oauth');
    };

    SFDCAccount.prototype.getCurrentUser = function(){
      var deferred = $q.defer();
      this.accountManager().getCurrentUser(deferred.resolve, deferred.reject);
      return deferred.promise;
    };

    SFDCAccount.prototype.getCurrentUserId = function(){
      return this.getCurrentUser()
        .then(function(currentUser){
          return currentUser.idUrl ? currentUser.idUrl.split('/').pop() : currentUser.userId;
        });
    };

    SFDCAccount.prototype.authenticate = function(){
      var deferred = $q.defer();
      this.oauthManager().forcetkRefresh(this.forcetkClient, deferred.resolve, deferred.reject);
      return deferred.promise;
    };

    SFDCAccount.prototype.logout = function(){
      return this.getCurrentUser()
        .then(this.accountManager().logout);
    };

    SFDCAccount.prototype.getSfdcClient = function(){
      return this.forcetkClient;
    };

    SFDCAccount.prototype.handleRefreshSession = function(credentials){
      this.forcetkClient = new forcetk.Client(credentials.clientId, credentials.loginUrl, null);
      this.forcetkClient.setSessionToken(credentials.accessToken, 'v36.0', credentials.instanceUrl);
      this.forcetkClient.setRefreshToken(credentials.refreshToken);
      this.forcetkClient.setUserAgentString(credentials.userAgent);
      forceMobile.setForceClient(this.forcetkClient);
      abbottConfigService.setForceObject(forceMobile);
    };

    return new SFDCAccount;
  }

  abbottApp.service('sfdcAccount', [
    '$q',
    'utils',
    'abbottConfigService',
    sfdcAccount
  ]);
})();