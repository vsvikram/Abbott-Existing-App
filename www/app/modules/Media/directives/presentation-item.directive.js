(function () {
  'use strict';

  angular
    .module('media')
    .directive('presentationItem', presentationItem);

  function presentationItem() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        data: '=presentationInfo'
      },
      bindToController: true,
      templateUrl: 'app/modules/Media/views/presentation-item.html',
      controller: 'presentationItemController as presentation'
    };
  }

})();