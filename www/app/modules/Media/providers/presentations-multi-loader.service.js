(function() {
  'use strict';

  angular
  .module('media')
  .service('presentationMultiLoader', presentationMultiLoader);

  presentationMultiLoader.$inject = [
    '$q',
    'loaderManager',
    'PresentationLoader'
  ];

  function presentationMultiLoader($q, loaderManager, PresentationLoader){
    var pendingDownload = [],
      MAX_THREAD_COUNT = 5,
      activeThreadCount = 0;

    this.initDownload = function(presentation){
      if(canCreateThread()){
        ++activeThreadCount;
        initDownloadThread(presentation);
      }else{
        pendingDownload.push(presentation);
        loaderManager.initLoader(createPresentationLoader(presentation));
      }
      return loaderManager.getLoaderById(presentation.Id);
    };

    this.isLoaderCreated = function(id){
      return !!loaderManager.getLoaderById(id);
    };

    this.getLoaderById = function(id){
      return loaderManager.getLoaderById(id);
    };

    this.destroyLoaderById = function(id){
      return loaderManager.destroyLoaderById(id);
    };

    this.destroyAllLoaders = function(){
      pendingDownload = [];
      loaderManager.destroyAllLoaders();
    };

    this.destroyAllPendingLoaders = function(){
      var presentationsIds = pendingDownload.map(function(presentation){return presentation.Id});
      loaderManager.destroyLoadersByIds(presentationsIds);
      pendingDownload = [];
    };

    function createPresentationLoader(presentation){
      return new PresentationLoader(presentation);
    }

    function canCreateThread(){
      return activeThreadCount < MAX_THREAD_COUNT
    }

    function initDownloadThread(presentation){
      downloadPresentation(presentation)
      .then(downloadThread);
    }

    function downloadPresentation(presentation){
      return $q(function(resolve, reject){
        loaderManager.invokeLoader(createPresentationLoader(presentation))
        .on('Destroy', resolve);
      });
    }

    function downloadThread(){
      if(pendingDownload.length){
        initDownloadThread(pendingDownload.shift())
      } else {
        --activeThreadCount;
      }
    }
  }

})();