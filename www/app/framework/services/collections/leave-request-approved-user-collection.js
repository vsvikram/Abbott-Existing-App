(function () {
    function leaveRequestApprovedUserCollection(
      utils, entityCollection, leaveRequestApprovedUserModel, sfdcAccount, Query
    ) {
        var LeaveRequestApprovedUserCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            this.isLeaveRequestApprovedForDate = utils.bind(this.isLeaveRequestApprovedForDate, this);
            this.getAll = utils.bind(this.getAll, this);
            LeaveRequestApprovedUserCollection.super.constructor.apply(this, arguments);
        };
        LeaveRequestApprovedUserCollection = utils.extend(LeaveRequestApprovedUserCollection, entityCollection);

        LeaveRequestApprovedUserCollection.prototype.model = leaveRequestApprovedUserModel;

        LeaveRequestApprovedUserCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
              .then(function (config) {
                  return sfdcAccount.getCurrentUserId()
                    .then(function (userId) {
                        var innerUserSelect = "SELECT Id FROM User";
                        innerUserSelect += " WHERE IsActive = true";
                        innerUserSelect += " AND Id = '" + userId + "'";
                        config += " WHERE User__c IN (" + innerUserSelect + ")";
                        config += " AND (Status__c = 'Approved' OR Status__c = 'Rejected Cancellation' OR Status__c = 'Manager Applied' OR Status__c = 'HR Applied' OR Status__c = 'HR Updated')";
                        config += " AND To_Date__c >= LAST_YEAR";
                        return config;
                    })
              });
        };

        LeaveRequestApprovedUserCollection.prototype.isLeaveRequestApprovedForDate = function (moment) {
            var date = moment.format('YYYY-MM-DD'),
              query = new Query()
              .selectCountFrom(this.model.tableSpec.local)
              .where({ 'From_Date__c': date }, Query.GR)
              .where({ 'To_Date__c': date }, Query.LR)
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

        LeaveRequestApprovedUserCollection.prototype.getAll = function () {
            return this.fetchAll()
              .then(this.fetchRecursiveFromCursor);
        };

        return LeaveRequestApprovedUserCollection;
    }

    abbottApp.factory('leaveRequestApprovedUserCollection', [
      'utils',
      'entityCollection',
      'leaveRequestApprovedUserModel',
      'sfdcAccount',
      'query',
      leaveRequestApprovedUserCollection
    ]);
})();