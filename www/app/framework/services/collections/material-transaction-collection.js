(function(){
  function materialTransactionCollection(utils, entityCollection, materialTransactionModel, sfdcAccount,dcrCollection){
    var MaterialTransactionCollection = function(){
      MaterialTransactionCollection.super.constructor.apply(this, arguments);
    };
    MaterialTransactionCollection = utils.extend(MaterialTransactionCollection, entityCollection);

    MaterialTransactionCollection.prototype.model = materialTransactionModel;

	MaterialTransactionCollection.prototype.onUploadingStarted = function(entities) {
		var mtList = [];
		return sfdcAccount.getCurrentUserId()
        .then(function(userId){
		var query = "select Date__c from DCR__c where Status__c='Submitted' and User__c ='"+userId+"' and Date__c!=null order by DCR__c.Date__c desc limit 1";
		return this.fetchFromSalesforce(query)
		.then(this.fetchRecursiveFromResponse)
		.then(function(date) {
			if(date){
				entities.forEach(function(val, i) {
					if(new Date(val.Call_Date__c) <= new Date(date[0].Date__c))
						mtList.push(val);
				});
			}
			return mtList;
		});
        }.bind(this));
    };


    MaterialTransactionCollection.prototype.onUploadingFinished = function(entities) {
    	this.removeEntities(entities);
    };

    return MaterialTransactionCollection;
  }

  abbottApp.factory('materialTransactionCollection', [
    'utils',
    'entityCollection',
    'materialTransactionModel',
    'sfdcAccount',
    'dcrCollection',
    materialTransactionCollection
  ]);
})();