(function(){
  function mobileDeviceInventoryCollection(Query, utils, entityCollection, mobileDeviceInventoryModel, sfdcAccount, syncLog, $cordovaAppVersion, $cordovaDevice){
    var MobileDeviceInventoryCollection = function(){
          this.fillDeviceInfo = utils.bind(this.fillDeviceInfo, this);

        MobileDeviceInventoryCollection.super.constructor.apply(this, arguments);
    };
    MobileDeviceInventoryCollection = utils.extend(MobileDeviceInventoryCollection, entityCollection);

    MobileDeviceInventoryCollection.prototype.model = mobileDeviceInventoryModel;

    MobileDeviceInventoryCollection.prototype.fillDeviceInfo = function(inventoryObj){
      var inventoryObj = {
        			'Login_Date__c': new Date()
      };
      return sfdcAccount.getCurrentUser()
        .then(function(activeUser){
          	inventoryObj['UserId__c'] = activeUser.userId;
          	inventoryObj['Username__c'] = activeUser.username;
          	return $cordovaAppVersion.getVersionNumber();
        }).then(function(appVersion) {
          	inventoryObj['App_Version__c'] = appVersion;

        }).then(function(){
        	var dpi = window.devicePixelRatio;
 			inventoryObj['Manufacturer__c'] = $cordovaDevice.getManufacturer();
  			inventoryObj['Model__c'] = $cordovaDevice.getModel();
  			inventoryObj['OS_Version__c'] = $cordovaDevice.getVersion();
   			inventoryObj['Platform__c'] = $cordovaDevice.getPlatform();
   			inventoryObj['Resolution__c'] = dpi*screen.width+'x'+dpi*screen.height;
   			inventoryObj['UUID__c'] = $cordovaDevice.getUUID();
          return this.upsertEntityToSfdc(inventoryObj);
        }.bind(this));
    };

    return MobileDeviceInventoryCollection;
  }

  abbottApp.factory('mobileDeviceInventoryCollection', [
    'query',
    'utils',
    'entityCollection',
    'mobileDeviceInventoryModel',
    'sfdcAccount',
    'syncLog',
    '$cordovaAppVersion',
    '$cordovaDevice',
    mobileDeviceInventoryCollection
  ]);
})();