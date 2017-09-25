(function(){
  function dcrKpiDataModel(utils, entityModel){
    var DcrKpiDataModel = function(){
      DcrKpiDataModel.super.constructor.apply(this, arguments);
    };

    DcrKpiDataModel = utils.extend(DcrKpiDataModel, entityModel);
    DcrKpiDataModel.description = 'DCR KPI data';
    DcrKpiDataModel.tableSpec = {
      sfdc: 'DCR_KpiData__c',
      local: 'DCR_KpiData__c'
    };

    DcrKpiDataModel.fieldsSpec = [
      {sfdc: 'Id',                          indexWithType: 'string'},
      {sfdc: 'Brand_Activity__c'                                   },
      {sfdc: 'DCR__c',                                 upload: true,            indexWithType: 'string'},
      {sfdc: 'DCR_Junction__c',                        upload: true,            indexWithType: 'string'},
      {sfdc: 'Divisionwise_Brand__c',                  upload: true},
      {sfdc: 'ChildObjectType__c'                                  },
      {sfdc: 'ChildToParentRelation__c'                            },
      {sfdc: 'ED_Divisionwise_Brand_Presentation__c',  upload: true},
      {sfdc: 'KpiSchemeId__c'                                      },
      {sfdc: 'KpiSrcJson__c',                          upload: true},
      {sfdc: 'Potential__c'                                        },
      {sfdc: 'Prescriptions__c'                                    },
      {sfdc: 'Status__c'                                           },
      {sfdc: 'Test_Kpi__c'                                         },
      {sfdc: 'TimeOnPresentation__c',                  upload: true},
      {sfdc: 'TimeOnSlides__c',                        upload: true},
      {sfdc: 'Material_Lot__c'                                     },
      {sfdc: 'Quantity__c'                                         },
      {sfdc: 'Sequence_Number__c'                                  }
    ];

	DcrKpiDataModel.localMappingSpec = [
		{'path': 'Local_DCR__c',  'type': 'string'},
		{'path': 'Local_DCR_Junction__c', 'type': 'string'},
		{'path': 'Local_Brand_Activity__c',  'type': 'string'}
	];

    DcrKpiDataModel.mapModel();
    return DcrKpiDataModel;
  }

  abbottApp.factory('dcrKpiDataModel', [
    'utils',
    'entityModel',
    dcrKpiDataModel
  ]);
})();