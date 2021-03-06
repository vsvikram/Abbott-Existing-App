(function(){
  function dcrJunctionModel(utils, entityModel){
    var DcrJunctionModel = function(){
      DcrJunctionModel.super.constructor.apply(this, arguments);
    };

    DcrJunctionModel = utils.extend(DcrJunctionModel, entityModel);
    DcrJunctionModel.description = 'DCR Junction';
    DcrJunctionModel.tableSpec = {
      sfdc: 'DCR_Junction__c',
      local: 'DCR_Junction__c'
    };

    DcrJunctionModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Name', upload: true},
      {sfdc: 'Account__c', upload: true, indexWithType: 'string'},
      {sfdc: 'Assignment__c', upload: true},
      {sfdc: 'Assignment__r.Market_Type__c',indexWithType: 'string'},
      {sfdc: 'Patch__c', upload: true},
      {sfdc: 'Patch__r.Name', indexWithType: 'string'},
      {sfdc: 'Brand1__c', upload: true},
      {sfdc: 'Brand2__c', upload: true},
      {sfdc: 'Brand3__c', upload: true},
      {sfdc: 'Brand4__c', upload: true},
      {sfdc: 'Brand5__c', upload: true},
      {sfdc: 'Brand6__c', upload: true},
      {sfdc: 'Brand7__c', upload: true},
      {sfdc: 'Brand8__c', upload: true},
      {sfdc: 'Brand9__c', upload: true},
      {sfdc: 'Brand10__c', upload: true},
      {sfdc: 'Rx_Month1__c', upload: true},
      {sfdc: 'Rx_Month2__c', upload: true},
      {sfdc: 'Rx_Month3__c', upload: true},
      {sfdc: 'Rx_Month4__c', upload: true},
      {sfdc: 'Rx_Month5__c', upload: true},
      {sfdc: 'Rx_Month6__c', upload: true},
      {sfdc: 'Rx_Month7__c', upload: true},
      {sfdc: 'Rx_Month8__c', upload: true},
      {sfdc: 'Rx_Month9__c', upload: true},
      {sfdc: 'Rx_Month10__c', upload: true},
      {sfdc: 'POB__c', upload: true},
      {sfdc: 'POB1__c', upload: true},
      {sfdc: 'POB2__c', upload: true},
      {sfdc: 'POB3__c', upload: true},
      {sfdc: 'POB4__c', upload: true},
      {sfdc: 'POB5__c', upload: true},
      {sfdc: 'POB6__c', upload: true},
      {sfdc: 'POB7__c', upload: true},
      {sfdc: 'POB8__c', upload: true},
      {sfdc: 'POB9__c', upload: true},
      {sfdc: 'POB10__c', upload: true},
      {sfdc: 'Brand1_Competitor1__c', upload: true},
      {sfdc: 'Brand1_Comp1_Rx_Month__c', upload: true},
      {sfdc: 'Brand1_Competitor2__c', upload: true},
      {sfdc: 'Brand1_Comp2_Rx_Month__c', upload: true},
      {sfdc: 'Brand1_Competitor3__c', upload: true},
      {sfdc: 'Brand1_Comp3_Rx_Month__c', upload: true},
      {sfdc: 'Brand1_Competitor4__c', upload: true},
      {sfdc: 'Brand1_Comp4_Rx_Month__c', upload: true},
      {sfdc: 'Brand2_Competitor1__c', upload: true},
      {sfdc: 'Brand2_Comp1_Rx_Month__c', upload: true},
      {sfdc: 'Brand2_Competitor2__c', upload: true},
      {sfdc: 'Brand2_Comp2_Rx_Month__c', upload: true},
      {sfdc: 'Brand2_Competitor3__c', upload: true},
      {sfdc: 'Brand2_Comp3_Rx_Month__c', upload: true},
      {sfdc: 'Brand2_Competitor4__c', upload: true},
      {sfdc: 'Brand2_Comp4_Rx_Month__c', upload: true},
      {sfdc: 'Brand3_Competitor1__c', upload: true},
      {sfdc: 'Brand3_Comp1_Rx_Month__c', upload: true},
      {sfdc: 'Brand3_Competitor2__c', upload: true},
      {sfdc: 'Brand3_Comp2_Rx_Month__c', upload: true},
      {sfdc: 'Brand3_Competitor3__c', upload: true},
      {sfdc: 'Brand3_Comp3_Rx_Month__c', upload: true},
      {sfdc: 'Brand3_Competitor4__c', upload: true},
      {sfdc: 'Brand3_Comp4_Rx_Month__c', upload: true},
      {sfdc: 'Brand4_Competitor1__c', upload: true},
      {sfdc: 'Brand4_Comp1_Rx_Month__c', upload: true},
      {sfdc: 'Brand4_Competitor2__c', upload: true},
      {sfdc: 'Brand4_Comp2_Rx_Month__c', upload: true},
      {sfdc: 'Brand4_Competitor3__c', upload: true},
      {sfdc: 'Brand4_Comp3_Rx_Month__c', upload: true},
      {sfdc: 'Brand4_Competitor4__c', upload: true},
      {sfdc: 'Brand4_Comp4_Rx_Month__c', upload: true},
      {sfdc: 'Brand5_Competitor1__c', upload: true},
      {sfdc: 'Brand5_Comp1_Rx_Month__c', upload: true},
      {sfdc: 'Brand5_Competitor2__c', upload: true},
      {sfdc: 'Brand5_Competitor3__c', upload: true},
      {sfdc: 'Brand5_Comp3_Rx_Month__c', upload: true},
      {sfdc: 'Brand5_Comp2_Rx_Month__c', upload: true},
      {sfdc: 'Brand5_Competitor4__c', upload: true},
      {sfdc: 'Brand5_Comp4_Rx_Month__c', upload: true},
      {sfdc: 'Brand6_Competitor1__c', upload: true},
      {sfdc: 'Brand6_Comp1_Rx_Month__c', upload: true},
      {sfdc: 'Brand6_Competitor2__c', upload: true},
      {sfdc: 'Brand6_Comp2_Rx_Month__c', upload: true},
      {sfdc: 'Brand6_Competitor3__c', upload: true},
      {sfdc: 'Brand6_Comp3_Rx_Month__c', upload: true},
      {sfdc: 'Brand6_Competitor4__c', upload: true},
      {sfdc: 'Brand6_Comp4_Rx_Month__c', upload: true},
      {sfdc: 'Brand7_Competitor1__c', upload: true},
      {sfdc: 'Brand7_Comp1_Rx_Month__c', upload: true},
      {sfdc: 'Brand7_Competitor2__c', upload: true},
      {sfdc: 'Brand7_Comp2_Rx_Month__c', upload: true},
      {sfdc: 'Brand7_Competitor3__c', upload: true},
      {sfdc: 'Brand7_Comp3_Rx_Month__c', upload: true},
      {sfdc: 'Brand7_Competitor4__c', upload: true},
      {sfdc: 'Brand7_Comp4_Rx_Month__c', upload: true},
      {sfdc: 'Brand8_Competitor1__c', upload: true},
      {sfdc: 'Brand8_Comp1_Rx_Month__c', upload: true},
      {sfdc: 'Brand8_Competitor2__c', upload: true},
      {sfdc: 'Brand8_Comp2_Rx_Month__c', upload: true},
      {sfdc: 'Brand8_Competitor3__c', upload: true},
      {sfdc: 'Brand8_Comp3_Rx_Month__c', upload: true},
      {sfdc: 'Brand8_Competitor4__c', upload: true},
      {sfdc: 'Brand8_Comp4_Rx_Month__c', upload: true},
      {sfdc: 'Brand9_Competitor1__c', upload: true},
      {sfdc: 'Brand9_Comp1_Rx_Month__c', upload: true},
      {sfdc: 'Brand9_Competitor2__c', upload: true},
      {sfdc: 'Brand9_Comp2_Rx_Month__c', upload: true},
      {sfdc: 'Brand9_Competitor3__c', upload: true},
      {sfdc: 'Brand9_Comp3_Rx_Month__c', upload: true},
      {sfdc: 'Brand9_Competitor4__c', upload: true},
      {sfdc: 'Brand9_Comp4_Rx_Month__c', upload: true},
      {sfdc: 'Brand10_Competitor1__c', upload: true},
      {sfdc: 'Brand10_Comp1_Rx_Month__c', upload: true},
      {sfdc: 'Brand10_Competitor2__c', upload: true},
      {sfdc: 'Brand10_Comp2_Rx_Month__c', upload: true},
      {sfdc: 'Brand10_Competitor3__c', upload: true},
      {sfdc: 'Brand10_Comp3_Rx_Month__c', upload: true},
      {sfdc: 'Brand10_Competitor4__c', upload: true},
      {sfdc: 'Brand10_Comp4_Rx_Month__c', upload: true},
      {sfdc: 'Medical_Query__c', upload: true},
      {sfdc: 'Post_call_Note__c', upload: true},
      {sfdc: 'Next_Call_Objective__c', upload: true},
      {sfdc: 'Last_Visit_Date__c', upload: true},
      {sfdc: 'Comments__c', upload: true},
      {sfdc: 'DCR__c', indexWithType: 'string', upload: true},
      {sfdc: 'DCR_Brand_Activity__c', indexWithType: 'string', upload: true},
      {sfdc: 'Sequence_Number__c', upload: true},
      {sfdc: 'NoOfPatientsScreenedDCRJunction__c', upload: true},
      {sfdc: 'LaboratoryDCRJunction__c', upload: true},
      {sfdc: 'HonorariumAmountDCRJunction__c', upload: true},
      {sfdc: 'AnyOtherCostDCRJunction__c', upload: true},
      {sfdc: 'DCR__r.Status__c', indexWithType: 'string'},
      {sfdc: 'DCR__r.Date__c', indexWithType: 'string'},
      {sfdc: 'JFW_None_Check__c', upload: true}
    ];

    DcrJunctionModel.localMappingSpec = [
		{'path': 'Local_DCR__c',  'type': 'string'},
		{'path': 'Local_DCR_Brand_Activity__c',  'type': 'string'}
	];

    DcrJunctionModel.mapModel();
    return DcrJunctionModel;
  }

  abbottApp.factory('dcrJunctionModel', [
    'utils',
    'entityModel',
    dcrJunctionModel
  ]);
})();