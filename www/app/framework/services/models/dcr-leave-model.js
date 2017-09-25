(function(){
function dcrLeaveModel(utils, entityModel){
    var DcrLeaveModel = function(){
      DcrLeaveModel.super.constructor.apply(this, arguments);
    };

    DcrLeaveModel = utils.extend(DcrLeaveModel, entityModel);
    DcrLeaveModel.description = 'DCR modul for Leave';
    DcrLeaveModel.tableSpec = {
      sfdc: 'DCR__c',
      local: ''
    };

    DcrLeaveModel.fieldsSpec = [
        {sfdc: 'Id', indexWithType: 'string'},
        {sfdc: 'Activity1__c', indexWithType: 'string', upload: true},
        {sfdc: 'Activity2__c', indexWithType: 'string', upload: true},
        {sfdc: 'Comment1__c', upload: true},
        {sfdc: 'Comment2__c', upload: true},
        {sfdc: 'Date__c', indexWithType: 'string', upload: true},
        {sfdc: 'Division__c', upload: true},
        {sfdc: 'DCR_Filed_Date__c'},
        {sfdc: 'Activity_Selection__c', upload: true},
        {sfdc: 'Joint_Work_With__c', upload: true},
        {sfdc: 'Status__c', indexWithType: 'string', upload: true},
        {sfdc: 'Territory_Code__c', upload: true},
        {sfdc: 'User__c', upload: true},
        {sfdc: 'Deviation_Comment__c', upload: true},
        {sfdc: 'Summary_Comment__c', upload: true},
        {sfdc: 'UserNDateCombination__c', indexWithType: 'string'},
        {sfdc: 'Company_Code__c', indexWithType: 'string', upload: true},
        {sfdc: 'DCRSubmitDate__c', upload: true},
        {sfdc: 'isMobileDCR__c', indexWithType: 'string', upload: true },
        {sfdc: 'Detailed_Summary__c', upload: true },
        {sfdc: 'DCR_JFW_Count__c', upload: true },
        {sfdc: 'DCR_Junction_Count__c', upload: true }
    ];

    DcrLeaveModel.mapModel();
    return DcrLeaveModel;
}

  abbottApp.factory('dcrLeaveModel', [
    'utils',
    'entityModel',
    dcrLeaveModel
  ]);
})();