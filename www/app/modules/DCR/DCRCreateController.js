abbottApp.controller('DCRCreateController', ['$scope', '$stateParams', 'abbottConfigService', '$rootScope', '$filter', 'jfwOtherRolesCollection', 'userCollection', 'targetCollection','statusDCRActivty','navigationService',
function($scope, $stateParams, abbottConfigService, $rootScope, $filter, JFWOtherRolesCollection, UserCollection, TargetCollection , statusDCRActivty,navigationService) {
	var jfwOtherRolesCollection = new JFWOtherRolesCollection(),
	    userCollection = new UserCollection(),
	    targetCollection = new TargetCollection(),
	    usersList = [],
	    targetsList = [],
	    currentUser = {};

	   $scope.activitiesSelectedInActivitySelectionPage = [];
        $scope.activitiesSelectedInActivitySelectionPage = statusDCRActivty.getActivityStatus();
        $scope.currentCalenderDate = statusDCRActivty.getCalenderDate();

	    $scope.init = function() {

		window.ga.trackView('DCRCreateDoctor');
		window.ga.trackTiming('DCRCreate Load Start Time', 20000, 'DCRCreateStart', 'DCRCreate Load Start');

		$scope.brandAdd = true;
		$scope.isCollapsed = true;
        
		$scope.tabTitle = $rootScope.tabTitle;
		$scope.tabTabType = $scope.$parent.tabTabType;
		$scope.selectedSupervisorIds =[];
		$scope.listOfSupervisors = [];
		$scope.transperantConfig = abbottConfigService.getTransparency();
		$scope.transperantConfig.display = true;
		$scope.transperantConfig.showBusyIndicator = true;
		$scope.transparentConfig.showTransparancy = true;
		abbottConfigService.setTransparency($scope.transperantConfig);

		//Adding ABM User //Adding ZBM User //Adding NSM User
		/*$scope.listOfSupervisors.push({
			"id" : "NONE",
			"name" : abbottConfigService.getLocale().None.toUpperCase(),
			"designation" : null
		});*/

		$scope.loadUserData().then(function() {
			for (var i = 1; i < usersList.length; i++) {
				if (usersList[i]) {
					$scope.listOfSupervisors.push({
						"id" : usersList[i].Id,
						"name" : usersList[i].Name,
						"designation" : usersList[i].Designation__c || null
					});
				}
			}

			addReportees('ABM');
			addReportees('TBM');
		}).then(jfwOtherRolesCollection.fetchAll).then(jfwOtherRolesCollection.fetchRecursiveFromCursor).then(function(jfwList) {
			jfwList.forEach(function(jfw) {
				$scope.listOfSupervisors.push({
					"id" : jfw.User__c,
					"name" : jfw.User__r.Name,
					"designation" : jfw.User__r.Designation__c || null
				});
			});
		});
	};

	$scope.loadUserData = function() {
		return userCollection.fetchAllCollectionEntities().then(function(allUsers) {
			usersList = allUsers;
		}).then(userCollection.getActiveUser).then(function(activeUser) {
			currentUser = activeUser;
		}).then(targetCollection.fetchAllCollectionEntities).then(function(targets) {
			targetsList = targets;
			window.ga.trackTiming('DCRCreate Load Finish Time', 20000, 'DCRCreateFinish', 'DCRCreate Load Finish');
		})
	};

	var addReportees = function(designation) {
		if (currentUser && designation == currentUser.Designation__c) {
			return;
		}

		var usersData = $filter('designationFilter')(targetsList, designation);

		angular.forEach(usersData, function(value, index) {
			if (value.User__r.Name != "Vacant") {
				$scope.listOfSupervisors.push({
					"id" : value.User__c,
					"name" : value.User__r.Name,
					"designation" : value.User__r.Designation__c || null
				});
			}
		});
	};

    //Header configuration
    $scope.abwheaderConfig = {
        hambergFlag: true,
        applogoFlag: false,
        headerText: 'Daily Call Report',
        syncFlag: true,
        toggleSideMenu: false,
        notifyFlag: true,
        notifyCount: 3,
        searchFlag: false,
        searchHandler : searchHandler
    }
    function searchHandler(searchVal) {
        $scope.searchVal = searchVal;
    }

    $scope.backButton = function() {
             navigationService.backFunc();
         }

}]);