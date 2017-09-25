(function(){
  function mtpAppointmentDetails2Model(utils, entityModel){
    var MTPAppointmentDetails2Model = function(){
      MTPAppointmentDetails2Model.super.constructor.apply(this, arguments);
    };

    MTPAppointmentDetails2Model = utils.extend(MTPAppointmentDetails2Model, entityModel);

    MTPAppointmentDetails2Model.description = 'MTP Appointment Details2';
    MTPAppointmentDetails2Model.tableSpec = {
      sfdc: 'MTP_Activity__c',
      local: 'MTPAppointmentDetails2'
    };

    MTPAppointmentDetails2Model.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'MTP_Junction__r.Id'},
      {sfdc: 'MTP_Junction__r.MTP_Cycle__r.date__c'},
      {sfdc: 'Brand__c'},
      {sfdc: 'Quantity__c'},
      {sfdc: 'Material_Allocation__r.Material_Code__c'},
      {sfdc: 'Material_Allocation__r.Batch_Code__c'},
      {sfdc: 'Material_Allocation__r.Material_Name__c'},
      {sfdc: 'MTP_Junction__r.Assignment__r.Account__c'}
    ];
    
    MTPAppointmentDetails2Model.mapModel();
    return MTPAppointmentDetails2Model;
  }

  abbottApp.factory('mtpAppointmentDetails2Model', [
    'utils',
    'entityModel',
    mtpAppointmentDetails2Model
  ]);
})();