(function(){
  function mtpAppointmentDetails1Model(utils, entityModel){
    var MTPAppointmentDetails1Model = function(){
      MTPAppointmentDetails1Model.super.constructor.apply(this, arguments);
    };

    MTPAppointmentDetails1Model = utils.extend(MTPAppointmentDetails1Model, entityModel);

    MTPAppointmentDetails1Model.description = 'MTP Appointment Details1';
    MTPAppointmentDetails1Model.tableSpec = {
      sfdc: 'MTP_Junction__c',
      local: 'MTPAppointmentDetails1'
    };

    MTPAppointmentDetails1Model.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Name'},
      {sfdc: 'ABM__r.Name'},
      {sfdc: 'TBM__r.Name'},
      {sfdc: 'MTP_Cycle__r.Date__c', indexWithType: 'string'},
      {sfdc: 'Assignment__r.Account__c', indexWithType: 'string'},
      {sfdc: 'Assignment__r.Brand1__c'},
      {sfdc: 'Assignment__r.Brand2__c'},
      {sfdc: 'Assignment__r.Brand3__c'},
      {sfdc: 'Assignment__r.Brand4__c'},
      {sfdc: 'Assignment__r.Brand5__c'},
      {sfdc: 'Assignment__r.Brand6__c'},
      {sfdc: 'Assignment__r.Brand7__c'},
      {sfdc: 'Assignment__r.Brand8__c'},
      {sfdc: 'Assignment__r.Brand9__c'},
      {sfdc: 'Assignment__r.Brand10__c'},
      {sfdc: 'Assignment__r.Brand1__r.Name'},
      {sfdc: 'Assignment__r.Brand2__r.Name'},
      {sfdc: 'Assignment__r.Brand3__r.Name'},
      {sfdc: 'Assignment__r.Brand4__r.Name'},
      {sfdc: 'Assignment__r.Brand5__r.Name'},
      {sfdc: 'Assignment__r.Brand6__r.Name'},
      {sfdc: 'Assignment__r.Brand7__r.Name'},
      {sfdc: 'Assignment__r.Brand8__r.Name'},
      {sfdc: 'Assignment__r.Brand9__r.Name'},
      {sfdc: 'Assignment__r.Brand10__r.Name'},
      {sfdc: 'Assignment__r.Account__r.Customer_Code__c'},
      {sfdc: 'Assignment__r.Account__r.Customer_type__c'},
      {sfdc: 'Assignment__r.Account__r.Name'},
      {sfdc: 'Assignment__r.Account__r.speciality__c'},
      {sfdc: 'Assignment__r.account__r.PersonMobilePhone'},
      {sfdc: 'Assignment__r.Account__r.Is_Government_Doctor__c'},
      {sfdc: 'Assignment__r.account__r.Institution_Name__c'},
      {sfdc: 'Assignment__r.account__r.PrivatePermittedPractice__c'},
      {sfdc: 'Assignment__r.Speciality__c'},
      {sfdc: 'Assignment__c'},
      {sfdc: 'Patch__c'},
      {sfdc: 'Patch__r.Name'},
      {sfdc: 'Assignment__r.Account__r.RecordType.Name'}
    ];

    MTPAppointmentDetails1Model.mapModel();
    return MTPAppointmentDetails1Model;
  }

  abbottApp.factory('mtpAppointmentDetails1Model', [
    'utils',
    'entityModel',
    mtpAppointmentDetails1Model
  ]);
})();