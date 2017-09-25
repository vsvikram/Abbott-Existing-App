(function() {
    function dcrCollection(utils, Query, entityCollection, dcrModel, $injector, $q, sfdcAccount, $rootScope) {
        var DcrCollection = function() {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            this.uploadEntitiesQuery = utils.bind(this.uploadEntitiesQuery, this);
            this.onUploadingStarted = utils.bind(this.onUploadingStarted, this);
            this.isDcrTodaySubmited = utils.bind(this.isDcrTodaySubmited, this);
            this.isDcrSubmitedByDate = utils.bind(this.isDcrSubmitedByDate, this);
            this.getDcrToday = utils.bind(this.getDcrToday, this);
            this.getDcrByDate = utils.bind(this.getDcrByDate, this);
            this.isExsistDcrActivityAfterDate = utils.bind(this.isExsistDcrActivityAfterDate, this);
            this.getLastSubmitted = utils.bind(this.getLastSubmitted, this);
            this.getSubmittedDCRsFromSFDC = utils.bind(this.getSubmittedDCRsFromSFDC, this);
            this.getDCRsIdsByDate = utils.bind(this.getDCRsIdsByDate, this);
            this.getDcrJunctionsIdsRelatedToDCR = utils.bind(this.getDcrJunctionsIdsRelatedToDCR, this);
            this.removeSavedDCRcDataFromSFDC = utils.bind(this.removeSavedDCRcDataFromSFDC, this);
            this.removeEntitiesRelatedToDCR = utils.bind(this.removeEntitiesRelatedToDCR, this);
            this.removeExistingDCRcData = utils.bind(this.removeExistingDCRcData, this);
            this.filterExistingDCRs = utils.bind(this.filterExistingDCRs, this);
            this.onUploadingFinished = utils.bind(this.onUploadingFinished, this);
            this.getDCRFromSFDCById = utils.bind(this.getDCRFromSFDCById, this);
            this.getRelatedFromSalesforceByDcrId = utils.bind(this.getRelatedFromSalesforceByDcrId, this);
            DcrCollection.super.constructor.apply(this, arguments);
        };
        DcrCollection = utils.extend(DcrCollection, entityCollection);

        DcrCollection.prototype.model = dcrModel;

        DcrCollection.prototype.uploadEntitiesQuery = function() {
            var query = new Query().selectFrom(this.model.tableSpec.local).where({
                __local__: true,
                Status__c: 'Submitted'
            });
            return this.instantPromise(query);
        };

        DcrCollection.prototype.getSubmittedDCRsFromSFDC = function() {
            return this.serverConfig().then(this.fetchFromSalesforce).then(this.fetchRecursiveFromResponse).then(function(records) {
                return records.filter(function(record) {
                    return record.Status__c === "Submitted";
                }).map(function(record) {
                    return record.Date__c;
                });
            })
        };

        DcrCollection.prototype.getDCRsIdsByDate = function(datesArray) {
            var that = this;
            return this.fetchAllWhereIn("Date__c", datesArray).then(this.fetchRecursiveFromCursor).then(function(entities) {
                var DCRsIdsArray = entities.map(function(entity) {
                    return {
                        'Id': entity._soupEntryId,
                        'Date__c': entity.Date__c
                    };
                });
                return that.removeEntities(entities).then(function() {
                    return DCRsIdsArray;
                });
            });
        };

        DcrCollection.prototype.getDcrJunctionsIdsRelatedToDCR = function(DCRsIdsArray) {
            var DcrJunctionCollection = $injector.get('dcrJunctionCollection'),
                collectionInstance = new DcrJunctionCollection;
            return collectionInstance.fetchAllWhereIn("DCR__c", DCRsIdsArray).then(this.fetchRecursiveFromCursor).then(function(entities) {
                return entities.map(function(entity) {
                    return entity._soupEntryId;
                });
            });
        };

        DcrCollection.prototype.removeEntitiesRelatedToDCR = function(collection, field, idsArray) {
            var collectionInstance = new collection;
            return collectionInstance.fetchAllWhereIn(field, idsArray).then(collectionInstance.fetchRecursiveFromCursor).then(collectionInstance.removeEntities);
        };

        DcrCollection.prototype.removeExistingDCRcData = function(DCRData) {
            var that = this,
                DcrJunctionCollection = $injector.get('dcrJunctionCollection'),
                DcrDropCollection = $injector.get('dcrDropCollection'),
                DcrBrandActivityCollection = $injector.get('dcrBrandActivityCollection'),
                DcrJFWCollection = $injector.get('dcrJFWCollection'),
                DcrKeyMessageCollection = $injector.get('dcrKeyMessageCollection'),
                DcrFollowupActivityCollection = $injector.get('dcrFollowupActivityCollection'),
                DcrKpiDataCollection = $injector.get('dcrKpiDataCollection'),
                MaterialTransaction = $injector.get('materialTransactionCollection'),

                DCRsIdsArray = DCRData.map(function(entity) {
                    return entity.Id;
                }),
                DCRDateArray = DCRData.map(function(entity) {
                    return entity.Date__c;
                });
            return this.getDcrJunctionsIdsRelatedToDCR(DCRsIdsArray).then(function(DCRJunctionsIdsArray) {
                return $q.all([
                    that.removeEntitiesRelatedToDCR(DcrKeyMessageCollection, "DCR_Junction__c", DCRJunctionsIdsArray),
                    that.removeEntitiesRelatedToDCR(DcrFollowupActivityCollection, "DCR_Junction__c", DCRJunctionsIdsArray)
                ]);
            }).then(function() {
                return $q.all([
                    that.removeEntitiesRelatedToDCR(DcrJunctionCollection, "DCR__c", DCRsIdsArray),
                    that.removeEntitiesRelatedToDCR(DcrDropCollection, "DCR__c", DCRsIdsArray),
                    that.removeEntitiesRelatedToDCR(DcrBrandActivityCollection, "DCR__c", DCRsIdsArray),
                    that.removeEntitiesRelatedToDCR(DcrJFWCollection, "DCR__c", DCRsIdsArray),
                    that.removeEntitiesRelatedToDCR(DcrKpiDataCollection, "DCR__c", DCRsIdsArray),
                    that.removeEntitiesRelatedToDCR(MaterialTransaction, "Call_Date__c", DCRDateArray)
                ]);
            }).then(function() {
                return DCRsIdsArray;
            });
        };

        //TODO: change the code of getting DCR twice and make it generic
        DcrCollection.prototype.getSavedDCRsFromSFDC = function(entities) {
            var that = this;
            return sfdcAccount.getCurrentUserId().then(function(userId) {
                var queryFields = that.mapFields();
                var query = 'SELECT ' + queryFields + ' FROM ' + that.model.tableSpec.sfdc;
                query += " WHERE Status__c = 'Saved' AND Date__c > = LAST_MONTH AND Date__c <= THIS_MONTH AND User__c = '" + userId + "' ORDER BY Date__c ASC";
                return query;
            }).then(this.fetchFromSalesforce).then(this.fetchRecursiveFromResponse).then(function(savedRecords) {
                var filtered = [];
                for (var i in savedRecords) {
                    for (var j in entities) {
                        if (savedRecords[i].Date__c === entities[j].Date__c) {
                            filtered.push(savedRecords[i]);
                        }
                    }
                }
                return filtered;
            });
        };

        DcrCollection.prototype.getRelatedFromSalesforceByDcrId = function(collection, ids) {
            var collectionInstance = new collection;
            var queryFields = collectionInstance.mapFields();
            var dcrIdString = ids.join("','");
            var query = 'SELECT ' + queryFields + ' FROM ' + collectionInstance.model.tableSpec.sfdc;
            query += " WHERE DCR__c IN ('" + dcrIdString + "')";
            return collectionInstance.fetchFromSalesforce(query).then(collectionInstance.fetchRecursiveFromResponse);
        };

        DcrCollection.prototype.getIdsSavedDCR = function(tableName, condtionTable, entities) {
            var IdsArray = this.mapEcranisedFields(entities, 'Id'),
                query = "select Id from " + tableName + " where " + condtionTable + " in (" + IdsArray + ")",
                that = this;
            return this.fetchFromSalesforce(query).then(this.fetchRecursiveFromResponse).then(function(entities) {
                return entities;
            });
        };

        DcrCollection.prototype.removeSavedDCRcDataFromSFDC = function(entities) {
            if (entities && entities.length) {
                return this.deleteEntitiesFromSfdc(entities, "DCR__c");
                /*var that = this;

                return this.getIdsSavedDCR("DCR_Junction__c", "DCR__c", entities).then(function (DCRJunctions) {
                    return $q.all([that.removeEntitiesRelatedToSavedDCR("DCR_Key_Message__c", "DCR_Junction__c", DCRJunctions), that.removeEntitiesRelatedToSavedDCR("DCR_Followup_Activity__c", "DCR_Junction__c", DCRJunctions)]).then(function () {
                        that.deleteEntitiesFromSfdc(DCRJunctions, "DCR_Junction__c");
                    });
                }).then(function () {
                    if ($rootScope.clmEnabled) {
                        return $q.all([that.removeEntitiesRelatedToSavedDCR("DCR_Drop__c", "DCR__c", entities), that.removeEntitiesRelatedToSavedDCR("DCR_Brand_Activity__c", "DCR__c", entities), that.removeEntitiesRelatedToSavedDCR("DCR_JFW__c", "DCR__c", entities), that.removeEntitiesRelatedToSavedDCR("DCR_KpiData__c", "DCR__c", entities)]);
                    } else {
                        return $q.all([that.removeEntitiesRelatedToSavedDCR("DCR_Drop__c", "DCR__c", entities), that.removeEntitiesRelatedToSavedDCR("DCR_Brand_Activity__c", "DCR__c", entities), that.removeEntitiesRelatedToSavedDCR("DCR_JFW__c", "DCR__c", entities)]);
                    }
                }).then(function () {
                   return that.deleteEntitiesFromSfdc(entities, "DCR__c");
                });*/
            } else {
                return true;
            }
        };

        DcrCollection.prototype.removeEntitiesRelatedToSavedDCR = function(tableName, conditionTable, entities) {
            if (entities && entities.length) {
                var that = this;
                return this.getIdsSavedDCR(tableName, conditionTable, entities).then(function(entity) {
                    if (entity && entity.length) {
                        that.deleteEntitiesFromSfdc(entity, tableName);
                    }
                });
            } else {
                return true;
            }
        };

        DcrCollection.prototype.removeDCREntitiesFromSFDC = function(collection, field, idsArray) {
            var collectionInstance = new collection;
            return collectionInstance.fetchAllWhereIn(field, idsArray).then(this.fetchRecursiveFromCursor).then(this.removeEntities);
        };

        DcrCollection.prototype.filterExistingDCRs = function(entities) {
            var that = this;
            return this.getSavedDCRsFromSFDC(entities).then(this.removeSavedDCRcDataFromSFDC).then(this.getSubmittedDCRsFromSFDC).then(this.getDCRsIdsByDate).then(this.removeExistingDCRcData).then(function(DCRsIdsArray) {
                var filteredEntities = entities.filter(function(entity) {
                    return DCRsIdsArray.indexOf(entity._soupEntryId) === -1
                });
                return that.instantPromise(filteredEntities);
            });
        };

        DcrCollection.prototype.onUploadingStarted = function(entities) {
            entities = entities.map(function(entity) {
                entity['UserNDateCombination__c'] = entity['User__c'] + entity['Date__c'];
                entity['Status__c'] = 'Saved';
                return entity;
            });
            return this.filterExistingDCRs(entities);
        };

        DcrCollection.prototype.onUploadingFinished = function(entities) {
            entities = entities.map(function(entity) {
                entity['Status__c'] = 'Submitted';
                return entity;
            });
            return this.upsertEntities(entities);
        };

        DcrCollection.prototype.prepareServerConfig = function(configPromise) {
            return configPromise.then(function(config) {
                return sfdcAccount.getCurrentUserId().then(function(userId) {
                    config += " WHERE Status__c = 'Submitted' and Date__c > = LAST_MONTH AND Date__c <= THIS_MONTH AND User__c = '" + userId + "' ORDER BY Date__c ASC";
                    return config;
                });
            });
        };

        DcrCollection.prototype.isDcrTodaySubmited = function() {
            return this.isDcrSubmitedByDate(moment());
        };

        DcrCollection.prototype.isDcrSubmitedByDate = function(moment) {
            var query = new Query().selectCountFrom(this.model.tableSpec.local).where({
                'Date__c': moment.format('YYYY-MM-DD'),
                'Status__c': 'Submitted'
            });
            return this.fetchWithQuery(query).then(this.getEntityFromResponse).then(function(count) {
                return !!count;
            });
        };
        // TODO: refactor next function
        DcrCollection.prototype.isExsistDcrActivityAfterDate = function(moment, activityId) {
            var query = new Query().selectCountFrom(this.model.tableSpec.local).where({
                'Date__c': moment.format('YYYY-MM-DD')
            }, Query.GR).where({
                'Status__c': 'Submitted',
                'Activity1__c': activityId
            }).or().where({
                'Date__c': moment.format('YYYY-MM-DD')
            }, Query.GR).where({
                'Status__c': 'Submitted',
                'Activity2__c': activityId
            });
            return this.fetchWithQuery(query).then(this.getEntityFromResponse).then(function(count) {
                return !!count;
            });
        };

        DcrCollection.prototype.getDcrByDate = function(moment) {
            var query = this._fetchAllQuery().where({
                'Date__c': moment.format('YYYY-MM-DD')
            });
            return this.fetchWithQuery(query).then(this.getEntityFromResponse);
        };

         DcrCollection.prototype.changeDCRLocalStatus = function (){
                var self = this;
                    return this.fetchEntitiesForUpload().then(function (entities) {
                        var entitiesToRemove = entities.filter(function (entity) {
                                 return typeof entity.Id == 'number';
                            });
                        if(entitiesToRemove && entitiesToRemove.length){                         
                        self.filterExistingDCRs(entitiesToRemove);
                        }
                });
        };

        DcrCollection.prototype.changeDCRStatus = function() {
            var that = this,
                dcrEntites = [],
                DcrJunctionCollection = $injector.get('dcrJunctionCollection'),
                DcrBrandActivityCollection = $injector.get('dcrBrandActivityCollection'),
                DcrJFWCollection = $injector.get('dcrJFWCollection');

            return this.fetchEntitiesForUpload().then(function(entities) {
                dcrEntites = entities;
                var dcrIDs = entities.map(function(dcr) {
                    return dcr.Id;
                });
                return $q.all([that.getRelatedFromSalesforceByDcrId(DcrJunctionCollection, dcrIDs), that.getRelatedFromSalesforceByDcrId(DcrJFWCollection, dcrIDs)]);
            }).then(function(dcrRelatedRecords) {
                var dcrJunctions = dcrRelatedRecords[0];
                var dcrJfws = dcrRelatedRecords[1];
                var filteredEntites = [];
                dcrEntites = dcrEntites.sort(function(currDate, nextDate) {
                    currDate = new Date(currDate.Date__c);
                    nextDate = new Date(nextDate.Date__c);
                    return currDate > nextDate ? -1 : currDate < nextDate ? 1 : 0;
                });
                dcrEntites.some(function(entity) {
                    entity["Status__c"] = "Submitted";
                    var dcrJunctionsForEntity = dcrJunctions.filter(function(junction) {
                        return junction.DCR__c == entity.Id;
                    });
                    var dcrJfwsForEntity = dcrJfws.filter(function(jfw) {
                        return jfw.DCR__c == entity.Id;
                    });
                    if (entity.DCR_JFW_Count__c == dcrJfwsForEntity.length && entity.DCR_Junction_Count__c == dcrJunctionsForEntity.length)
                        filteredEntites.push(entity);
                    else
                        return false;
                });
                return this._upsertEntitiesToServerRecursively(filteredEntites).then(function(entities) {
                    entities.map(function(entity) {
                        entity.Synced = 'true';
                        return entity;
                    })
                    return this.upsertEntities(entities)
                }.bind(this));
            }.bind(this));
        };

        DcrCollection.prototype.getDcrToday = function() {
            return this.getDcrByDate(moment());
        };

        DcrCollection.prototype.getLastSubmitted = function() {
            var query = this._fetchAllQuery().where({
                Status__c: 'Submitted'
            }).orderBy(['Date__c'], Query.DESC).limit(1);
            return this.fetchWithQuery(query).then(this.getEntityFromResponse);
        };


        return DcrCollection;
    }


    abbottApp.factory('dcrCollection', ['utils', 'query', 'entityCollection', 'dcrModel', '$injector', '$q', 'sfdcAccount', '$rootScope', dcrCollection]);
})();