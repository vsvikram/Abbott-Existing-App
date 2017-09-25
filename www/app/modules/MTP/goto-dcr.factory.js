(function() {
	'use strict';

	angular.module('AbbottMobile').factory('gotoDcr', gotoDcr);

	gotoDcr.$inject = ['$q', '$rootScope', '$filter', '$state', 'abbottConfigService', 'dcrCollection', 'activitySelectionCollection', 'fullDayActivityCollection', 'halfDayActivityCollection', 'mtpRemoveConfigCollection', 'mtpAppointmentDetails1Collection', 'statusDCRActivty', 'gotoDcrValidator'];

	function gotoDcr($q, $rootScope, $filter, $state, abbottConfigService, DcrCollection, ActivitySelectionCollection, FullDayActivityCollection, HalfDayActivityCollection, MtpRemoveConfigCollection, mtpAppointmentDetails1Collection, statusDCRActivty, gotoDcrValidator) {
		var locale = abbottConfigService.getLocale(),
		    dcrCollection = new DcrCollection(),
		    activitySelectionCollection = new ActivitySelectionCollection(),
		    fullDayActivityCollection = new FullDayActivityCollection(),
		    halfDayActivityCollection = new HalfDayActivityCollection(),
		    mtpRemoveConfigCollection = new MtpRemoveConfigCollection();

		return function(customerData, formatedDate) {
			var date = moment(formatedDate, 'YYYY-MM-DD');

			return getActivityByDate(date).then(function(activity) {
				var dayActivityCollection = isFullDayActivity(activity) ? fullDayActivityCollection : halfDayActivityCollection;

				return $q.all([$q.when(activity), getAllRecords(dayActivityCollection)]);
			}).then(function(taple) {
				var dayActivitiesList = taple.pop(),
				    activity = taple.pop(),
				    fieldWorkActivityId = $filter('filter')(dayActivitiesList, {
					'Name' : 'Field Work'
				}).pop().Id,
				    dayActivitiesIds = [],
				    activityStatus;

				function fillDataForTransition() {
					dayActivitiesIds.push(activity.Activity1__c);
					!isFullDayActivity(activity) && dayActivitiesIds.push(activity.Activity2__c);
					activityStatus = getActivityStatusByListAndIds(dayActivitiesList, dayActivitiesIds);
				}


				activity && fillDataForTransition();
				gotoDcrValidator(activity, activityStatus, customerData.userId, date, fieldWorkActivityId).then(function() {
					activity = activity || createDefaultActivity(fieldWorkActivityId, formatedDate);
					return addCustomerIfDeleted(activity, customerData, date);
				}).then(function() {
					!activityStatus && fillDataForTransition();
					goToDcr(activityStatus, customerData, date);
				});
			});
		}
		function getActivityByDate(date) {
			return getDcrByDate(date).then(function(dcr) {
				return dcr ? dcr : activitySelectionCollection.getActivitySelectionByDate(date);
			});
		}

		function getDcrByDate(date) {
			return dcrCollection.getDcrByDate(date).then(function(dcr) {
				$rootScope.disablingEdit = isActivitySubmitted(dcr);
				return dcr;
			});
		}

		function isActivitySubmitted(activity) {
			return !!activity && (activity.Status__c === 'Submitted');
		}

		function isFullDayActivity(activity) {
			return !(activity && activity.Activity2__c);
		}

		function getAllRecords(collection) {
			return collection.fetchAll().then(collection.fetchRecursiveFromCursor);
		}

		function createDefaultActivity(fieldWorkActivityId, formatedDate) {
			var defaultActivity = {
				Date__c : formatedDate,
				Activity_Selection__c : 'Full Day',
				Activity1__c : fieldWorkActivityId
			};
			// TODO: fetch activityRecord by Name insted filter
			activitySelectionCollection.upsertEntities([defaultActivity]).then(function() {
				$rootScope.activitySaved = true;
			});
			return defaultActivity;
		}

		function getActivityStatusByListAndIds(dayActivitiesList, dayActivitiesIds) {
			return dayActivitiesIds.map(function(activityId) {
				var activityRecord = $filter('filter')(dayActivitiesList, {
					"Id" : activityId
				}).pop();
				// TODO: fetch activityRecord by Id insted filter
				return {
					Id : activityRecord.Id,
					Name : activityRecord.Name
				};
			});
		}

		function addCustomerIfDeleted(activity, customerData, date) {
			if (!isActivitySubmitted(activity)) {
				return returnCustomerForActivitySelection(customerData, date);
			}
			return $q.when();
		}

		function returnCustomerForActivitySelection(customerData, date) {
			return new mtpAppointmentDetails1Collection().getMtpIdByUserIdAndDate(customerData.userId, date).then(function(mtpId) {
				return mtpId ? mtpRemoveConfigCollection.getMTPRemoveConfigsById(mtpId) : [];
			}).then(function(mtpRemoveConfigs) {
				var mtpRemoveConfigsSoupEntryIds = mtpRemoveConfigs.map(function(config) {
					return config._soupEntryId;
				});
				if (mtpRemoveConfigsSoupEntryIds.length) {
					mtpRemoveConfigCollection.removeEntitiesByIds(mtpRemoveConfigsSoupEntryIds);
				}
			});
		}

		function goToDcr(activityStatus, customerData, date) {
			statusDCRActivty.setActivityStatus(activityStatus);
			statusDCRActivty.setCalenderDate(date.format('YYYY-MM-DD'));
			$rootScope.tabTitle = getTabTitleByCustomerType(customerData.customerType);
			statusDCRActivty.setCustomerId(customerData.userId);
			$state.go('dcrList');
		}

		function getTabTitleByCustomerType(customerType) {
			return ({
			Doctor: locale.Doctors,
			Chemist: locale.Chemists,
			Stockist: locale.Stockists,
			Other: locale.Others
			})[customerType];
		}

	}

})(); 