(function() {
    function associatedAppModel(utils, entityModel) {
        var AssociatedAppModel = function() {
            AssociatedAppModel.super.constructor.apply(this, arguments);
        };

        AssociatedAppModel = utils.extend(AssociatedAppModel, entityModel);

        AssociatedAppModel.description = 'Associated App';
        AssociatedAppModel.tableSpec = {
            sfdc: 'Associated_App__c',
            local: 'Associated_App__c'
        };

        AssociatedAppModel.fieldsSpec = [
            { sfdc: 'Id', indexWithType: 'string' },
            { sfdc: 'AppStore_URL__c' },
            { sfdc: 'Icon__c' },
            { sfdc: 'Name' },
            { sfdc: 'Package_Name__c' },
            { sfdc: 'Playstore_url__c' },
            { sfdc: 'Status__c' },
            { sfdc: 'Version__c' },
            { sfdc: 'Scheme__c' },
            { sfdc: 'Description__c' },
            { sfdc: 'Rating__c' },
            { sfdc: 'Category__c' },
            { sfdc: 'Filesize__c' },
            { sfdc: 'Date__c' },
            { sfdc: 'Priority__c'}
        ];

        AssociatedAppModel.mapModel();
        return AssociatedAppModel;
    }

    abbottApp.factory('associatedAppModel', [
        'utils',
        'entityModel',
        associatedAppModel
    ]);
})();