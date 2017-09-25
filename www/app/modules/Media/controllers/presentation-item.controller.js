(function() {
  'use strict';

  angular
  .module('media')
  .controller('presentationItemController', presentationItemController);

  presentationItemController.$inject = [
    '$rootScope',
    '$scope',
    'abbottConfigService',
    'PresentationViewer',
    'PresentationLoader',
    'presentationLoaderStates',
    'presentationMultiLoader',
    'presentationCollection',
    'presentationFileManager',
    'presentationErrorPopup',
    'utils'
  ];

  function presentationItemController($rootScope, $scope, abbottConfigService, PresentationViewer
    , PresentationLoader, presentationLoaderStates, presentationMultiLoader, presentationCollection
    , presentationFileManager, presentationErrorPopup, utils){

    var vm = this, presentationLoader;
    // TODO: map only needed values
    vm.locale = abbottConfigService.getLocale();

    vm.presentationLoaderState = presentationLoaderStates.NOT_INITED;
    vm.thumbPath = '';
    vm.getLoadedVersionText = getLoadedVersionText;
    vm.getTotalSize = getTotalSize;
    vm.getDownloadText = getDownloadText;
    vm.isRedyToDownload = isRedyToDownload;
    vm.isDownloading = isDownloading;
    vm.isCanCancel = isCanCancel;
    vm.isFinished = isFinished;
    vm.onDownloadClick = onDownloadClick;
    vm.download = download;
    vm.onCancelClick = onCancelClick;
    vm.cancel = cancel;
    vm.openPresentation = openPresentation;
    vm.getDownloadPercentage = getDownloadPercentage;

    activate();

    function activate(){
    window.ga.trackView('Presentation-item');
      initPresentationCollection();
      initPresentationState();
      initThumbPath();
      initRootSubscriptions();
    }

    function initThumbPath(){
    window.ga.trackTiming('Get Thumb path start time',20000,'getThumbPathStart','Get Thumb Path start');
      if(isPresentationDownloaded()){
        getThumbPath()
          .then(function(path){
            vm.thumbPath = path;
          });
      }
    }

    function initPresentationCollection(){
    window.ga.trackTiming('presentationCollection Load start time',20000,'presentationCollectionStart','presentationCollection Load start');
      presentationCollection = new presentationCollection();
      window.ga.trackTiming('presentationCollection Load Finish time',20000,'presentationCollectionFinish','presentationCollection Load Finish');
    }

    function initPresentationState(){
    window.ga.trackTiming('PresentationState Load start time',20000,'presentationStateStart','PresentationState start');
      presentationLoader = presentationMultiLoader.getLoaderById(vm.data.Id);
      if(presentationLoader){
        vm.presentationLoaderState = presentationLoader.state;
        subscribeOnLoaderEvents();
      }
    }

    function initRootSubscriptions(){
    window.ga.trackTiming('RootSubscriptions Load Start time',20000,'rootSubscriptionsStart','RootSubscriptions start');
        var downloadAllPresentationsSubscriprion = $rootScope.$on('DownloadAllPresentations', function(){
          if(!isPresentationDownloaded() && !presentationLoader){
            vm.download();
          }
        });
        $scope.$on('$destroy', downloadAllPresentationsSubscriprion);
    }

    function isPresentationDownloaded(){
      return !angular.isUndefined(vm.data.currentVersion);
    }

    function getLoadedVersionText(){
      var textParts = [];
      if(isPresentationDownloaded()){
        textParts = [vm.locale.Version, vm.data.currentVersion, vm.locale.IsDownloaded];
        if(vm.data.currentVersion < vm.data.Version__c){
          textParts.splice(2, 0, vm.locale.Of, vm.data.Version__c);
        }
      }
      return textParts.join(' ');
    }

    function getDownloadText(){
      return isPresentationDownloaded() && vm.data.currentVersion < vm.data.Version__c ?
        vm.locale.Update : vm.locale.Download;
    }

    function getTotalSize(){
      return vm.isCanCancel() ?
        ((Math.round(presentationLoader.fileSize * 100 / 1024 / 1024) / 100) || 0) + 'Mb' :
        vm.locale.Unzipping;
    }

    function checkState(stateName){
      return vm.presentationLoaderState === presentationLoaderStates[stateName];
    }

    function isRedyToDownload(){
      return checkState('NOT_INITED') &&
        (!isPresentationDownloaded() ||
        vm.data.currentVersion < vm.data.Version__c);
    }

    function isDownloading(){
      return ['INITED', 'DOWNLOAD', 'UNZIP', 'REPLACING'].some(checkState);
    }

    function isFinished(){
      return checkState('FINISHED') || vm.data.currentVersion === vm.data.Version__c;
    }

    function isCanCancel(){
      return ['INITED', 'DOWNLOAD'].some(checkState);
    }

    function onDownloadClick($event){
      $event.stopPropagation();
      download();
    }

    function download(){
      if(utils.isDeviceOnline()){
        presentationMultiLoader.initDownload(vm.data);
        initPresentationState();
        subscribeOnLoaderFail();
        subscribeOnLoaderSuccess();
      } else {
        presentationErrorPopup.alert(vm.locale.ConnectionError);
      }

       window.ga.trackTiming('RootSubscriptions Load Finish time',20000,'rootSubscriptionsFinish','RootSubscriptions Finish');
    }

    function initPresentationViewer(){
      var presentationViewer = new PresentationViewer(vm.data.Id);
      presentationViewer.on('complete', function(){
        presentationViewer.closePresentation();
      });
      return presentationViewer;
    }

    function openPresentation(){
      if(isPresentationDownloaded() && !presentationLoader){
        initPresentationViewer().openPresentation();
      }
    }

    function onCancelClick($event){
      $event.stopPropagation();
      cancel();
    }

    function cancel(){
      presentationLoader && presentationLoader.abort()
    }

    function getDownloadPercentage(){
      return parseInt(presentationLoader.loadedSize / presentationLoader.fileSize * 100) || 0;
    }

    function subscribeOnLoaderEvents(){
      var loaderSubscriptions,
      loaderEvenHandlerPairs = {
        'StateChange': onStateChange,
        'Destroy': onDestroy,
        'SuccessLoad': onSuccessLoad
      };
      loaderSubscriptions = Object.keys(loaderEvenHandlerPairs).map(function(eventName){
        return presentationLoader.on(eventName, loaderEvenHandlerPairs[eventName]);
      });
      $scope.$on('$destroy', function(){
        loaderSubscriptions.forEach(function(listener){
          listener();
        });
      });

      window.ga.trackTiming('PresentationState Load Finish time',20000,'presentationStateFinish','PresentationState Finish');
    }

    function onStateChange(event, val){
      console.log('StateChange', vm.data.Name, presentationLoaderStates.statesNames[val.state]);
      vm.presentationLoaderState = val.state;
    }

    function onDestroy(){
      console.log('Destroy', vm.data.Name);
      $scope.$applyAsync(function(){
        vm.presentationLoaderState = presentationLoaderStates.NOT_INITED;
        presentationLoader = null;
      });
    }

    function onSuccessLoad(){
      console.log('SuccessLoad', vm.data.Name);
      vm.data.currentVersion = vm.data.Version__c;
      initThumbPath();
    }

    function subscribeOnLoaderFail(){
      presentationLoader.on('FailLoad', function(event, error){
        console.log('FailLoad', vm.data.Name);
        var messageKey;
        if(FileTransferError.CONNECTION_ERR === error.code){
          messageKey = 'ConnectionError';
          presentationMultiLoader.destroyAllPendingLoaders();
        } else {
          messageKey = 'DownloadError';
        }
        presentationErrorPopup.alert(vm.locale[messageKey]);
      });
    }

    function subscribeOnLoaderSuccess(){
      presentationLoader.on('SuccessLoad', function(event){
        vm.data.currentVersion = vm.data.Version__c;
        presentationCollection.upsertEntities([vm.data]);
      });
    }

    function getThumbPath(){
      return presentationFileManager.afterInit
        .then(function(){
          return presentationFileManager.getPresentationIconPath(vm.data.Id);
        });
        window.ga.trackTiming('Get Thumb path end time',20000,'getThumbPathEnd','Get Thumb Path End');
    }

  }

})();