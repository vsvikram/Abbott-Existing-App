(function () {
    function deviceCollection(Query, utils, entityCollection, deviceModel, sfdcAccount, syncLog, $cordovaAppVersion, $cordovaDevice, locationService) {
        var DeviceCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            this.uploadEntitiesQuery = utils.bind(this.uploadEntitiesQuery, this);
            this.fillDeviceInfo = utils.bind(this.fillDeviceInfo, this);
            this.onUploadingStarted = utils.bind(this.onUploadingStarted, this);
            this.getCurrentDevice = utils.bind(this.getCurrentDevice, this);
            DeviceCollection.super.constructor.apply(this, arguments);
        };
        DeviceCollection = utils.extend(DeviceCollection, entityCollection);

        DeviceCollection.prototype.model = deviceModel;

        DeviceCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
              .then(function (config) {
                  config += " WHERE Device_ID__c = '" + $cordovaDevice.getUUID() + "' ORDER BY LastModifiedDate DESC LIMIT 1";
                  return config;
              });
        };

        DeviceCollection.prototype.uploadEntitiesQuery = function () {
            return this.instantPromise(new Query().selectFrom(this.model.tableSpec.local).where({ Device_ID__c: $cordovaDevice.getUUID() }));
        };

        DeviceCollection.prototype.getCurrentDevice = function () {
            return this.fetchAllWhere({ Device_ID__c: $cordovaDevice.getUUID() })
              .then(this.getEntityFromResponse)
              .then(function (currentDevice) {
                  if (!currentDevice) {
                      currentDevice = { Device_ID__c: $cordovaDevice.getUUID() };
                      return this.updateEntity(currentDevice);
                  } else {
                      return currentDevice;
                  }
              }.bind(this));
        };

        DeviceCollection.prototype.fillDeviceInfo = function (deviceEntity) {
            return sfdcAccount.getCurrentUserId()
              .then(function (userId) {
                  deviceEntity['Last_User__c'] = userId;
                  return $cordovaAppVersion.getVersionNumber();
              }).then(function (appVersion) {
                  deviceEntity['Version__c'] = appVersion;
                  return syncLog.getLogText();
              }).then(function (lastSyncLog) {
                  deviceEntity['Last_Debug_Log__c'] = lastSyncLog;
                  deviceEntity['Model__c'] = $cordovaDevice.getModel();
                  deviceEntity['OS_Version__c'] = $cordovaDevice.getVersion();
                  deviceEntity['Last_Syncronization__c'] = utils.currentDateInSFDCFormat();
                  //		  var location = locationService.getLastLocation();
                  //          if(location){
                  //            deviceEntity['Last_GEO_Location__Latitude__s'] = location['latitude'];
                  //            deviceEntity['Last_GEO_Location__Longitude__s'] = location['longitude'];
                  //          }
                  deviceEntity['Last_GEO_Location__Latitude__s'] = '';
                  deviceEntity['Last_GEO_Location__Longitude__s'] = '';
                  return this.updateEntities([deviceEntity]);
              }.bind(this));
        };

        DeviceCollection.prototype.onUploadingStarted = function (records) {
            delete records[0].Id;
            return this.fillDeviceInfo(records[0])
        };

        return DeviceCollection;
    }

    abbottApp.factory('deviceCollection', [
      'query',
      'utils',
      'entityCollection',
      'deviceModel',
      'sfdcAccount',
      'syncLog',
      '$cordovaAppVersion',
      '$cordovaDevice',
      'locationService',
      deviceCollection
    ]);
})();