(function(){
  function mtpAppointmentDetails2Collection(utils, entityCollection, mtpAppointmentDetails2Model, sfdcAccount){
    var MTPAppointmentDetails2Collection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      MTPAppointmentDetails2Collection.super.constructor.apply(this, arguments);
    };
    MTPAppointmentDetails2Collection = utils.extend(MTPAppointmentDetails2Collection, entityCollection);

    MTPAppointmentDetails2Collection.prototype.model = mtpAppointmentDetails2Model;

    MTPAppointmentDetails2Collection.prototype.prepareServerConfig = function(configPromise){
      return configPromise
        .then(function(config){
          return sfdcAccount.getCurrentUserId()
            .then(function(userId){
              config += " WHERE target__r.user__c='" + userId + "'";
              config += " AND MTP_Junction__r.MTP_Cycle__r.date__c >= LAST_MONTH";
              config += " AND MTP_Junction__r.MTP_Cycle__r.date__c <= THIS_MONTH";
              config += " AND MTP_Junction__r.MTP_Cycle__r.status__c = 'Approved'";
              return config;
            })
        });
    };

    return MTPAppointmentDetails2Collection;
  }

  abbottApp.factory('mtpAppointmentDetails2Collection', [
    'utils',
    'entityCollection',
    'mtpAppointmentDetails2Model',
    'sfdcAccount',
    mtpAppointmentDetails2Collection
  ]);
})();