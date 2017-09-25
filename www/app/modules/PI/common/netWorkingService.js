abbottApp.service('netWorkingService',['$http',function($http){
	return {
		post: function(url){
			return $http.post(url);
		},
		get: function(url){
			return $http.get(url);
		}
	}
}]);