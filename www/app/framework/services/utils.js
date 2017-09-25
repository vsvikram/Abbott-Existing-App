(function(){
  function utils($q, $rootScope){
    var Utils = function(){
      this.toDateString = this.bind(this.toDateString, this);
      this.toSFDCDate = this.bind(this.toSFDCDate, this);
      this.currentDateInSFDCFormat = this.bind(this.currentDateInSFDCFormat, this);
    };

    Utils.prototype.isAndroid = function(){
      return /Android/.test(navigator.userAgent);
    };

    Utils.prototype.isDeviceOnline = function(){
      return !['NONE', 'UNKNOWN'].some(function(connectionTypeName){
        return navigator.connection.type === Connection[connectionTypeName];
      })
    };

    Utils.prototype.isIos = function(){
      return /iPhone/.test(navigator.userAgent);
    };

    Utils.prototype.isMobile = function(){
      return this.isAndroid() || this.isIos();
    };

    Utils.prototype.mapConcurrent = function(collection, handler){
      return $q.when(collection.map(handler));
    };

    Utils.prototype.fieldMapper = function(field){
      return function(object){
        return object[field];
      };
    };

    Utils.prototype.mapFieldFromCollection = function(collection, field){
      var mapper = this.fieldMapper(field);
      return collection.map(mapper);
    };

    Utils.prototype.bind = function(fn, me){
      return function(){
        return fn.apply(me, arguments);
      };
    };

    Utils.prototype.extend = function(child, parent){
      for(var key in parent){
        if({}.hasOwnProperty.call(parent, key)) child[key] = parent[key];
      }

      function Constructor(){
        this.constructor = child;
      }

      Constructor.prototype = parent.prototype;
      child.prototype = new Constructor();
      child.super = parent.prototype;
      return child;
    };

    Utils.prototype.bindAllPrototype = function(){
      angular.foreach(this.constructor.prototype, function(value, key){
        if(value instanceof Function){
          this[key] = value.bind(this);
        }
      }, this);
    };

    Utils.prototype.extendByEvents = function(Constructor){
      Constructor.prototype.trigger = function(eventName, value){
        this.scope.$broadcast(eventName, value);
      };
      Constructor.prototype.on = function(eventName, callback){
        return this.scope.$on(eventName, callback);
      };
      Constructor.prototype.initEvents = function(){
        this.scope = $rootScope.$new(true);
        this.trigger = this.trigger.bind(this);
        this.on = this.on.bind(this);
      };
    };

    Utils.prototype.isEmpty = function(obj){
      for(var prop in obj){
        if(obj.hasOwnProperty(prop))
          return false;
      }
      return true;
    };

    Utils.prototype.toUpperCaseFirstCharacter = function(str){
      return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };

    Utils.prototype.dayOfWeekAsString = function(dayText){
      return [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ].indexOf(dayText);
    };

    Utils.prototype.getMax = function(array, key){
      var max = 0;
      for(var i = 0; i < array.length; i++){
        if(array[i][key] > max){
          max = array[i][key];
        }
      }
      return max + 1;
    };

    Utils.prototype.toDateString = function(date){
      return moment(date).format('YYYY-MM-DD');
    };

    Utils.prototype.toSFDCDate = function(date){
      return moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
    };

    Utils.prototype.currentDateInSFDCFormat = function(){
      return this.toSFDCDate(moment().utc());
    };

    Utils.prototype.mapCollectionToKeyValue = function(collection, keyField, valueField){
      var keyValueObject = {};
      collection.forEach(function(collectionItem){
        keyValueObject[collectionItem[keyField]] = valueField ? collectionItem[valueField] : collectionItem;
      });
      return keyValueObject;
    };

    Utils.prototype.uniqueElements = function(collection){
        var newCollection =[];
        collection.forEach(function(value, index) {
            if(newCollection.indexOf(value)==-1)
                newCollection.push(value);
        });
        return newCollection;
    };

    return new Utils();
  }

  abbottApp.service('utils', [
    '$q',
    '$rootScope',
    utils
  ]);
})();