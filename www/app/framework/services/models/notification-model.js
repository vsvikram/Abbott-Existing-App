(function() {
    function notificationModel(utils, entityModel) {
        var NotificationModel = function() {
            NotificationModel.super.constructor.apply(this, arguments);
        };

        NotificationModel = utils.extend(NotificationModel, entityModel);

        NotificationModel.description = 'Notification';
        NotificationModel.tableSpec = {
            sfdc: 'ABBWorld_Wrapper_Notification__c',
            local: 'ABBWorld_Wrapper_Notification__c'
        };

        NotificationModel.fieldsSpec = [
            { sfdc: 'Id', indexWithType: 'string'},
            { sfdc: 'ABBWorld_Wrapper_Notification_Message__c'},
            { sfdc: 'AppName__c' },
            { sfdc: 'Category__c' },
            { sfdc: 'Operation_Type__c' },
            { sfdc: 'Division__c' },
            { sfdc: 'Level__c' },
            { sfdc: 'Name_of_User__c' },
            { sfdc: 'Username__c' },
            { sfdc: 'SMS_Engine_Message__c' },
            { sfdc: 'CreatedDate'}
        ];

        NotificationModel.mapModel();
        return NotificationModel;
    }

    abbottApp.factory('notificationModel', [
        'utils',
        'entityModel',
        notificationModel
    ]);
})();