(function () {
  'use strict';

  function dcrLockService(utils, $filter, abbottConfigService, popupService, DcrUnlockReasonCollection,
                          DcrLockedStatusCollection, GreenFlagCollection, DcrLockingCollection, DivisionCollection,
                          sfdcAccount, $cordovaNetwork) {
    var DcrLockService = function () {
      this.dcrUnlockReasonCollection = new DcrUnlockReasonCollection();
      this.dcrLockedStatusCollection = new DcrLockedStatusCollection();
      this.dcrLockingCollection = new DcrLockingCollection();
      this.divisionCollection = new DivisionCollection();
      this.greenFlagCollection = new GreenFlagCollection();
      this.showLockPopup = utils.bind(this.showLockPopup, this);
      this.fetchNumberOfLockingDays = utils.bind(this.fetchNumberOfLockingDays, this);
      this.fetchMobileUsageDays = utils.bind(this.fetchMobileUsageDays, this);
      this.getDcrLockedStatus = utils.bind(this.getDcrLockedStatus, this);
      this.getLastDCRDate = utils.bind(this.getLastDCRDate, this);
      this.closeModalPopup = utils.bind(this.closeModalPopup, this);
      this.onDCRSubmissionStatusDismiss = utils.bind(this.onDCRSubmissionStatusDismiss, this);
      this.onDCRSubmissionStatusUnlockDCR = utils.bind(this.onDCRSubmissionStatusUnlockDCR, this);
      this.showAlertRequestSubmitted = utils.bind(this.showAlertRequestSubmitted, this);
      this.showAlertRequestNotSubmitted = utils.bind(this.showAlertRequestNotSubmitted, this);
      this.syncUnlockRequest = utils.bind(this.syncUnlockRequest, this);
      this.showLongNotUsedPopup = utils.bind(this.showLongNotUsedPopup, this);
      this.getTimeDiff = utils.bind(this.getTimeDiff, this);
      this.fetchListOfReasonCodes = utils.bind(this.fetchListOfReasonCodes, this);
      this.displayUnlockPopup = utils.bind(this.displayUnlockPopup, this);
      this.isLocked = utils.bind(this.isLocked, this);
      this.locale = abbottConfigService.getLocale();

      this.defaultPopupWidth = "60%";
    };

    DcrLockService.prototype.showLockPopup = function($scope){
      var that = this;
    //  numberOfLockingDays, mobileUsageDays;
      this.$scope = $scope;

    /*  this.fetchNumberOfLockingDays()
     .then(function(days){
      numberOfLockingDays = days;
     })
      .then(this.fetchMobileUsageDays)
      .then(function(days){
       mobileUsageDays = days;
     })
      .then(this.getLastDCRDate)
     .then(function (lastDCRDate) {
        var diff = that.getTimeDiff(lastDCRDate);
      // only considering mobile dcr allow till filed here.
      if(diff < mobileUsageDays){
         that.showDCRSubmissionStatusPopup(lastDCRDate);
       }else{
        that.showLongNotUsedPopup();
        }
        });
        this.showDCRSubmissionStatusPopup(lastDCRDate);*/
         return this.getLastDCRDate()
         .then(function (lastDCRDate) {
             that.showDCRSubmissionStatusPopup(lastDCRDate);
         });
    };

    DcrLockService.prototype.showAlertRequestSubmitted = function () {
      popupService.openPopup(this.locale.UnlockRequestSubmitted, this.locale.OK, '35%');
    };

    DcrLockService.prototype.showAlertRequestNotSubmitted = function () {
      popupService.openPopup(this.locale.NotAccessToUnlock, this.locale.OK, '35%');
    };

    DcrLockService.prototype.getLastDCRDate = function () {
      return this.greenFlagCollection.fetchLastDCRDate()
        .then(function (lastDcrDateEntity) {
          var lastDcrDate = lastDcrDateEntity && lastDcrDateEntity.Date__c;
          if (!lastDcrDate) {
            lastDcrDate = "1970-01-01";
          }
          return lastDcrDate;
        });
    };

    DcrLockService.prototype.getTimeDiff = function(lastDcrDate){
      var date1 = new Date(lastDcrDate),
        date2 = new Date(),
        timeDiff = Math.abs(date2.setHours(0, 0, 0, 0) - date1.getTime());
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    };

    DcrLockService.prototype.getDcrLockedStatus = function () {
      return this.dcrLockedStatusCollection.fetchAll()
        .then(this.dcrLockedStatusCollection.getEntityFromResponse);
    };

    DcrLockService.prototype.fetchListOfReasonCodes = function () {
      return this.dcrUnlockReasonCollection.fetchAll()
        .then(this.dcrUnlockReasonCollection.fetchRecursiveFromCursor);
    };

    DcrLockService.prototype.showDCRSubmissionStatusPopup = function (lastDcrDate) {
      var lastDcrDateFiltered = $filter('date')(lastDcrDate, 'dd/MM/yyyy'),
        popupTitle = this.locale.DCRSubmissionStatus,
        popupBody = this.locale.LastDayReportsubmitted + lastDcrDateFiltered + this.locale.DCRislocked;
      popupService.openConfirm(
        popupTitle,
        popupBody,
        this.locale.Dismiss,
        this.locale.UnlockDCR,
        this.defaultPopupWidth,
        this.onDCRSubmissionStatusDismiss,
        this.onDCRSubmissionStatusUnlockDCR
      );
    };

    DcrLockService.prototype.onDCRSubmissionStatusDismiss = function () {
      this.closeModalPopup();
    };

    DcrLockService.prototype.onDCRSubmissionStatusUnlockDCR = function () {
      this.closeModalPopup(); // close modal popup for open new =/
      this.displayUnlockPopup();
    };

    DcrLockService.prototype.displayUnlockPopup = function () {
      var that = this;
      this.$scope.reasons = [];
      this.$scope.selectedReason = null;
      this.$scope.lockSvc = {
        reasons: [],
        comment: '',
        selectedReason: null,
        closeModalPopup: this.closeModalPopup,
        syncUnlockRequest: this.syncUnlockRequest
      };
      this.prepareUnlockReasonsList()
      .then(function(){
        popupService.openPopupWithTemplateUrl(
          that.$scope,
          "app/modules/LockScreen/views/lock-screen.html",
          that.defaultPopupWidth);
      });
    };

    DcrLockService.prototype.closeModalPopup = function(){
      popupService.closePopup();
    };

    DcrLockService.prototype.syncUnlockRequest = function(isValid){
      if(isValid) {
		  var that = this;
		  if($cordovaNetwork.isOffline()){
			popupService.openPopup(this.locale.NoInternetConnection, this.locale.OK, '35%')
		  }else{
			this.getDcrLockedStatus()
			  .then(function(lockedEntity){
				if(lockedEntity){
				if((lockedEntity["Unlock_Reason__c"] == null && lockedEntity["User_Comments__c"] == null) || (lockedEntity["Unlock_Reason__c"] == '' && lockedEntity["User_Comments__c"] == '')){
				  lockedEntity["Unlock_Reason__c"] = that.$scope.lockSvc.selectedReason;
				  lockedEntity["User_Comments__c"] = that.$scope.lockSvc.comment;
				  lockedEntity["Status__c"] = "Requested For Unlock";
				  that.dcrLockedStatusCollection.updateEntityToSfdc(lockedEntity)
					.then(that.showAlertRequestSubmitted, that.showAlertRequestNotSubmitted);
				}
				popupService.openPopup(abbottConfigService.getLocale().unlockRequestAlreadySubmitted, abbottConfigService.getLocale().OK, '35%')
				}else{
				  that.closeModalPopup();
				}
			  });
		  }
      }
    };

    DcrLockService.prototype.prepareUnlockReasonsList = function(){
      var that = this;
      return this.fetchListOfReasonCodes()
        .then(function(reasonEntities){
          reasonEntities.forEach(function(reasonEntity){
            if(reasonEntity.Reason__c){
              that.$scope.lockSvc.reasons.push(reasonEntity.Reason__c);
            }
          });
        });
    };

    DcrLockService.prototype.fetchNumberOfLockingDays = function(){
      var DefaultDCRLockingDays = 0;
      return this.dcrLockingCollection.fetchAll()
        .then(this.dcrLockingCollection.getEntityFromResponse)
        .then(function(entity){
          if(entity){
            return entity.DCR_Locking_Days__c || DefaultDCRLockingDays;
          }else{
            return DefaultDCRLockingDays;
          }
        });
    };

    DcrLockService.prototype.fetchMobileUsageDays = function(){
      var DefaultMobileDCRAllowedTill = 5;
      return this.divisionCollection.fetchAll()
        .then(this.divisionCollection.getEntityFromResponse)
        .then(function(entity){
          if(entity){
            return entity.Mobile_DCR_Allowed_Till__c || DefaultMobileDCRAllowedTill;
          }else{
            return DefaultMobileDCRAllowedTill;
          }
        });
    };

    DcrLockService.prototype.showLongNotUsedPopup = function(){
      popupService.openPopup(this.locale.YouhavenotusedMobilefromlongtimePleaseusePortalApp, this.locale.OK, '35%', function(){
        //sfdcAccount.logout(); //TODO: CLARIFY! IF USER ALWAYS WILL LOGOUT - HE WILL NEVER SYNC FOR NEW DATA
      });
    };

    return new DcrLockService;
  }

  abbottApp.service('dcrLockService', [
    'utils',
    '$filter',
    'abbottConfigService',
    'popupService',
    'dcrUnlockReasonCollection',
    'dcrLockedStatusCollection',
    'greenFlagCollection',
    'dcrLockingCollection',
    'divisionCollection',
    'sfdcAccount',
    '$cordovaNetwork',
    dcrLockService
  ]);

})();