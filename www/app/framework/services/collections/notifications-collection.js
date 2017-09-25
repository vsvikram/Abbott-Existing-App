(function(){
  function notificationsCollection(utils, entityCollection, notificationsModel, userCollection){
    var NotificationsCollection = function(){
      this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
      NotificationsCollection.super.constructor.apply(this, arguments);
    };
    NotificationsCollection = utils.extend(NotificationsCollection, entityCollection);

    NotificationsCollection.prototype.model = notificationsModel;

    NotificationsCollection.prototype.prepareServerConfig = function(configPromise){
      return configPromise
         .then(function(config){
              return new userCollection().getActiveUser()
                 .then(function(activeUser){
                    config += " WHERE Division_Name__c = '" + activeUser.Division + "'";
                    return config;
                 })
            });
         };
    return NotificationsCollection;
  }

  abbottApp.factory('notificationsCollection', [
    'utils',
    'entityCollection',
    'notificationsModel',
    'userCollection',
    notificationsCollection
  ]);
})();


