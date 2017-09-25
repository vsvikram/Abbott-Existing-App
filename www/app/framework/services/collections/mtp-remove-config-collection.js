(function(){
  function mtpRemoveConfigCollection(utils, entityCollection, mtpRemoveConfigModel, Query){
    var MTPRemoveConfigCollection = function(){
      this.getMTPRemoveConfigsById = utils.bind(this.getMTPRemoveConfigsById, this);
      this.getMTPRemoveConfigsCountByDate = utils.bind(this.getMTPRemoveConfigsCountByDate, this);
      MTPRemoveConfigCollection.super.constructor.apply(this, arguments);
    };
    MTPRemoveConfigCollection = utils.extend(MTPRemoveConfigCollection, entityCollection);

    MTPRemoveConfigCollection.prototype.model = mtpRemoveConfigModel;

    MTPRemoveConfigCollection.prototype.getMTPRemoveConfigsById = function(id){
      var query = this._fetchAllQuery()
        .where({
          'Id': id
        });
      return this.fetchWithQuery(query)
        .then(this.fetchRecursiveFromCursor);
    };

    MTPRemoveConfigCollection.prototype.getMTPRemoveConfigsCountByDate = function(moment){
      var query = query = new Query()
        .selectCountFrom(this.model.tableSpec.local)
        .where({'Date__c': moment.format('YYYY-MM-DD')});
      return this.fetchWithQuery(query)
        .then(this.fetchRecursiveFromCursor);
    };

    return MTPRemoveConfigCollection;
  }

  abbottApp.factory('mtpRemoveConfigCollection', [
    'utils',
    'entityCollection',
    'mtpRemoveConfigModel',
    'query',
    mtpRemoveConfigCollection
  ]);
})();