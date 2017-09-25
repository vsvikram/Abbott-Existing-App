(function() {
  'use strict';

  angular
  .module('media')
  .factory('PresentationLoader', presentationLoader);

  presentationLoader.$inject = [
    'utils',
    'presentationFileManager',
    'sfdcAccount',
    'presentationLoaderStates',
    '$cordovaFileTransfer'
  ];

  function presentationLoader(utils, presentationFileManager, sfdcAccount, presentationLoaderStates, $cordovaFileTransfer){

    function PresentationLoader(presentation){
      var that = this;
      this.initEvents();

      this.id = presentation.Id;
      this.presentation = presentation;
      this.state = this.states.INITED;
      this.fileSize = 0;
      this.loadedSize = 0;
      presentationFileManager.afterInit
        .then(function(){
          that.temporaryDirectory = presentationFileManager.getPathToTemporaryDir();
          that.temporaryFile = that.temporaryDirectory + '/' + that.id + '.zip';
        });
      this.download = utils.bind(this.download, this);
      this.buildDownloadUrl = utils.bind(this.buildDownloadUrl, this);
      this.buildDownloadHeaders = utils.bind(this.buildDownloadHeaders, this);
      this.prepareDownloadConfig = utils.bind(this.prepareDownloadConfig, this);
      this.startDownload = utils.bind(this.startDownload, this);
      this._onDownloadProgress = utils.bind(this._onDownloadProgress, this);
      this._onDownloadSuccess = utils.bind(this._onDownloadSuccess, this);
      this._errorHandler = utils.bind(this._errorHandler, this);
      this._fileTransferErrorHandler = utils.bind(this._fileTransferErrorHandler, this);
      this._unzip = utils.bind(this._unzip, this);
      this._onUnzipSuccess = utils.bind(this._onUnzipSuccess, this);
      this._cleanup = utils.bind(this._cleanup, this);
      this.abort = utils.bind(this.abort, this);
      this.canStop = utils.bind(this.canStop, this);
      this._changeState = utils.bind(this._changeState, this);
    }
    utils.extendByEvents(PresentationLoader);
    PresentationLoader.prototype.states = presentationLoaderStates;

    PresentationLoader.prototype.download = function(){
      this._changeState(this.states.DOWNLOAD);
      presentationFileManager.afterInit
        .then(this.startDownload);
    };

    PresentationLoader.prototype.buildDownloadUrl = function(){
      var sfdcClient = sfdcAccount.getSfdcClient();
      return [
        sfdcClient.instanceUrl,
        'services/data',
        sfdcClient.apiVersion,
        'sobjects/ContentVersion',
        this.presentation['Actual_Download_URL__c'],
        'VersionData'
      ].join('/');
    };

    PresentationLoader.prototype.buildDownloadHeaders = function(){
      var sfdcClient = sfdcAccount.getSfdcClient();
      return {
        Authorization: 'Bearer ' + sfdcClient.sessionId
      };
    };

    PresentationLoader.prototype.prepareDownloadConfig = function(){
      return {
        url: this.buildDownloadUrl(),
        options: {
          headers: this.buildDownloadHeaders()
        }
      };
    };

    PresentationLoader.prototype.startDownload = function(){
      var downloadConfig = this.prepareDownloadConfig();
      this.fileTransferDeferred = $cordovaFileTransfer.download(downloadConfig.url, this.temporaryFile, downloadConfig.options, true);
      this.fileTransferDeferred.then(this._onDownloadSuccess, this._fileTransferErrorHandler, this._onDownloadProgress);
    };

    PresentationLoader.prototype._onDownloadProgress = function(progress){
      this.fileSize = progress.total > 0 ? progress.total : this.presentation['Actual_Content_Size__c'];
      this.loadedSize = progress.loaded;
      this.trigger('Downloading', {
        progress: {current: this.loadedSize, total: this.fileSize}
      });
    };

    PresentationLoader.prototype._onDownloadSuccess = function(entry){
      this.trigger('Downloading', {
        progress: {current: this.loadedSize, total: this.fileSize}
      });
      this._unzip(entry.name);
    };

    PresentationLoader.prototype._fileTransferErrorHandler = function(error){
      if(error.code === FileTransferError.ABORT_ERR){
        this._cleanup();
      } else {
        this._errorHandler(error);
      }
    };

    PresentationLoader.prototype._errorHandler = function(error){
      this.trigger('FailLoad', error);
      this._cleanup();
      console.log('File transfer error handler called:', error);
    };

    PresentationLoader.prototype._unzip = function(zipName){
      var source, destination;
      this._changeState(this.states.UNZIP);
      source = [this.temporaryDirectory, zipName].join('/');
      destination = [this.temporaryDirectory, this.id].join('/');
      presentationFileManager.unzipFile(source, destination)
      .then(this._onUnzipSuccess)
      .catch(function(error){
        this._errorHandler(error)
      }.bind(this));
    };

    PresentationLoader.prototype._onUnzipSuccess = function(){
      var that = this;
      this._changeState(this.states.REPLACING);
      presentationFileManager.replacePresentation(this.id)
      .then(function(){
        that._changeState(that.states.FINISHED);
        that.trigger('SuccessLoad');
        return presentationFileManager.removePresentationArchive(that.id);
      })
      .catch(this._errorHandler);
    };

    PresentationLoader.prototype._cleanup = function(){
      presentationFileManager.removePresentationArchive(this.id);
      presentationFileManager.removePresentationTempFolder(this.id);
    };

    PresentationLoader.prototype.abort = function(){
      if(this.canStop()){
        this.fileTransferDeferred && this.fileTransferDeferred.abort();
        this.trigger('Abort');
      }
    };

    PresentationLoader.prototype.canStop = function(){
      return ['DOWNLOAD', 'FINISHED', 'INITED'].some(function(state){
        return this.state === this.states[state];
      }, this)
    };

    PresentationLoader.prototype._changeState = function(state){
      this.state = state;
      this.trigger('StateChange', { state: this.state });
    };

    return PresentationLoader;
  }

})();