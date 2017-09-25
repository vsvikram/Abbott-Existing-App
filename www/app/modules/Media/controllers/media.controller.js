(function() {
  'use strict';

  angular
  .module('media')
  .controller('mediaController', mediaController);

  mediaController.$inject = [
    '$rootScope',
    '$scope',
    '$timeout',
    'abbottConfigService',
    'presentationCollection',
    'spinner',
    'FileManager',
    'popupService',
    'utils'
  ];

  function mediaController($rootScope, $scope, $timeout, abbottConfigService, presentationCollection, spinner,
    FileManager, popupService, utils){

    var vm = this, FETCH_CHUNK_SIZE = 20, presentationsCursor, collection, rootSubscription;

    vm.locale = abbottConfigService.getLocale();
    vm.downloadAll = downloadAll;
    vm.loadMorePresentations = loadMorePresentations;

    activate();

    function activate(){
      rootSubscription = $rootScope.$on('databaseAvailable', reInit);
      $scope.$on('$destroy', rootSubscription);
      init();
    }

    function init(){

      window.ga.trackView('Media');
      window.ga.trackTiming('Media Load Start Time',20000,'MediaLoadStart','Media Load Start');

      collection = new presentationCollection;
      collection.pageSize = FETCH_CHUNK_SIZE;
      presentationsCursor = null;
      vm.presentations = null;
      vm.isAllFetched = false;

      window.ga.trackTiming('Media Load Finish Time',20000,'MediaLoadFinish','Media Load Finish');
    }

    function reInit(){
      init();
      loadMorePresentations();
    }

    function closeCursor(){
      vm.isAllFetched = true;
      presentationsCursor.closeCursor();
      presentationsCursor = null
    }

    function downloadAll(){
      if(presentationsCursor){
        spinner.show();
        collection.fetchRecursiveFromCursor(presentationsCursor)
          .then(function(records){
            vm.presentations = records;
            vm.isAllFetched = true;
            spinner.hide();
            $timeout(triggerDownloadAll);
          });
      } else {
        triggerDownloadAll();
      }
    }

    function triggerDownloadAll(){
      if(utils.isDeviceOnline()){
        $rootScope.$emit('DownloadAllPresentations');
      } else {
        popupService.openPopup(vm.locale.ConnectionError, 'Ok');
      }
    }

    function loadMorePresentations(){
      spinner.show();
      getPresentationCursor()
      .then(function(cursor){
        presentationsCursor = cursor;
        vm.presentations = presentationsCursor.records;
        spinner.hide();
        if(!presentationsCursor.hasMore()){
          closeCursor();
        }
      });
    window.ga.trackTiming('Load Time More Presentations',20000,'presentationsLoad',' Load More Presentations');
    }

    function getPresentationCursor(){
      return presentationsCursor ?
          presentationsCursor.getMore() :
          collection.fetchAll();
    }

  }

})();