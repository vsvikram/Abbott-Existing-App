(function(){
  function presentationModel(utils, entityModel){
    var PresentationModel = function(){
      PresentationModel.super.constructor.apply(this, arguments);
    };

    PresentationModel = utils.extend(PresentationModel, entityModel);
    PresentationModel.description = 'Presentation';
    PresentationModel.tableSpec = {
      sfdc: 'Presentation__c',
      local: 'Presentation__c'
    };

    PresentationModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Actual_Content_Document_Id__c'},
      {sfdc: 'Actual_Download_URL__c'},
      {sfdc: 'Actual_Presentation_Content__c'},
      {sfdc: 'Actual_Content_Size__c'},
      {sfdc: 'Description__c'},
      {sfdc: 'DownloadUrl__c'},
      {sfdc: 'KPI_Scheme__c'},
      {sfdc: 'Name'},
      {sfdc: 'Version__c'}
    ];

    PresentationModel.mapModel();
    return PresentationModel;
  }

  abbottApp.factory('presentationModel', [
    'utils',
    'entityModel',
    presentationModel
  ]);
})();