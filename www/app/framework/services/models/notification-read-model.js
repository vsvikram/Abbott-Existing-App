(function() {
    function notificationReadModel(utils, entityModel) {
        var NotificationReadModel = function() {
            NotificationReadModel.super.constructor.apply(this, arguments);
        };

        NotificationReadModel = utils.extend(NotificationReadModel, entityModel);

        NotificationReadModel.description = 'NotificationRead';
        NotificationReadModel.tableSpec = {
            sfdc: 'ABBWorld_Wrapper_Notification_Read__c',
            local: 'ABBWorld_Wrapper_Notification_Read__c'
        };

        NotificationReadModel.fieldsSpec = [
            { sfdc: 'Id', indexWithType: 'string'},
            { sfdc: 'ABBWorld_Wrapper_Notification__c',upload: true},
            { sfdc: 'isRead__c',upload: true },
            { sfdc: 'User__c',upload: true }
        ];

        NotificationReadModel.mapModel();
        return NotificationReadModel;
    }

    abbottApp.factory('notificationReadModel', [
        'utils',
        'entityModel',
        notificationReadModel
    ]);
})();