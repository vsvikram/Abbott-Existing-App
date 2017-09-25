var forceMobile = (function() {

	//force client object 
	var forceClient = {};

	/**
	 * Login to Salesforce using OAuth. If running in a Browser, the OAuth workflow happens in a a popup window.
	 * If running in Cordova container, it happens using the Mobile SDK 2.3+ Oauth Plugin
	 * @param successHandler - function to call back when login succeeds
	 * @param errorHandler - function to call back when login fails
	 */
	function login(successHandler, errorHandler) {
		// Get salesforce mobile sdk OAuth plugin
		var oauthPlugin = cordova.require("com.salesforce.plugin.oauth");

		// Call getAuthCredentials to get the initial session credentials
		oauthPlugin.getAuthCredentials(
		// Callback method when authentication succeeds.
		function(creds) {
			// Create forcetk client instance for rest API calls
			forceClient = new forcetk.Client(creds.clientId, creds.loginUrl);
			forceClient.setSessionToken(creds.accessToken, "v36.0",
					creds.instanceUrl);
			forceClient.setRefreshToken(creds.refreshToken);

			// Call success handler and handover the forcetkClient
			successHandler();
		}, function(error) {
			if (errorHandler)
				errorHandler(error);
		});
	}
	
	function setForceClient(aForceClient) {
		forceClient = aForceClient;
	}

	function logout() {
		var sfAccManagerPlugin = cordova.require("com.salesforce.plugin.sfaccountmanager");
		sfAccManagerPlugin.logout();
	}

	function registerSoup(soupName, schemaObj, success, failure) {
		navigator.smartstore.registerSoup(true, soupName, schemaObj, success,
				failure);
	}

	function enterDataInSoup(soupName, entries, success, failure) {
		navigator.smartstore.upsertSoupEntries(true, soupName, entries,
				success, failure);
	}

	function fetchDataFromSoup(soQuery, success, failure) {		
		var querySpec = navigator.smartstore.buildSmartQuerySpec(soQuery, 10000);
		navigator.smartstore.runSmartQuery(true, querySpec, function(cursor){
			var object = {};
			object.records = cursor.currentPageOrderedEntries;
			success(object);
		}, failure);
	}

	function retriveSpecificSoupData(isGlobalStore, soupName, entryIds,
			success, failure) {
		navigator.smartstore.retrieveSoupEntries(true, soupName, entryIds,
				success, failure);
	}

	function deleteDataFromSoup(soupName, indexArray, success, failure) {
		navigator.smartstore.removeFromSoup(true, soupName, indexArray,
				success, failure);
	}
	
	function fetchDataFromSalesForce(sqlQuery, successHandler, errorHandler) { 
        forceClient.query(sqlQuery, successHandler, errorHandler);
	}
	
	function queryMore(nextPageUrl, successHandler, errorHandler) { 
        forceClient.queryMore(nextPageUrl, successHandler, errorHandler);
	}	

	/**
	 * Convenience function to execute a SOQL query
	 * @param soql
	 * @param successHandler
	 * @param errorHandler
	 */
	function query(soQuery, successHandler, errorHandler) {
		fetchDataFromSoup(soQuery, successHandler, errorHandler);
	}

	function create(tableName, data, successHandler, errorHandler) {
		forceClient.create(tableName, data, successHandler, errorHandler);
	}

	function update(tableName, primaryKey, data, successHandler, errorHandler) {
		forceClient.update(tableName, primaryKey, data, successHandler, errorHandler);
	}

	function clearSoup(soupName, successCallback, errorCallback) {
		navigator.smartstore.clearSoup(true, soupName, successCallback, errorCallback);
	}

	function upsert() {

	}

	function del(tableName, id, successHandler, errorHandler) {
		forceClient.del(tableName, id, successHandler, errorHandler);
	}

	// The public API
	return {
		login : login,
		logout : logout,
		registerSoup : registerSoup,
		enterDataInSoup : enterDataInSoup,
		fetchDataFromSoup : fetchDataFromSoup,
		retriveSpecificSoupData : retriveSpecificSoupData,
		deleteDataFromSoup : deleteDataFromSoup,
		fetchDataFromSalesForce : fetchDataFromSalesForce,
		query : query,
		create : create,
		update : update,
		clearSoup : clearSoup,
		upsert : upsert,
		del : del,
		setForceClient: setForceClient,
		queryMore: queryMore
	};

}());