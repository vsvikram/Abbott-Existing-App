(function(){
  function sfcFareModel(utils, entityModel){
    var SFCFareModel = function(){
      SFCFareModel.super.constructor.apply(this, arguments);
    };

    SFCFareModel = utils.extend(SFCFareModel, entityModel);

    SFCFareModel.description = 'SFC Fare';
    SFCFareModel.tableSpec = {
      sfdc: 'SFC_Fare__c',
      local: 'SFC_Fare__c'
    };

    SFCFareModel.fieldsSpec = [
		{sfdc: 'Id', indexWithType: 'string'},
		{sfdc: 'Company_Code__c'},
		{sfdc: 'Effective_From_Date__c'},
		{sfdc: 'Effective_To_Date__c'},
		{sfdc: 'Expense_Company__c'},
		{sfdc: 'External_Id__c', indexWithType: 'string'},
		{sfdc: 'One_way_Fare__c'},
		{sfdc: 'Remarks__c'},
		{sfdc: 'ERN_Code__c',indexWithType: 'string'},
		{sfdc: 'SFC_Assignment__c'},
		{sfdc: 'SFC_Assignment__r.Market_Type__c'},
		{sfdc: 'SFC_Master__r.SFC_Code__c'},
		{sfdc: 'SFC_Master__r.From_Market__c'},
		{sfdc: 'SFC_Master__r.To_Market__c'},
		{sfdc: 'SFC_Master__r.One_way_distance_in_kms__c'},
		{sfdc: 'SFC_Master__c', indexWithType: 'string'}

    ];
    
    SFCFareModel.mapModel();
    return SFCFareModel;
  }

  abbottApp.factory('sfcFareModel', [
    'utils',
    'entityModel',
    sfcFareModel
  ]);
})();
