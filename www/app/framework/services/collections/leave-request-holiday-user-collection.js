(function () {
    function leaveRequestHolidayUserCollection(utils, entityCollection, leaveRequestHolidayUserModel, userCollection, $q) {
        var LeaveRequestHolidayUserCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            this.getAll = utils.bind(this.getAll, this);
            LeaveRequestHolidayUserCollection.super.constructor.apply(this, arguments);
        };
        LeaveRequestHolidayUserCollection = utils.extend(LeaveRequestHolidayUserCollection, entityCollection);

        LeaveRequestHolidayUserCollection.prototype.model = leaveRequestHolidayUserModel;

        LeaveRequestHolidayUserCollection.prototype.prepareServerConfig = function (configPromise) {
            var me = this;
            return configPromise
              .then(function (config) {
                  return new userCollection().getActiveUser()
                    .then(function (activeUser) {
                        return me.getStateInformation(activeUser.Id).then(function (states) {
                            //var innerStateSelect = "SELECT State__c FROM Territory_States__c";
                            //innerStateSelect += " WHERE Target__r.User__r.Id = '" + activeUser.Id + "'";
                            config += " WHERE Date__c >= LAST_YEAR";
                            config += " AND ("
                            if (states.length > 0)
                                config += "(Company_Code__c = '" + activeUser.CompanyName + "' AND Division__c = '" + activeUser.Division + "' AND State__c='" + states[0].State__c + "' AND  RecordType.Name='Division State') OR";
                            config += " (RecordType.Name='User-Floating' and User__c='" + activeUser.Id + "')";
                            config += " OR (RecordType.Name='Annual' and Company_Code__c= '" + activeUser.CompanyName + "'))";
                            config += " GROUP BY Date__c";
                            return config;
                        });
                    });
              });
        };

        LeaveRequestHolidayUserCollection.prototype.getStateInformation = function (Id) {
            var deferred = $q.defer();
            var stateInfoQuery = "select State__c from Territory_States__c WHERE Target__r.User__r.Id = '" + Id + "'";
            this.fetchFromSalesforce(stateInfoQuery).then(function (response) {
                deferred.resolve(response.records);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        LeaveRequestHolidayUserCollection.prototype.getAll = function () {
            return this.fetchAll()
              .then(this.fetchRecursiveFromCursor);
        };

        return LeaveRequestHolidayUserCollection;
    }

    abbottApp.factory('leaveRequestHolidayUserCollection', [
      'utils',
      'entityCollection',
      'leaveRequestHolidayUserModel',
      'userCollection',
      '$q',
      leaveRequestHolidayUserCollection
    ]);
})();