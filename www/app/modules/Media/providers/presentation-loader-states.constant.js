(function() {
  'use strict';

  angular
  .module('media')
  .constant('presentationLoaderStates', presentationLoaderStates());

  function presentationLoaderStates(){
    var states = {
      NOT_INITED: -1,
      INITED: 0,
      DOWNLOAD: 1,
      UNZIP: 2,
      REPLACING: 3,
      FINISHED: 4
    };
    states.statesNames = statesNames.call(states);

    return states;

    function statesNames(){
      var that = this;
      return Object.keys(this).reduce(function(acc, key){
        acc[that[key]] = key;
        return acc;
      }, {})
    }

  }

})();