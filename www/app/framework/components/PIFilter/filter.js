abbottApp.controller('filterController',['$scope','dashboardStateService', function($scope,dashboardStateService){
	$scope.applyFilter = function(areaType,value){
		dashboardStateService.modifyStates(areaType);	
	}

}]);	