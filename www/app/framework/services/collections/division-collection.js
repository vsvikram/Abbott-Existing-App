(function () {
    function divisionCollection(utils, entityCollection, divisionModel, userCollection) {
        var DivisionCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            this.getDivision = utils.bind(this.getDivision, this);
            DivisionCollection.super.constructor.apply(this, arguments);
        };
        DivisionCollection = utils.extend(DivisionCollection, entityCollection);

        DivisionCollection.prototype.model = divisionModel;

        DivisionCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
              .then(function (config) {
                  return new userCollection().getActiveUser()
                    .then(function (activeUser) {
                        config += " WHERE Name = '" + activeUser.Division + "'";
                        return config;
                    })
              });
        };

        DivisionCollection.prototype.getDivision = function () {
            return this.fetchAll()
              .then(this.getEntityFromResponse);
        }


        return DivisionCollection;
    }

    abbottApp.factory('divisionCollection', [
      'utils',
      'entityCollection',
      'divisionModel',
      'userCollection',
      divisionCollection
    ]);
})();