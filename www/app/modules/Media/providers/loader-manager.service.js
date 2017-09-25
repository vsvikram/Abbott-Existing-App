(function() {
  'use strict';

  angular
  .module('media')
  .service('loaderManager', loaderManager);

  function loaderManager(){
    var _cachedLoaders = {};

    this.getLoaderById = function(id){
      var loader = _cachedLoaders[id];
      return id && loader ? loader : null;
    };

    this.initLoader = function(loader){
      var cachedLoader = this.getLoaderById(loader.id);
      loader = cachedLoader ? cachedLoader : cacheLoader(loader);
      return this.subscribeOnLoaderFinal(loader);
    };

    this.invokeLoader = function(loader){
      loader = this.initLoader(loader);
      loader && loader.download();
      return loader;
    };
    // for better debug
    // window._cachedLoaders = _cachedLoaders

    this.removeLoaderById = function(id){
      var loader = this.getLoaderById(id);
      loader && loader.canStop() && delete _cachedLoaders[id];
      return loader;
    };

    this.destroyLoaderById = function(id){
      var loader = this.removeLoaderById(id);
      if(loader){
        loader.trigger('Destroy');
        loader.abort();
        loader.scope.$destroy();
      }
      return loader;
    };

    this.destroyLoadersByIds = function(ids){
      ids.forEach(this.destroyLoaderById, this);
    };

    this.destroyAllLoaders = function(){
      this.destroyLoadersByIds(Object.keys(_cachedLoaders));
    };

    this.subscribeOnLoaderFinal = function(loader){
      var that = this, finalEventsNames = ['FailLoad', 'Abort', 'SuccessLoad'];

      finalEventsNames.forEach(function(eventName){
        loader.on(eventName, function(){
          that.destroyLoaderById(loader.id);
        });
      });

      return loader;
    };

    this.hasActiveLoaders = function(){
      return Object.keys(_cachedLoaders).length;
    };

    function cacheLoader(loader){
      return _cachedLoaders[loader.id] = loader;
    }


  }

})();