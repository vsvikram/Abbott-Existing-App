(function () {
    function entityCollection($q, utils, Query, QueryCursor, sfdcAccount) {
        var EntityCollection = function () {
            this.store = utils.bind(this.store, this);
            this.instantPromise = utils.bind(this.instantPromise, this);
            this.initSoup = utils.bind(this.initSoup, this);
            this.clearSoup = utils.bind(this.clearSoup, this);
            this.mapEcranisedFields = utils.bind(this.mapEcranisedFields, this);
            this.mapFields = utils.bind(this.mapFields, this);
            this.serverConfig = utils.bind(this.serverConfig, this);
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            this.fetchFromSalesforce = utils.bind(this.fetchFromSalesforce, this);
            this.syncDown = utils.bind(this.syncDown, this);
            this.syncUp = utils.bind(this.syncUp, this);
            this.uploadEntitiesQuery = utils.bind(this.uploadEntitiesQuery, this);
            this.fetchEntitiesForUpload = utils.bind(this.fetchEntitiesForUpload, this);
            this.onUploadingStarted = utils.bind(this.onUploadingStarted, this);
            this._upsertEntitiesToServerRecursively = utils.bind(this._upsertEntitiesToServerRecursively, this);
            this.sfdcMethodForEntity = utils.bind(this.sfdcMethodForEntity, this);
            this.upsertEntityToServer = utils.bind(this.upsertEntityToServer, this);
            this.upsertEntityToSfdc = utils.bind(this.upsertEntityToSfdc, this);
            this.updateEntityToSfdc = utils.bind(this.updateEntityToSfdc, this);
            this.deleteEntityFromSfdc = utils.bind(this.deleteEntityFromSfdc, this);
            this.onUploadingFinished = utils.bind(this.onUploadingFinished, this);
            this.updateRelationFieldByCollectionField = utils.bind(this.updateRelationFieldByCollectionField, this);
            this.fetchRecursiveFromResponse = utils.bind(this.fetchRecursiveFromResponse, this);
            this.upsertLoadedEntities = utils.bind(this.upsertLoadedEntities, this);
            this.mergeWithLocalEntities = utils.bind(this.mergeWithLocalEntities, this);
            this.onDownloadingFinished = utils.bind(this.onDownloadingFinished, this);
            this._createSmartSqlQuery = utils.bind(this._createSmartSqlQuery, this);
            this.fetchWithQuery = utils.bind(this.fetchWithQuery, this);
            this._fetchAllQuery = utils.bind(this._fetchAllQuery, this);
            this._fetchCountQuery = utils.bind(this._fetchCountQuery, this);
            this.fetchAll = utils.bind(this.fetchAll, this);
            this.fetchAllCollectionEntities = utils.bind(this.fetchAllCollectionEntities, this);
            this.fetchRecursiveFromCursor = utils.bind(this.fetchRecursiveFromCursor, this);
            this.getEntity = utils.bind(this.getEntity, this);
            this.getEntityFromResponse = utils.bind(this.getEntityFromResponse, this);
            this.fetchEntityById = utils.bind(this.fetchEntityById, this);
            this.fetchAllWhere = utils.bind(this.fetchAllWhere, this);
            this.fetchAllWhereIn = utils.bind(this.fetchAllWhereIn, this);
            this.fetchAllLike = utils.bind(this.fetchAllLike, this);
            this.fetchAllWhereLike = utils.bind(this.fetchAllWhereLike, this);
            this.fetchAllAndSortBy = utils.bind(this.fetchAllAndSortBy, this);
            this.fetchAllWhereAndSortBy = utils.bind(this.fetchAllWhereAndSortBy, this);
            this.fetchAllWhereInAndSortBy = utils.bind(this.fetchAllWhereInAndSortBy, this);
            this.fetchAllLikeAndSortBy = utils.bind(this.fetchAllLikeAndSortBy, this);
            this.fetchAllWhereLikeAndSortBy = utils.bind(this.fetchAllWhereLikeAndSortBy, this);
            this.markEntityAsNonModified = utils.bind(this.markEntityAsNonModified, this);
            this.removeUnscopedQuery = utils.bind(this.removeUnscopedQuery, this);
            this.removeUnscopedEntities = utils.bind(this.removeUnscopedEntities, this);
            this.isLocalEntity = utils.bind(this.isLocalEntity, this);
            this.upsertSfdcEntities = utils.bind(this.upsertSfdcEntities, this);
            this.localModificationForEntity = utils.bind(this.localModificationForEntity, this);
            this.markModifiedEntities = utils.bind(this.markModifiedEntities, this);
            this.updateEntities = utils.bind(this.updateEntities, this);
            this.upsertEntities = utils.bind(this.upsertEntities, this);
            this.removeEntities = utils.bind(this.removeEntities, this);
            this.updateEntity = utils.bind(this.updateEntity, this);
            this.removeEntity = utils.bind(this.removeEntity, this);
            this.removeEntitiesByIds = utils.bind(this.removeEntitiesByIds, this);
            this.deleteEntitiesFromSfdc = utils.bind(this.deleteEntitiesFromSfdc, this);
            this.onRemoveFinished = utils.bind(this.onRemoveFinished, this);
            this.onRemoveStarted = utils.bind(this.onRemoveStarted, this);
            this.removeEntitiesQuery = utils.bind(this.removeEntitiesQuery, this);
            this.syncRemove = utils.bind(this.syncRemove, this);
        };

        EntityCollection.prototype.pageSize = 2000;
        EntityCollection.prototype.model = null;
        EntityCollection.prototype.METHODS = {
            CREATE: 'create',
            UPDATE: 'update',
            UPSERT: 'upsert',
            DELETE: 'delete'
        };

        EntityCollection.prototype.store = function () {
            return cordova.require('com.salesforce.plugin.smartstore');
        };

        EntityCollection.prototype.instantPromise = function (promiseValue) {
            return $q.when(promiseValue);
        };

        EntityCollection.prototype.initSoup = function () {
            var deferred = $q.defer();
            this.store().soupExists(true, this.model.tableSpec.local, function (isSoupExist) {
                if (isSoupExist) {
                    deferred.resolve();
                } else {
                    this.store().registerSoup(true, this.model.tableSpec.local, this.model.indexSpec, deferred.resolve, deferred.reject);
                }
            }.bind(this), deferred.reject);
            return deferred.promise;
        };

        EntityCollection.prototype.isSoupPresent = function () {
                    var deferred = $q.defer();
                    this.store().soupExists(true, this.model.tableSpec.local, function (isSoupExist) {
                        if (isSoupExist) {
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    }.bind(this), deferred.reject);
                    return deferred.promise;
        };

        EntityCollection.prototype.clearSoup = function () {
            var deferred = $q.defer();
            this.store().soupExists(true, this.model.tableSpec.local, function (isSoupExist) {
                if (isSoupExist) {
                    this.store().clearSoup(true, this.model.tableSpec.local, deferred.resolve, deferred.reject);
                } else {
                    deferred.resolve();
                }
            }.bind(this), deferred.reject);
            return deferred.promise;
        };

        EntityCollection.prototype.removeSoup = function () {
            var deferred = $q.defer();
            this.store().soupExists(true, this.model.tableSpec.local, function (isSoupExist) {
                if (isSoupExist) {
                    this.store().removeSoup(true, this.model.tableSpec.local, deferred.resolve, deferred.reject);
                } else {
                    deferred.resolve();
                }
            }.bind(this), deferred.reject);
            return deferred.promise;
        };

        EntityCollection.prototype.mapEcranisedFields = function (collection, field) {
            return utils.mapFieldFromCollection(collection, field).map(Query.valueOf);
        };

        EntityCollection.prototype.mapFields = function () {
            return this.model.sfdc.join(',');
        };

        EntityCollection.prototype.serverConfig = function () {
            var queryFields = this.mapFields();
            var config = 'SELECT ' + queryFields + ' FROM ' + this.model.tableSpec.sfdc;
            return this.prepareServerConfig(this.instantPromise(config));
        };

        EntityCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise;
        };

        EntityCollection.prototype.fetchFromSalesforce = function (query) {
            var deferred = $q.defer();
            sfdcAccount
              .getSfdcClient()
              .query(query, deferred.resolve, deferred.reject);
            return deferred.promise;
        };

        EntityCollection.prototype.syncDown = function () {
            return this.serverConfig()
              .then(this.fetchFromSalesforce)
              .then(this.fetchRecursiveFromResponse)
              .then(this.onDownloadingFinished)
              .then(this.removeUnscopedEntities)
              .then(this.upsertLoadedEntities);
        };

        EntityCollection.prototype.syncUp = function () {
            return this.fetchEntitiesForUpload()
              .then(this.onUploadingStarted)
              .then(this._upsertEntitiesToServerRecursively)
              .then(this.onUploadingFinished);
        };

        EntityCollection.prototype.syncRemove = function (deleteLocally) {
            return this.fetchEntitiesToRemove()
              .then(this.onRemoveStarted)
              .then(function (records) {
                  if (!!deleteLocally)
                      this.removeEntities(records);
                  else
                      this.deleteEntitiesFromSfdc(records);
              }.bind(this))
              .then(this.onRemoveFinished);
        };

        EntityCollection.prototype.onRemoveStarted = function (records) {
            return this.instantPromise(records);
        };

        EntityCollection.prototype.onRemoveFinished = function (records) {
            return this.instantPromise(records);
        };

        EntityCollection.prototype.fetchEntitiesToRemove = function () {
            return this.removeEntitiesQuery()
                .then(this.fetchWithQuery)
                .then(this.fetchRecursiveFromCursor);
        };

        EntityCollection.prototype.removeEntitiesQuery = function () {
            return this.instantPromise(new Query().selectFrom(this.model.tableSpec.local).where({ __locally_deleted__: true }));
        };

        EntityCollection.prototype.uploadEntitiesQuery = function () {
            return this.instantPromise(new Query().selectFrom(this.model.tableSpec.local).where({ __local__: true }));
        };

        EntityCollection.prototype.fetchEntitiesForUpload = function () {
            return this.uploadEntitiesQuery()
              .then(this.fetchWithQuery)
              .then(this.fetchRecursiveFromCursor);
        };

        EntityCollection.prototype.onUploadingStarted = function (records) {
            return this.instantPromise(records);
        };

        EntityCollection.prototype._upsertEntitiesToServerRecursively = function (records) {
            var entity,
              syncedEntities = [],
              deferred = $q.defer(),
              upsertRecursion = function () {
                  if (!records.length) {
                      deferred.resolve(syncedEntities);
                  } else {
                      entity = records.pop();
                      this.upsertEntityToServer(entity)
                        .then(function (record) {
                            syncedEntities.push(record);
                        })
                        .catch(deferred.notify)
                        .finally(upsertRecursion);
                  }
              }.bind(this);
            upsertRecursion();
            return deferred.promise;
        };

        EntityCollection.prototype.sfdcMethodForEntity = function (entity) {
            return entity.__locally_deleted__ ? this.METHODS.DELETE : this.METHODS.UPSERT;
        };

        EntityCollection.prototype.upsertEntityToServer = function (entity) {
            var method = this.sfdcMethodForEntity(entity);
            if (method == this.METHODS.UPSERT) {
                return this.upsertEntityToSfdc(entity)
                  .then(function (updatedEntity) {
                      //entity = this.markEntityAsNonModified(entity);
                      entity.Id = (updatedEntity && updatedEntity.id) || entity.Id;
                      return this.updateEntity(entity);
                  }.bind(this));
            } else {
                return this.deleteEntityFromSfdc(entity)
                  .then(function () {
                      return this.removeEntity(entity);
                  }.bind(this));
            }
        };

        EntityCollection.prototype.updateEntityToSfdc = function (entity) {
            var deferred = $q.defer(),
              fields = this.model.getAttributes(entity),
              externalId = this.model.externalId,
              entityId = this.isLocalEntity(entity) ? null : entity[externalId];
            sfdcAccount
              .getSfdcClient().update(this.model.tableSpec.sfdc, entityId, fields, deferred.resolve, deferred.reject);
            return deferred.promise;
        };

        EntityCollection.prototype.upsertEntityToSfdc = function (entity) {
            var deferred = $q.defer(),
              fields = this.model.getAttributes(entity),
              externalId = this.model.externalId,
              entityId = this.isLocalEntity(entity) ? null : entity[externalId];
            sfdcAccount
              .getSfdcClient().upsert(this.model.tableSpec.sfdc, externalId, entityId, fields, deferred.resolve, deferred.reject);
            return deferred.promise;
        };

        EntityCollection.prototype.deleteEntityFromSfdc = function (entity) {
            var deferred = $q.defer();
            sfdcAccount
              .getSfdcClient().del(this.model.tableSpec.sfdc, entity.Id, deferred.resolve, deferred.reject);
            return deferred.promise;
        };

        EntityCollection.prototype.deleteEntitiesFromSfdc = function (entity) {
            var deferred = $q.defer();
            var that = this;
            if (entity && entity.length) {
                angular.forEach(entity, function (value, index) {
                    sfdcAccount
                      .getSfdcClient().del(that.model.tableSpec.sfdc, value.Id, deferred.resolve, deferred.reject);
                });
            } else {
                deferred.resolve;
            }
            return deferred.promise;
        };

        EntityCollection.prototype.updateRelationFieldByCollectionField = function (entities, collection, relationField, collectionField) {
            collectionField = collectionField || '_soupEntryId';
            var localRelationField = 'Local_' + relationField;
            entities = entities.map(function (entity) {
                if (!entity[localRelationField] || entity[localRelationField] == '')
                    entity[localRelationField] = entity[relationField];
                return entity;
            });
            var collectionInstance = new collection(),
              relatedIds = utils.mapFieldFromCollection(entities, localRelationField);

            return collectionInstance.fetchAllWhereIn(collectionField, relatedIds)
              .then(collectionInstance.fetchRecursiveFromCursor)
              .then(function (relatedRecordsList) {
                  var idMap = utils.mapCollectionToKeyValue(relatedRecordsList, collectionField, 'Id');
                  return entities.map(function (entity) {
                      if (typeof (entity[relationField]) == 'number' && idMap[entity[localRelationField]]) {
                          entity[relationField] = idMap[entity[localRelationField]];
                      } else if (typeof (entity[relationField]) == 'string' && idMap[entity[localRelationField]]) {
                          entity[relationField] = idMap[entity[localRelationField]];
                      }
                      delete entity['Id'];
                      return entity;
                  })
              }).then(function (records) {
                  return records.filter(function (entity) {
                      return typeof (entity[relationField]) != 'number' || entity[relationField].length > 0;
                  });
              })
              .then(function (entities) {
                  return this.upsertEntities(entities)
                    .then(function () {
                        return entities;
                    });
              }.bind(this))
        };

        EntityCollection.prototype.onUploadingFinished = function (records) {
            return this.instantPromise(records);
        };

        EntityCollection.prototype.fetchRecursiveFromResponse = function (response) {
            var that = this,
              deferred = $q.defer();
            if (!response.nextRecordsUrl) {
                deferred.resolve(response.records);
            } else {
                sfdcAccount
                  .getSfdcClient()
                  .queryMore(response.nextRecordsUrl, function (nextResponse) {
                      response.records = response.records.concat(nextResponse.records);
                      response.nextRecordsUrl = nextResponse.nextRecordsUrl;
                      deferred.resolve(that.fetchRecursiveFromResponse(response));
                  }, deferred.reject);
            }
            return deferred.promise;
        };

        EntityCollection.prototype.removeUnscopedQuery = function (entities) {
            var actualIds = utils.mapFieldFromCollection(entities, this.model.externalId);
            return this.instantPromise(this._fetchAllQuery().where({ __local__: false }).and().whereNotIn(this.model.externalId, actualIds));
        };

        EntityCollection.prototype.removeUnscopedEntities = function (entities) {
            return this.removeUnscopedQuery(entities)
              .then(this.fetchWithQuery)
              .then(this.fetchRecursiveFromCursor)
              .then(this.removeEntities)
              .then(function () {
                  return entities
              });
        };

        EntityCollection.prototype.upsertLoadedEntities = function (entities) {
            entities = entities.map(this.markEntityAsNonModified);
            return this.mergeWithLocalEntities(entities)
              .then(this.upsertSfdcEntities);
        };

        EntityCollection.prototype.mergeWithLocalEntities = function (entities) {
            var actualIds = utils.mapFieldFromCollection(entities, this.model.externalId);
            return this.fetchAllWhereIn(this.model.externalId, actualIds)
              .then(this.fetchRecursiveFromCursor)
              .then(function (existingEntities) {
                  if (!existingEntities.length) {
                      return entities;
                  }
                  var idMap = utils.mapCollectionToKeyValue(existingEntities, this.model.externalId);
                  return entities.map(function (entity) {
                      return angular.extend((idMap[entity[this.model.externalId]] || {}), entity);
                  }, this);
              }.bind(this));
        };

        EntityCollection.prototype.onDownloadingFinished = function (records) {
            return this.instantPromise(records);
        };

        EntityCollection.prototype._createSmartSqlQuery = function (query, soup, pageSize) {
            query = query.toString();
            return {
                queryType: 'smart',
                soupName: soup,
                smartSql: query,
                pageSize: pageSize
            };
        };

        EntityCollection.prototype.fetchWithQuery = function (query) {
            var deferred = $q.defer();
            query = this._createSmartSqlQuery(query, this.model.tableSpec.local, this.pageSize);
            this.store().runSmartQuery(true, query, function (response) {
                response = new QueryCursor(response);
                deferred.resolve(response);
            }, deferred.reject);
            return deferred.promise;
        };

        EntityCollection.prototype._fetchAllQuery = function () {
            return new Query().selectFrom(this.model.tableSpec.local);
        };

        EntityCollection.prototype._fetchCountQuery = function () {
            return new Query().selectCountFrom(this.model.tableSpec.local);
        };

        EntityCollection.prototype.fetchAll = function () {
            var query = this._fetchAllQuery();
            return this.fetchWithQuery(query);
        };

        EntityCollection.prototype.fetchAllCollectionEntities = function () {
            return this.fetchAll()
              .then(this.fetchRecursiveFromCursor);
        };

        EntityCollection.prototype.fetchRecursiveFromCursor = function (cursor) {
            var deferred = $q.defer(),
              recursionFetch = function (cursor) {
                  if (!cursor.hasMore()) {
                      cursor.closeCursor();
                      deferred.resolve(cursor.records);
                  } else {
                      cursor.getMore().then(recursionFetch);
                  }
              };
            recursionFetch(cursor);
            return deferred.promise;
        };

        EntityCollection.prototype.getEntity = function (records) {
            return records.length ? records[0] : null;
        };

        EntityCollection.prototype.getEntityFromResponse = function (response) {
            return response.records && response.records.length ? response.records[0] : null;
        };

        EntityCollection.prototype.fetchEntityById = function (id) {
            var that = this,
              fetchQuery = new Query().selectFrom(this.model.tableSpec.local).where({ Id: id });
            return this.fetchWithQuery(fetchQuery)
              .then(function (response) {
                  var record = that.getEntityFromResponse(response);
                  response.closeCursor();
                  return record;
              });
        };

        EntityCollection.prototype.fetchAllWhere = function (fieldsValues) {
            var query = this._fetchAllQuery().where(fieldsValues);
            return this.fetchWithQuery(query);
        };

        EntityCollection.prototype.fetchAllWhereIn = function (field, values) {
            var query = this._fetchAllQuery().whereIn(field, values);
            return this.fetchWithQuery(query);
        };

        EntityCollection.prototype.fetchAllLike = function (fieldsValues) {
            var query = this._fetchAllQuery().whereLike(fieldsValues);
            return this.fetchWithQuery(query);
        };

        EntityCollection.prototype.fetchAllWhereLike = function (whereFieldsValues, likeFieldsValues) {
            var query = this._fetchAllQuery().where(whereFieldsValues).and().whereLike(likeFieldsValues);
            return this.fetchWithQuery(query);
        };

        EntityCollection.prototype.fetchAllAndSortBy = function (sortFields, isAsc) {
            var order = isAsc ? Query.ASC : Query.DESC,
              query = this._fetchAllQuery().orderBy(sortFields, order);
            return this.fetchWithQuery(query);
        };

        EntityCollection.prototype.fetchAllWhereAndSortBy = function (fieldsValues, sortFields, isAsc) {
            var order = isAsc ? Query.ASC : Query.DESC,
              query = this._fetchAllQuery().where(fieldsValues).orderBy(sortFields, order);
            return this.fetchWithQuery(query);
        };

        EntityCollection.prototype.fetchAllWhereInAndSortBy = function (field, values, sortFields, isAsc) {
            var order = isAsc ? Query.ASC : Query.DESC,
              query = this._fetchAllQuery().whereIn(field, values).orderBy(sortFields, order);
            return this.fetchWithQuery(query);
        };

        EntityCollection.prototype.fetchAllLikeAndSortBy = function (fieldsValues, sortFields, isAsc) {
            var order = isAsc ? Query.ASC : Query.DESC,
              query = this._fetchAllQuery().whereLike(fieldsValues).orderBy(sortFields, order);
            return this.fetchWithQuery(query);
        };

        EntityCollection.prototype.fetchAllWhereLikeAndSortBy = function (whereFieldsValues, likeFieldsValues, sortFields, isAsc) {
            var order = isAsc ? Query.ASC : Query.DESC,
              query = this._fetchAllQuery().where(whereFieldsValues).and().whereLike(likeFieldsValues).orderBy(sortFields, order);
            return this.fetchWithQuery(query);
        };

        EntityCollection.prototype.markEntityAsNonModified = function (entity) {
            var nonModifiedValues = {
                __local__: false,
                __locally_created__: false,
                __locally_updated__: false,
                __locally_deleted__: false
            };
            return angular.extend(entity, nonModifiedValues);
        };

        EntityCollection.prototype.isLocalEntity = function (entity) {
            var externalId = this.model.externalId;
            return !entity[externalId] || (externalId == 'Id' && typeof (entity[externalId]) == 'number') || entity.__locally_created__;
        };

        EntityCollection.prototype.upsertSfdcEntities = function (entities) {
            var deferred = $q.defer();
            this.store().upsertSoupEntriesWithExternalId(true, this.model.tableSpec.local, entities, this.model.externalId, deferred.resolve, deferred.reject);
            return deferred.promise;
        };

        EntityCollection.prototype.localModificationForEntity = function (entity, created, updated, deleted) {
            created = created || !entity._soupEntryId;
            updated = updated || false;
            deleted = deleted || false;
            return {
                __locally_created__: created,
                __locally_updated__: updated,
                __locally_deleted__: deleted,
                __local__: created || updated
            };
        };

        EntityCollection.prototype.markModifiedEntities = function (entities) {
            if (!angular.isArray(entities)) {
                entities = [entities];
            }
            return entities.map(function (entity) {
                return angular.extend(entity, this.localModificationForEntity(entity, null, true, false));
            }, this);
        };

        EntityCollection.prototype.upsertEntities = function (entities) {
            if (!angular.isArray(entities)) {
                entities = [entities];
            }
            entities = this.markModifiedEntities(entities);
            return this.updateEntities(entities);
        };

        EntityCollection.prototype.updateEntities = function (entities) {
            if (!angular.isArray(entities)) {
                entities = [entities];
            }
            var deferred = $q.defer();
            this.store().upsertSoupEntries(true, this.model.tableSpec.local, entities, deferred.resolve, deferred.reject);
            return deferred.promise;
        };

        EntityCollection.prototype.removeEntities = function (entities) {
            console.log("entities", entities);
            entities = entities.map(function (entity) {
                return entity._soupEntryId;
            });
            return this.removeEntitiesByIds(entities);
        };

        EntityCollection.prototype.updateEntity = function (entity) {
            return this.updateEntities([entity])
              .then(this.getEntity);
        };

        EntityCollection.prototype.removeEntity = function (entity) {
            return this.removeEntitiesByIds([entity._soupEntryId])
              .then(this.getEntity);
        };

        EntityCollection.prototype.removeEntitiesByIds = function (entitiesIds) {
            var deferred = $q.defer();
            this.store().removeFromSoup(true, this.model.tableSpec.local, entitiesIds, deferred.resolve, deferred.reject);
            return deferred.promise;
        };

        return EntityCollection;
    }

    abbottApp.factory('entityCollection', [
      '$q',
      'utils',
      'query',
      'queryCursor',
      'sfdcAccount',
      entityCollection
    ]);
})();
