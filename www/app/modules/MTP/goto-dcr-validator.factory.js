(function() {
	'use strict';

	angular.module('AbbottMobile').factory('gotoDcrValidator', gotoDcrValidator);

	gotoDcrValidator.$inject = ['$q', 'abbottConfigService', 'dcrCollection', 'utils', 'dcrJunctionCollection', 'statusDCRActivty', 'popupService', 'leaveRequestPendingUserCollection', 'leaveRequestApprovedUserCollection', 'leaveRequestHolidayUserCollection', 'divisionCollection'];

	function gotoDcrValidator($q, abbottConfigService, DcrCollection, utils, DcrJunctionCollection, statusDCRActivty, popupService, LeaveRequestPendingUserCollection, LeaveRequestApprovedUserCollection, LeaveRequestHolidayUserCollection, DivisionCollection) {
		var locale = abbottConfigService.getLocale(),
		    dcrCollection = new DcrCollection(),
		    dcrJunctionCollection = new DcrJunctionCollection(),
		    leaveRequestPendingUserCollection = new LeaveRequestPendingUserCollection(),
		    leaveRequestApprovedUserCollection = new LeaveRequestApprovedUserCollection(),
		    leaveRequestHolidayUserCollection = new LeaveRequestHolidayUserCollection(),
		    divisionCollection = new DivisionCollection();

		return checkDcrValidityForTransition;

		function isActivitySubmitted(activity) {
			return !!activity && (activity.Status__c === 'Submitted');
		}

		function checkDcrValidityForTransition(activity, activityStatus, customerId, date, fieldWorkActivityId) {
			return checkAllPendingLeaveRequest().then(function() {
				return checkApprovedLeaveRequestByDate(date);
			}).then(function() {
				if (!isActivitySubmitted(activity)) {
					return checkSubmitedDcrAfterDate(date, fieldWorkActivityId).then(function() {
						return checkVisitSequence(date);
					});
				}
			}).then(function() {
				var isFieldWorkActivity = isFieldWorkActivityByActivityStatus(activityStatus),
				    isSubmitted = isActivitySubmitted(activity),
				    localeKey;

				if (!isFieldWorkActivity) {
					localeKey = isSubmitted ? 'MTPActivitySublitedAlert' : 'MTPActivityNotSublitedAlert';
					return $q.reject({
						message : locale[localeKey]
					});
				} else if (isSubmitted) {
					return checkJunction(date, customerId);
				}
			}).catch(function(reason) {
				popupService.openPopup(reason.message, locale.OK, '35%');
				return $q.reject({
					message : reason
				});
			});
		}

		function isFieldWorkActivityByActivityStatus(activityStatus) {
			return !activityStatus || activityStatus.some(function(status) {
				return status.Name === 'Field Work';
			});
		}

		function checkVisitSequence(date) {
			return dcrCollection.getLastSubmitted().then(function(dcr) {
				if (dcr) {
					return $q.all([getDayWeeklyOffIndex(), getHolidaysRegistry(), getApprovedLeavesRegistry()]).then(function(result) {
						var approvedLeavesRegistry = result.pop(),
						    holidaysRegistry = result.pop(),
						    dayWeeklyOffIndex = result.pop(),
						    dayToCheck = date.clone().subtract(1, 'days');

						function innerLoop() {
							var isWeeklyOff,
							    isHoliday,
							    isLeave,
							    isDayOff;
							isWeeklyOff = (parseInt(dayToCheck.format('d')) === dayWeeklyOffIndex);
							isHoliday = !!holidaysRegistry[dayToCheck.format('YYYY-MM-DD')];
							isLeave = !!approvedLeavesRegistry[dayToCheck.format('YYYY-MM-DD')];
							isDayOff = isWeeklyOff || isHoliday || isLeave;
							isDayOff && dayToCheck.subtract(1, 'days');
							return isDayOff ? innerLoop() :
							void 0;
						}

						innerLoop();
						return dcrCollection.isDcrSubmitedByDate(dayToCheck);
					}).then(function(isDcrSubmited) {
						if (!isDcrSubmited) {
							return $q.reject({
								message : locale.DCRSequentially + moment(dcr.Date__c, 'YYYY-MM-DD').format('D/M/YYYY')
							});
						}
					});
				}
			});
		}

		function getDayWeeklyOffIndex() {
			return divisionCollection.getDivision().then(function(division) {
				return utils.dayOfWeekAsString(division.Weekly_Off__c);
			});
		}

		function getHolidaysRegistry() {
			return leaveRequestHolidayUserCollection.getAll().then(function(holidays) {
				return generateHolidaysRegistry(holidays);
			});
		}

		function getApprovedLeavesRegistry() {
			return leaveRequestApprovedUserCollection.getAll().then(function(approvedLeaves) {
				return generateApprovedLeavesRegistry(approvedLeaves);
			});
		}

		function generateHolidaysRegistry(holidays) {
			return holidays.reduce(function(acc, holiday) {
				acc[holiday.Date__c] = true;
				return acc;
			}, {});
		}

		function generateApprovedLeavesRegistry(approvedLeaves) {
			return approvedLeaves.reduce(function(acc, approvedLeave) {
				var startDate = moment(approvedLeave.From_Date__c, 'YYYY-MM-DD'),
				    endDate = approvedLeave.To_Date__c ? moment(approvedLeave.From_Date__c, 'YYYY-MM-DD') : startDate.clone(),
				    leaveDaysDuration = parseInt(moment.duration(endDate.diff(startDate)).asDays()) + 1;
				new Array(leaveDaysDuration).join(' ').split(' ').forEach(function(item, index) {
					acc[startDate.clone().add(index, 'd').format('YYYY-MM-DD')] = true;
				});
				return acc;
			}, {});
		}

		function checkApprovedLeaveRequestByDate(date) {
			return leaveRequestApprovedUserCollection.isLeaveRequestApprovedForDate(date).then(function(isApproved) {
				return isApproved && $q.reject({
					message : locale.PurpleDaySelectionAlert
				});
			});
		}

		function checkJunction(date, customerId) {
			return dcrJunctionCollection.dcrJunctionCountByDate(date, customerId).then(function(count) {
				return !count && $q.reject({
					message : locale.MTPActivitySublitedWithoutJunctionAlert
				});
			});
		}

		function checkSubmitedDcrAfterDate(date, fieldWorkActivityId) {
			return dcrCollection.isExsistDcrActivityAfterDate(date, fieldWorkActivityId).then(function(isExist) {
				return isExist && $q.reject({
					message : locale.NoDCRFiledOn + date.format('D/M/YYYY')
				});
			});
		}

		function checkAllPendingLeaveRequest() {
			return leaveRequestPendingUserCollection.fetchAll().then(leaveRequestPendingUserCollection.fetchRecursiveFromCursor).then(function(leaveUserList) {
				var formattedDate,
				    message,
				    isPending = leaveUserList && leaveUserList.length;
				if (isPending) {
					formattedDate = moment(leaveUserList[0].From_Date__c, 'YYYY-MM-DD').format('D/M/YYYY');
					message = locale.DCRFilingRestrictedDueToAppliedLeaveAlert.replace('$DAY$', formattedDate);
				}
				return isPending && $q.reject({
					message : message
				});
			});
		}

	}

})(); 