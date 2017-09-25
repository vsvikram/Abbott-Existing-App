(function() {
  'use strict';

  angular
  .module('media')
  .factory('PresentationViewer', presentationViewer);

  presentationViewer.$inject = [
    'PresentationViewerBase',
    'presentationFileManager',
    'utils'
  ];

  function presentationViewer(PresentationViewerBase, presentationFileManager, utils){

    function PresentationViewer(presentationId){
      PresentationViewer.super.constructor.apply(this, arguments);
      this.presentationId = presentationId;
    };
    PresentationViewer = utils.extend(PresentationViewer, PresentationViewerBase);

    PresentationViewer.prototype._getPresentationIndex = function(){
      return [presentationFileManager.getPathToPresentation(this.presentationId), 'index.html'].join('/');
    };

    return PresentationViewer;
  }

})();