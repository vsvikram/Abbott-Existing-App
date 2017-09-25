(function () {
    function fullDayActivityCollection(utils, entityCollection, fullDayActivityModel, userCollection) {
        var FullDayActivityCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            FullDayActivityCollection.super.constructor.apply(this, arguments);
        };
        FullDayActivityCollection = utils.extend(FullDayActivityCollection, entityCollection);

        FullDayActivityCollection.prototype.model = fullDayActivityModel;

        FullDayActivityCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
              .then(function (config) {
                  return new userCollection().getActiveUser()
                    .then(function (activeUser) {
                        config += " WHERE Full_day__c = true";
                        config += " AND X" + activeUser.CompanyName + "__c = true";
                        return config;
                    });
              });
        };

        return FullDayActivityCollection;
    }

    abbottApp.factory('fullDayActivityCollection', [
      'utils',
      'entityCollection',
      'fullDayActivityModel',
      'userCollection',
      fullDayActivityCollection
    ]);
})();