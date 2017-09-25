abbottApp.controller('salesMatricsController', ['entityCollection','userCollection', 'targetCollection','$scope', 'abbottConfigService', '$filter', '$q', 'popupService', 'SALESFORCE_QUERIES',
function(entityCollection,userCollection,targetCollection, $scope, abbottConfigService, $filter, $q, popupService, SALESFORCE_QUERIES) {

	$scope.locale = abbottConfigService.getLocale();
	$scope.config = {
            left: {
                text: "Sales"
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
	$scope.updationDate = new Date();
	$scope.P1_Sales = 0;
	$scope.P2_Sales = 0;
	$scope.TotalSales = 0;
	$scope.TotalGoodsReturn = 0;
	$scope.p2GoodsReturn = 0;
	$scope.p1GoodsReturn = 0;
	$scope.TotalPending = 0;
	$scope.series = [$scope.locale.sale, $scope.locale.earlyIncentiveTarget, $scope.locale.target];
	$scope.P1Target = '';
    $scope.P2Target = '';

	var labels = [0], midMonthData = [], overallData = [0],
	userCollectionInstance = new userCollection(),
    		targetCollectionInstance = new targetCollection(),
    		entityCollectionInstance = new entityCollection(),
    		usersList = [],
    		targetsList = [],
    		currentTarget = {},
    		userId = '',
    		loggedInUser='',
    		username = '',
    		userTerritory='';

	$scope.init = function() {

	window.ga.trackView('SalesMetrics');
	window.ga.trackTiming('SalesMetrics Load Start Time',20000,'salesLoadStart','Sales Metrics Load Start');

		userCollectionInstance.fetchAllCollectionEntities().then(function(allUsers) {
			usersList = allUsers;
		}).then(userCollectionInstance.getActiveUser).then(function(activeUser) {
			loggedInUser = activeUser;
			userType = activeUser.Designation__c;
			$scope.userType = activeUser.Designation__c;
		}).then(targetCollectionInstance.fetchAllCollectionEntities).then(function(targets) {
			targetsList = targets;
			userTerritory = targets[0].Territory__c;
		}).then(function(){
			getSalesMatrixForUser(userTerritory, loggedInUser.Id);
			reset();
		});

		$scope.DoughnutColours = [{ // default
	  		"strokeColor": "rgba(151, 187, 205,1)", //Blue
	  		"pointStrokeColor": "#fff",
	  		"pointHighlightFill": "#fff",
	  		"pointHighlightStroke": "rgba(151, 187, 205,1)" //Blue
	  	},{ // default
	  		"strokeColor": "rgba(255, 255, 255,1)", //Blue
	  		"pointStrokeColor": "#fff",
	  		"pointHighlightFill": "#fff",
	  		"pointHighlightStroke": "rgba(255, 255, 255,1)" //Blue
	  	}];

		$scope.speedoMeterConfig = {
			wobble : false,
			backgroundColor : 'white',
			markerColor : 'black',
			smallTickColor : 'gray',
			smallTickIncrement : 2,
			largeTickColor : 'black',
			max : 140,
			endOfWarningDegree : 220,
			endOfNormalDegree : 280,
			warningColor : "rgb(0, 255, 0)",
			normalColor : "rgb(255, 0, 0)"
		};

	};

	var reset = function() {
		switch ($scope.userType) {
            case "ABM":
                $scope.TBMUsers = [];
                var TBMUsersData = $filter('designationFilter')(targetsList, 'TBM'),
                userId = loggedInUser.Id;
                $scope.TBMUsers = TBMUsersData;
                var user_c=loggedInUser.Id;
                $scope.TBMUsers.unshift({
                    "option" : "All",
                    "Territory__c" : userTerritory,
                    "User__c":user_c
                });
                break;
            case "ZBM":
                $scope.ABMUsers = [];
                var ABMUsersData = $filter('designationFilter')(targetsList, 'ABM'),
                userId = loggedInUser.Id;
                $scope.ABMUsers = ABMUsersData;
                var user_c=loggedInUser.Id;
               var all = {
                    "option" : "All",
                    "Territory__c" : userTerritory,
                    "User__c":user_c
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
		}
		getSalesMatrixForUser($scope.selectedABM.Territory__c, $scope.selectedABM.User__c);
	};

	$scope.onSelectTBMChange = function() {
		getSalesMatrixForUser($scope.selectedTBM.Territory__c, $scope.selectedTBM.User__c);
	};

	var getSalesMatrixForUser = function(territoryId, userid) {
		resetData();
		userid = userid || '';
		getTargets(userid).then(function(target) {
			if (target != null) {
				fetchSalesData(territoryId).then(function(data) {
					if (data != null) {
					    labels = [0];
						angular.forEach(data, function(val, i) {
							var updateDate = val.UPDATED_DATE__c || "2016-5-5";
							var arr = updateDate.split('-');
							$scope.updationDate = new Date(arr[0], arr[1] - 1, arr[2]);
							$scope.P1_Sales = val.P1_PRIMARY_VAL__c || 0;
							$scope.P2_Sales = val.P2_PRIMARY_VAL__c || 0;
							$scope.TotalSales = val.TOTAL_PRIMARY_VAL__c || 0;
							$scope.TotalGoodsReturn = val.TOTAL_RETURNS_VAL__c || 0;
							$scope.p2GoodsReturn = val.P2_RETURNS_VAL__c || 0;
							$scope.p1GoodsReturn = val.P1_RETURNS_VAL__c || 0;
							$scope.TotalPending = val.TOTAL_PENDING_VAL__c || 0;
							var day = $scope.updationDate.getDate();

							labels.push(day);
							overallData.push($scope.TotalSales);

						});
						var c = new Date();
						var daysInMonth = new Date(c.getFullYear(), c.getMonth() + 1, 0).getDate();
						if (labels.length == 1)
							labels = ["0", "3", "6", "9", "12", "15", "18", "21", "24", "27", daysInMonth];

						var i = labels[labels.length - 1];
						for (; i < daysInMonth; ) {
							i = i + 3;
							if (i > daysInMonth)
								i = daysInMonth;
							labels.push(i);
						}
						$scope.labels = labels;
						var targetSeries = [], earlyIncentive = [];
						var tagetValue = target.OVERALL_TGT_VALUE__c * 100000;
						$scope.target = tagetValue;
						var earlyInc = target.OVERALL_TGT_VALUE__c * 40000;
						for ( i = 0; i < labels.length; i++) {
							targetSeries.push(tagetValue);
							earlyIncentive.push(earlyInc);
						}

						$scope.options = {
							scaleOverride : true,
							scaleSteps : 7,
							showTooltips:false,
							scaleStepWidth : Math.ceil(tagetValue * 0.2),
							scaleStartValue : 0,
							scaleLabel : function(valuePayload) {
								var tar = tagetValue;
								return function(valuePayload) {
									return Math.ceil((valuePayload.value / tar) * 100) + ' %';
								};
							}(),
							seriesLabel:[
							{ value:$scope.locale.target + " : " + $scope.locale.currency + $scope.convertToLakhs($scope.target),xaxis:0.4 ,yaxis:2 / 8},
							{ value:$scope.locale.earlyIncentiveTarget + " : " + $scope.locale.currency + $scope.convertToLakhs($scope.target * 0.4),xaxis:0.4 ,yaxis:5 / 8},
							{ value:$scope.locale.totalSales + " : " + $scope.locale.currency + $scope.convertToLakhs($scope.TotalSales),xaxis:0.4 ,yaxis:7 / 8}]
						};
						
						
						

						 $scope.p1TargetData = ($scope.P1_Sales > 0) ? $scope.P1_Sales/ (target.P1_TGT_VALUE__c *1000) : 0;
						 $scope.p2TargetData = ($scope.P2_Sales > 0) ? $scope.P2_Sales/ (target.P2_TGT_VALUE__c *1000): 0;
						 $scope.P1Target = target.P1_TGT_VALUE__c;
						 $scope.P2Target = target.P2_TGT_VALUE__c;
						
						$scope.endData = [overallData, earlyIncentive, targetSeries];
						var canvas = document.getElementById("line");
						var width = canvas.offsetWidth;
						var height = canvas.offsetHeight;
						//setTimeout($scope.chartClick, 5000);
					} else {
						resetData();
						popupService.openPopup($scope.locale.NoDataAvailable, $scope.locale.OK, '35%', function() {
						});
					}
				}, function() {
					resetData();
					popupService.openPopup($scope.locale.ThereissomeProblemintheServer, $scope.locale.OK, '35%', function() {
					});
				});
			} else {
				resetData();
				popupService.openPopup($scope.locale.NoDataAvailable, $scope.locale.OK, '35%', function() {
				});
			}
		}, function() {
			resetData();
			popupService.openPopup($scope.locale.ThereissomeProblemintheServer, $scope.locale.OK, '35%', function() {
			});
		});

		window.ga.trackTiming('SalesMetrics Load Finish Time',20000,'salesLoadFinish','Sales Metrics Load Finish');
	};

	$scope.chartClick = function() {
		var canvas = document.getElementById("line");
		var width = canvas.offsetWidth;
		var height = canvas.offsetHeight;
		var tarX = (width * 0.2);
		var tarY = (height * 2 / 8);
		var incY = height * 5 / 8;
		var context = canvas.getContext("2d");
		context.fillStyle = "red";
		context.font = "12px Arial";
		context.fillText($scope.locale.target + ":" + $scope.locale.currency + $scope.convertToLakhs($scope.target), tarX, tarY);
		context.fillText($scope.locale.earlyIncentiveTarget + ":" + $scope.locale.currency + $scope.convertToLakhs($scope.target * 0.4), tarX, incY);
	};

	$scope.convertToLakhs = function(value){
		if(value > 10000000)
			return (value/10000000).toFixed(2) +' Cr';
		else if(value > 100000)
			return (value/100000).toFixed(2) +' Lakhs';
		else
			return value;
	};

	var getTargets = function(userid) {

		var deferred = $q.defer();
		var getTragetsQuery = SALESFORCE_QUERIES.SERVER_QUERIES.getSalesTargets;
		getTragetsQuery = getTragetsQuery.replace('$LOGGEDINUSERID$', userid);
		entityCollectionInstance.fetchFromSalesforce(getTragetsQuery).then(function(res) {
			if (res != null && res.records.length > 0) {
				deferred.resolve(res.records[0]);
			} else {
				deferred.resolve(null);
			}
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	var fetchSalesData = function(territoryId) {
		var deferred = $q.defer();
		var query = SALESFORCE_QUERIES.SERVER_QUERIES.getSalesInfo;
		query = query.replace('$TERRITORYID$', territoryId);
		entityCollectionInstance.fetchFromSalesforce(query).then(function(response) {
			if (response != null && response.records.length > 0) {
				deferred.resolve(response.records);
			} else {
				deferred.resolve(null);
			}
		}, function(error) {
			deferred.reject(error);
		});

		return deferred.promise;
	};

	var resetData = function() {
        $scope.updationDate = new Date();
        $scope.P1_Sales = 0;
        $scope.P2_Sales = 0;
        $scope.TotalSales = 0;
        $scope.TotalGoodsReturn = 0;
        $scope.p2GoodsReturn = 0;
        $scope.p1GoodsReturn = 0;
        $scope.P2Target = 0;
        $scope.P1Target = 0;
        $scope.p1TargetData = 0;
        $scope.p2TargetData = 0;
        $scope.TotalPending = 0;
        labels = [0];
        midMonthData = [];
        overallData = [0];
        $scope.labels = [];
        $scope.midData = [0];
        $scope.endData = [];

        var c = new Date();
        var daysInMonth = new Date(c.getFullYear(), c.getMonth() + 1, 0).getDate();
        labels = ["0", "3", "6", "9", "12", "15", "18", "21", "24", "27", daysInMonth];
        $scope.labels = labels;
        var tagetValue = 10000;
        $scope.options = {
            scaleOverride : true,
            scaleSteps : 7,
            showTooltips:false,
            scaleStepWidth : Math.ceil(tagetValue * 0.2),
            scaleStartValue : 0,
            scaleLabel : function(valuePayload) {
                var tar = tagetValue;
                return function(valuePayload) {
                    return Math.ceil((valuePayload.value / tar) * 100) + ' %';
                };
            }(),
            seriesLabel:[]
        };
        $scope.endData = [[], [], []];
	};

}]);

