// by mahesh

abbottApp.controller('DCROthersCorporateInitiativeController', ['$scope', 'abbottConfigService', 'dcrHelperService', 'popupService', '$filter', 'campaignCollection', 'dcrBrandActivityCollection',
function($scope, abbottConfigService, dcrHelperService, popupService, $filter, CampaignCollection, DcrBrandActivityCollection) {

	var campaignCollection = new CampaignCollection(),
	    dcrBrandActivityCollection = new DcrBrandActivityCollection(),
	    dcrCorporateInitiativeData = [],
	    dcrBrandActivityDetails = [],
	    docAndDetails = [],
	    currentCustomerIndex = 0;

	$scope.compInfoDetail = [];

	$scope.init = function() {
		window.ga.trackView('DCROthersCorporsteInitiative');
		window.ga.trackTiming('DCROthersCorporateInitiative Load Start Time', 20000, 'othersCorporateInitiativeStart', 'DCROthersCorporateInitiative Load start');
		$scope.corpDataNotAvailable = false;
		var data = [],
		    isTicked = false;

		$scope.filterdatetime = $filter('date')($scope.currentCalenderDate, 'yyyy-MM-dd');

		dcrBrandActivityDetails = dcrHelperService.getDCRBrandActivity();
		docAndDetails = dcrHelperService.getCustomerDetails();
		currentCustomerIndex = dcrHelperService.getCurrentCustomerIndex();
		$scope.locale = abbottConfigService.getLocale();

		dcrCorporateInitiativeData = dcrBrandActivityDetails[currentCustomerIndex];
		if (dcrCorporateInitiativeData != undefined) {
			dcrCorporateInitiativeData = $filter('filterNonEmpty')(dcrCorporateInitiativeData, 'Corporate_Initiative__c');
		}

		campaignCollection.fetchAll().then(campaignCollection.fetchRecursiveFromCursor).then(function(campaignList) {
			var filteredOnStartDate = [];
			for (var i = 0; i < campaignList.length; i++) {
				if (new Date(campaignList[i].Start_Date__c) <= new Date($scope.currentCalenderDate) && new Date(campaignList[i].End_Date__c) >= new Date($scope.currentCalenderDate)) {
					filteredOnStartDate.push(campaignList[i]);
				}
			}
			campaignList = filteredOnStartDate;
			$scope.corpDataNotAvailable = !campaignList.length;

			for (var i in campaignList) {
				isTicked = false;
				for (var j in dcrCorporateInitiativeData) {
					if (campaignList[i].Id == dcrCorporateInitiativeData[j].Corporate_Initiative__c) {
						isTicked = true;
						break;
					}
				}
				$scope.compInfoDetail.push({
					"corpInitiativeId" : campaignList[i].Id,
					"corpInitiativeName" : campaignList[i].Name,
					"isTicked" : isTicked
				});
			}
			$scope.compInfoDetail = $filter('orderBy')($scope.compInfoDetail, 'corpInitiativeName');
		}, function() {
			$scope.corpDataNotAvailable = true;
		});
		$scope.docInfoText = docAndDetails[currentCustomerIndex].name + " (" + docAndDetails[currentCustomerIndex].patch + ")";
		window.ga.trackTiming('DCROthersCorporateInitiative Load Finish Time', 20000, 'othersCorporateInitiativeFinish', 'DCROthersCorporateInitiative Load Finish');
	};

	$scope.saveCompInfo = function() {

		window.ga.trackEvent('Save Corporate Initiative', 'click', 'CorporateInitiativeSaved', 20000);
		window.ga.trackTiming('DCROthersCorporateInitiative save Start Time', 20000, 'othersCorporateInitiativeSaveStart', 'DCROthersCorporateInitiative Save start');

		var filterCorpInitiativeData = $filter('filter')($scope.compInfoDetail, {
			'isTicked' : true
		}),
		    deleteCriteria = $scope.makeDeletCriteria();

		dcrBrandActivityCollection.removeEntitiesByIds(deleteCriteria).then(function() {
			return filterCorpInitiativeData.map(function(data, index) {
				var record = {};
				record.DCR_Junction__c = docAndDetails[currentCustomerIndex].DCR_Junction__c;
				record.DCR__c = docAndDetails[currentCustomerIndex].DCR__c;
				record.Local_DCR_Junction__c = docAndDetails[currentCustomerIndex].DCR_Junction__c;
				record.Local_DCR__c = docAndDetails[currentCustomerIndex].DCR__c;
				record.Corporate_Initiative__c = data.corpInitiativeId;
				record.Sequence_Number__c = index;
				return record;
			});
		}).then(dcrBrandActivityCollection.upsertEntities).then(function(response) {
			dcrBrandActivityDetails[currentCustomerIndex] = response;
			dcrHelperService.setDCRBrandActivity(dcrBrandActivityDetails);
			popupService.openPopup($scope.locale.DataSaveConfirmation, $scope.locale.OK, '35%');
		}).catch(function() {
			popupService.openPopup($scope.locale.SaveFailed, $scope.locale.OK, '35%');
		});
		window.ga.trackTiming('DCROthersCorporateInitiative Save Finish Time', 20000, 'othersCorporateInitiativeSaveFinish', 'DCROthersCorporateInitiative Save Finish');
	};

	$scope.makeDeletCriteria = function() {
		var deletKeys = [];
		for (var i in dcrCorporateInitiativeData) {
			if (dcrCorporateInitiativeData[i]._soupEntryId != undefined) {
				deletKeys.push(dcrCorporateInitiativeData[i]._soupEntryId);
			}
		}
		return deletKeys;
	};

}]);
