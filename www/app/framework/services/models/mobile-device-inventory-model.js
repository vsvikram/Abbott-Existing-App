(function(){
  function mobileDeviceInventoryModel(utils, entityModel){
    var MobileDeviceInventoryModel = function(){
      MobileDeviceInventoryModel.super.constructor.apply(this, arguments);
    };
    
    MobileDeviceInventoryModel = utils.extend(MobileDeviceInventoryModel, entityModel);

    MobileDeviceInventoryModel.description = 'Mobile Device Inventory';
    MobileDeviceInventoryModel.tableSpec = {
      sfdc: 'Mobile_Device_Inventory__c',
      local: 'Mobile_Device_Inventory__c'
    };

    MobileDeviceInventoryModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Login_Date__c', indexWithType: 'string'},
      {sfdc: 'Manufacturer__c', upload: true},
      {sfdc: 'Model__c', upload: true},
      {sfdc: 'OS_Version__c', upload: true},
      {sfdc: 'Platform__c', upload: true},
      {sfdc: 'Resolution__c', indexWithType: 'string', upload: true},
      {sfdc: 'UUID__c', upload: true},
      {sfdc: 'UserId__c', upload: true},
      {sfdc: 'Username__c', upload: true},
      {sfdc: 'App_Version__c', upload: true},
    ];
    
    MobileDeviceInventoryModel.mapModel();
    return MobileDeviceInventoryModel;
  }

  abbottApp.factory('mobileDeviceInventoryModel', [
    'utils',
    'entityModel',
    mobileDeviceInventoryModel
  ]);
})();