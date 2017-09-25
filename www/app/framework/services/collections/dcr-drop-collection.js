(function() {
	function dcrDropCollection(utils, entityCollection, dcrDropModel, sfdcAccount, DCRCollection, DCRJunctionCollection, DCRBrandActivityCollection, $injector) {
		var DcrDropCollection = function() {
			this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
			DcrDropCollection.super.constructor.apply(this, arguments);
		};
		DcrDropCollection = utils.extend(DcrDropCollection, entityCollection);

		DcrDropCollection.prototype.model = dcrDropModel;

		DcrDropCollection.prototype.prepareServerConfig = function(configPromise) {
			return configPromise.then(function(config) {
				return sfdcAccount.getCurrentUserId().then(function(userId) {
					var innerDcrSelect = "SELECT Id FROM DCR__c";
					innerDcrSelect += " WHERE Status__c = 'Submitted'";
					innerDcrSelect += " AND Date__c >= LAST_MONTH";
					innerDcrSelect += " AND Date__c <= THIS_MONTH";
					innerDcrSelect += " AND User__c = '" + userId + "'";
					config += " WHERE DCR__c IN (" + innerDcrSelect + ")";
					return config;
				})
			});
		};

		DcrDropCollection.prototype.onUploadingStarted = function(entities) {
			var DCRCollection = $injector.get('dcrCollection'),
			    dcrCollectionInstance = new DCRCollection;
			if (entities && entities.length) {
				var localDCRIds = entities.map(function(entity) {
					return entity['DCR__c'];
				});
				return dcrCollectionInstance.fetchAllWhereIn('_soupEntryId', localDCRIds).then(dcrCollectionInstance.fetchRecursiveFromCursor).then(function(dcrs) {
					if (dcrs && dcrs.length) {
						var dcrList = dcrs;
						return this.updateRelationFieldByCollectionField(entities, DCRCollection, 'DCR__c').then( function(entities) {
							return this.updateRelationFieldByCollectionField(entities, DCRJunctionCollection, 'DCR_Junction__c')
						}.bind(this)).then( function(entities) {
							return this.updateRelationFieldByCollectionField(entities, DCRBrandActivityCollection, 'Brand_Activity__c')
						}.bind(this)).then(function(records) {
							return records.filter(function(record) {
								var dcr = dcrList.filter(function (dcrRecord) {
                                   return dcrRecord.Id == record.DCR__c;
                               });
								return typeof (record['DCR__c']) != 'number' && !!dcr && !!dcr.length && dcr[0].Synced != 'true' && dcr[0].isMobileDCR__c == true ;
							});
						});
					} else {
						 return this.removeEntities(entities).then(function(){
                            return [];
                        });
					}
				}.bind(this));
			} else {
				return entities;
			}
		};

		return DcrDropCollection;
	}


	abbottApp.factory('dcrDropCollection', ['utils', 'entityCollection', 'dcrDropModel', 'sfdcAccount', 'dcrCollection', 'dcrJunctionCollection', 'dcrBrandActivityCollection', '$injector', dcrDropCollection]);
})(); 