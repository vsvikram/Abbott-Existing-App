(function(){
  function mtpAppointmentDetails1Collection(utils, entityCollection, mtpAppointmentDetails1Model, sfdcAccount, Query){
    var MTPAppointmentDetails1Collection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      this.mtpTodayCount = utils.bind(this.mtpTodayCount, this);
      this.mtpGetByDayCount = utils.bind(this.mtpGetByDayCount, this);
      this.getMtpIdByUserIdAndDate = utils.bind(this.getMtpIdByUserIdAndDate, this);
      MTPAppointmentDetails1Collection.super.constructor.apply(this, arguments);
    };
    MTPAppointmentDetails1Collection = utils.extend(MTPAppointmentDetails1Collection, entityCollection);

    MTPAppointmentDetails1Collection.prototype.model = mtpAppointmentDetails1Model;

    MTPAppointmentDetails1Collection.prototype.prepareServerConfig = function(configPromise){
      return configPromise
        .then(function(config){
          return sfdcAccount.getCurrentUserId()
            .then(function(userId){
              var mtpCycleSelect = "SELECT Id FROM MTP__c WHERE Target__r.User__c = '" + userId + "'";
              mtpCycleSelect += " AND Status__c = 'Approved'";
              mtpCycleSelect += " AND Date__c >= LAST_MONTH AND Date__c  <= THIS_MONTH";
              config += " WHERE Assignment__r.Effective_Date__c != null";
              config += " AND Assignment__r.Effective_Date__c <= THIS_MONTH";
              config += " AND (Assignment__r.Deactivation_Date__c = null OR Assignment__r.Deactivation_Date__c >= LAST_MONTH)";
              config += " AND MTP_Cycle__c IN(" + mtpCycleSelect + ")";
              config += " ORDER BY Name ASC";
              return config;
            })
        });
    };

    MTPAppointmentDetails1Collection.prototype.mtpTodayCount = function(){
      var query = new Query()
        .selectCountFrom(this.model.tableSpec.local)
        .where({'MTP_Cycle__r.Date__c': moment().format('YYYY-MM-DD')});
      return this.fetchWithQuery(query)
        .then(this.getEntityFromResponse);
    };
    MTPAppointmentDetails1Collection.prototype.mtpGetByDayCount = function(moment){
      var query = new Query()
        .selectCountFrom(this.model.tableSpec.local)
        .where({'MTP_Cycle__r.Date__c': moment.format('YYYY-MM-DD')});
      return this.fetchWithQuery(query)
        .then(this.getEntityFromResponse);
    };

    MTPAppointmentDetails1Collection.prototype.getMtpIdByUserIdAndDate = function(userId, moment){
      var query = this._fetchAllQuery()
        .where({
          'MTP_Cycle__r.Date__c': moment.format('YYYY-MM-DD'),
          'Assignment__r.Account__c': userId
        });
      return this.fetchWithQuery(query)
        .then(this.getEntityFromResponse)
        .then(function(mtp){
          return mtp ? mtp.Id : null;
        });
    };

    return MTPAppointmentDetails1Collection;
  }

  abbottApp.factory('mtpAppointmentDetails1Collection', [
    'utils',
    'entityCollection',
    'mtpAppointmentDetails1Model',
    'sfdcAccount',
    'query',
    mtpAppointmentDetails1Collection
  ]);
})();