(function () {
    function assigmentDetailCollection(utils, entityCollection, assigmentDetailModel, targetCollection, userCollection, $rootScope) {
        var AssigmentDetailCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            this.fetchUserAssignmentDetails = utils.bind(this.fetchUserAssignmentDetails, this);
            AssigmentDetailCollection.super.constructor.apply(this, arguments);
        };
        AssigmentDetailCollection = utils.extend(AssigmentDetailCollection, entityCollection);

        AssigmentDetailCollection.prototype.model = assigmentDetailModel;

        AssigmentDetailCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise.then(function (config) {
                var targetCollectionInstance = new targetCollection();
                return targetCollectionInstance.fetchAll().then(targetCollectionInstance.fetchRecursiveFromCursor).then(function (targets) {
                    var targetsIds = this.mapEcranisedFields(targets, 'Territory__c');
                    config += " WHERE Effective_Date__c != null";
                    config += " AND Effective_Date__c <= THIS_MONTH";
                    config += " AND (Deactivation_Date__c = null OR Deactivation_Date__c >= LAST_MONTH)";
                    config += " AND Target__r.Territory__c IN (" + targetsIds.join(',') + ")";
                    config += " AND Account__r.RecordType.Name != null";
                    return config;
                }.bind(this))
            }.bind(this));
        };

        AssigmentDetailCollection.prototype.fetchUserAssignmentDetails = function () {
            var userCollectionInstance = new userCollection();
            return userCollectionInstance.getActiveUser().then(function (activeUser) {
                return this.fetchAll().then(this.fetchRecursiveFromCursor).then(function (assignmentDetails) {
                    if (activeUser.Designation__c == 'ZBM') {
                        var groupedDetails = {},
						    territoryId;
                        assignmentDetails.filter(function (assignmentDetail) {
                            return !!assignmentDetail['Target__r'];
                        }).forEach(function (assignmentDetail) {
                            territoryId = assignmentDetail['Target__r']['Territory__c'];
                            if (!groupedDetails[territoryId]) {
                                groupedDetails[territoryId] = [];
                            }
                            groupedDetails[territoryId].push(assignmentDetail);
                        });
                        $rootScope.newCustomerAppointmentDetails = groupedDetails;
                        return groupedDetails;
                    } else {
                        $rootScope.newCustomerAppointmentDetails = assignmentDetails;
                        return assignmentDetails;
                    }
                });
            }.bind(this));
        };

        return AssigmentDetailCollection;
    }


    abbottApp.factory('assigmentDetailCollection', ['utils', 'entityCollection', 'assigmentDetailModel', 'targetCollection', 'userCollection', '$rootScope', assigmentDetailCollection]);
})();
