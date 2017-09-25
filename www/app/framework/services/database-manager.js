(function() {
    function databaseManager($q,
        popupService,
        abbottConfigService,
        abbExchangeService,
        $timeout,
        userPreferences,
        $rootScope,
        utils,
        locationService,
        uploadDataService,
        sfdcAccount,
        syncLog,
        associatedAppCollection,
        notificationCollection,
        notificationReadCollection,
        dcrCollection,
        mtpAppointmentDetails1Collection,
        mtpAppointmentDetails2Collection,
        targetCollection,
        userCollection,
        targetUserCollection,
        greenFlagCollection,
        leaveRequestApprovedUserCollection,
        leaveRequestPendingUserCollection,
        leaveRequestHolidayUserCollection,
        leaveRequestCollection,
        mtpDetailsCollection,
        lastVisitCollection,
        fullDayActivityCollection,
        halfDayActivityCollection,
        jfwOtherRolesCollection,
        divisionwiseCompetitorsCollection,
        dcrBrandActivityCollection,
        mtpCollection,
        dcrJunctionCollection,
        dcrDropCollection,
        divisionwiseBrandCollection,
        materialLotCollection,
        materialTransactionCollection,
        campaignCollection,
        campaignBrandActivityCollection,
        keyMessageCollection,
        dcrKeyMessageCollection,
        dcrFollowupActivityCollection,
        dcrJFWCollection,
        assigmentDetailCollection,
        newCustomerCollection,
        divisionCollection,
        dcrLockingCollection,
        dcrUnlockReasonCollection,
        dcrLockedStatusCollection,
        mtpRemoveConfigCollection,
        activitySelectionCollection,
        brandActivityCollection,
        reporteeJFWCollection,
        patchCollection,
        deviceCollection,
        divisionwiseBrandPresentationCollection,
        dcrKpiDataCollection,
        presentationCollection,
        territoryCollection,
        userTerritoryCollection,
        otherExpensesCollection,
        otherExpensesEarningCollection,
        sfcAssignmentCollection,
        sfcMasterCollection,
        sfcFareCollection,
        patchMarketJunctionCollection,
        expenseCollection,
        expenseDetailsCollection,
        expenseSAPCodesCollection,
        dailyAllowanceMasterCollection,
        dailyAllowanceFareCollection,
        mobileDeviceInventoryCollection,
        attachmentCollection,
        dcrSchedulerSummaryCollection,
        $cordovaNetwork,
        loaderManager,
        $cordovaAppVersion) {
        var locale = abbottConfigService.getLocale();
        var DatabaseManager = function() {
            this.scope = $rootScope.$new(true);
            this.clearUserData = utils.bind(this.clearUserData, this);
            this.initDatabase = utils.bind(this.initDatabase, this);
            this.canSync = utils.bind(this.canSync, this);
            this.runSync = utils.bind(this.runSync, this);
            this.sync = utils.bind(this.sync, this);
            this.startSync = utils.bind(this.startSync, this);
            this.showProgress = utils.bind(this.showProgress, this);
            this.updateProgress = utils.bind(this.updateProgress, this);
            this.logSuccesfullyState = utils.bind(this.logSuccesfullyState, this);
            this.logFailState = utils.bind(this.logFailState, this);
            this.loadAndCheckDevice = utils.bind(this.loadAndCheckDevice, this);
            this.setLastSyncedState = utils.bind(this.setLastSyncedState, this);
            this.onSuccessfullSync = utils.bind(this.onSuccessfullSync, this);
            this.onFailSync = utils.bind(this.onFailSync, this);
            this.syncDownForCollection = utils.bind(this.syncDownForCollection, this);
            this.syncUpForCollection = utils.bind(this.syncUpForCollection, this);
            this.onSyncDownCollectionSuccess = utils.bind(this.onSyncDownCollectionSuccess, this);
            this.onSyncDownCollectionFail = utils.bind(this.onSyncDownCollectionFail, this);
            this.onSyncUpCollectionSuccess = utils.bind(this.onSyncUpCollectionSuccess, this);
            this.onSyncUpEntityFail = utils.bind(this.onSyncUpEntityFail, this);
            this.logFailUploadState = utils.bind(this.logFailUploadState, this);
            this.onsyncRemoveCollectionFail = utils.bind(this.onsyncRemoveCollectionFail, this);
            this.onsyncRemoveCollectionSuccess = utils.bind(this.onsyncRemoveCollectionSuccess, this);
            this.syncRemoveForCollection = utils.bind(this.syncRemoveForCollection, this);
            this.transactionalSync = utils.bind(this.transactionalSync, this);
            this.syncDownForABM = utils.bind(this.syncDownForABM, this);
        };

        DatabaseManager.collections = [
            deviceCollection,
            notificationCollection,
            notificationReadCollection,
            dcrCollection,
            mtpAppointmentDetails1Collection,
            mtpAppointmentDetails2Collection,
            targetCollection,
            userCollection,
            targetUserCollection,
            greenFlagCollection,
            leaveRequestApprovedUserCollection,
            leaveRequestPendingUserCollection,
            leaveRequestHolidayUserCollection,
            leaveRequestCollection,
            mtpDetailsCollection,
            lastVisitCollection,
            fullDayActivityCollection,
            halfDayActivityCollection,
            jfwOtherRolesCollection,
            divisionwiseCompetitorsCollection,
            dcrBrandActivityCollection,
            mtpCollection,
            dcrJunctionCollection,
            dcrDropCollection,
            divisionwiseBrandCollection,
            materialLotCollection,
            materialTransactionCollection,
            campaignCollection,
            campaignBrandActivityCollection,
            keyMessageCollection,
            dcrKeyMessageCollection,
            dcrFollowupActivityCollection,
            dcrJFWCollection,
            assigmentDetailCollection,
            newCustomerCollection,
            divisionCollection,
            dcrLockingCollection,
            dcrUnlockReasonCollection,
            dcrLockedStatusCollection,
            mtpRemoveConfigCollection,
            activitySelectionCollection,
            brandActivityCollection,
            reporteeJFWCollection,
            patchCollection,
            divisionwiseBrandPresentationCollection,
            dcrKpiDataCollection,
            presentationCollection,
            territoryCollection,
            userTerritoryCollection,
            otherExpensesCollection,
            otherExpensesEarningCollection,
            sfcAssignmentCollection,
            sfcMasterCollection,
            sfcFareCollection,
            patchMarketJunctionCollection,
            expenseCollection,
            expenseDetailsCollection,
            expenseSAPCodesCollection,
            dailyAllowanceMasterCollection,
            dailyAllowanceFareCollection,
            attachmentCollection,
            associatedAppCollection,
            dcrSchedulerSummaryCollection
        ];

        DatabaseManager.prototype.clearUserData = function() {
            //return utils.mapConcurrent(DatabaseManager.collections, function(collection){
            return utils.mapConcurrent(DatabaseManager.TransactionalCollections, function(collection) {
                    return new collection().clearSoup();
                })
                .then(userPreferences.getPreferences)
                .then(function(preferences) {
                    return angular.extend(preferences, {
                        Is_Last_Sync_Completed: false,
                        LastSyncLog: [],
                        LastLoggedUserId: ''
                    });
                })
                .then(userPreferences.setPreferences);
        };

        DatabaseManager.prototype.initDatabase = function() {
            return utils.mapConcurrent(DatabaseManager.collections, function(collection) {
                return new collection().initSoup();
            }).then(function() {
                setTimeout(function() {
                    $rootScope.$emit('databaseAvailable');
                    return null;
                }, 2000);
            });
        };

        DatabaseManager.prototype.canSync = function() {
            var deferred = $q.defer();
            if ($cordovaNetwork.isOffline()) {
                deferred.reject({ message: locale.NoInternetConnection });
            } else {
                if (loaderManager.hasActiveLoaders()) {
                    deferred.reject({ message: locale.SyncAlert });
                } else {
                    sfdcAccount.getCurrentUserId()
                        .then(function(userId) {
                            userPreferences.getValueForKey('LastLoggedUserId')
                                .then(function(lastUserId) {
                                    if (!lastUserId || userId == lastUserId) {
                                        deferred.resolve();
                                    } else {
                                        deferred.reject({ message: locale.MultipleUserApplicationUseAlert });
                                    }
                                    if ($cordovaNetwork.isOffline()) {
                                        deferred.reject({ message: locale.NoInternetConnection });
                                    }
                                });
                        });
                }
            }
            return deferred.promise;
        };

        DatabaseManager.prototype.runSync = function(withoutConfirm, userTypeDetails) {
            this.userTypeDetails = userTypeDetails;
            return this.canSync()
                .then(function() {
                    if (withoutConfirm) {
                        this.sync();
                    } else {
                        popupService.openConfirm(locale.Sync, locale.SyncConfirmation, locale.No, locale.Yes, '35%', function() {},
                            this.transactionalSync);
                    }
                }.bind(this))
                .catch(function(reason) {
                    popupService.openPopup(reason.message, locale.OK, '35%');
                });
        };

        DatabaseManager.prototype.sync = function() {
            //locationService.trackLocation();
            var dcrLockedStatusCollectionInstance = new dcrLockedStatusCollection();
            return this.startSync(true)
                .then(this.loadAndCheckDevice)
                .then(this.syncDownForCollection(userCollection))
                .then(this.syncDownForCollection(greenFlagCollection))
                .then(this.syncDownForCollection(divisionCollection))
                .then(this.syncDownForCollection(dcrLockingCollection))
                .then(this.syncDownForCollection(dcrUnlockReasonCollection))
                .then(this.syncDownForCollection(dcrLockedStatusCollection))
                .then(dcrLockedStatusCollectionInstance.getDcrLockedStatus)
                .then(function(dcrLockedStatus) {
                    var deferred = $q.defer();
                    if (dcrLockedStatus == null || dcrLockedStatus.Status__c === 'Unlocked') {
                        deferred.resolve();
                    } else {
                        deferred.reject('DCR_Locked');
                    }
                    return deferred.promise;
                })
                .then(this.syncDownForCollection(userTerritoryCollection))
                .then(this.syncDownForCollection(territoryCollection))
                // .then(this.syncUpForCollection(dcrCollection))
                .then(this.syncDownForCollection(dcrCollection))
                /* .then(this.syncUpForCollection(dcrJunctionCollection))
              .then(this.syncUpForCollection(dcrBrandActivityCollection))
               .then(this.syncUpForCollection(dcrJunctionCollection, true))
           .then(this.syncUpForCollection(dcrBrandActivityCollection, true))
            .then(this.syncUpForCollection(dcrDropCollection))
              .then(this.syncUpForCollection(dcrKeyMessageCollection))
           .then(this.syncUpForCollection(dcrFollowupActivityCollection))
             .then(this.syncUpForCollection(dcrJFWCollection))
             .then(function () {
                if ($rootScope.clmEnabled) {
                  var dcrKpiDataCollectionInstance = new dcrKpiDataCollection();
                    this.updateProgress(dcrKpiDataCollectionInstance.model.description, true);
                   return dcrKpiDataCollectionInstance.syncUp()
                       .then(this.onSyncUpCollectionSuccess(dcrKpiDataCollectionInstance.model), null, this.onSyncUpEntityFail(dcrKpiDataCollectionInstance.model));
              }
              else
                    return true;
             }.bind(this))
              .then(function () {
                  var dcrCollectionInstance = new dcrCollection();
                  return dcrCollectionInstance.changeDCRStatus()
                  .then(this.onSyncUpCollectionSuccess(dcrCollectionInstance.model), null, this.onSyncUpEntityFail(dcrCollectionInstance.model));
              }.bind(this))*/
                // .then(this.syncUpForCollection(materialTransactionCollection))
                .then(this.syncRemoveForCollection(expenseCollection))
                .then(this.syncRemoveForCollection(expenseDetailsCollection, true))
                .then(this.syncRemoveForCollection(attachmentCollection, true))
                .then(uploadDataService.syncUp)
                .then(function(response) {
                    var attachmentCollectionInstance = new attachmentCollection();
                    return attachmentCollectionInstance.updateAttachmentId(response);

                    console.log(response);
                })
                // update expense_detail id from response for webservice call and then do syncup.
                .then(this.syncUpForCollection(attachmentCollection))
                .then(function() {
                    var dcrCollectionInstance = new dcrCollection();
                    return dcrCollectionInstance.changeDCRLocalStatus()
                        .then(this.onSyncUpCollectionSuccess(dcrCollectionInstance.model), null, this.onSyncUpEntityFail(dcrCollectionInstance.model));
                }.bind(this))
                .then(this.syncDownForCollection(dcrCollection))
                .then(this.syncDownForCollection(dcrJunctionCollection))
                .then(this.syncDownForCollection(dcrBrandActivityCollection))
                .then(this.syncDownForCollection(dcrDropCollection))
                .then(this.syncDownForCollection(dcrKeyMessageCollection))
                .then(this.syncDownForCollection(dcrFollowupActivityCollection))
                .then(this.syncDownForCollection(dcrJFWCollection))
                .then(this.syncDownForCollection(materialLotCollection))
                .then(function() {
                    var expenseCollectionInstance = new expenseCollection();
                    return expenseCollectionInstance.changeExpenseStatus()
                        .then(this.onSyncUpCollectionSuccess(expenseCollectionInstance.model), null, this.onSyncUpEntityFail(expenseCollectionInstance.model));
                }.bind(this))
                .then(this.syncDownForABM(expenseCollection))
                .then(this.syncDownForABM(expenseDetailsCollection))
                .then(this.syncDownForCollection(mtpCollection))
                .then(this.syncDownForCollection(keyMessageCollection))
                .then(this.syncDownForCollection(mtpAppointmentDetails1Collection))
                .then(this.syncDownForCollection(mtpAppointmentDetails2Collection))
                .then(this.syncDownForCollection(targetCollection))
                .then(this.syncDownForCollection(userCollection))
                .then(this.syncDownForCollection(targetUserCollection))
                .then(this.syncDownForCollection(leaveRequestApprovedUserCollection))
                .then(this.syncDownForCollection(leaveRequestPendingUserCollection))
                .then(this.syncDownForCollection(leaveRequestHolidayUserCollection))
                .then(this.syncDownForCollection(leaveRequestCollection))
                .then(this.syncDownForCollection(mtpDetailsCollection))
                .then(this.syncDownForCollection(lastVisitCollection))
                .then(this.syncDownForCollection(fullDayActivityCollection))
                .then(this.syncDownForCollection(halfDayActivityCollection))
                .then(this.syncDownForCollection(jfwOtherRolesCollection))
                .then(this.syncDownForCollection(divisionwiseCompetitorsCollection))
                .then(this.syncDownForCollection(divisionwiseBrandCollection))
                .then(function() {
                    if ($rootScope.clmEnabled) {
                        var divisionwiseBrandPresentationInstance = new divisionwiseBrandPresentationCollection();
                        this.updateProgress(divisionwiseBrandPresentationInstance.model.description, false);
                        return divisionwiseBrandPresentationInstance.syncDown()
                            .then(this.onSyncDownCollectionSuccess(divisionwiseBrandPresentationInstance.model))
                            .catch(this.onSyncDownCollectionFail(divisionwiseBrandPresentationInstance.model));
                    } else
                        return true;
                }.bind(this))
                .then(function() {
                    if ($rootScope.clmEnabled) {
                        var presentationCollectionInstance = new presentationCollection();
                        this.updateProgress(presentationCollectionInstance.model.description, false);
                        return presentationCollectionInstance.syncDown()
                            .then(this.onSyncDownCollectionSuccess(presentationCollectionInstance.model))
                            .catch(this.onSyncDownCollectionFail(presentationCollectionInstance.model));
                    } else
                        return true;
                }.bind(this))
                .then(this.syncDownForCollection(campaignCollection))
                .then(this.syncDownForCollection(campaignBrandActivityCollection))
                .then(this.syncDownForCollection(assigmentDetailCollection))
                .then(this.syncDownForCollection(brandActivityCollection))
                .then(this.syncDownForCollection(patchCollection))
                .then(this.syncDownForCollection(reporteeJFWCollection))
                .then(function() {
                    if (localStorage.getItem('deviceInInventory') == null || !localStorage.getItem('deviceInInventory')) {
                        var mobileDeviceInventoryCollectionInstance = new mobileDeviceInventoryCollection();
                        mobileDeviceInventoryCollectionInstance.fillDeviceInfo();
                        localStorage.setItem('deviceInInventory', true);
                    } else
                        return true;
                }.bind(this))
                .then(this.syncDownForCollection(greenFlagCollection))
                .then(this.syncUpForCollection(notificationCollection))
                .then(this.syncDownForCollection(notificationCollection))
                .then(this.syncUpForCollection(notificationReadCollection))
                .then(this.syncDownForCollection(notificationReadCollection))
                .then(this.syncDownForABM(otherExpensesCollection))
                .then(this.syncDownForABM(otherExpensesEarningCollection))
                .then(this.syncDownForABM(sfcAssignmentCollection))
                .then(this.syncDownForABM(sfcMasterCollection))
                .then(this.syncDownForABM(sfcFareCollection))
                .then(this.syncDownForABM(patchMarketJunctionCollection))
                .then(this.syncDownForABM(expenseSAPCodesCollection))
                .then(this.syncDownForABM(dailyAllowanceMasterCollection))
                .then(this.syncDownForABM(dailyAllowanceFareCollection))
                .then(this.syncDownForCollection(associatedAppCollection))
                .then(this.syncUpForCollection(deviceCollection))
                .then(this.syncDCRSchedulerSummary())
                .then(this.onSuccessfullSync)
                .catch(this.onFailSync)
                .finally(this.generateLogs)
        };

        // this is main funciton for sync the expense and DCR only
        DatabaseManager.prototype.transactionalSync = function() {
            //locationService.trackLocation();
            var dcrLockedStatusCollectionInstance = new dcrLockedStatusCollection();
            return this.startSync()
                .then(this.loadAndCheckDevice)
                .then(this.syncDownForCollection(dcrLockedStatusCollection))
                .then(dcrLockedStatusCollectionInstance.getDcrLockedStatus)
                .then(function(dcrLockedStatus) {
                    var deferred = $q.defer();
                    if (dcrLockedStatus == null || dcrLockedStatus.Status__c === 'Unlocked') {
                        deferred.resolve();
                    } else {
                        deferred.reject('DCR_Locked');
                    }
                    return deferred.promise;
                })
                // .then(this.syncUpForCollection(dcrCollection))
                .then(this.syncDownForCollection(dcrCollection))
                /* .then(this.syncUpForCollection(dcrJunctionCollection))
                            .then(this.syncUpForCollection(dcrBrandActivityCollection))
                           .then(this.syncUpForCollection(dcrJunctionCollection, true))
                           .then(this.syncUpForCollection(dcrBrandActivityCollection, true))
                           .then(this.syncUpForCollection(dcrDropCollection))
                          .then(this.syncUpForCollection(dcrKeyMessageCollection))
                           .then(this.syncUpForCollection(dcrFollowupActivityCollection))
                           .then(this.syncUpForCollection(dcrJFWCollection))
                           .then(this.syncUpForCollection(materialTransactionCollection))
                           .then(function () {
                                if ($rootScope.clmEnabled) {
                                    var dcrKpiDataCollectionInstance = new dcrKpiDataCollection();
                                 this.updateProgress(dcrKpiDataCollectionInstance.model.description, true);
                                  return dcrKpiDataCollectionInstance.syncUp()
                                      .then(this.onSyncUpCollectionSuccess(dcrKpiDataCollectionInstance.model), null, this.onSyncUpEntityFail(dcrKpiDataCollectionInstance.model));
                              }
                               else
                                    return true;
                          }.bind(this))
                           .then(function () {
                             var dcrCollectionInstance = new dcrCollection();
                              return dcrCollectionInstance.changeDCRStatus()
                                .then(this.onSyncUpCollectionSuccess(dcrCollectionInstance.model), null, this.onSyncUpEntityFail(dcrCollectionInstance.model));
                       }.bind(this))*/
                .then(this.syncRemoveForCollection(expenseCollection))
                .then(this.syncRemoveForCollection(expenseDetailsCollection, true))
                .then(this.syncRemoveForCollection(attachmentCollection, true))
                .then(uploadDataService.syncUp)
                .then(function(response) {
                    var attachmentCollectionInstance = new attachmentCollection();
                    return attachmentCollectionInstance.updateAttachmentId(response);
                })
                //update expense_detail id from response for webservice call and then do syncup.
                .then(this.syncUpForCollection(attachmentCollection))
                .then(function() {
                    var dcrCollectionInstance = new dcrCollection();
                    return dcrCollectionInstance.changeDCRLocalStatus()
                        .then(this.onSyncUpCollectionSuccess(dcrCollectionInstance.model), null, this.onSyncUpEntityFail(dcrCollectionInstance.model));
                }.bind(this))
                .then(this.syncDownForCollection(dcrCollection))
                .then(this.syncDownForCollection(dcrJunctionCollection))
                .then(this.syncDownForCollection(dcrBrandActivityCollection))
                .then(this.syncDownForCollection(dcrDropCollection))
                .then(this.syncDownForCollection(dcrKeyMessageCollection))
                .then(this.syncDownForCollection(dcrFollowupActivityCollection))
                .then(this.syncDownForCollection(dcrJFWCollection))
                .then(this.syncDownForCollection(materialLotCollection))
                .then(function() {
                    var expenseCollectionInstance = new expenseCollection();
                    return expenseCollectionInstance.changeExpenseStatus()
                        .then(this.onSyncUpCollectionSuccess(expenseCollectionInstance.model), null, this.onSyncUpEntityFail(expenseCollectionInstance.model));
                }.bind(this))
                .then(this.syncDownForCollection(greenFlagCollection))
                .then(this.syncDownForABM(expenseCollection))
                .then(this.syncDownForABM(expenseDetailsCollection))
                .then(this.syncUpForCollection(deviceCollection))
                .then(this.syncUpForCollection(notificationCollection))
                .then(this.syncDownForCollection(notificationCollection))
                .then(this.syncUpForCollection(notificationReadCollection))
                .then(this.syncDownForCollection(notificationReadCollection))
                .then(this.syncDCRSchedulerSummary())
                .then(this.onSuccessfullSync)
                .catch(this.onFailSync)
                .finally(this.generateLogs)
        };

        DatabaseManager.prototype.syncDCRSchedulerSummary = function() {
            var that = this;
            return function() {

                var dcrSchedulerSummaryCollectionInstance = new dcrSchedulerSummaryCollection();
                that.updateProgress(dcrSchedulerSummaryCollectionInstance.model.description, false);
                return dcrSchedulerSummaryCollectionInstance.getSummaryData().then(that.onSyncDownCollectionSuccess(dcrSchedulerSummaryCollectionInstance.model))
                    .catch(that.onSyncDownCollectionFail(dcrSchedulerSummaryCollectionInstance.model));
            }.bind(this);
        };


        DatabaseManager.prototype.syncDownForABM = function(collection) {
            var that = this;
            return function() {
                return (new userCollection()).getActiveUser().then(function(activeUser) {
                    if (activeUser.Designation__c !== 'ZBM') {
                        var collectionInstance = new collection();
                        that.updateProgress(collectionInstance.model.description, false);
                        return collectionInstance.syncDown()
                            .then(that.onSyncDownCollectionSuccess(collectionInstance.model))
                            .catch(that.onSyncDownCollectionFail(collectionInstance.model));
                    } else
                        return true;
                });
            };
        };


        DatabaseManager.prototype.generateLogs = function() {
            var generateLogs = true;
            if (generateLogs) {
                var data = '...';
                // your data, could be useful JSON.stringify to convert an object to JSON string
                window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(directoryEntry) {
                    directoryEntry.getFile('abbott_log.txt', {
                        create: true
                    }, function(fileEntry) {
                        fileEntry.createWriter(function(fileWriter) {
                            fileWriter.onwriteend = function(result) {
                                //console.log( 'done.' );
                            };
                            fileWriter.onerror = function(error) {
                                console.log(error);
                            };
                            fileWriter.write(data);
                        }, function(error) {
                            console.log(error);
                        });
                    }, function(error) {
                        console.log(error);
                    });
                }, function(error) {
                    console.log(error);
                });
            }
        };

        DatabaseManager.prototype.showProgress = function(isFullSync) {
            this.syncStep = 0;
            this.totalSyncSteps = 0;
            if (this.userTypeDetails == "ZBM") {
                // for now I can see 125 record steps for ZBM user, i.e. full sync 63 and 20 for trasc sync.
                this.totalSyncSteps = isFullSync ? 50 : 18;
            } else {
                // for now I can see 125 record steps for non ZBM user, i.e. full sync 75 and 20 for trasc sync.
                this.totalSyncSteps = isFullSync ? 61 : 22;
            }
            this.scope.locale = locale;
            this.scope.progress = { value: 0, message: locale['SyncPopupPending'] };
            popupService.openProgress(this.scope, '60%');
            this.updateProgress(locale.gettingUserInfo, false, true);
        };

        DatabaseManager.prototype.updateProgress = function(collectionName, isUpload, isDeleted) {
            this.syncStep++;
            console.log("this.syncStep++", this.syncStep);
            this.scope.progress.value = Math.ceil((this.syncStep / this.totalSyncSteps) * 100);
            this.scope.progress.message = [
                (isUpload ? (isDeleted ? locale['SyncPopupRemoveAction'] : locale['SyncPopupUploadAction']) : (isDeleted ? '' : locale['SyncPopupDownloadAction'])),
                collectionName
            ].join(' ');
        };

        DatabaseManager.prototype.startSync = function(fullSync) {
            this.showProgress(fullSync);
            this.uploadFailed = false;
            //  this.updateProgress(locale.gettingUserInfo, false, true);
            return sfdcAccount.authenticate()
                .then(function() {
                    return sfdcAccount.getCurrentUserId()
                        .then(function(userId) {
                            return userPreferences.getPreferences()
                                .then(function(preferences) {
                                    return angular.extend(preferences, {
                                        Is_Last_Sync_Completed: false,
                                        LastLoggedUserId: userId
                                    });
                                })
                                .then(userPreferences.setPreferences);
                        })
                        .then(syncLog.init)
                }.bind(this))
                .catch(function() {
                    return sfdcAccount.logout();
                });
        };

        DatabaseManager.prototype.loadAndCheckDevice = function() {
            var deferred = $q.defer(),
                mobileDeviceCollection = new deviceCollection();
            this.syncDownForCollection(deviceCollection)()
                .then(mobileDeviceCollection.getCurrentDevice)
                .then(function(currentDevice) {
                    if (currentDevice && currentDevice.Request_Erase__c) {
                        currentDevice.Erased__c = true;
                        mobileDeviceCollection.updateEntity(currentDevice)
                            .then(mobileDeviceCollection.syncUp)
                            .then(this.clearUserData)
                            .then(sfdcAccount.logout)
                            .then(deferred.reject)
                    } else {
                        deferred.resolve();
                    }
                }.bind(this))
                .catch(deferred.reject);
            return deferred.promise;
        };

        DatabaseManager.prototype.setLastSyncedState = function(wasSuccessful) {
            return userPreferences.setValueForKey('Is_Last_Sync_Completed', wasSuccessful);
        };

        DatabaseManager.prototype.onSuccessfullSync = function() {
            if (!this.uploadFailed) {
                return syncLog.appendToLog(locale['SyncLogSuccess'] + new Date())
                    .then(function() {
                        popupService.openPopup(locale.SyncProcessCompleted, locale.OK, '35%', function() { $rootScope.$emit('databaseAvailable'); });

                        new userCollection().getActiveUser()
                            .then(function(user) {
                                $rootScope.clmEnabled = (user) ? user.CLM_User__c && isiPad : false
                            });
                        $rootScope.LastSyncFail = false;

                        //Home page application list updation after the first sync
                        var appData = abbExchangeService.getAppList();
                        appData.then(function(data) {
                            $rootScope.$broadcast('setHomeAppList', data)
                        });


                        return sfdcAccount.getCurrentUserId()
                            .then(function(userId) {
                                userPreferences.getPreferences()
                                    .then(function(preferences) {
                                        return angular.extend(preferences, {
                                            Is_Last_Sync_Completed: true,
                                            LastLoggedUserId: userId
                                        });
                                    })
                                    .then(userPreferences.setPreferences);
                            });
                    });
            } else {
                return this.onFailSync();
            }
        };

        DatabaseManager.prototype.onFailSync = function(err) {
            return syncLog.appendToLog(locale['SyncLogFail'] + new Date())
                .then(function() {
                    if (err == "DCR_Locked") {
                        $rootScope.$emit('databaseAvailable');
                        return sfdcAccount.getCurrentUserId()
                            .then(function(userId) {
                                userPreferences.getPreferences()
                                    .then(function(preferences) {
                                        return angular.extend(preferences, {
                                            Is_Last_Sync_Completed: true,
                                            LastLoggedUserId: userId
                                        });
                                    })
                                    .then(userPreferences.setPreferences);
                            });
                    } else {
                        $rootScope.LastSyncFail = true;
                        var errorMsg = navigator.onLine ? locale.SyncProcessFailed : locale.SyncFailNoInternet;
                        popupService.openPopup(errorMsg, locale.OK, '35%', function() { $rootScope.$emit('databaseAvailable'); });
                        return sfdcAccount.getCurrentUserId()
                            .then(function(userId) {
                                userPreferences.getPreferences()
                                    .then(function(preferences) {
                                        return angular.extend(preferences, {
                                            Is_Last_Sync_Completed: false,
                                            LastLoggedUserId: userId
                                        });
                                    })
                                    .then(userPreferences.setPreferences);
                            });
                    }
                });
        };

        DatabaseManager.prototype.syncDownForCollection = function(collection) {
            return function() {
                var collectionInstance = new collection();
                this.updateProgress(collectionInstance.model.description, false);
                return collectionInstance.syncDown()
                    .then(this.onSyncDownCollectionSuccess(collectionInstance.model))
                    .catch(this.onSyncDownCollectionFail(collectionInstance.model));
            }.bind(this);
        };

        DatabaseManager.prototype.syncRemoveForCollection = function(collection, deleteLocally) {
            return function() {
                var collectionInstance = new collection();
                this.updateProgress(collectionInstance.model.description, true, true);
                return collectionInstance.syncRemove(deleteLocally)
                    .then(this.onsyncRemoveCollectionSuccess(collectionInstance.model))
                    .catch(this.onsyncRemoveCollectionFail(collectionInstance.model));
            }.bind(this);
        };

        DatabaseManager.prototype.syncUpForCollection = function(collection, isSymposia) {
            return function() {
                var collectionInstance = new collection(isSymposia);
                this.updateProgress(collectionInstance.model.description, true);
                return collectionInstance.syncUp()
                    .then(this.onSyncUpCollectionSuccess(collectionInstance.model), null, this.onSyncUpEntityFail(collectionInstance.model));
            }.bind(this);
        };

        DatabaseManager.prototype.logSuccesfullyState = function(isUp, model, records, isDeleted) {
            var direction = isUp ? locale['SyncLogSendAction'] : locale['SyncLogReceiveAction'];
            direction = isDeleted ? locale['deleting'] : direction;
            var message = [
                model.description,
                direction,
                records && records.length ? records.length : 0,
                locale['SyncLogStatusOk']
            ].join(' ');
            return syncLog.appendInfo(message);
        };

        DatabaseManager.prototype.logFailState = function(isUp, model, error, isDeleted) {
            var direction = isUp ? locale['SyncLogSendAction'] : locale['SyncLogReceiveAction'];
            direction = isDeleted ? locale['deleting'] : direction;
            var message = [
                model.description,
                direction,
                locale['SyncLogStatusFail']
            ].join(' ');

            message += '\n' + error.responseText;
            return syncLog.appendError(message);
        };

        DatabaseManager.prototype.onsyncRemoveCollectionSuccess = function(model) {
            return function(records) {
                return this.logSuccesfullyState(false, model, records, true);
            }.bind(this);
        };

        DatabaseManager.prototype.onsyncRemoveCollectionFail = function(model) {
            return function(error) {
                return this.logFailState(false, model, error, true)
                    .then(function() {
                        return error;
                    });
            }.bind(this);
        };

        DatabaseManager.prototype.onSyncDownCollectionSuccess = function(model) {
            return function(records) {
                return this.logSuccesfullyState(false, model, records);
            }.bind(this);
        };

        DatabaseManager.prototype.onSyncUpCollectionSuccess = function(model) {
            return function(records) {

                return this.logSuccesfullyState(true, model, records);
            }.bind(this);
        };

        DatabaseManager.prototype.onSyncDownCollectionFail = function(model) {
            return function(error) {
                return this.logFailState(false, model, error)
                    .then(function() {
                        return error;
                    });
            }.bind(this);
        };

        DatabaseManager.prototype.onSyncUpEntityFail = function(model) {
            return function(error) {
                return this.logFailUploadState(model, error);
            }.bind(this);
        };

        DatabaseManager.prototype.logFailUploadState = function(model, error) {
            this.uploadFailed = true;
            var message = [
                model.description,
                locale['SyncLogUploadEntity'],
                locale['SyncLogStatusFail']
            ].join(' ');
            message += '\n' + error.responseText;
            return syncLog.appendError(message);
        };

        DatabaseManager.TransactionalCollections = [
            deviceCollection,
            dcrCollection,
            notificationCollection,
            notificationReadCollection,
            mtpAppointmentDetails1Collection,
            mtpAppointmentDetails2Collection,
            targetCollection,
            userCollection,
            targetUserCollection,
            greenFlagCollection,
            leaveRequestApprovedUserCollection,
            leaveRequestPendingUserCollection,
            leaveRequestHolidayUserCollection,
            leaveRequestCollection,
            mtpDetailsCollection,
            lastVisitCollection,
            fullDayActivityCollection,
            halfDayActivityCollection,
            jfwOtherRolesCollection,
            divisionwiseCompetitorsCollection,
            dcrBrandActivityCollection,
            mtpCollection,
            dcrJunctionCollection,
            dcrDropCollection,
            divisionwiseBrandCollection,
            materialLotCollection,
            materialTransactionCollection,
            campaignCollection,
            campaignBrandActivityCollection,
            keyMessageCollection,
            dcrKeyMessageCollection,
            dcrFollowupActivityCollection,
            dcrJFWCollection,
            assigmentDetailCollection,
            newCustomerCollection,
            divisionCollection,
            dcrLockingCollection,
            dcrUnlockReasonCollection,
            dcrLockedStatusCollection,
            mtpRemoveConfigCollection,
            activitySelectionCollection,
            brandActivityCollection,
            reporteeJFWCollection,
            patchCollection,
            dcrKpiDataCollection,
            territoryCollection,
            userTerritoryCollection,
            otherExpensesCollection,
            otherExpensesEarningCollection,
            sfcAssignmentCollection,
            sfcMasterCollection,
            sfcFareCollection,
            patchMarketJunctionCollection,
            expenseCollection,
            expenseDetailsCollection,
            expenseSAPCodesCollection,
            dailyAllowanceMasterCollection,
            dailyAllowanceFareCollection,
            attachmentCollection,
            dcrSchedulerSummaryCollection
        ];

        DatabaseManager.prototype.clearTransactionalData = function() {
            // tables to clear for first time
            syncLog.appendInfo('clearing local db-inside clear function');
            return utils.mapConcurrent(DatabaseManager.TransactionalCollections, function(collection) {
                return new collection().removeSoup();
            }).then(function() {
                var message = DatabaseManager.TransactionalCollections.join('\n') + " deleted";
                return syncLog.appendInfo(message);
            });
        };

        return new DatabaseManager;
    }

    abbottApp.service('databaseManager', [
        '$q',
        'popupService',
        'abbottConfigService',
        'abbExchangeService',
        '$timeout',
        'userPreferences',
        '$rootScope',
        'utils',
        'locationService',
        'uploadDataService',
        'sfdcAccount',
        'syncLog',
        'associatedAppCollection',
        'notificationCollection',
        'notificationReadCollection',
        'dcrCollection',
        'mtpAppointmentDetails1Collection',
        'mtpAppointmentDetails2Collection',
        'targetCollection',
        'userCollection',
        'targetUserCollection',
        'greenFlagCollection',
        'leaveRequestApprovedUserCollection',
        'leaveRequestPendingUserCollection',
        'leaveRequestHolidayUserCollection',
        'leaveRequestCollection',
        'mtpDetailsCollection',
        'lastVisitCollection',
        'fullDayActivityCollection',
        'halfDayActivityCollection',
        'jfwOtherRolesCollection',
        'divisionwiseCompetitorsCollection',
        'dcrBrandActivityCollection',
        'mtpCollection',
        'dcrJunctionCollection',
        'dcrDropCollection',
        'divisionwiseBrandCollection',
        'materialLotCollection',
        'materialTransactionCollection',
        'campaignCollection',
        'campaignBrandActivityCollection',
        'keyMessageCollection',
        'dcrKeyMessageCollection',
        'dcrFollowupActivityCollection',
        'dcrJFWCollection',
        'assigmentDetailCollection',
        'newCustomerCollection',
        'divisionCollection',
        'dcrLockingCollection',
        'dcrUnlockReasonCollection',
        'dcrLockedStatusCollection',
        'mtpRemoveConfigCollection',
        'activitySelectionCollection',
        'brandActivityCollection',
        'reporteeJFWCollection',
        'patchCollection',
        'deviceCollection',
        'divisionwiseBrandPresentationCollection',
        'dcrKpiDataCollection',
        'presentationCollection',
        'territoryCollection',
        'userTerritoryCollection',
        'otherExpensesCollection',
        'otherExpensesEarningCollection',
        'sfcAssignmentCollection',
        'sfcMasterCollection',
        'sfcFareCollection',
        'patchMarketJunctionCollection',
        'expenseCollection',
        'expenseDetailsCollection',
        'expenseSAPCodesCollection',
        'dailyAllowanceMasterCollection',
        'dailyAllowanceFareCollection',
        'mobileDeviceInventoryCollection',
        'attachmentCollection',
        'dcrSchedulerSummaryCollection',
        '$cordovaNetwork',
        'loaderManager',
        '$cordovaAppVersion',
        databaseManager
    ]);
})();