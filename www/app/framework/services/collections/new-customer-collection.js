(function(){
  function newCustomerCollection(utils, entityCollection, newCustomerModel, Query){
    var NewCustomerCollection = function(){
      this.newCustomersCountByDay = utils.bind(this.newCustomersCountByDay, this);
      NewCustomerCollection.super.constructor.apply(this, arguments);
    };
    NewCustomerCollection = utils.extend(NewCustomerCollection, entityCollection);

    NewCustomerCollection.prototype.model = newCustomerModel;

    NewCustomerCollection.prototype.newCustomersCountByDay = function(moment){
      var query = new Query()
        .selectCountFrom(this.model.tableSpec.local)
        .where({'Date__c': moment.format('YYYY-MM-DD')});
      return this.fetchWithQuery(query)
        .then(this.getEntityFromResponse);
    };

    return NewCustomerCollection;
  }

  abbottApp.factory('newCustomerCollection', [
    'utils',
    'entityCollection',
    'newCustomerModel',
    'query',
    newCustomerCollection
  ]);
})();