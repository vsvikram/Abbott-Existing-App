(function(){
  function syncLog(abbottConfigService, utils, userPreferences, $cordovaAppVersion, $cordovaDevice){
    var locale = abbottConfigService.getLocale();
    var SyncLog = function(){
      this.init = utils.bind(this.init, this);
      this.appendToLog = utils.bind(this.appendToLog, this);
      this.appendFormattedMessage = utils.bind(this.appendFormattedMessage, this);
      this.appendInfo = utils.bind(this.appendInfo, this);
      this.appendError = utils.bind(this.appendError, this);
      this.appendWarning = utils.bind(this.appendWarning, this);
      this.prepareLogHeader = utils.bind(this.prepareLogHeader, this);
      this.saveLog = utils.bind(this.saveLog, this);
      this.loadLog = utils.bind(this.loadLog, this);
      this.getLogText = utils.bind(this.getLogText, this);
      this.getLogHtml = utils.bind(this.getLogHtml, this);
    };
    
    SyncLog.prototype._formatedDate = function(){
      var date = new Date();
      return [date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()].join(':');
    };
    
    SyncLog.prototype.logList = [];

    SyncLog.prototype.init = function(){
      this.logList = [];
      return this.prepareLogHeader();
    };
    
    SyncLog.prototype.appendToLog = function(logLine){
      this.logList.push(logLine);
      return this.saveLog();
    };

    SyncLog.prototype.appendFormattedMessage = function(messageType, messageBody){
      var message = messageType + ' ' + this._formatedDate() + (messageBody ? ' - ' + messageBody : '');
      return this.appendToLog(message);
    };

    SyncLog.prototype.appendInfo = function(message){
      return this.appendFormattedMessage(locale['SyncLogInfoLabel'], message);
    };

    SyncLog.prototype.appendError = function(message){
      return this.appendFormattedMessage(locale['SyncLogErrorLabel'], message);
    };

    SyncLog.prototype.appendWarning = function(message){
      return this.appendFormattedMessage(locale['SyncLogWarningLabel'], message);
    };
    
    SyncLog.prototype.prepareLogHeader = function(){
      this.appendToLog(locale['SyncStartedAt'] + new Date());
      this.appendToLog(locale['SyncOSVersion'] + [$cordovaDevice.getPlatform(), $cordovaDevice.getVersion()].join(' '));
      return $cordovaAppVersion.getVersionNumber()
        .then(function(appVersion){
          return this.appendToLog(locale['SyncAppVersion'] + appVersion);
        }.bind(this));
    };
    
    SyncLog.prototype.saveLog = function(){
      return userPreferences.saveSyncLog(this.logList);
    };
    
    SyncLog.prototype.loadLog = function(){
      return userPreferences.loadSyncLog();
    };

    SyncLog.prototype.getLogText = function(){
      return userPreferences.loadSyncLog()
        .then(function(logList){
          return logList.join('\n')
        });
    };

    SyncLog.prototype.getLogHtml = function(){
      return userPreferences.loadSyncLog()
        .then(function(logList){
          return logList.join('<br/>').replace(/\\n/ig, '<br/>');
        });
    };

    return new SyncLog;
  }

  abbottApp.service('syncLog', [
    'abbottConfigService',
    'utils',
    'userPreferences',
    '$cordovaAppVersion',
    '$cordovaDevice',
    syncLog
  ]);
})();