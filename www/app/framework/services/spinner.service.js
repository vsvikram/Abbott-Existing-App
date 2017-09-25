(function() {
  'use strict';

  angular
  .module('media')
  .service('spinner', spinner);

  spinner.$inject = [
    '$rootScope',
    'abbottConfigService'
  ];

  function spinner($rootScope, abbottConfigService){

    $rootScope.transparentConfig = abbottConfigService.getTransparency();

    this.show = showSpinner;
    this.hide = hideSpinner;

    function showSpinner(busyText){
      $rootScope.transparentConfig.showTransparancy = true;
      $rootScope.transparentConfig.showBusyIndicator = true;
      $rootScope.transparentConfig.display = true;
      $rootScope.transparentConfig.busyIndicatorText = busyText == null ? '' : busyText;
    }

    function hideSpinner(){
      $rootScope.transparentConfig.showTransparancy = false;
      $rootScope.transparentConfig.showBusyIndicator = false;
      $rootScope.transparentConfig.display = false;
      $rootScope.transparentConfig.busyIndicatorText = '';
    }

  }

})();