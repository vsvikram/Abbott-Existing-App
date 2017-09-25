(function() {
  'use strict';

  angular
  .module('media')
  .service('presentationErrorPopup', presentationErrorPopup);

  presentationErrorPopup.$inject = [
    'popupService'
  ];

  function presentationErrorPopup(popupService){
    var isPopupOpened = false;

    this.alert = openPopup;

    function openPopup(message){
      if(!isPopupOpened){
        popupService.openPopup(message, 'Ok', null, function(){
          isPopupOpened = false;
        });
        isPopupOpened = true;
      }
    }

  }

})();