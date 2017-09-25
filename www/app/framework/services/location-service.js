(function(){
  function locationService(utils, $cordovaGeolocation){
    var watcher, location;
    var LocationService = function(){
      this.trackLocation = utils.bind(this.trackLocation, this);
      this.onLocationUpdated = utils.bind(this.onLocationUpdated, this);
      this.onLocationUpdateError = utils.bind(this.onLocationUpdateError, this);
      this.stopTrackLocation = utils.bind(this.stopTrackLocation, this);
      this.getLastLocation = utils.bind(this.getLastLocation, this);
    };

    LocationService.prototype.trackLocation = function(options){
      this.stopTrackLocation();
      options = options || {};
      watcher = $cordovaGeolocation.watchPosition(options);
      watcher.then(null, this.onLocationUpdateError, this.onLocationUpdated);
    };

    LocationService.prototype.onLocationUpdated = function(newLocation){
      location = newLocation;
    };

    LocationService.prototype.onLocationUpdateError = function(locationError){
      console.log('locationTrackError', locationError);
    };

    LocationService.prototype.stopTrackLocation = function(){
      if(watcher){
        watcher.clearWatch();
        watcher = null;
      }
    };

    LocationService.prototype.getLastLocation = function(){
      return (location && location.coords) || null;
    };

    return new LocationService;
  }

  abbottApp.service('locationService', [
    'utils',
    '$cordovaGeolocation',
    locationService
  ]);
})();