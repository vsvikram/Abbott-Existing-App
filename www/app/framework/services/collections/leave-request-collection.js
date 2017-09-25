(function () {
    function leaveRequestCollection(
      utils, entityCollection, leaveRequestModel, sfdcAccount, Query
    ) {
        var LeaveRequestCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            LeaveRequestCollection.super.constructor.apply(this, arguments);
        };
        LeaveRequestCollection = utils.extend(LeaveRequestCollection, entityCollection);

        LeaveRequestCollection.prototype.model = leaveRequestModel;

        LeaveRequestCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
              .then(function (config) {
                  return sfdcAccount.getCurrentUserId()
                    .then(function (userId) {
                        var innerUserSelect = "SELECT Id FROM User";
                        innerUserSelect += " WHERE IsActive = true";
                        innerUserSelect += " AND Id = '" + userId + "'";
                        config += " WHERE User__c IN (" + innerUserSelect + ")";
                        return config;
                    })
              });
        };
        return LeaveRequestCollection;

    };

    abbottApp.factory('leaveRequestCollection', [
      'utils',
      'entityCollection',
      'leaveRequestModel',
      'sfdcAccount',
      'query',
      leaveRequestCollection
    ]);
})();