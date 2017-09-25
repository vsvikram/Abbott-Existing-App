abbottApp.controller('DCROthersFollowUpActivityController', ['$scope', '$rootScope', 'statusDCRActivty', 'dcrHelperService', 'abbottConfigService', 'popupService', 'utils', '$filter', 'dcrFollowupActivityCollection',
function($scope, $rootScope, statusDCRActivty, dcrHelperService, abbottConfigService, popupService, utils, $filter, DcrFollowupActivityCollection) {
	$scope.locale = abbottConfigService.getLocale();

	var _soupEntryId,
	    dcrFollowupActivityCollection = new DcrFollowupActivityCollection(),
	    dcrFollowupMessages = [],
	    customerDetails = [],
	    currentCustomerIndex = 0;
	$scope.dataArray = [];

	$scope.init = function() {
		window.ga.trackView('DCROthersFollowUpActivity');
		window.ga.trackTiming('DCROthersFollowup Load Start Time', 20000, 'othersFollowUpStart', 'DCROthersFollowUp Load start');
		$scope.dataArray = [];
		$scope.disableEdit = $rootScope.disablingEdit;
		$scope.selectedPeople = [];
		$scope.locale = abbottConfigService.getLocale();
		customerDetails = dcrHelperService.getCustomerDetails();
		currentCustomerIndex = dcrHelperService.getCurrentCustomerIndex();

		dcrFollowupMessages = customerDetails[currentCustomerIndex].dcrFollowupMessages;

		$scope.docInfoText = customerDetails[currentCustomerIndex].name + " (" + customerDetails[currentCustomerIndex].patch + ")";

		$scope.deletedDate = [];
		_soupEntryId = "" + customerDetails[currentCustomerIndex].DCR_Junction__c;

		if (dcrFollowupMessages != undefined && dcrFollowupMessages.length > 0) {
			$scope.dataArray = angular.copy(dcrFollowupMessages);
		}
		window.ga.trackTiming('DCROthersFollowup Load Finish Time', 20000, 'othersFollowUpFinish', 'DCROthersFollowUp Load Finish');
	};

	//	$scope.formattedDate = function(date) {
	//    		 if(date !=null && date!='') {
	//    		   	  var temparray = [];
	//    			  temparray = date.split("-");
	//    			  var year = temparray[0],
	//    			  month = temparray[1],
	//    			  day = temparray[2];
	//    			  return $filter('date')(new Date(year, month - 1, day), "d/M/yyyy");
	//              } else {
	//              	  return date;
	//              }
	//    };

	$scope.addRow = function() {
		var currentCalenderDate = new Date(statusDCRActivty.getCalenderDate());
		if ($scope.defaultDate == '' || $scope.defaultDate == undefined || $scope.defaultDate == null) {
			popupService.openPopup($scope.locale.FollowupDateMandatory, $scope.locale.OK, '35%');
			return;
		} else if ($scope.defaultDate < currentCalenderDate) {
			popupService.openPopup($scope.locale.FollowUpInvalidDate, $scope.locale.OK, '35%');
			return;
		}

		var data = {
			Subject__c : '',
			Date__c : '',
			Comment__c : ''
		};

		data.DCR_Junction__c = customerDetails[currentCustomerIndex].DCR_Junction__c;
		data.Subject__c = $scope.defaultSubject;
		data.Date__c = $filter('date')($scope.defaultDate, 'yyyy-MM-dd');
		data.Comment__c = $scope.defaultComment;
		data.Sequence_Number__c = utils.getMax($scope.dataArray, 'Sequence_Number__c');

		$scope.dataArray.push(data);
		$scope.defaultSubject = "";
		$scope.defaultDate = "";
		$scope.defaultComment = "";

	};

	$scope.removeRow = function(index) {
		$scope.dataArray.splice(index, 1);
		//  isRowRemoved = true;
	};

	$scope.clearRow = function() {
		$scope.defaultSubject = "";
		$scope.defaultDate = "";
		$scope.defaultComment = "";
	};

	$scope.saveCompInfo = function() {
		window.ga.trackEvent('Save FollowUp Activity', 'click', 'FollowUPActivitySaved', 20000);
		window.ga.trackTiming('DCROthersFollowup Save Start Time', 20000, 'othersFollowUpSaveStart', 'DCROthersFollowUp save start');
		var currentCalenderDate = new Date(statusDCRActivty.getCalenderDate());
		if ($scope.defaultDate == '' || $scope.defaultDate == undefined || $scope.defaultDate == null) {
			popupService.openPopup($scope.locale.FollowupDateMandatory, $scope.locale.OK, '35%');
			return;
		} else if ($scope.defaultDate < currentCalenderDate) {
			popupService.openPopup($scope.locale.FollowUpInvalidDate, $scope.locale.OK, '35%');
			return;
		}

		var dataDefault = {
			Subject__c : '',
			Date__c : '',
			Comment__c : ''
		};
		dataDefault.DCR_Junction__c = customerDetails[currentCustomerIndex].DCR_Junction__c;
		dataDefault.Local_DCR_Junction__c = customerDetails[currentCustomerIndex].DCR_Junction__c;
		if ($scope.defaultSubject != undefined && $scope.defaultSubject != '')
			dataDefault.Subject__c = $scope.defaultSubject;
		dataDefault.Date__c = $filter('date')($scope.defaultDate, 'yyyy-MM-dd');
		if ($scope.defaultComment != undefined && $scope.defaultComment != '')
			dataDefault.Comment__c = $scope.defaultComment;
		dataDefault.Sequence_Number__c = utils.getMax($scope.dataArray, 'Sequence_Number__c');
		$scope.dataArray.push(dataDefault);
		$scope.clearRow();

		//create local object as per service object
		//delete records soup based on DCR_Junction__c
		//insert records into soup
		//replace service object for selected doctor
		var _soupEntryId = "" + customerDetails[currentCustomerIndex].DCR_Junction__c,
		    deleteCriteria = [_soupEntryId];

		deleteCriteria = $scope.makeDeletCriteria(dcrFollowupMessages);

		if (deleteCriteria.length <= 0) {

			dcrFollowupActivityCollection.upsertEntities($scope.dataArray).then(function() {
				$scope.FetchDataFromSoup().then(function(testData) {
					customerDetails[currentCustomerIndex].dcrFollowupMessages = null;
					var dataFromSoup = testData;
					customerDetails[currentCustomerIndex].dcrFollowupMessages = dataFromSoup;
					dcrHelperService.setCustomerDetails(customerDetails);
					popupService.openPopup($scope.locale.DataSaveConfirmation, "Ok", '35%');
				});

			}, function() {
				popupService.openPopup($scope.locale.SaveFailed, "Ok", '35%');
			});

		} else {
			//delete from soup
			dcrFollowupActivityCollection.removeEntitiesByIds(deleteCriteria).then(function() {
				for (var i in $scope.dataArray) {
					if ($scope.dataArray[i]._soupEntryId) {
						delete $scope.dataArray[i]._soupEntryId;
					}
				}
				dcrFollowupActivityCollection.upsertEntities($scope.dataArray).then(function() {
					$scope.FetchDataFromSoup().then(function(testData1) {
						customerDetails[currentCustomerIndex].dcrFollowupMessages = null;
						var dataFromSoup = testData1;
						customerDetails[currentCustomerIndex].dcrFollowupMessages = dataFromSoup;
						dcrHelperService.setCustomerDetails(customerDetails);
						popupService.openPopup($scope.locale.DataSaveConfirmation, "Ok", '35%');
					});

				}, function() {
					popupService.openPopup($scope.locale.SaveFailed, "Ok", '35%');
				});
			}, function(error) {

			});
		}
		window.ga.trackTiming('DCROthersFollowup save Finish Time', 20000, 'othersFollowUpSaveFinish', 'DCROthersFollowUp save Finish');
	};

	$scope.makeDeletCriteria = function(dcrFollowupMessages) {
		var deletKeys = [];
		dcrFollowupMessages = customerDetails[currentCustomerIndex].dcrFollowupMessages;
		for (var i in dcrFollowupMessages) {

			if (dcrFollowupMessages[i]._soupEntryId != undefined) {
				deletKeys.push(dcrFollowupMessages[i]._soupEntryId.toString());
			}

		}

		return deletKeys;
		//= deletKeys.substring(0,deletKeys.length-1);
	};

	$scope.FetchDataFromSoup = function() {
		return dcrFollowupActivityCollection.fetchAll().then(dcrFollowupActivityCollection.fetchRecursiveFromCursor).then(function(activityList) {
			return $filter('getDataBasedOnDateFilter')(activityList, _soupEntryId, 'DCR_Junction__c');
		});
	};
}]);
