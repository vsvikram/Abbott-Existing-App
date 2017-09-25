(function () {
    function halfDayActivityCollection(utils, entityCollection, halfDayActivityModel, userCollection) {
        var HalfDayActivityCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            HalfDayActivityCollection.super.constructor.apply(this, arguments);
        };
        HalfDayActivityCollection = utils.extend(HalfDayActivityCollection, entityCollection);

        HalfDayActivityCollection.prototype.model = halfDayActivityModel;

        HalfDayActivityCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
              .then(function (config) {
                  return new userCollection().getActiveUser()
                    .then(function (activeUser) {
                        config += " WHERE Half_day__c = true";
                        config += " AND X" + activeUser.CompanyName + "__c = true";
                        return config;
                    });
              });
        };

        return HalfDayActivityCollection;
    }

    abbottApp.factory('halfDayActivityCollection', [
      'utils',
      'entityCollection',
      'halfDayActivityModel',
      'userCollection',
      halfDayActivityCollection
    ]);
})();