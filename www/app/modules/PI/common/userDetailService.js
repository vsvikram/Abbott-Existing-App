abbottApp.service('userDetailService', ['$q', '$filter', 'userCollection', 'SALESFORCE_QUERIES', 'entityCollection', function($q, $filter, userCollection, SALESFORCE_QUERIES, entityCollection) {
    this.userDetail = null;
    var userCollectionInstance = new userCollection();
    var entityCollectionInstance = new entityCollection();
    this.getUserInfo = function() {
        var q = $q.defer();
        var self = this,
            err = "Error @ getUserInfo";
        if (self.userDetail) {
            q.resolve(self.userDetail);
        } else {
            userCollectionInstance.getActiveUser().then(function(response) {
                self.getUser_Z_A_T(response.Id).then(function(userTerritory) {
                    if (userTerritory) {
                        response['userTerritory'] = userTerritory[0].Name;
			response['userTerritoryID'] = userTerritory[0].Id;
                        response['userTerritoryName'] = userTerritory[0].Description;
                        self.setUserDetail(response);
                        q.resolve(response);
                    } else {
                        q.reject(err);
                    }
                });
            }, function(err) {
                q.reject(err);
            });
        }
        return q.promise;
    };
    this.setUserDetail = function(data) {
        this.userDetail = data;
    };
    this.getUser_Z_A_T = function(userId) {
        var query = SALESFORCE_QUERIES.SERVER_QUERIES.getUser_Z_A_T_ID;
        var finalQuery = query.replace('$LOGGEDINUSERID$', userId);
        return this.fetchFromSalesforceData(finalQuery);
    }
    this.fetchFromSalesforceData = function(query) {
        var self = this,
            q = $q.defer();
        entityCollectionInstance.fetchFromSalesforce(query).then(function(res) {
            if (res != null && res.records.length > 0) {
                q.resolve(res.records);
            } else {
                q.resolve(null);
            }
        }, function() {
            q.reject(error);
        });
        return q.promise;
    };
}]);