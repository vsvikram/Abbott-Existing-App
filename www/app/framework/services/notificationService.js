abbottApp.service('notificationService', [
  function(){
    var self = this;
    this.notification = {};

    this.getNotification = function(){
      return self.notification;
    };

    this.setNotification = function(notification){
      self.notification = notification;
    };
  }
]);
