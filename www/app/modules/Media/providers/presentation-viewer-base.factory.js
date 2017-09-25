(function() {
  'use strict';

  angular
  .module('media')
  .factory('PresentationViewerBase', presentationViewerBase);

  presentationViewerBase.$inject = [
    '$q',
    'utils'
  ];

  function presentationViewerBase($q, utils){

    function PresentationViewerBase(){
      this.initEvents();
      this.openPresentation = utils.bind(this.openPresentation, this);
      this.closePresentation = utils.bind(this.closePresentation, this);
      this.getKPI = utils.bind(this.getKPI, this);
      this.PresentationViewerModule = cordova.require('com.qapint.cordova.presentation-viewer.PresentationViewer');
    };
    utils.extendByEvents(PresentationViewerBase);

    PresentationViewerBase.prototype.openPresentation = function(){
      return this.openPresentationWithParams({index: this._getPresentationIndex()});
    };

    PresentationViewerBase.prototype._getPresentationIndex = function(){
      return 'index.html';
    };

    PresentationViewerBase.prototype.openPresentationWithParams = function(params){
      this.viewer = new this.PresentationViewerModule();
      this.viewer.open(params, this._presentationViewingHandler.bind(this), this._presentationViewingErrorHandler.bind(this));
    };

    PresentationViewerBase.prototype._presentationViewingHandler = function(message){
      var eventConnector = {};
      eventConnector[this.PresentationViewerModule.events.didLoad] = 'didLoad';
      eventConnector[this.PresentationViewerModule.events.complete] = 'complete';
      return this.trigger(eventConnector[message] || 'didLoad');
    }

    PresentationViewerBase.prototype._presentationViewingErrorHandler = function(message){
      this.trigger('error');
    };

    PresentationViewerBase.prototype.closePresentation = function(){
      return $q(function(resolve, reject){
        this.viewer ? this.viewer.close(resolve, reject) : reject(this.getErrorMessage());
      }.bind(this));
    };

    PresentationViewerBase.prototype.getKPI = function(){
      return $q(function(resolve, reject){
        this.viewer ? this.viewer.getKPI(resolve, reject) : reject(this.getErrorMessage());
      }.bind(this));
    };

    PresentationViewerBase.prototype.getErrorMessage = function(){
      return 'PresentationViewer has not initialized!!';
    };

    return PresentationViewerBase;
  }

})();