(function() {
	function targetCollection($filter, utils, entityCollection, targetModel, sfdcAccount) {
		var TargetCollection = function() {
			this.fetchFromSalesforce = utils.bind(this.fetchFromSalesforce, this);
			this.fetchTarget = utils.bind(this.fetchTarget, this);
			this.fetchTargetsByDesignation = utils.bind(this.fetchTargetsByDesignation, this);
			TargetCollection.super.constructor.apply(this, arguments);
		};
		TargetCollection = utils.extend(TargetCollection, entityCollection);

		TargetCollection.prototype.model = targetModel;

		TargetCollection.prototype.fetchFromSalesforce = function() {
			return sfdcAccount.getCurrentUserId().then(function(userId) {
				var query = "SELECT Id,Level__c, name, ParentTerritoryId FROM Territory where Id in (SELECT TerritoryId FROM UserTerritory where userid = '" + userId + "')";
				return TargetCollection.super.fetchFromSalesforce.call(this, query).then(function(response) {
					if (response && response.records && response.records.length) {
						var reporteeQuery = "SELECT Id,Level__c, name, ParentTerritoryId FROM Territory where ParentTerritoryId in (SELECT TerritoryId FROM UserTerritory where userid = '" + userId + "')";
						return TargetCollection.super.fetchFromSalesforce.call(this, reporteeQuery).then(function(resp) {
							if (resp && resp.records && resp.records.length) {
								response.records = response.records.concat(resp.records);
								var tbmQuery = "SELECT Id, Level__c, name, ParentTerritoryId FROM Territory Where ParentTerritoryId in (";
								var tbmTerritoryIds = '';
								angular.forEach(response.records, function(value, index) {
									if (value.Level__c && value.Level__c.toLowerCase() == 'area') {
										tbmTerritoryIds += "'" + value.Id + "',";
									}
								});
								if (tbmTerritoryIds.length > 0) {
									tbmTerritoryIds = tbmTerritoryIds.slice(0, -1);;
									tbmQuery += tbmTerritoryIds + ")";
									return TargetCollection.super.fetchFromSalesforce.call(this, tbmQuery).then(function(res) {
										if (res && res.records && res.records.length)
											response.records = response.records.concat(res.records);
										return response;
									});
								}else
									return response;
							}else
								return response;
						});
					}else
						return response;
				}).then(function(response) {
					var territoryList = response.records;
					if (territoryList && territoryList.length) {
						var territoryIds = this.mapEcranisedFields(territoryList, 'Id');
						var territoryIdsString = utils.uniqueElements(territoryIds).join(',');
						var userTerritoryQuery = "SELECT userId, territoryId FROM UserTerritory Where territoryId in (" + territoryIdsString + ")";
						return TargetCollection.super.fetchFromSalesforce.call(this, userTerritoryQuery).then(function(resp) {
							return resp.records;
						}).then(function(userTerritoryList) {
							var userIdsString = '';
							if (userTerritoryList && userTerritoryList.length) {
								var userIds = this.mapEcranisedFields(userTerritoryList, 'UserId');
								userIdsString = utils.uniqueElements(userIds).join(',');
							}
							if (userIdsString && userIdsString.length) {
								var userInfoQuery = "SELECT Id, Name, Designation__c FROM User Where Id in (" + userIdsString + ")";
								return TargetCollection.super.fetchFromSalesforce.call(this, userInfoQuery).then(function(data) {
									if (data && data.records && data.records.length) {
										var userList = data.records;
										angular.forEach(territoryList, function(terr, i) {
											//initilize to defaults
											var territory = $filter('filter')(territoryList, {"Id" : terr.ParentTerritoryId});
											terr.User__c = undefined;
											terr.User__r = {};
											terr.Territory__c = terr.Name;
											terr.Parent_Territory__c = (territory != null && territory.length > 0) ? territory[0].Name : '';
											terr.User__r.Designation__c = terr.Level__c  && terr.Level__c.toLowerCase() =="area"? "ABM" :"TBM";
											terr.User__r.Name = "Vacant";
											angular.forEach(userTerritoryList, function(repUsrTerr, index) {
												angular.forEach(userList, function(usr, index) {
													if (repUsrTerr.TerritoryId == terr.Id && repUsrTerr.UserId == usr.Id) {
														terr.User__c = usr.Id;
														terr.User__r.Name = usr.Name;
														terr.User__r.Designation__c = usr.Designation__c;
													}
												});
											});
										});
										if (territoryList.length < userTerritoryList.length) {
											angular.forEach(userTerritoryList, function(terrUsr, i) {
												var usrTerritory = $filter('filter')(territoryList, {
													"Id" : terrUsr.TerritoryId
												});
												var territory =[];
												if(usrTerritory){
												 territory = $filter('filter')(territoryList, {"Id" : usrTerritory[0].ParentTerritoryId});
												}
												var userterr = $filter('filter')(territoryList, {
													"User__c" : terrUsr.UserId
												});
												var userData = $filter('filter')(userList, {
													"Id" : terrUsr.UserId
												});

												if (userData.length != 0 && userterr.length == 0 && usrTerritory.length != 0) {
													var newUser = {};
													newUser.Id = terrUsr.TerritoryId;
													newUser.User__c = userData[0].Id;
													newUser.Territory__c = usrTerritory[0].Name;
													newUser.Name = usrTerritory[0].Name;
													newUser.Parent_Territory__c = terrUsr.Name;//territoryCode;
													newUser.Parent_Territory__c = (territory != null && territory.length > 0) ? territory[0].Name : '';
													newUser.User__r = {};
													newUser.User__r.Name = userData[0].Name;
													newUser.User__r.Designation__c = userData[0].Designation__c;
													territoryList.push(newUser);
												}
											});
										}
										response.records = territoryList
										return response;
									} else {
										return true;
									}
								}.bind(this));
							}
						}.bind(this));
					}
				}.bind(this));
			}.bind(this));
		};

		TargetCollection.prototype.fetchTarget = function() {
			return sfdcAccount.getCurrentUserId().then( function(userId) {
				return this.fetchAllWhere({
					'User__c' : userId
				}).then(this.getEntityFromResponse);
			}.bind(this));
		};

		TargetCollection.prototype.serverConfig = function() {
			var queryFields = this.mapFields();
			var config = 'SELECT ' + queryFields + ' FROM ' + this.model.tableSpec.sfdc;
			return this.prepareServerConfig(this.instantPromise(config));
		};

		TargetCollection.prototype.fetchTargetsByDesignation = function(designation) {
			return this.fetchAllWhere({
				'User__r.Designation__c' : designation
			});
		};

		return TargetCollection;
	}


	abbottApp.factory('targetCollection', ['$filter','utils', 'entityCollection', 'targetModel', 'sfdcAccount', targetCollection]);
})(); 