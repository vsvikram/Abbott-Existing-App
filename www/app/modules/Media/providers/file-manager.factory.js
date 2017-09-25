(function() {
  'use strict';

  angular
  .module('media')
  .factory('FileManager', fileManager);

  fileManager.$inject = [
    '$window',
    '$q',
    'utils'
  ];


  function fileManager($window, $q, utils){

    function getLocalFileSystem(){
      return $q(function(resove, reject){
        if($window.LocalFileSystem){
          resove($window.LocalFileSystem);
        }else{
          document.addEventListener("deviceready", function(){
            resove($window.LocalFileSystem);
          }, false);
        }

      })
    }

    function FileManager(){
      this.afterInit = this.initEntry(getLocalFileSystem(), '_rootEntry');

      this.getDirectory = utils.bind(this.getDirectory, this);
      this._cleanupPath = utils.bind(this._cleanupPath, this);
      this._recursiveCreateDir = utils.bind(this._recursiveCreateDir, this);
      this._catchError = utils.bind(this._catchError, this);
      this.getPathToTemporaryDir = utils.bind(this.getPathToTemporaryDir, this);
      this.rootUrl = utils.bind(this.rootUrl, this);
      this.moveEntry = utils.bind(this.moveEntry, this);
      this.removeDirectory = utils.bind(this.removeDirectory, this);
      this.getFile = utils.bind(this.getFile, this);
      this.removeFile = utils.bind(this.removeFile, this);
      this.unzipFile = utils.bind(this.unzipFile, this);
    }

    FileManager.prototype.initEntry = function(LocalFileSystemFunction, fieldName){
      var that = this,
          entry,
          errorMessage = 'File system unavailable';
      return LocalFileSystemFunction
      .then(function(LocalFileSystem){
        entry = LocalFileSystem.PERSISTENT;
        return $q(function(resolve, reject){
          if($window.requestFileSystem){
            $window.requestFileSystem(entry, 0, function(fileSystem){
              that[fieldName] = fileSystem.root;
              that[fieldName].absPath = fileSystem.root.nativeURL.replace('file://', '');
              resolve()
            }, function(error){
              reject(error);
              console.error(error);
            });
          } else {
            reject(new Error(errorMessage));
            console.error(errorMessage);
          }
        });
      });
    };

    FileManager.prototype._temporaryRoot = 'temporary';

    FileManager.prototype.getDirectory = function(dirPath, create){
      var that = this, promise;
      create = angular.isUndefined(create) ? true : create;
      dirPath = this._cleanupPath(dirPath);
      promise = create ? this._recursiveCreateDir(dirPath) : $q(function(resolve, reject){
        that._rootEntry.getDirectory(dirPath, {create: create}, resolve, that._catchError(reject));
      });
      return promise;
    };

    FileManager.prototype._cleanupPath = function(path){
      return ['file://', this._rootEntry.absPath, /^\/+/ig].reduce(function(path, removePart){
        return path.replace(removePart, '');
      }, path);
    };

    FileManager.prototype._recursiveCreateDir = function(path, rootEntry){
      var that = this;
      rootEntry = rootEntry || this._rootEntry;
      return $q(function(resolve, reject){
        var subfolders = path.split('/');
        path = '';
        function recursion(dirEntry){
          if(subfolders.length){
            path = that._cleanupPath([path, subfolders.shift()].join('/'));
            rootEntry.getDirectory(path, {create: true}, recursion, that._catchError(reject));
          } else {
            resolve(dirEntry);
          }
        }
        recursion(null);
      });
    };

    FileManager.prototype._catchError = function(reject){
      return function(error){
        reject(error);
        console.error(error)
      };
    };

    FileManager.prototype.getPathToTemporaryDir = function(){
      return this.rootUrl() + this._temporaryRoot;
    };

    FileManager.prototype.rootUrl = function(){
      return this._rootEntry.nativeURL;
    };

    FileManager.prototype.moveEntry = function(fsEntry, newParent){
      return this._transferEntry(fsEntry, newParent);
    };

    FileManager.prototype._transferEntry = function(entry, toDirectory, action){
      var that = this;
      action = action || 'move';
      return $q(function(resolve, reject){
        entry[action + 'To'](toDirectory, entry.name, resolve, that._catchError(reject));
      });
    };

    FileManager.prototype.removeDirectory = function(dirEntry){
      var that = this;
      return $q(function(resolve, reject){
        dirEntry.removeRecursively(resolve, function(fileError){
          if(fileError.code === FileError.PATH_EXISTS_ERR || fileError.code === FileError.NOT_FOUND_ERR){
            resolve(null);
          } else {
            that._catchError(reject)(fileError);
          }
        });
      });
    };

    FileManager.prototype.getFile = function(dirEntry, fileName, create){
      var that = this;
      create = angular.isUndefined(create) ? true : create;
      return $q(function(resolve, reject){
        dirEntry.getFile(fileName, {create: create}, resolve, that._catchError(reject));
      });
    };

    FileManager.prototype.removeFile = function(fileEntry){
      var that = this;
      return $q(function(resolve, reject){
        fileEntry.remove(resolve, function(fileError){
          var errorCode = fileError.code;
          if(errorCode === FileError.NOT_FOUND_ERR || errorCode === FileError.NO_MODIFICATION_ALLOWED_ERR){
            resolve(fileEntry);
          } else{
            that._catchError(reject)(fileError);
          }
        })
      });
    };

    FileManager.prototype.unzipFile = function(zipFile, unpackFolder){
      var that = this;
      return $q(function(resolve, reject){
        zip.unzip(zipFile, unpackFolder, function(result){
          if(result == -1){
            return reject({code: 422});
          }
          that.getDirectory(unpackFolder).then(resolve, reject);
        });
      });
    };


    return FileManager;
  }

})();