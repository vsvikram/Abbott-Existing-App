/**
 * @author 441257
 * Modified 593264
 */
abbottApp.controller('MTPListController', ['$q','$scope', '$rootScope', '$filter', 'navigationService', 'abbottConfigService', '$stateParams', 'utils', 'mtpAppointmentDetails1Collection', 'lastVisitCollection', 'mtpDetailsCollection', 'userCollection', 'gotoDcr','sfdcAccount','$cordovaInAppBrowser','mtpRemoveConfigCollection','newCustomerCollection','dcrCollection','dcrJunctionCollection',
function($q ,$scope, $rootScope, $filter, navigationService, abbottConfigService, $stateParams, utils, mtpAppointmentDetails1Collection, lastVisitCollection, mtpDetailsCollection, userCollection, gotoDcr,sfdcAccount,$cordovaInAppBrowser,MtpRemoveConfigCollection,NewCustomerCollection,DcrCollection,DcrJunctionCollection) {

	$scope.errorShowHtml = false;
	$scope.date = new Date();

	$scope.filterdatetime = $filter('date')($scope.date, 'yyyy-MM-dd');
	$scope.MTPListViewData = {
		mtpDetails : [],
		lastVisited : [],
		nonFieldWorkDetails : []
	};

	$scope.mtpDetails = [];

    //Get if the day is non filed work activity
	$scope.checkIfNonFieldWorkActivity = function() {
		var nonFieldWorkDetails = $scope.MTPListViewData.nonFieldWorkDetails,
		    filteredRecord = $filter('getDataBasedOnDateFilter')(nonFieldWorkDetails, $scope.filterdatetime, 'MTP_Cycle__r.Date__c'),
		    activityName = '';
		if (filteredRecord.length > 0) {
			activityName = filteredRecord[0].Activity_Master__r.Name;
		}
		return activityName;
	};

    /*
	var previousSortedColumnName = '';
	$scope.sortList = function(sortType) {
		if (previousSortedColumnName == sortType) {
			$scope.sortReverse = !$scope.sortReverse;
		} else {
			$scope.sortReverse = true;
		}
		previousSortedColumnName = sortType;

		$scope.sortType = sortType;
		$scope.mtpDetails = $filter('orderBy')($scope.mtpDetails, $scope.sortType, $scope.sortReverse);
	};*/

	$scope.getMTPList = function() {
		$scope.transperantConfig.display = false;
		$scope.sortType = null;
		$scope.sortReverse = false;
		$scope.nonFieldActivityName = $scope.checkIfNonFieldWorkActivity();
		$scope.patchDetails = [];
		if ($scope.nonFieldActivityName == '') {
			$scope.mtpDetails = [];
			var mtpDetailsData = $scope.MTPListViewData.mtpDetails,
			    lastVisitedData = $scope.MTPListViewData.lastVisited;
			var mtpDataForSelectedDay = $filter('getDataBasedOnDateFilter')(mtpDetailsData, $scope.filterdatetime, 'MTP_Cycle__r.Date__c'),
			    lastVisitDates = [],
			    lastVisitDate = '';

			mtpDataForSelectedDay = $filter('orderBy')(mtpDataForSelectedDay, 'Name');

			if (mtpDataForSelectedDay.length > 0) {
				angular.forEach(mtpDataForSelectedDay, function(value, index) {

					lastVisitDates = $filter('filter')(lastVisitedData, {
						'Account__c' : mtpDataForSelectedDay[index].Assignment__r.Account__c
					});
					if (lastVisitDates != null) {
						angular.forEach(lastVisitDates, function(value, index) {
							if (value.Last_Visit_Date__c != null) {
								value.Last_Visit_Date__c = new Date(value.Last_Visit_Date__c);
							}
						});
						//lastVisitDates = $filter('orderBy')(lastVisitDates, 'Last_Visit_Date__c', true);
						lastVisitDate = (lastVisitDates[0] == undefined || lastVisitDates[0].Last_Visit_Date__c == null) ? $scope.locale.NotFound : lastVisitDates[0].Last_Visit_Date__c;
						lastVisitDate = (new Date(lastVisitDate) == new Date($scope.filterdatetime)) ? $scope.locale.NotFound : lastVisitDate;
					} else
						lastVisitDate = $scope.locale.NotFound;

					if (lastVisitDate != $scope.locale.NotFound) {
						lastVisitDate = $filter('date')(lastVisitDate, 'dd MMMM yyyy');
					}

					if ($scope.userType == "TBM") {
						this.push({
							"name" : value.Assignment__r.Account__r.Name,
							"userId" : value.Assignment__r.Account__c,
							"customerType" : value.Assignment__r.Account__r.Customer_Type__c,
							"speciality": value.Assignment__r.Speciality__c,
							"personMobilePhone" : value.Assignment__r.Account__r.PersonMobilePhone,
							"patch" : value.Patch__r.Name,
							"last_Visit_Date" : lastVisitDate
						});
						if($scope.patchDetails.indexOf(value.Patch__r.Name) == -1){
						    $scope.patchDetails.push(value.Patch__r.Name);
						}
					} else if ($scope.userType == "ABM") {
						if (value.TBM__r == null) {
							$scope.tbmName = "";
						} else {
							$scope.tbmName = value.TBM__r.Name;
						}
						this.push({
							"name" : value.Assignment__r.Account__r.Name,
							"userId" : value.Assignment__r.Account__c,
							"customerType" : value.Assignment__r.Account__r.Customer_Type__c,
							"speciality": value.Assignment__r.Speciality__c,
							"personMobilePhone" : value.Assignment__r.Account__r.PersonMobilePhone,
							"patch" : value.Patch__r.Name,
							"last_Visit_Date" : lastVisitDate
						});
						if($scope.patchDetails.indexOf(value.Patch__r.Name) == -1){
                        	$scope.patchDetails.push(value.Patch__r.Name);
                        }
					} else if ($scope.userType == "ZBM") {
						if (value.ABM__r == null) {
							$scope.abmName = "";
						} else {
							$scope.abmName = value.ABM__r.Name;
						}
						if (value.TBM__r == null) {
							$scope.tbmName = "";
						} else {
							$scope.tbmName = value.TBM__r.Name;
						}
						this.push({
							"name" : value.Assignment__r.Account__r.Name,
							"userId" : value.Assignment__r.Account__c,
							"customerType" : value.Assignment__r.Account__r.Customer_Type__c,
							"speciality": value.Assignment__r.Speciality__c,
							"personMobilePhone" : value.Assignment__r.Account__r.PersonMobilePhone,
							"patch" : value.Patch__r.Name,
							"last_Visit_Date" : lastVisitDate
						});
						if($scope.patchDetails.indexOf($scope.abmName) == -1){
                             $scope.patchDetails.push($scope.abmName);
                        }
					}
				}, $scope.mtpDetails);
			} else {
				$scope.errorShowHtml = true;
			}
			//$scope.numberOfCalls = $scope.mtpDetails.length;
			$scope.getCallsToGo();
			console.log("Patch Details",$scope.patchDetails);
			console.log("MTP Details",$scope.mtpDetails);
		}

		if($scope.patchDetails.length > 0){
			//this array is not empty
			$scope.patchDetails = $scope.patchDetails.join(', ');
		}else{
		   //this array is empty
		   $scope.patchDetails = $scope.locale.NoDataAvailable;
		}

		window.ga.trackTiming('MTP List Load Finish Time', 20000, 'MTPListLoadFinish', 'MTP List Load Finish');
	};

	$scope.init = function() {

		window.ga.trackView('MTPList');
		window.ga.trackTiming('MTP List Load Start Time', 20000, 'MTPListLoadStart', 'MTP List Load Start');

		$scope.transperantConfig = abbottConfigService.getTransparency();
		$scope.transperantConfig.display = true;
		$scope.transperantConfig.showBusyIndicator = true;
		$scope.transperantConfig.showTransparancy = true;
		abbottConfigService.setTransparency($scope.transperantConfig);
		$scope.userType = null;
		$scope.locale = abbottConfigService.getLocale();
		$scope.MTPDate = $stateParams.date;
		if ($scope.MTPDate) {
			//TODO
			$scope.date = $scope.MTPDate;
			$scope.filterdatetime = $filter('date')($scope.date, 'yyyy-MM-dd');
		}
		$scope.errorShowHtml = false;
		var currentDate = new Date(),
		    endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
		    filterEndDate = $filter('date')(endDate, 'yyyy-MM-dd'),
		    startDate = new Date(currentDate.getFullYear(), (currentDate.getMonth() - 1), 1),
		    filterStartDate = $filter('date')(startDate, 'yyyy-MM-dd');

		$scope.getMTPList();

		var mtpAppointmentDetails1CollectionInstance = new mtpAppointmentDetails1Collection(),
		    lastVisitCollectionInstance = new lastVisitCollection(),
		    mtpDetailsCollectionInstance = new mtpDetailsCollection();
		new userCollection().getActiveUser().then($scope.initColumns).then(mtpAppointmentDetails1CollectionInstance.fetchAll).then(mtpAppointmentDetails1CollectionInstance.fetchRecursiveFromCursor).then(function(mtpAppointmentDetails1List) {
			if (mtpAppointmentDetails1List.length) {
				$scope.errorShowHtml = false;
				$scope.MTPListViewData.mtpDetails = mtpAppointmentDetails1List;
			}
			return mtpAppointmentDetails1List;
		}).then(lastVisitCollectionInstance.fetchAll).then(lastVisitCollectionInstance.fetchRecursiveFromCursor).then(function(lastVisitList) {
			if (lastVisitList.length) {
				$scope.MTPListViewData.lastVisited = lastVisitList;
			}
			return lastVisitList;
		}).then(mtpDetailsCollectionInstance.fetchAll).then(mtpDetailsCollectionInstance.fetchRecursiveFromCursor).then(function(mtpDetailsList) {
			if (mtpDetailsList.length) {
				$scope.MTPListViewData.nonFieldWorkDetails = mtpDetailsList;
			}
			return mtpDetailsList;
		}).then($scope.getMTPList).catch(function() {
			$scope.transperantConfig.display = false;
			$scope.errorShowHtml = true;
		});

        //Header configuration
		$scope.abwheaderConfig = {
            hambergFlag: true,
            applogoFlag: false,
            headerText: 'Monthly Tour Plan',
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
	};

    //Get the values of the user types to seperate the MTP details based on the user type
	$scope.initColumns = function(activeUser) {
		$scope.userDetails = activeUser;
		$scope.userType = $scope.userDetails.Designation__c;

		return activeUser;
	};

    //Get the details of MTP on the selected date from the MTPDay component
	$scope.goToSelectedDate = function(date) {
		$scope.errorShowHtml = false;
		$scope.date = date.date;
		$scope.filterdatetime = $filter('date')($scope.date, 'yyyy-MM-dd');
		$scope.mtpDetails = [];
		$scope.getMTPList();
	};

	//Show File DCR if DCR is avialable
	$scope.isGoToDcrAvailable = function() {
		var pageDate = moment($scope.filterdatetime, 'YYYY-MM-DD').endOf('day'),
		    currentDate = moment().endOf('day');
		return !pageDate.isAfter(currentDate);
	}

    //Navigate to DCR page from MTP on the click of File DCR
	$scope.goToDcr = function(customerData) {
		gotoDcr(customerData, $scope.filterdatetime);
	}
	/*
	$scope.navigateToMTPCalendar = function() {
		navigationService.navigate('mtpCalendar');
	};
	*/
	$scope.gotoKG = function(){
        window.ga.trackEvent('Navigate To KG','click','KGLink',20000);
        window.ga.trackTiming('Navigate To KG Start Time',20000,'KGStart','Navigation to KG Start');

        var options = {
          location: 'no',
          toolbar: 'no'
        };
        var loginUrl = sfdcAccount.getSfdcClient().loginUrl;
		var isProd = loginUrl != null && loginUrl.indexOf('test') == -1;
		var leaveUrl = isProd ? 'https://abbworld--c.ap4.visual.force.com/apex/KG_DocRegistration' :'https://abbworld--ailtesting--c.cs31.visual.force.com/apex/KG_DocRegistration';
      	$cordovaInAppBrowser.open(leaveUrl, '_blank', options);

      	 window.ga.trackTiming('Navigate To KG Finish Time',20000,'navigationToKGFinish','Navigation to KG Finish');
	};

	//Calculate the values of No of calls to go on particular selected day
	$scope.getCallsToGo =function() {
		var mtpAppointmentDetails1ColInstance = new mtpAppointmentDetails1Collection(),
		dcrJunctionCollection = new DcrJunctionCollection(),
		dcrCollection = new DcrCollection(),
		newCustomerCollection = new NewCustomerCollection(),
		mtpRemoveConfigCollection = new MtpRemoveConfigCollection();

		  $q.all([mtpAppointmentDetails1ColInstance.mtpGetByDayCount(moment($scope.filterdatetime, 'YYYY-MM-DD')),
			dcrJunctionCollection.dcrJunctionCountByDate(moment($scope.filterdatetime, 'YYYY-MM-DD')),
			dcrCollection.getDcrByDate(moment($scope.filterdatetime, 'YYYY-MM-DD')),
			newCustomerCollection.newCustomersCountByDay(moment($scope.filterdatetime, 'YYYY-MM-DD')),
			mtpRemoveConfigCollection.getMTPRemoveConfigsCountByDate(moment($scope.filterdatetime, 'YYYY-MM-DD'))
		  ])
		  .then(function (values) {
			  var mtpTodayCount = values.shift(),
				dcrJunctionTodayCount = values.shift(),
				isDcrTodaySubmited = values.shift(),
				newDoctorsCount = values.shift(),
				mtpRemoveConfigsCount = values.shift();
			  var callsToGoCount = mtpTodayCount + newDoctorsCount - dcrJunctionTodayCount - mtpRemoveConfigsCount;
			  if (callsToGoCount < 0) {
				  callsToGoCount = 0;
			  }
			  $scope.callsToGo = isDcrTodaySubmited ? 0 : callsToGoCount;
		  });
	  }



    //Get values from Calendar directive
    $scope.getDayData = function(date) {
         //Values from the calendar Data
         $scope.goToSelectedDate(date);
     }
}]);