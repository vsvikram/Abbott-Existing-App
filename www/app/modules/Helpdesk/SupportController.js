abbottApp.controller('SupportController',['$scope','$state','$stateParams','$q','navigationService', 'abbottConfigService','statusDCRActivty','popupService',
function($scope,$state,$stateParams,$q,navigationService,abbottConfigService,statusDCRActivty,popupService) {
	
	$scope.locale = abbottConfigService.getLocale();

	window.ga.trackView('Support');
	$scope.appVersion = '';
	
	var getAppVersion = function(){
		var deferred = $q.defer();
		cordova.getAppVersion.getVersionNumber(function (version) {
			deferred.resolve(version);						
		});		
		return deferred.promise;
	};

	//Get the android application version
	getAppVersion().then(function(version){
		$scope.appVersion = version+' - '+device.platform + ' '+device.version ;
	});

}]);
