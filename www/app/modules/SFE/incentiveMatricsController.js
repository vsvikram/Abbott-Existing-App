abbottApp.controller('incentiveMatricsController', ['entityCollection','userCollection', 'targetCollection', '$scope', '$filter', '$location', 'navigationService', 'abbottConfigService', '$rootScope', '$q', 'popupService', 'dcrHelperService', 'SALESFORCE_QUERIES', '$timeout',
function(entityCollection,userCollection,targetCollection, $scope, $filter, $location, navigationService, abbottConfigService, $rootScope, $q, popupService, dcrHelperService, SALESFORCE_QUERIES, $timeout) {

	$scope.locale = abbottConfigService.getLocale();
	$scope.eligibleCurrentMonth = 0;
	$scope.earnedPreviousMonth = 0;
	$scope.earnedYTD = 0;
    $scope.config = {
                left: {
                    text: "Incentive"
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
		entityCollectionInstance = new entityCollection(),
		userId = '',
		username = '',
		territory__c = '',
		selectedUserid ='',
		selectedUsername='';

	$scope.init = function() {
	window.ga.trackView('IncentiveMetrics');
	window.ga.trackTiming('IncentiveMetrics Load Start Time',20000,'IncentiveLoadStart','Incentive Metrics Load Start');

		userCollectionInstance.fetchAllCollectionEntities().then(function(allUsers) {
			usersList = allUsers;
		}).then(userCollectionInstance.getActiveUser).then(function(activeUser) {
			loggedInUser = activeUser;
			userId = activeUser.Id;
			username = activeUser.username;
			selectedUserid =userId;
			selectedUsername=username;
			$scope.userType = activeUser.Designation__c;
		}).then(targetCollectionInstance.fetchAllCollectionEntities).then(function(targets) {
			targetsList = targets;
			userTerritory = targets[0].Territory__c;
		}).then(function(){
			getIncentivesForUser(userId);
			reset();
		});
		getPreviousMonths();
	};

	var getPreviousMonths = function(month, year){
		var date = month && year ? new Date(year, month - 1 ,1) : new Date(),
			date1 = month && year ? new Date(year, month - 1 ,1) : new Date(),
			previousMonth = new Date(date.setMonth(date.getMonth() - 1)),
			twoMonthBack = new Date(date1.setMonth(date1.getMonth() - 2));

		$scope.previousMonth = getMonth(previousMonth.getMonth()) + "' " + previousMonth.getFullYear().toString().slice(2);

		$scope.twoMonthBack = getMonth(twoMonthBack.getMonth()) + "' " + twoMonthBack.getFullYear().toString().slice(2);
	};

	var getMonth = function(val) {
		var month = '';
		switch (val) {
		case 0:
			month = $scope.locale.January;
			break;
		case 1:
			month = $scope.locale.Febuary;
			break;
		case 2:
			month = $scope.locale.March;
			break;
		case 3:
			month = $scope.locale.April;
			break;
		case 4:
			month = $scope.locale.May;
			break;
		case 5:
			month = $scope.locale.June;
			break;
		case 6:
			month = $scope.locale.July;
			break;
		case 7:
			month = $scope.locale.August;
			break;
		case 8:
			month = $scope.locale.September;
			break;
		case 9:
			month = $scope.locale.Octuber;
			break;
		case 10:
			month = $scope.locale.November;
			break;
		case 11:
			month = $scope.locale.December;
			break;

		default:
			month = "";
			break;
		}

		return month;
	};

	var reset = function() {
		switch ($scope.userType) {
		case "ABM":
			$scope.TBMUsers = [];
			var TBMUsersData = $filter('designationFilter')(targetsList, 'TBM');
			$scope.TBMUsers = TBMUsersData;
			$scope.TBMUsers.unshift({
				"option" : "All",
				"User__c" : userId
			});
			break;
		case "ZBM":
			$scope.ABMUsers = [];
			var ABMUsersData = $filter('designationFilter')(targetsList, 'ABM');
			$scope.ABMUsers = ABMUsersData;
			var all = {
				"option" : "All",
				"User__c" : userId
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
			var TBMUsersData = $filter('getDataBasedOnDateFilter')(targetsList, $scope.selectedABM.Territory__c, 'Parent_Territory__c');
			$scope.TBMUsers = TBMUsersData;
			var obj = angular.copy($scope.selectedABM);
			obj.option = "All";
			$scope.TBMUsers.unshift(obj);
			$scope.selectedTBM = $scope.TBMUsers[0];
			selectedUserid =$scope.selectedABM.User__c;
			selectedUsername=username;
		}
		getIncentivesForUser($scope.selectedABM.User__c);
	};

	$scope.onSelectTBMChange = function() {
		selectedUserid =$scope.selectedTBM.User__c;
		getIncentivesForUser($scope.selectedTBM.User__c);
	};

	var getIncentivesForUser = function(userid) {
        userid = userid || '';
		getDataFromSalesforce(userid).then(function(record) {
			if (record != null) {
				getPreviousMonths(record.IMonth__c,record.IYear__c);
				$scope.eligibleCurrentMonth = record.ELIGIBLE_FOR_NM__c;
				$scope.earnedPreviousMonth = record.LAST_MONTH_INC__c;
				$scope.earnedYTD = record.EARNED_YTD_INC__c;
			} else {
				$scope.eligibleCurrentMonth = 0;
				$scope.earnedPreviousMonth = 0;
				$scope.earnedYTD = 0;
				popupService.openPopup($scope.locale.NoDataAvailable, $scope.locale.OK, '35%', function() {
				});
			}

		}, function(error) {
			console.log(error);
			$scope.eligibleCurrentMonth = 0;
			$scope.earnedPreviousMonth = 0;
			$scope.earnedYTD = 0;
			popupService.openPopup($scope.locale.ThereissomeProblemintheServer, $scope.locale.OK, '35%', function() {
			});
		});

	};

	var getDataFromSalesforce = function(userid) {
		var deferred = $q.defer();

		var query = SALESFORCE_QUERIES.SERVER_QUERIES.getIncentiveData;

		var incentiveMatrix = query.replace('$LOGGEDINUSERID$', userid);

		entityCollectionInstance.fetchFromSalesforce(incentiveMatrix).then(function(response) {
			if (response != null && response.records.length > 0) {
				var record = response.records[0];
				deferred.resolve(record);
			} else {
				deferred.resolve(null);
			}
		}, function(error) {
			deferred.reject(error);
		});

		return deferred.promise;

		window.ga.trackTiming('IncentiveMetrics Load Finish Time',20000,'IncentiveLoadFinish','Incentive Metrics Load Finish');
	};

	$scope.navigateToIncentiveCalculator = function(userid) {
		if (navigator.onLine)
			navigationService.navigate('incentiveCalculator', {
				'userid' : selectedUserid,
				'username' : selectedUsername
			});
		else
			popupService.openPopup($scope.locale.NoInternetConnection, $scope.locale.OK, '35%', function() {			});
	};

}]); 