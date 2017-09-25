(function(){
  function notificationsModel(utils, entityModel){
    var NotificationsModel = function(){
      NotificationsModel.super.constructor.apply(this, arguments);
    };

    NotificationsModel = utils.extend(NotificationsModel, entityModel);
    NotificationsModel.description = 'Notifications ';
    NotificationsModel.tableSpec = {
      sfdc: 'Notifications__c',
      local: ''
    };

    NotificationsModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Activation_Date__c', indexWithType: 'string'},
      {sfdc: 'Content_Path__c', indexWithType: 'string'},
      {sfdc: 'DeActivation_Date__c', indexWithType: 'string'},
      {sfdc: 'Division_Name__c', indexWithType: 'string'},
      {sfdc: 'Level__c', indexWithType: 'string'},
      {sfdc: 'Message_Description__c', indexWithType: 'string'},
      {sfdc: 'Notification_Category__c', indexWithType: 'string'},
      {sfdc: 'Type__c', indexWithType: 'string'},
      {sfdc: 'Name', indexWithType: 'string'}
    ];

    NotificationsModel.mapModel();
    return NotificationsModel;
  }

  abbottApp.factory('notificationsModel', [
    'utils',
    'entityModel',
    notificationsModel
  ]);
})();

