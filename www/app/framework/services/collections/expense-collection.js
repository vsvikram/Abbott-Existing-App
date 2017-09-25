(function () {
    function expenseCollection(utils, entityCollection, expenseModel, sfdcAccount, dcrCollection, userCollection, $injector) {
        var ExpenseCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            this.onUploadingStarted = utils.bind(this.onUploadingStarted, this);
            this.removeExpense = utils.bind(this.removeExpense, this);
            this.removeExpenseDetails = utils.bind(this.removeExpenseDetails, this);
            this.filterExistingExpenses = utils.bind(this.filterExistingExpenses, this);
            this.getExpenseFromSFDC = utils.bind(this.getExpenseFromSFDC, this);
            this.removeAttachments = utils.bind(this.removeAttachments, this);
           this.deleteEntityFromSfdc = utils.bind(this.deleteEntityFromSfdc, this);
            ExpenseCollection.super.constructor.apply(this, arguments);
        };
        ExpenseCollection = utils.extend(ExpenseCollection, entityCollection);

        ExpenseCollection.prototype.model = expenseModel;

        ExpenseCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
                    .then(function (con) {
                        return (new userCollection()).getActiveUser().then(function (activeUser) {
                            if (activeUser.Designation__c == 'ABM' || activeUser.Designation__c == 'ZBM') {
                                var queryFields = expenseModel.sfdc.filter(function (field) {
                                    return field != 'Hill_Station_Allowance__c';
                                }).map(function (field) {
                                    return field;
                                }).join(',');
                            }
                            else if (activeUser.Designation__c == 'TBM') {
                                var queryFields = expenseModel.sfdc.map(function (field) {
                                    return field;
                                }).join(',');
                            }
                            var config = 'SELECT ' + queryFields + ' FROM ' + expenseModel.tableSpec.sfdc;
                            return sfdcAccount.getCurrentUserId()
                            .then(function (userId) {
                                config += " WHERE DCR__c IN (SELECT  Id FROM DCR__c where  User__c = '" + userId + "'AND  Date__c >= LAST_MONTH AND Date__c <= THIS_MONTH) AND Status__c != 'Saved'";
                                return config;
                            })
                        })
                    });
        };

        ExpenseCollection.prototype.onUploadingStarted = function (entities) {
            if (entities && entities.length) {
                return this.updateRelationFieldByCollectionField(entities, dcrCollection, 'DCR__c').then(function (records) {
                   if(records && records.length){
                        return records.filter(function (record) {
                            return typeof (record['DCR__c']) !== 'number';
                        });
                    }else{
                    /* when records is not available that is DCR is synced and downloaded, _soupEntryId is not available and expense not yet been synced */
                        var dcrCollectionInstance = new dcrCollection();
                        var dates = entities.map(function(entity){
                            return entity.Expense_Date__c;
                        })
                        return dcrCollectionInstance.fetchAllWhereIn('Date__c',dates).then(dcrCollectionInstance.fetchRecursiveFromCursor).then(function(dcrList){
                            if(dcrList && dcrList.length){
                                entities = entities.map(function(entity){
                                    angular.forEach(dcrList,function(dcr){
                                        if(entity.Expense_Date__c == dcr.Date__c && dcr.isMobileDCR__c && dcr.Status__c == 'Submitted'){
                                            entity.DCR__c = dcr.Id;
                                        }
                                    });
                                    return entity;
                                }).filter(function(entity){
                                    return typeof entity.DCR__c !== 'number';
                                });
                                 return entities;
                            }else{
                                return [];
                            }
                        })
                    }
                }).then(this.filterExistingExpenses);
            } else {
                return entities;
            }
        };

        ExpenseCollection.prototype.removeExpense = function (days) {
            var that = this;
            return this.fetchAllWhereIn("Expense_Date__c", days).then(this.fetchRecursiveFromCursor).then(function (entities) {
                var expenseIdsArray = entities.map(function (entity) {
                    return entity.Id
                });
                return that.removeExpenseDetails(expenseIdsArray).then(function () {
                    angular.forEach(entities, function (entity) {
                        if (that.isLocalEntity(entity)) {
                            return that.removeEntities([entity]);
                        } else {
                            angular.extend(entity, that.localModificationForEntity(entity, false, false, true));
                            that.updateEntities([entity]);
                        }
                    });
                    return entities;
                });
            });
        };
        ExpenseCollection.prototype.removeExpenseDetails = function (expenseIds) {
            var that = this;
            var ExpenseDetailsCollection = $injector.get('expenseDetailsCollection'),
                collectionInstance = new ExpenseDetailsCollection;
            return collectionInstance.fetchAllWhereIn("Expense__c", expenseIds).then(collectionInstance.fetchRecursiveFromCursor).then(function (entities) {
                var expenseDetailIds = entities.map(function (entity) {
                    return entity._soupEntryId
                });
                return that.removeAttachments(expenseDetailIds).then(function () {
                    angular.forEach(entities, function (entity) {
                        if (collectionInstance.isLocalEntity(entity)) {
                            return collectionInstance.removeEntities([entity]);
                        } else {
                            angular.extend(entity, collectionInstance.localModificationForEntity(entity, false, false, true));
                            collectionInstance.updateEntities([entity]);
                        }
                    });
                    return entities;
                });
            });
        };

        ExpenseCollection.prototype.removeAttachments = function (expenseDetailIds) {
            var that = this;
            var AttachmentCollection = $injector.get('attachmentCollection'),
                collectionInstance = new AttachmentCollection;
            return collectionInstance.fetchAllWhereIn("ParentId", expenseDetailIds).then(collectionInstance.fetchRecursiveFromCursor).then(function (entities) {
                angular.forEach(entities, function (entity) {
                    if (collectionInstance.isLocalEntity(entity)) {
                        return collectionInstance.removeEntities([entity]);
                    } else {
                        angular.extend(entity, collectionInstance.localModificationForEntity(entity, false, false, true));
                        collectionInstance.updateEntities([entity]);
                    }
                });
                return entities;
            });
        };

        ExpenseCollection.prototype.filterExistingExpenses = function (entities) {
            var that = this;
            if(entities && entities.length){
            return this.getExpenseFromSFDC(entities).then(function (filteredEntities) {
                var expenseDates = [];
                expenseDates = filteredEntities.map(function (entity) {
                    return entity.Expense_Date__c;
                });
                return that.removeExpense(expenseDates).then(function () {
                    return filteredEntities;
                });
            }).then(function (entitiesToRemove) {
                var expenseDateArray = [];
                angular.forEach(entitiesToRemove, function (entity) {
                    expenseDateArray.push(entity.Expense_Date__c);
                });
                var filteredEntities = entities.filter(function (entity) {
                    return expenseDateArray.indexOf(entity.Expense_Date__c) === -1;
                });
                return that.instantPromise(filteredEntities);
            });
            }else
                return entities;
        };

        ExpenseCollection.prototype.getExpenseFromSFDC = function (entities) {
        var self = this;
            if (entities && entities.length) {
                entities = entities.filter(function (entity) {
                    return !!entity.DCR__c;;
                });
                var dcrs = entities.map(function (entity) {
                    return "'" + entity.DCR__c + "'";
                }).join(",")
                var filtered = [];
                if (dcrs && dcrs.length) {
                    var query = "SELECT Id, Expense_Date__c, Status__c FROM Expense__c WHERE DCR__c IN (" + dcrs + ")";
                    return this.fetchFromSalesforce(query).then(this.fetchRecursiveFromResponse).then(function (existingRecords) {
                        angular.forEach(existingRecords, function (extRec) {
                            if(extRec.Status__c == 'Saved'){
                            // delete from web
                                self.deleteEntityFromSfdc(extRec);
                            }else{
                                angular.forEach(entities, function (entity) {
                                    if (extRec.Expense_Date__c === entity.Expense_Date__c) {
                                        filtered.push(entity);
                                    }
                                });
                            }
                        });
                        // already submitted in salesforce, remove from local
                        return filtered;
                    });
                } else
                    return filtered;
            } else
                return entities;
        };

         ExpenseCollection.prototype.onUploadingFinished = function (entities) {
                    entities = entities.map(function (entity) {
                        entity['Status__c'] = 'Submitted';
                        return entity;
                    });
                 return this.upsertEntities(entities);
          };

           ExpenseCollection.prototype.changeExpenseStatus = function () {
               return this.fetchEntitiesForUpload().then(function (entities) {
                           var entitiesToUpload = entities.filter(function (entity) {
                                return typeof entity.Id !=='number';
                           });
                             var entitiesToRemove = entities.filter(function (entity) {
                                return typeof entity.Id ==='number';
                           }).map(function(entity){
                               return entity.Expense_Date__c;
                           });
                          entities = entities.map(function (entity) {
                              entity["Status__c"] = "Submitted";
                              delete entity['DCR__c'];
                              return entity;
                          });
                          this.removeExpense(entitiesToRemove);
                          return this._upsertEntitiesToServerRecursively(entitiesToUpload);
                      }.bind(this));
                  };

        return ExpenseCollection;
    };


    abbottApp.factory('expenseCollection', ['utils', 'entityCollection', 'expenseModel', 'sfdcAccount', 'dcrCollection', 'userCollection', '$injector', expenseCollection]);
})();
