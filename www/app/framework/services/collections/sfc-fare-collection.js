(function(){
  function sfcFareCollection(utils, entityCollection, sfcFareModel, sfcAssignmentCollection, sfcMasterCollection, otherExpensesEarningCollection, userCollection){
    var SFCFareCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      SFCFareCollection.super.constructor.apply(this, arguments);
    };
    SFCFareCollection = utils.extend(SFCFareCollection, entityCollection);

    SFCFareCollection.prototype.model = sfcFareModel;

    SFCFareCollection.prototype.prepareServerConfig = function(configPromise){
     return configPromise
             .then(function(config){
             var sfcAssignmentCollectionInstance = new sfcAssignmentCollection();
               return sfcAssignmentCollectionInstance.fetchAll()
                 .then(sfcAssignmentCollectionInstance.fetchRecursiveFromCursor)
                  .then(function(assignments){
                        var userAssignments = assignments.map(function(assignment){
                            return "'" + assignment.SFC_Master__c+ "'";
                        }).join(',');
                         userAssignments = userAssignments || "''";
                        return new userCollection().getActiveUser().then(function(activeUser){
                            config += " WHERE SFC_Master__c IN (" + userAssignments + ")" ;
                            config += " AND Company_Code__c='"+activeUser.CompanyName+"' AND Expense_Company__c ='"+activeUser.Expense_Company__c +"' AND (Effective_To_Date__c >= LAST_MONTH OR Effective_To_Date__c = NULL) AND One_way_Fare__c !=NULL";
                            return config;

                        });
                 })
             });
    };

    return SFCFareCollection;
  }

  abbottApp.factory('sfcFareCollection', [
    'utils',
    'entityCollection',
    'sfcFareModel',
    'sfcAssignmentCollection',
    'sfcMasterCollection',
    'otherExpensesEarningCollection',
    'userCollection',
    sfcFareCollection
  ]);
})();
