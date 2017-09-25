abbottApp.controller('DCRKeyMessagesController', ['$scope', '$rootScope', '$filter', 'popupService', 'abbottConfigService', 'dcrHelperService', 'keyMessageCollection', 'dcrKeyMessageCollection',
function($scope, $rootScope, $filter, popupService, abbottConfigService, dcrHelperService, KeyMessageCollection, DcrKeyMessageCollection) {
	var keyMessageCollection = new KeyMessageCollection(),
	    dcrKeyMessageCollection = new DcrKeyMessageCollection(),
	    dcrKeyMessageData = [],
	    keyMessagesList = [],
	    customerDetails = [],
	    brandsData = [],
	    currentCustomerIndex = 0;
	$scope.disableEdit = $rootScope.disablingEdit;

	$scope.dcrKeyMessagesLayoutObj = [];

	$scope.init = function() {
		window.ga.trackView('DCRKeyMessages');
		window.ga.trackTiming('DCRKeyMessages Load Start Time', 20000, 'DCRKeyMessagesStart', 'DCRKeyMessages Load Start');
		$scope.selectedPeople = [];
		$scope.locale = abbottConfigService.getLocale();
		customerDetails = dcrHelperService.getCustomerDetails();
		currentCustomerIndex = dcrHelperService.getCurrentCustomerIndex();

		dcrKeyMessageData = customerDetails[currentCustomerIndex].dcrKeyMessages;
		brandsData = customerDetails[currentCustomerIndex].attributes;

		keyMessageCollection.fetchAll().then(keyMessageCollection.fetchRecursiveFromCursor).then(function(keyMessageList) {
			keyMessagesList = keyMessageList;
			return keyMessageList
		}).then(setup);

		$scope.docInfoText = customerDetails[currentCustomerIndex].name + " (" + customerDetails[currentCustomerIndex].patch + ")";
	};

	var setup = function() {
		angular.forEach(brandsData, function(value, index) {
			var dcrKeyMessageRowObj = {};
			var repeatBrandFlag = 0;
			for (var i in $scope.dcrKeyMessagesLayoutObj) {
				repeatBrandFlag = 0;
				if (value.brandName == $scope.dcrKeyMessagesLayoutObj[i].brandName) {
					repeatBrandFlag = 1;
					break;
				}
			}
			if (repeatBrandFlag == 0) {
				dcrKeyMessageRowObj.brandName = value.brandName;
				dcrKeyMessageRowObj.brandId = value.brandId;
				dcrKeyMessageRowObj.data = [];

				dcrKeyMessageRowObj.data = getAvailableDCRKeyMessages(dcrKeyMessageRowObj.brandId);

				$scope.dcrKeyMessagesLayoutObj.push(dcrKeyMessageRowObj);
			}
		});
		window.ga.trackTiming('DCRKeyMessages Load Finish Time', 20000, 'DCRKeyMessagesFinish', 'DCRKeyMessages Load Finish');
		//		console.log($scope.dcrKeyMessagesLayoutObj);
	};

	var getAvailableDCRKeyMessages = function(brandId) {
		var listOfKeyMessagesForSelectedBrand = $filter('filter')(keyMessagesList, {
			'Divisionwise_Brand__c' : brandId
		}),
		    availableKeyMessages = [];

		angular.forEach(dcrKeyMessageData, function(value2, index2) {
			angular.forEach(listOfKeyMessagesForSelectedBrand, function(value1, index1) {
				if (value1.Id == value2.Key_Message__c) {
					var keyMessageText = getKeyMessageText(value2.Key_Message__c);
					availableKeyMessages.push({
						'Id' : value2.Key_Message__c,
						'Key_Message__c' : keyMessageText
					});
				}
			});
		});

		return availableKeyMessages;
	};

	var getKeyMessageText = function(id) {
		var keyMessageText = $filter('filter')(keyMessagesList, {
			'Id' : id
		});
		if (keyMessageText.length > 0) {
			return keyMessageText[0].Key_Message__c;
		}
		return null;
	};

	$scope.openSelectPopup = function(item) {
		$scope.selectedPeople = [];
		$scope.selectedIndex = item;
		$scope.brandName = $scope.dcrKeyMessagesLayoutObj[item].brandName;

		$scope.listofMessages = $filter('getDataBasedOnDateFilter')(keyMessagesList, $scope.dcrKeyMessagesLayoutObj[item].brandId, 'Divisionwise_Brand__c');
		if ($scope.dcrKeyMessagesLayoutObj[item].data.length > 0) {
			for (var i in $scope.listofMessages) {
				for (var j in $scope.dcrKeyMessagesLayoutObj[item].data) {
					if ($scope.listofMessages[i].Id == $scope.dcrKeyMessagesLayoutObj[item].data[j].Key_Message__c) {
						$scope.listofMessages.splice(i, 1);
					}
				}
			}
		}
		$scope.listofMessages = $filter('orderBy')($scope.listofMessages, 'Key_Message__c');
		if ($scope.listofMessages.length == 0) {
			popupService.openPopup($scope.dcrKeyMessagesLayoutObj[item].brandName + " has no messages", $scope.locale.OK, '35%');
		} else {
			popupService.openPopupWithTemplateUrl($scope, "app/modules/DCR/KeyMessagesPopup.html", '75%');
		}
	};

	$scope.showValue = function(value) {

		var existingIds = $scope.getAllIndexes($scope.selectedPeople, 'Id', value.Id);
		if (existingIds.length == 0) {
			$scope.selectedPeople.push(value);
		} else {
			$scope.selectedPeople.splice(existingIds[0], 1);
		}
	};

	$scope.addThisKey = function() {
		angular.forEach($scope.selectedPeople, function(value, index) {
			$scope.dcrKeyMessagesLayoutObj[$scope.selectedIndex].data.push(value);
		});

		popupService.closePopup();
	};

	$scope.removeThis = function(childIndex, parentIndex) {
		$scope.dcrKeyMessagesLayoutObj[parentIndex].data.splice(childIndex, 1);
	};

	$scope.save = function() {
		//create local object as per service object
		//delete records soup based on DCR_Junction__c
		//insert records into soup
		//replace service object for selected doctor
		var dcrMessagesData = [],
		    _soupEntryId = customerDetails[currentCustomerIndex].dcrJunction._soupEntryId,
		    deleteCriteria = [_soupEntryId];

		angular.forEach($scope.dcrKeyMessagesLayoutObj, function(value1, index1) {
			angular.forEach(value1.data, function(value2, index2) {
				dcrMessagesData.push({
					'DCR_Junction__c' : _soupEntryId,
					'Local_DCR_Junction__c' : _soupEntryId,
					'Key_Message__c' : value2.Id,
					'Sequence_Number__c' : index2
				});
			});
		});

		// devesh was from here
		deleteCriteria = $scope.makeDeletCriteria(dcrKeyMessageData);
		if (deleteCriteria == "") {
			dcrKeyMessageCollection.upsertEntities(dcrMessagesData).then(function(response) {
				customerDetails[currentCustomerIndex].dcrKeyMessages = response;
				dcrHelperService.setCustomerDetails(customerDetails);
				popupService.openPopup($scope.locale.DataSaveConfirmation, $scope.locale.OK, '35%');
			}).catch(function() {
				popupService.openPopup($scope.locale.SaveFailed, $scope.locale.OK, '35%');
			});
		} else {
			dcrKeyMessageCollection.removeEntitiesByIds(deleteCriteria).then(function() {
				for (var i in dcrMessagesData) {
					if (dcrMessagesData[i]._soupEntryId) {
						delete dcrMessagesData[i]._soupEntryId;
					}
				}
				return dcrKeyMessageCollection.upsertEntities(dcrMessagesData).then(function(response) {
					customerDetails[currentCustomerIndex].dcrKeyMessages = response;
					dcrHelperService.setCustomerDetails(customerDetails);
					popupService.openPopup($scope.locale.DataSaveConfirmation, $scope.locale.OK, '35%');
				}).catch(function() {
					popupService.openPopup($scope.locale.SaveFailed, $scope.locale.OK, '35%');
				});
			});
		}
	};

	$scope.makeDeletCriteria = function(dcrKeyMessageData) {
		var deletKeys = [];
		dcrKeyMessageData = customerDetails[currentCustomerIndex].dcrKeyMessages
		for (var i in dcrKeyMessageData) {

			if (dcrKeyMessageData[i]._soupEntryId != undefined) {
				deletKeys.push(dcrKeyMessageData[i]._soupEntryId.toString());
			}
		}

		return deletKeys;
		//= deletKeys.substring(0,deletKeys.length-1);
	};

	$scope.getAllIndexes = function(array, attr, value) {
		var indexes = [],
		    i;
		for ( i = 0; i < array.length; i++) {
			if (array[i].hasOwnProperty(attr) && array[i][attr] === value)
				indexes.push(i);
		}
		return indexes;
	};

}]);
