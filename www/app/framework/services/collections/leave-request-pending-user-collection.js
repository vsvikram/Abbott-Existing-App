(function () {
    function leaveRequestPendingUserCollection(
      utils, entityCollection, leaveRequestPendingUserModel, sfdcAccount, Query
    ) {

        var LeaveRequestPendingUserCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            this.isLeaveRequestPendingForDate = utils.bind(this.isLeaveRequestPendingForDate, this);
            LeaveRequestPendingUserCollection.super.constructor.apply(this, arguments);
        };
        LeaveRequestPendingUserCollection = utils.extend(LeaveRequestPendingUserCollection, entityCollection);

        LeaveRequestPendingUserCollection.prototype.model = leaveRequestPendingUserModel;

        LeaveRequestPendingUserCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
              .then(function (config) {
                  return sfdcAccount.getCurrentUserId()
                    .then(function (userId) {
                        var innerUserSelect = "SELECT Id FROM User";
                        innerUserSelect += " WHERE IsActive = true";
                        innerUserSelect += " AND Id = '" + userId + "'";
                        config += " WHERE User__c IN (" + innerUserSelect + ")";
                        config += " AND (Status__c = 'Pending' OR status__c = 'Pending Cancellation')";
                        config += " AND To_Date__c >= LAST_YEAR";
                        return config;
                    });
              });
        };

        LeaveRequestPendingUserCollection.prototype.isLeaveRequestPendingForDate = function (moment) {
            var date = moment.format('YYYY-MM-DD'),
              query = new Query()
              .selectCountFrom(this.model.tableSpec.local)
              .where({ 'From_Date__c': date }, Query.GRE)
              .where({ 'To_Date__c': date }, Query.LRE)
              .or()
              .where({ 'From_Date__c': date })
              .or()
              .where({ 'To_Date__c': date });
            return this.fetchWithQuery(query)
              .then(this.getEntityFromResponse)
              .then(function (count) {
                  return !!count;
              });
        };

        return LeaveRequestPendingUserCollection;
    }

    abbottApp.factory('leaveRequestPendingUserCollection', [
      'utils',
      'entityCollection',
      'leaveRequestPendingUserModel',
      'sfdcAccount',
      'query',
      leaveRequestPendingUserCollection
    ]);
})();