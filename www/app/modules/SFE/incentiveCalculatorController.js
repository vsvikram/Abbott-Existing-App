abbottApp.controller('incentiveCalculatorController', ['$scope', '$filter', '$stateParams','abbottConfigService', '$q', 'popupService', 'SALESFORCE_QUERIES', '$timeout','entityCollection',
function($scope, $filter,$stateParams, abbottConfigService,  $q, popupService, SALESFORCE_QUERIES, $timeout,entityCollection) {
	$scope.date = new Date();
	$scope.locale = abbottConfigService.getLocale();
    $scope.config = {
                left: {
                    text: "Incentive Calculator"
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
	var userId = $stateParams.userid;
	var username = $stateParams.username;
	$scope.bandsInfo = [];
	var entityCollectionInstance = new entityCollection();

	$scope.slider = {
		value : 0,
		maxvalue : 0,
		ticks : 5,
		incentive : 0,
		label : $scope.locale.ExpectedPrimarySales,
		type : 'primary',
		options : {
			showSelectionBar : false,
			floor : 0,
			ceil : 0,
			step : 1000,
			disabled : false,
			showTicksValues : false
		}
	};
	$scope.slider1 = {
		value : 0,
		maxvalue : 0,
		ticks : 5,
		incentive : 0,
		label : $scope.locale.ExpectedP1Sales,
		type : 'p1',
		options : {
			showSelectionBar : false,
			floor : 0,
			ceil : 0,
			step : 1000,
			disabled : false,
			showTicksValues : false
		}
	};
	$scope.slider2 = {
		value : 0,
		maxvalue : 0,
		ticks : 5,
		incentive : 0,
		label : $scope.locale.ExpectedP2Sales,
		type : 'p2',
		options : {
			showSelectionBar : false,
			floor : 0,
			ceil : 0,
			step : 1000,
			disabled : false,
			showTicksValues : false
		}
	};
	$scope.slider3 = {
		value : 0,
		maxvalue : 0,
		ticks : 6,
		incentive : 0,
		label : $scope.locale.ExpectedQuaterlySales,
		type : 'qtr',
		options : {
			showSelectionBar : false,
			floor : 0,
			ceil : 0,
			step : 1000,
			disabled : false,
			showTicksValues : false
		}
	};

	var sliders = [$scope.slider, $scope.slider1, $scope.slider2, $scope.slider3];

	$scope.$on('update-incentive', function(event, args) {
		$scope.totalIncentive = $scope.slider.incentive + $scope.slider1.incentive + $scope.slider2.incentive + $scope.slider3.incentive;
	});

	$scope.init = function() {
	window.ga.trackView('IncentiveCalculator');
	window.ga.trackTiming('IncentiveCalculator Load Start Time',20000,'IncentiveCalculatorStartload','Incentive Calculator Load Start');

	     userId = userId || '';
		getTargets(userId).then(function(targets) {
			if (targets != null) {
				$scope.targets = targets;
				$scope.employeeName = targets.EMP_NAME__c;

				$scope.slider.maxvalue = (targets.TRGT__c != null || targets.TRGT__c != '' ? targets.TRGT__c * 1.4 : 0) * 100000;
				$scope.slider.options.ceil =  Math.round($scope.slider.maxvalue,0);
				$scope.slider1.maxvalue = (targets.TRGT_P1__c != null || targets.TRGT_P1__c != '' ? targets.TRGT_P1__c * 1.4 : 0) * 100000;
				$scope.slider1.options.ceil = Math.round($scope.slider1.maxvalue,0);
				$scope.slider2.maxvalue = (targets.TRGT_P2__c != null || targets.TRGT_P2__c != '' ? targets.TRGT_P2__c * 1.4 : 0) * 100000;
				$scope.slider2.options.ceil = Math.round($scope.slider2.maxvalue,0);
				$scope.slider3.maxvalue = (targets.CURR_QTR_TRGT__c != null || targets.CURR_QTR_TRGT__c != '' ? targets.CURR_QTR_TRGT__c * 1.4 : 0) * 100000;
				$scope.slider3.options.ceil = Math.round($scope.slider3.maxvalue,0);;


				$timeout(function() {
					$scope.$broadcast('rzSliderForceRender');
				});
				getUserBandInfo(userId).then(function(result) {
					if (result != null) {
						getBandsInfo(result.SLAB__c + ' ' + result.BAND__c).then(function(result) {
							$scope.bandsInfo = result;
						}, function() {
							popupService.openPopup($scope.locale.ThereissomeProblemintheServer, $scope.locale.OK, '35%', function() {
								disableAllSlider();
							});
						});
					} else {
						popupService.openPopup($scope.locale.NoDataAvailable, $scope.locale.OK, '35%', function() {
							disableAllSlider();
						});
					}
				}, function() {
					popupService.openPopup($scope.locale.ThereissomeProblemintheServer, $scope.locale.OK, '35%', function() {
						disableAllSlider();
					});
				});
			} else {
				popupService.openPopup($scope.locale.NoDataAvailable, $scope.locale.OK, '35%', function() {
					disableAllSlider();
				});
			}
		}, function() {
			popupService.openPopup($scope.locale.ThereissomeProblemintheServer, $scope.locale.OK, '35%', function() {
				disableAllSlider();
			});
		});
	};

	var disableAllSlider = function() {
		$scope.slider3.options.disabled = true;
		$scope.slider2.options.disabled = true;
		$scope.slider1.options.disabled = true;
		$scope.slider.options.disabled = true;
	};

	var getTargets = function(userid) {

		var deferred = $q.defer();
		var getTragetsQuery = SALESFORCE_QUERIES.SERVER_QUERIES.getUserTargets;
		getTragetsQuery = getTragetsQuery.replace('$LOGGEDINUSERID$', userid);
		entityCollectionInstance.fetchFromSalesforce(getTragetsQuery).then(function(res) {
			if (res != null && res.records.length > 0) {
				deferred.resolve(res.records[0]);
			} else {
				deferred.resolve(null);
			}
		}, function() {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	var getUserBandInfo = function(userid) {

		var deferred = $q.defer();
		var getUserBand = SALESFORCE_QUERIES.SERVER_QUERIES.getUserBand;
		getUserBand = getUserBand.replace('$LOGGEDINUSERID$', userid);
		entityCollectionInstance.fetchFromSalesforce(getUserBand).then(function(res) {
			if (res != null && res.records.length > 0) {
				deferred.resolve(res.records[0]);
			} else {
				deferred.resolve(null);
			}
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;

		window.ga.trackTiming('IncentiveCalculator Load Finish Time',20000,'IncentiveCalculatorFinishLoad','Incentive Calculator Load Finish');
	};

	var getBandsInfo = function(band) {
		var deferred = $q.defer();
		var getBandsInfo = SALESFORCE_QUERIES.SERVER_QUERIES.getBandInfo;
		getBandsInfo = getBandsInfo.replace('$BANDTARGETPCPM$', band);
		entityCollectionInstance.fetchFromSalesforce(getBandsInfo).then(function(res) {
			if (res != null && res.records.length > 0) {
				deferred.resolve(res.records);
			} else {
				deferred.resolve(null);
			}
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

}]);
