abbottApp.controller('performanceMatricsController', ['entityCollection','userCollection', 'targetCollection', 'divisionCollection', '$scope','$filter','$location', 'navigationService', 'abbottConfigService', '$rootScope', '$q', 'popupService','dcrHelperService', 'SALESFORCE_QUERIES','$timeout',
                                                      function(entityCollection,userCollection,targetCollection,divisionCollection, $scope, $filter,$location, navigationService, abbottConfigService, $rootScope,$q, popupService,dcrHelperService,SALESFORCE_QUERIES,$timeout) {
    $scope.config = {
                    left: {
                        text: "Performance"
                    },
                    right: {
                        text: ""
                    }
            };
    $scope.abwheaderConfig = {
            hambergFlag: true,
            applogoFlag: true,
            textFlag  : false,
            syncFlag: true,
            toggleSideMenu: false,
            notifyFlag: true,
            notifyCount: 3,
            searchFlag: false,
            searchHandler : searchHandler
    };
    function searchHandler(searchVal) {
            $scope.searchVal = searchVal;
    };

	var userCollectionInstance = new userCollection(),
		targetCollectionInstance = new targetCollection(),
		divisionCollectionInstance = new divisionCollection(),
		entityCollectionInstance = new entityCollection(),
		usersList = [],
		targetsList = [],
		userObj = {},
		currentTarget = {},
		userType = '',
		leagueData = [];
	$scope.designation='';
	$scope.userDesigntion = '';
	$scope.performanceMatrixObj = {};

	$scope.init = function() {
		window.ga.trackView('PerformanceMetrics');
		window.ga.trackTiming('PerformanceMetrics Load Start Time',20000,'performanceLoadStart','Performance Metrics Load Start');

		$scope.locale = abbottConfigService.getLocale();
		//Loading indicator code
		$scope.transperantConfig = abbottConfigService.getTransparency();
		$scope.transperantConfig.display = true;
		$scope.transperantConfig.showBusyIndicator = true;
		$scope.transperantConfig.showTransparancy = true;
		abbottConfigService.setTransparency($scope.transperantConfig);
		
		userCollectionInstance.fetchAllCollectionEntities().then(function(allUsers) {
			usersList = allUsers;
		}).then(userCollectionInstance.getActiveUser).then(function(activeUser) {
			userObj = activeUser;
			userType = activeUser.Designation__c;
			$scope.designation=userType;
			$scope.userDesigntion = userType;
		}).then(targetCollectionInstance.fetchAllCollectionEntities).then(function(targets) {
			targetsList = targets;
		}).then(targetCollectionInstance.fetchTarget).then(function(target) {
			currentTarget = target;
		}).then(function(){
			return divisionCollectionInstance.getDivision();
		}).then(function(division){
			$scope.divisionName=division.Division_Name__c;
		}).then(function(){
	  		reset();
		  	getPerformanceLeague(userObj.Id);
		});
	};
	
	var getPerformanceLeague = function(userId) {
		if(leagueData.length == 0) {
			getLeagueData().then(function(record) {
				if (record != null) {
					leagueData = record;
					getPerformanceData(userId);
				} else {
					popupService.openPopup($scope.locale.NoDataAvailable, $scope.locale.OK, '35%', function() {});
					$scope.transperantConfig.display = false;
					abbottConfigService.setTransparency($scope.transperantConfig);
				}
			}, function(error) {
				console.log(error);
				popupService.openPopup($scope.locale.ThereissomeProblemintheServer, $scope.locale.OK, '35%', function() {
				});
			});
		} else {
			getPerformanceData(userId);
		}
	};
	
	var getLeagueData = function() {
		var deferred = $q.defer();
		var leagueQuery = SALESFORCE_QUERIES.SERVER_QUERIES.getSfeDbLeague;
		var escapeDivionName = $scope.divisionName.replace(/([\'])/g, "\\$1");
		leagueQuery = leagueQuery.replace('$DIVISIONNAME$', escapeDivionName);
		
		entityCollectionInstance.fetchFromSalesforce(leagueQuery).then(function(response) {
			if (response != null && response.records.length > 0) {
				var filteredData = [];
				for(var i=0;i<response.records.length;i++) {
					var desig = response.records[i].User_Designation__c;
					if(desig=='BM') {
						desig='ZBM';
					}
					if(desig == $scope.designation) {
						filteredData = response.records[i];
						$scope.userType=filteredData.User_Type__c;
					}
				}
				deferred.resolve(filteredData);
			} else {
				deferred.resolve(null);
			}
		}, function(error) {
			deferred.reject(error);
		});

		return deferred.promise;

		window.ga.trackTiming('PerformanceMetrics Load Finish Time',20000,'PerformanceLoadFinish','Performance Metrics Load Finish');
	};

	var reset = function() {
		switch($scope.designation) {
		case "ABM":
			$scope.TBMUsers=[];
			var TBMUsersData = $filter('designationFilter')(targetsList, 'TBM'),
			userId=userObj.Id;
			$scope.TBMUsers = TBMUsersData;
			$scope.TBMUsers.unshift({"option": "All", "User__c":userId});
			break;
		case "ZBM":
			$scope.ABMUsers=[];
			var ABMUsersData = $filter('designationFilter')(targetsList, 'ABM'),
			userId=userObj.Id;
			$scope.ABMUsers = ABMUsersData;
			var all = {"option": "All", "User__c":userId};
			$scope.ABMUsers.unshift(all);
			$scope.selectedABM = all;
			break;
		default:break;
		}
	};

	$scope.onSelectABMChange = function() {
		$scope.TBMUsers=[];
		if($scope.selectedABM.option!="All") {
			var TBMUsersData = $filter('getDataBasedOnDateFilter')(targetsList, $scope.selectedABM.Territory__c, 'Parent_Territory__c');
			$scope.TBMUsers = TBMUsersData;
			var obj = angular.copy($scope.selectedABM);
			obj.option = "All";
			$scope.TBMUsers.unshift(obj);
			$scope.selectedTBM = $scope.TBMUsers[0];
			$scope.designation = $scope.selectedABM.User__r.Designation__c;
		} else {
			$scope.designation = "ZBM";
		}
		if($scope.selectedABM.User__c==null) {
			$scope.performanceMatrixObj = null;
			popupService.openPopup($scope.locale.NoDataAvailable, $scope.locale.OK, '35%', function() {});	
			return;
		}
		getPerformanceLeague($scope.selectedABM.User__c);
	};

	$scope.onSelectTBMChange = function() {
		if($scope.selectedTBM.User__c==null) {
			$scope.performanceMatrixObj = null;
			popupService.openPopup($scope.locale.NoDataAvailable, $scope.locale.OK, '35%', function() {});	
			return;
		}
		getPerformanceLeague($scope.selectedTBM.User__c);
		$scope.designation = ($scope.selectedTBM.option!="All") ? $scope.selectedTBM.User__r.Designation__c : "ABM";
	};

	var getPerformanceData = function(userId) {
		retrievePerformanceData(userId).then(function(data) {
			$scope.performanceMatrixObj = data;
			if(data==null) {
				popupService.openPopup($scope.locale.NoDataAvailable, $scope.locale.OK, '35%', function() {});
			} else {
				for (var key in leagueData) {
					if(key=='attributes') {
						continue;
					}
					$scope.performanceMatrixObj[key+"_Percentage"] =  0;
					if ($scope.performanceMatrixObj[key] && leagueData[key] && typeof leagueData[key] == 'number') {
						$scope.performanceMatrixObj[key+"_Percentage"] = ($scope.performanceMatrixObj[key] / leagueData[key]) * 100;

					}
				}
			}
			$scope.transperantConfig.display = false;
			abbottConfigService.setTransparency($scope.transperantConfig);
		}, function(error) {
			console.log(error);
			popupService.openPopup($scope.locale.ThereissomeProblemintheServer, $scope.locale.OK, '35%', function() {});
			$scope.transperantConfig.display = false;
			abbottConfigService.setTransparency($scope.transperantConfig);
		});
	};

	var retrievePerformanceData = function(userId) {
		var deferred = $q.defer();
		var getTragets = "SELECT LEAGUE_SCORE__c, FINAL_RANK__c, Overall_Sales_Ach_Points__c, P1_Sales_Ach_Points__c, P2_Sales_Ach_Points__c, P3_Sales_Ach_Points__c,"
						 +"DSO_score__c, PEOPLE_DEVELOPMENT__c, PROCESS_COMPLIANCE__c,"
						 +"Field_Work_Points__c, DOC_CALL_FW_Score__c, COV_2PC_Score__c, TOTAL_COV_Score__c,"
						 +"ELEARNING_MODULE__c, WASTE_REDUCTION_score__c, E_Secondary_Points__c,"
						 +"Forecast_Accuracy_Points__c, COACHING_Score__c FROM SFE_DB_Incentive__c where Employee_Code__r.Id = '"+userId+"'";
		entityCollectionInstance.fetchFromSalesforce(getTragets).then(function(response) {
			if(response != null && response.records.length > 0) {
				deferred.resolve(response.records[0]);
			} else {
				deferred.resolve(null);
			}
		},function(error){
			console.log(error);
			deferred.reject(error);
			$scope.transperantConfig.display = false;
			abbottConfigService.setTransparency($scope.transperantConfig);
		});		
	return deferred.promise;
	}
	
	window.ga.trackTiming('PerformanceMetrics Load Finish Time',20000,'PerformanceLoadFinish','Performance Metrics Load Finish');

}]);