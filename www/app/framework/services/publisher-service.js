abbottApp.service('publisher', [
  '$rootScope',
  function publisher($rootScope){
    this.publish = function(message){
      $rootScope.$emit(message.type, message);
    };
  }
]);
