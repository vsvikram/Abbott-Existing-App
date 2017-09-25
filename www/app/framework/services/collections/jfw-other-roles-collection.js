(function () {
    function jfwOtherRolesCollection(utils, entityCollection, jfwOtherRolesModel, userCollection) {
        var JFWOtherRolesCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            JFWOtherRolesCollection.super.constructor.apply(this, arguments);
        };
        JFWOtherRolesCollection = utils.extend(JFWOtherRolesCollection, entityCollection);

        JFWOtherRolesCollection.prototype.model = jfwOtherRolesModel;

        JFWOtherRolesCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise
              .then(function (config) {
                  return new userCollection().getActiveUser()
                    .then(function (activeUser) {
                        config += " WHERE Division__c = '" + activeUser.Division + "'";
                        config += " AND JFW__c = true";
                        return config;
                    })
              });
        };

        return JFWOtherRolesCollection;
    }

    abbottApp.factory('jfwOtherRolesCollection', [
      'utils',
      'entityCollection',
      'jfwOtherRolesModel',
      'userCollection',
      jfwOtherRolesCollection
    ]);
})();