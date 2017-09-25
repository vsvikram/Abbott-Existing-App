(function(){
  function deviceModel(utils, entityModel){
    var DeviceModel = function(){
      DeviceModel.super.constructor.apply(this, arguments);
    };
    
    DeviceModel = utils.extend(DeviceModel, entityModel);

    DeviceModel.description = 'Mobile Device';
    DeviceModel.tableSpec = {
      sfdc: 'Mobile_Device__c',
      local: 'Mobile_Device__c'
    };

    DeviceModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Model__c', upload: true},
      {sfdc: 'OS_Version__c', upload: true},
      {sfdc: 'Last_GEO_Location__Latitude__s', upload: true},
      {sfdc: 'Last_GEO_Location__Longitude__s', upload: true},
      {sfdc: 'Device_ID__c', indexWithType: 'string', upload: true},
      {sfdc: 'Version__c', upload: true},
      {sfdc: 'Last_Syncronization__c', upload: true},
      {sfdc: 'Last_User__c', upload: true},
      {sfdc: 'Last_Debug_Log__c', upload: true},
      {sfdc: 'Erased__c', upload: true},
      {sfdc: 'Request_Erase__c', upload: true}
    ];
    
    DeviceModel.mapModel();
    return DeviceModel;
  }

  abbottApp.factory('deviceModel', [
    'utils',
    'entityModel',
    deviceModel
  ]);
})();