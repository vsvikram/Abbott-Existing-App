(function() {
	function dcrBrandActivityCollection(utils, entityCollection, dcrBrandActivityModel, sfdcAccount, DCRCollection, DCRJunctionCollection, $injector) {
		var DcrBrandActivityCollection = function(forSymposia) {
			this.forSymposia = !!forSymposia;
			this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
			this.uploadEntitiesQuery = utils.bind(this.uploadEntitiesQuery, this);
			this.onUploadingStarted = utils.bind(this.onUploadingStarted, this);
			DcrBrandActivityCollection.super.constructor.apply(this, arguments);
		};
		DcrBrandActivityCollection = utils.extend(DcrBrandActivityCollection, entityCollection);

		DcrBrandActivityCollection.prototype.model = dcrBrandActivityModel;

		DcrBrandActivityCollection.prototype.prepareServerConfig = function(configPromise) {
			return configPromise.then(function(config) {
				return sfdcAccount.getCurrentUserId().then(function(userId) {
					var innerSelectDcr = "SELECT Id FROM DCR__c";
					innerSelectDcr += " WHERE Status__c = 'Submitted'";
					innerSelectDcr += " AND Date__c >= LAST_MONTH";
					innerSelectDcr += " AND Date__c <= THIS_MONTH";
					innerSelectDcr += " AND User__c = '" + userId + "'";
					config += " WHERE DCR__c IN (" + innerSelectDcr + ")";
					return config;
				})
			});
		};

		DcrBrandActivityCollection.prototype.uploadEntitiesQuery = function() {
			return DcrBrandActivityCollection.super.uploadEntitiesQuery.apply(this, arguments).then( function(query) {
				if (this.forSymposia) {
					return query.and().whereNotNull('Corporate_Initiative__c');
				} else {
					return query.and().whereNull('Corporate_Initiative__c');
				}
			}.bind(this));
		};

		DcrBrandActivityCollection.prototype.onUploadingStarted = function(entities) {
			var DCRCollection = $injector.get('dcrCollection'),
			    dcrCollectionInstance = new DCRCollection;
			if (entities && entities.length) {
				var localDCRIds = entities.map(function(entity) {
					return entity['Local_DCR__c'];
				});
				return dcrCollectionInstance.fetchAllWhereIn('_soupEntryId', localDCRIds).then(dcrCollectionInstance.fetchRecursiveFromCursor).then(function(dcrs) {
					if (dcrs && dcrs.length) {
						var dcrList = dcrs;
						var deferred = this.updateRelationFieldByCollectionField(entities, DCRCollection, 'DCR__c').then( function(entities) {
							return this.updateRelationFieldByCollectionField(entities, DCRJunctionCollection, 'DCR_Junction__c')
						}.bind(this)).then(function(records) {
							return records.filter(function(record) {
								var dcr = dcrList.filter(function(dcrRecord) {
									return dcrRecord.Id == record.DCR__c;
								});
								return typeof (record['DCR__c']) != 'number' && !!dcr && !!dcr.length && dcr[0].Synced != 'true' && dcr[0].isMobileDCR__c == true;
							});
						});
						if (this.forSymposia) {
							deferred = deferred.then( function(entities) {
								return this.updateRelationFieldByCollectionField(entities, DcrBrandActivityCollection, 'DCR_Junction_Self__c')
							}.bind(this))
						}
						return deferred;
					} else {
						return this.removeEntities(entities).then(function() {
							return [];
						});
					}
				}.bind(this));
			} else {
				return entities;
			}
		};

		return DcrBrandActivityCollection;
	}


	abbottApp.factory('dcrBrandActivityCollection', ['utils', 'entityCollection', 'dcrBrandActivityModel', 'sfdcAccount', 'dcrCollection', 'dcrJunctionCollection', '$injector', dcrBrandActivityCollection]);
})(); 