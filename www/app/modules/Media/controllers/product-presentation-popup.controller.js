(function () {
  'use strict';

  function productPresentationPopupController($scope,
                                              utils,
                                              popupService,
                                              presentationCollection,
                                              PresentationViewer,
                                              abbottConfigService,
                                              divisionwiseBrandCollection,
                                              divisionwiseBrandPresentationCollection,
                                              presentationMultiLoader) {

    $scope.locale = abbottConfigService.getLocale();

    this.presentationCollection = new presentationCollection();
    this.divisionwiseBrandCollection = new divisionwiseBrandCollection();
    this.divisionwiseBrandPresentationCollection = new divisionwiseBrandPresentationCollection();
    this.selectedProduct = null;
    this.allProducts = [];
    this.products = [];
    this.presentations = [];
    this.divisionwiseBrandPresentation = [];

    this.fetchProductsWithPresentations = function () {
      var that = this;

      return that.presentationCollection.fetchAll()
        .then(that.presentationCollection.fetchRecursiveFromCursor)
        .then(function (entities) {
          that.presentations = entities;
        })
        .then(that.divisionwiseBrandCollection.fetchAll)
        .then(that.divisionwiseBrandCollection.fetchRecursiveFromCursor)
        .then(function (entities) {
          that.allProducts = entities
            .filter(function (entity) {
              return new Date(entity.Effective_From__c) <= new Date() &&
                (new Date(entity.Effective_Till__c) >= new Date() || entity.Effective_Till__c == null);
            });
          return entities.map(function (entity) {
            return entity.Id
          });
        })
        .then(function (productsIds) {
          return that.divisionwiseBrandPresentationCollection.fetchAllWhereIn('DivisionwiseBrand__c', productsIds)
        })
        .then(that.divisionwiseBrandPresentationCollection.fetchRecursiveFromCursor)
    };

    this.getFilteredProductWithPresentations = function () {
      var that = this;
      return that.fetchProductsWithPresentations()
        .then(function (productPresentationsEntities) {
          var productPresentationMap = {};
          that.divisionwiseBrandPresentation = productPresentationsEntities;
          productPresentationsEntities.forEach(function (productPresentationsEntity) {
            if(productPresentationMap[productPresentationsEntity.DivisionwiseBrand__c]){
              productPresentationMap[productPresentationsEntity.DivisionwiseBrand__c].push(productPresentationsEntity.Presentation__c);
            }else{
              productPresentationMap[productPresentationsEntity.DivisionwiseBrand__c] = [productPresentationsEntity.Presentation__c];
            }
          });
          that.products = that.allProducts
            .filter(function (product) {
              return productPresentationsEntities.some(function (productPresentationsEntity) {
                return productPresentationsEntity.DivisionwiseBrand__c == product.Id;
              });
            })
            .map(function (product) {
              product.presentations = productPresentationMap[product.Id].filter(function(presentationId){
                return that.presentations.some(function(presentation){
                  return presentation.Id === presentationId;
                })
              }).map(function(filteredPresentationId){
                return that.presentations.filter(function(presentation){
                  return presentation.Id === filteredPresentationId;
                })[0];
              });
              return product;
            });
        });
    };

    this.init = function () {
      var that = this;
      this.getFilteredProductWithPresentations()
        .then(function () {
          $scope.element.addClass('fade-in');
        })
        .then(function () {
          that.updateProductPopupSize();
        })
    };

    this.updateProductPopupSize = function () {
      //Called from View for addapt size of popup if to much elements
      var placeholder = $scope.element.find('.product-popup-item-placeholder');
      if (this.products.length === 0) {
        placeholder.removeClass('hide');
      } else {
        this.adaptPopupSize('.product-popup-wrapper');
      }
    };

    this.updatePresentationPopupSize = function () {
      //Called from View for addapt size of popup if to much elements
      this.adaptPopupSize('.presentation-popup-wrapper');
    };

    this.adaptPopupSize = function (wrapperSelector) {
      var that = this,
        wrapper = $scope.element.find(wrapperSelector),
        header = wrapper.find('h3'),
        height,
        content = wrapper.find('.product-presentation-scroll-content');
        content.height('auto');
        height = wrapper.outerHeight() - header.outerHeight();
      if (height) {
        content.height(height);
      }else{
        setTimeout(function(){
          that.adaptPopupSize(wrapperSelector);
        }, 0);
      }
    };

    this.showProducts = function () {
      this.selectedProduct = null;
    };

    this.selectProduct = function (product) {
      this.selectedProduct = product;
    };

    this.getDivisionwiseBrandPresentationIdByProductPresentation = function (productId, presentationId) {
      var result = this.divisionwiseBrandPresentation.filter(function (entity) {
        return entity.DivisionwiseBrand__c === productId && entity.Presentation__c === presentationId;
      });
      return result[0];
    };

    this.selectPresentation = function (presentation) {
      var presentationViewer, that = this;
      if (presentationMultiLoader.getLoaderById(presentation.Id) || !presentation.currentVersion && presentation.currentVersion != 0) {
        popupService.openPopup($scope.locale.PresentationNotDownloaded, $scope.locale.OK, '35%');
      } else {
        // TODO: remove popup functionality
        $scope.productPresentationPopup.hide();
        presentationViewer = new PresentationViewer(presentation.Id);
        presentationViewer.on('didLoad', function(){
          if($scope.element[0].parentNode){
            $scope.element[0].parentNode.removeChild($scope.element[0]);
          }
        });
        presentationViewer.on('complete', function () {
          presentationViewer.getKPI()
            .then(function (jsonKPI) {
              var DBPEntity;
              if ($scope.updateKPIData) {
                DBPEntity = that.getDivisionwiseBrandPresentationIdByProductPresentation(that.selectedProduct.Id, presentation.Id);
                $scope.updateKPIData(that.selectedProduct.Id, DBPEntity.Id, jsonKPI);
              }
              presentationViewer.closePresentation();
            }, function () {
              presentationViewer.closePresentation();
            });
        });
        presentationViewer.openPresentation();
      }
    };

    this.hide = function () {
      var onWebkitAnimationEnd = function (event) {
        if (event.target == $scope.element[0]) {
          $scope.element[0].parentNode.removeChild($scope.element[0]);
        }
      };

      $scope.element.addClass('fade-out');
      $scope.element.on('webkitAnimationEnd', onWebkitAnimationEnd);
    };
  }

  abbottApp.controller('productPresentationPopupController', [
    '$scope',
    'utils',
    'popupService',
    'presentationCollection',
    'PresentationViewer',
    'abbottConfigService',
    'divisionwiseBrandCollection',
    'divisionwiseBrandPresentationCollection',
    'presentationMultiLoader',
    productPresentationPopupController
  ]);

})();