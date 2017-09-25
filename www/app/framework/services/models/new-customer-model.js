(function() {
    function newCustomerModel(utils, entityModel) {
        var NewCustomerModel = function() {
            NewCustomerModel.super.constructor.apply(this, arguments);
        };

        NewCustomerModel = utils.extend(NewCustomerModel, entityModel);
        NewCustomerModel.description = 'New Customer';
        NewCustomerModel.tableSpec = {
            sfdc: '',
            local: 'NewCustomers'
        };

        NewCustomerModel.fieldsSpec = [
            { sfdc: 'Date__c', indexWithType: 'string' },
            { sfdc: 'Account__c' },
            { sfdc: 'Assignment__c' },
            { sfdc: 'Designation' },
            { sfdc: 'Name' },
            { sfdc: 'Patch' },
            { sfdc: 'PatchCode' },
            { sfdc: 'Customer_Code__c' },
            { sfdc: 'CustomerType' },
            { sfdc: 'ABM_Territory__c' },
            { sfdc: 'SortIndex' },
            { sfdc: 'Mobile__c' }
        ];

        NewCustomerModel.mapModel();
        return NewCustomerModel;
    }

    abbottApp.factory('newCustomerModel', [
        'utils',
        'entityModel',
        newCustomerModel
    ]);
})();