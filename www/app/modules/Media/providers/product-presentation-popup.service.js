(function () {

  'use strict';

  function productPresentationPopupService(utils, $compile, $document) {
    var ProductPresentationPopup = function () {
      this.showProductPresentationPopup = utils.bind(this.showProductPresentationPopup, this);
      this.element = null;
    };

    ProductPresentationPopup.prototype.showProductPresentationPopup = function ($scope) {
      var linkFn = $compile('<product-presentation-popup></product-presentation-popup>');
      this.element = linkFn($scope);
      $document[0].body.appendChild(this.element[0]);
    };

    return new ProductPresentationPopup;
  }

  abbottApp.service('productPresentationPopupService', [
    'utils',
    '$compile',
    '$document',
    productPresentationPopupService
  ]);

})();