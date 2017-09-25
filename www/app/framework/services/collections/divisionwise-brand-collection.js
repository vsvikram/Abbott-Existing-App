(function () {
    function divisionwiseBrandCollection(utils, entityCollection, divisionwiseBrandModel, userCollection) {
        var DivisionwiseBrandCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            DivisionwiseBrandCollection.super.constructor.apply(this, arguments);
        };
        DivisionwiseBrandCollection = utils.extend(DivisionwiseBrandCollection, entityCollection);

        DivisionwiseBrandCollection.prototype.model = divisionwiseBrandModel;

        DivisionwiseBrandCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
              .then(function (config) {
                  return new userCollection().getActiveUser()
                    .then(function (activeUser) {
                        config += " WHERE Division__c = '" + activeUser.Division + "'";
                        return config;
                    })
              });
        };

        return DivisionwiseBrandCollection;
    }

    abbottApp.factory('divisionwiseBrandCollection', [
      'utils',
      'entityCollection',
      'divisionwiseBrandModel',
      'userCollection',
      divisionwiseBrandCollection
    ]);
})();