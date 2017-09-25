(function () {
  'use strict';

  function productPresentationPopup() {
    return {
      restrict: 'E',
      replace: true,
      link: function (scope, element, attr) {
        var content = element.find('.product-presentation-popup-content');
        content.on('click', function (event) {
          if (event.target === content[0]) {
            scope.productPresentationPopup.hide();
          }
        });
        scope.element = element;
        scope.productPresentationPopup.init();
      },
      controller: 'productPresentationPopupController as productPresentationPopup',
      templateUrl: 'app/modules/Media/views/product-presentation-popup.html'
    };
  }

  abbottApp.directive('productPresentationPopup', productPresentationPopup);

})();