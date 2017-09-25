(function(){
  function userPreferences($q, utils){
    var UserPreferences = function(){
      this.store = utils.bind(this.store, this);
      this.init = utils.bind(this.init, this);
      this.getPreferences = utils.bind(this.getPreferences, this);
      this.setPreferences = utils.bind(this.setPreferences, this);
      this.setValueForKey = utils.bind(this.setValueForKey, this);
      this.getValueForKey = utils.bind(this.getValueForKey, this);
      this.saveSyncLog = utils.bind(this.saveSyncLog, this);
      this.loadSyncLog = utils.bind(this.loadSyncLog, this);
    };

    UserPreferences.key = 1;
    
    UserPreferences.spec = [
      {
        'path': 'Id',
        'type': 'string'
      },
      {
        'path': 'Is_Last_Sync_Completed',
        'type': 'string'
      },
      {
        'path': 'LastLoggedUserId',
        'type': 'string'
      },
      {
        'path': 'LastSyncLog',
        'type': 'string'
      }
    ];

    UserPreferences.table = 'User_Preferences';

    UserPreferences.defaults = {
      Id: 1,
      Is_Last_Sync_Completed: false,
      LastLoggedUserId: '',
      LastSyncLog: []
    };

    UserPreferences.prototype.store = function(){
      return cordova.require('com.salesforce.plugin.smartstore');
    };

    UserPreferences.prototype.init = function(){
      var that = this,
        deferred = $q.defer();
      this.store().soupExists(true, UserPreferences.table, function(isSoupExist){
        if(isSoupExist){
          deferred.resolve();
        }else{
          that.store().registerSoup(true, UserPreferences.table, UserPreferences.spec, deferred.resolve, deferred.reject);
        }
      }, deferred.reject);
      return deferred.promise;
    };

    UserPreferences.prototype.getPreferences = function(){
      var that = this,
        deferred = $q.defer();
      return this.init()
        .then(function(){
          that.store().retrieveSoupEntries(true, UserPreferences.table, [UserPreferences.key], function(entries){
            if(entries.length){
              deferred.resolve(entries[0]);
            }else{
              that.setPreferences(UserPreferences.defaults)
                .then(deferred.resolve, deferred.reject);
            }
          }, deferred.reject);
          return deferred.promise;
        });
    };

    UserPreferences.prototype.setPreferences = function(preferences){
      var that = this,
        deferred = $q.defer();
      return this.init()
        .then(function(){
          preferences = angular.extend(UserPreferences.defaults, preferences);
          that.store().upsertSoupEntries(true, UserPreferences.table, [preferences], function(entries){
            deferred.resolve(preferences);
          }, deferred.reject);
          return deferred.promise;
        });
    };

    UserPreferences.prototype.setValueForKey = function(key, value){
      return this.getPreferences()
        .then(function(preferences){
          preferences[key] = value;
          return preferences
        }).then(this.setPreferences);
    };

    UserPreferences.prototype.getValueForKey = function(key){
      return this.getPreferences()
        .then(function(preferences){
          return preferences[key] || UserPreferences.defaults[key] || null;
        });
    };

    UserPreferences.prototype.saveSyncLog = function(logsList){
      return this.setValueForKey('LastSyncLog', logsList)
    };

    UserPreferences.prototype.loadSyncLog = function(){
      return this.getValueForKey('LastSyncLog')
    };

    return new UserPreferences;
  }

  abbottApp.service('userPreferences', [
    '$q',
    'utils',
    userPreferences
  ]);
})();