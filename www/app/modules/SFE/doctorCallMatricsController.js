abbottApp.controller('doctorCallMatricsController', ['fullDayActivityCollection','navigationService', 'missedDoctorCallService','entityCollection','userCollection', 'targetCollection', 'divisionCollection', '$scope', '$rootScope', '$filter','abbottConfigService', '$q', 'popupService', 'SALESFORCE_QUERIES',
function(fullDayActivityCollection, navigationService, missedDoctorCallService, entityCollection,userCollection,targetCollection,divisionCollection,$scope, $rootScope, $filter, abbottConfigService, $q, popupService, SALESFORCE_QUERIES) {

	$scope.locale = abbottConfigService.getLocale();
	$scope.config = {
            left: {
                text: "Doctor Call"
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
	$scope.callAverage = 0;
	$scope.totalCoverageForMonth = 0;
	$scope.totalCoverageYTD = 0;
	$scope.doctorsVisited = 0;
	$scope.plannedVisits = 0;
	$scope.missedDoctors = 0;
	$scope.userType = '';

	var userCollectionInstance = new userCollection(),
		targetCollectionInstance = new targetCollection(),
		divisionCollectionInstance = new divisionCollection(),
		entityCollectionInstance = new entityCollection(),
		fullDayActivityCollectionInstance = new fullDayActivityCollection(),
		usersList = [],
		targetsList = [],
		loggedInUser = {},
		currentTarget = {},
		userType = '',
		userId = '',
		username = '',
		territory__c = '',
		filedActivityId = '',
		leaveCount = 0;

	$scope.init = function() {
	window.ga.trackView('DoctorCallMetrics');
	window.ga.trackTiming('DoctorCall Metrics Load Start Time',20000,'DoctorCallStartload','DoctorcallMetrics Load Start');

		userCollectionInstance.fetchAllCollectionEntities().then(function(allUsers) {
        			usersList = allUsers;
		}).then(userCollectionInstance.getActiveUser).then(function(activeUser) {
			loggedInUser = activeUser;
			userType = activeUser.Designation__c;
			$scope.userType = activeUser.Designation__c;
		}).then(targetCollectionInstance.fetchAllCollectionEntities).then(function(targets) {
			targetsList = targets;
		}).then(targetCollectionInstance.fetchTarget).then(function(target) {
			currentTarget = target;
			territory__c = target.Territory__c;
		}).then(function(){
			return divisionCollectionInstance.getDivision();
		}).then(function(division){
			$scope.divisionName=division.Division_Name__c;
		}).then(function(){
			reset();
			fullDayActivityCollectionInstance.fetchAll().then(fullDayActivityCollectionInstance.fetchRecursiveFromCursor).then(function(fullDayActivityList) {
				var filedActivity = $filter('filter')(fullDayActivityList, {"Name" : "Field Work"});
				filedActivityId = filedActivity[0].Id;
				$scope.getDoctorCallsDetailsForUser(loggedInUser.Id, territory__c);
            });
		});
	};

	var reset = function() {
		switch ($scope.userType) {
		case "ABM":
			$scope.TBMUsers = [];
			var TBMUsersData = $filter(
			'designationFilter')(targetsList, 'TBM'), userId = loggedInUser.Id;
			$scope.TBMUsers = TBMUsersData;
			$scope.TBMUsers.unshift({
				"option" : "All",
				"User__c" : userId,
				"Territory__c":territory__c
			});
			break;
		case "ZBM":
			$scope.ABMUsers = [];
			var ABMUsersData = $filter(
			'designationFilter')(targetsList, 'ABM'), userId = loggedInUser.Id;
			$scope.ABMUsers = ABMUsersData;
			var all = {
				"option" : "All",
				"User__c" : userId,
				"Territory__c":territory__c
			};
			$scope.ABMUsers.unshift(all);
			$scope.selectedABM = all;
			break;
		default:
			break;
		}
	};

	$scope.onSelectABMChange = function() {
		$scope.TBMUsers = [];
		if ($scope.selectedABM.option != "All") {
			var TBMUsersData = $filter(
			'getDataBasedOnDateFilter')(targetsList, $scope.selectedABM.Territory__c, 'Parent_Territory__c');
			$scope.TBMUsers = TBMUsersData;
			var obj = angular.copy($scope.selectedABM);
			obj.option = "All";
			$scope.TBMUsers.unshift(obj);
			$scope.selectedTBM = $scope.TBMUsers[0];
		}
		$scope.getDoctorCallsDetailsForUser($scope.selectedABM.User__c, $scope.selectedABM.Territory__c);
	};

	$scope.onSelectTBMChange = function() {

		console.log($scope.selectedTBM);
 		$scope.getDoctorCallsDetailsForUser($scope.selectedTBM.User__c, $scope.selectedTBM.Territory__c);
	};

	$scope.getDoctorCallsDetailsForUser = function(userid, territoryId) {
        $scope.TotalDoctorsVisited = [];
        $scope.TotalDoctorsPlanned = [];
        userid = userid || '';
		$q.all([getNoOfDoctorsVisited(userid), getPlannedDoctorsVisits(userid)]).then(function(values) {
			var distinctDocVisited = [];
			var distinctDocPlanned = [];

			if (values[0] != null) {
		        $scope.TotalDoctorsVisited = values[0];
				$scope.doctorsVisited = $scope.TotalDoctorsVisited.length;

				var newList = [];
                angular.forEach($scope.TotalDoctorsVisited, function(val, i){
                    if(newList.indexOf(val['DCR__r']['Date__c']) == -1){
                        newList.push(val['DCR__r']['Date__c']);
                    }
                });

                angular.forEach($scope.TotalDoctorsVisited, function(val, i){
                    if(distinctDocVisited.indexOf(val.Assignment__r.Account__r.Name) == -1){
                        distinctDocVisited.push(val.Assignment__r.Account__r.Name);
                    }
                });

				var worksDays = newList.length;
				var callAverage = $scope.doctorsVisited / worksDays;
				$scope.callAverage = isNaN(callAverage) ? 0 : callAverage.toFixed(2);
			} else {
				$scope.doctorsVisited = 0;
				$scope.callAverage = 0;
			}
			$scope.TotalDoctorsPlanned = values[1];
			$scope.plannedVisits = $scope.TotalDoctorsPlanned.length;
			$scope.missedDoctors = $scope.plannedVisits - $scope.TotalDoctorsVisited.length;
			if ($scope.plannedVisits > 0) {
				var totalCoverage = ($scope.doctorsVisited * 100) / $scope.plannedVisits;
				$scope.totalCoverageForMonth = totalCoverage.toFixed(2);
			} else
				$scope.totalCoverageForMonth = 0;

            angular.forEach($scope.TotalDoctorsPlanned, function(val, i){
                if(distinctDocPlanned.indexOf(val.Assignment__r.Account__r.Name) == -1){
                    distinctDocPlanned.push(val.Assignment__r.Account__r.Name);
                }
            });

			$scope.missedDocList = [];
            angular.forEach(distinctDocPlanned, function(val, i){
                var missedDoc = $filter('filter')(distinctDocVisited, function(visited){
                    if(visited == val)
                        return true;
                    return false;
                });
                if(missedDoc.length == 0 ){
                   $scope.missedDocList.push(val);
                }
            });
            $scope.missedDoctors =  $scope.missedDocList.length;
		}, function(error) {
			$scope.callAverage = 0, $scope.totalCoverageForMonth = 0, $scope.totalCoverageYTD = 0, $scope.doctorsVisited = 0, $scope.plannedVisits = 0;
			$scope.missedDoctors = 0;
			if(error =='no data')
			    popupService.openPopup($scope.locale.NoDataAvailable, $scope.locale.OK, '35%', function() {
            				});
            else
                popupService.openPopup($scope.locale.ThereissomeProblemintheServer, $scope.locale.OK, '35%', function() {
                });
		});

		window.ga.trackTiming('DoctorCall Metrics Load Finish Time',20000,'DoctorCallFinishtload','DoctorcallMetrics Load Finish');
	};

	var getNoOfDoctorsVisited = function(userid) {

		var deferred = $q.defer();

		var noofdoctorvisited = SALESFORCE_QUERIES.SERVER_QUERIES.doctorVisitByUser.replace('$LOGGEDINUSERID$', userid).replace('$FIELD_ACTIVITY$', filedActivityId).replace('$FIELD_ACTIVITY$', filedActivityId);

		entityCollectionInstance.fetchFromSalesforce(noofdoctorvisited).then(function(response) {
			deferred.resolve(response.records);
		}, function(error) {
			console.log(error);
			deferred.reject(error);
		});

		return deferred.promise;
	};

	var getPlannedDoctorsVisits = function(userid) {
		var mtpQuery = SALESFORCE_QUERIES.SERVER_QUERIES.getMTPDoctorsForUser.replace('$LOGGEDINUSERID$', userid);
		var deferred = $q.defer();
		entityCollectionInstance.fetchFromSalesforce(mtpQuery).then(function(response) {
			if (response != null && response.records.length > 0) {

				deferred.resolve(response.records);

			} else {
				deferred.reject("no data");
			}
		});

		return deferred.promise;
	};

	$scope.displayMissedDoctor = function(){
    if($scope.missedDocList.length > 0)
    {
        missedDoctorCallService.setDocList($scope.missedDocList);
        navigationService.navigate('missedDoctorCallDetails');
    }
            //popupService.openPopupWithTemplateUrl($scope,"app/modules/SFE/missedDoctorCallDetails.html",'90%');
	};

	$scope.closeDialog = function(){
	    popupService.closePopup();
	};
}]);