(function() {
  'use strict';

  angular
  .module('media')
  .factory('presentationFileManager', presentationFileManager);

  presentationFileManager.$inject = [
    'utils',
    'FileManager'
  ];

  function presentationFileManager(utils, FileManager){

    function PresentationFileManager(){
      PresentationFileManager.super.constructor.apply(this, arguments);

      this.removePresentationTempFolder = utils.bind(this.removePresentationTempFolder, this);
      this.getPathToTemporaryPresentation = utils.bind(this.getPathToTemporaryPresentation, this);
      this.getPathToPresentations = utils.bind(this.getPathToPresentations, this);
      this.getPathToPresentation = utils.bind(this.getPathToPresentation, this);
      this.getPresentationIconPath = utils.bind(this.getPresentationIconPath, this);
      this.replacePresentation = utils.bind(this.replacePresentation, this);
      this.getTempPresentationDir = utils.bind(this.getTempPresentationDir, this);
      this.removePresentationArchive = utils.bind(this.removePresentationArchive, this);
    }
    PresentationFileManager = utils.extend(PresentationFileManager, FileManager);

    PresentationFileManager.prototype._presentationsRoot = 'presentations';

    PresentationFileManager.prototype.removePresentationTempFolder = function(presentationId){
      return this.getDirectory(this.getPathToTemporaryPresentation(presentationId))
      .then(this.removeDirectory);
    };

    PresentationFileManager.prototype.getPathToTemporaryPresentation = function(presentationId){
      return [this.getPathToTemporaryDir(), presentationId].join('/');
    };

    PresentationFileManager.prototype.getPathToPresentations = function(){
      return this.rootUrl() + this._presentationsRoot;
    };

    PresentationFileManager.prototype.getPathToPresentation = function(presentationId){
      return [this.getPathToPresentations(), presentationId].join('/');
    };

    PresentationFileManager.prototype.getPresentationIconPath = function(presentationId){
      var presentationDir = this.getPathToPresentation(presentationId);
      return this.getDirectory(presentationDir, false)
        .then(function(dirEntry){
          return this.getFile(dirEntry, 'icon@2x.png', false)
            .then(function(){
              return [presentationDir, 'icon@2x.png?_='].join('/') + new Date().getTime();
            });
        }.bind(this))
        .catch(function(){
          return 'resources/images/2x/media/absent-icon.png';
        });
    };

    PresentationFileManager.prototype.replacePresentation = function(presentationId){
      var that = this;
      return this.getDirectory(this.getPathToPresentation(presentationId))
      .then(this.removeDirectory)
      .then(this.getTempPresentationDir(presentationId))
      .then(function(tempPresentationDir){
        return that.getDirectory(that.getPathToPresentations())
          .then(function(presentationsDir){
            return that.moveEntry(tempPresentationDir, presentationsDir);
          });
      });
    };

    PresentationFileManager.prototype.getTempPresentationDir = function(presentationId){
      var that = this;
      return function(){
        return that.getDirectory(that.getPathToTemporaryPresentation(presentationId));
      };
    };

    PresentationFileManager.prototype.removePresentationArchive = function(presentationId){
      var that = this, fileName = presentationId + '.zip';
      this.getDirectory(this.getPathToTemporaryDir())
      .then(function(presentationsTemporaryDir){
        return that.getFile(presentationsTemporaryDir, fileName);
      })
      .then(this.removeFile);
    };


    return new PresentationFileManager;
  }

})();