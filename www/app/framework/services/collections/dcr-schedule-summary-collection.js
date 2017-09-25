(function() {

    function dcrSchedulerSummaryCollection(utils, Query, entityCollection, dcrSchedulerSummaryModel, $injector, $q, sfdcAccount, $rootScope, userCollection, targetCollection, $filter) {
        var DcrSchedulerSummaryCollection = function() {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            this.uploadEntitiesQuery = utils.bind(this.uploadEntitiesQuery, this);
            this.onUploadingStarted = utils.bind(this.onUploadingStarted, this);
            this.isDcrTodaySubmited = utils.bind(this.isDcrTodaySubmited, this);
            this.isDcrSubmitedByDate = utils.bind(this.isDcrSubmitedByDate, this);
            this.getDcrToday = utils.bind(this.getDcrToday, this);
            this.getDcrByDate = utils.bind(this.getDcrByDate, this);
            this.isExsistDcrActivityAfterDate = utils.bind(this.isExsistDcrActivityAfterDate, this);
            this.getLastSubmitted = utils.bind(this.getLastSubmitted, this);
            this.getSubmittedDCRsFromSFDC = utils.bind(this.getSubmittedDCRsFromSFDC, this);
            this.getDCRsIdsByDate = utils.bind(this.getDCRsIdsByDate, this);
            this.getDcrJunctionsIdsRelatedToDCR = utils.bind(this.getDcrJunctionsIdsRelatedToDCR, this);
            this.removeSavedDCRcDataFromSFDC = utils.bind(this.removeSavedDCRcDataFromSFDC, this);
            this.removeEntitiesRelatedToDCR = utils.bind(this.removeEntitiesRelatedToDCR, this);
            this.removeExistingDCRcData = utils.bind(this.removeExistingDCRcData, this);
            this.filterExistingDCRs = utils.bind(this.filterExistingDCRs, this);
            this.onUploadingFinished = utils.bind(this.onUploadingFinished, this);
            this.getDCRFromSFDCById = utils.bind(this.getDCRFromSFDCById, this);
            this.getRelatedFromSalesforceByDcrId = utils.bind(this.getRelatedFromSalesforceByDcrId, this);
            DcrSchedulerSummaryCollection.super.constructor.apply(this, arguments);
        };
        DcrSchedulerSummaryCollection = utils.extend(DcrSchedulerSummaryCollection, entityCollection);

        DcrSchedulerSummaryCollection.prototype.model = dcrSchedulerSummaryModel;

        DcrSchedulerSummaryCollection.prototype.getSummaryData = function() {
            var currentUser, currentTarget;

            var that = this;
            var userCollectionInstance = new userCollection();

            var targetCollectionInstance = new targetCollection();
            var deferred = $q.defer();
            userCollectionInstance.getActiveUser().then(function(activeUser) {
                currentUser = activeUser;
            }).then(targetCollectionInstance.fetchTarget).then(function(target) {
                currentTarget = target;


                var curr = new Date();
                var currentMonth = curr.getMonth(),
                    currentYear = curr.getFullYear();

                var firstDayOfCurrentMonth = $filter('date')(new Date(currentYear, currentMonth, 1), 'yyyy-MM-dd')
                var lastDayOfCurrentMonth = $filter('date')(new Date(currentYear, currentMonth + 1, 0), 'yyyy-MM-dd')
                var prevMonth = new Date(curr.setMonth(curr.getMonth() - 1)).getMonth();
                var prevYear = new Date(curr.setMonth(curr.getMonth() - 1)).getFullYear();
                var firstDayOfPrevMonth = $filter('date')(new Date(prevYear, prevMonth, 1), 'yyyy-MM-dd');
                var lastDayOfPrevMonth = $filter('date')(new Date(prevYear, prevMonth + 1, 0), 'yyyy-MM-dd');

                var deferredClear = $q.defer();
                that.store().clearSoup(true, that.model.tableSpec.local, deferredClear.resolve, deferredClear.reject);

                deferredClear.promise.then(function() {

                    $q.all([
that.getCurrentCalls(currentMonth, currentYear, currentUser),
that.getCurrentCalls(prevMonth, prevYear, currentUser),
that.getCurrentDoctors(currentMonth, currentYear, currentUser, currentTarget),
that.getCurrentDoctors(prevMonth, prevYear, currentUser, currentTarget),
that.getTotalDoctors(currentMonth, currentYear, currentTarget, lastDayOfCurrentMonth),
that.getTotalDoctors(prevMonth, prevYear, currentTarget, lastDayOfPrevMonth),
that.getDays(currentMonth, currentYear, firstDayOfCurrentMonth, lastDayOfCurrentMonth, currentUser, currentTarget),
that.getDays(prevMonth, prevYear, firstDayOfPrevMonth, lastDayOfPrevMonth, currentUser, currentTarget),
that.getTotalDays(currentMonth, currentYear, firstDayOfCurrentMonth, lastDayOfCurrentMonth, currentUser, currentTarget),
that.getTotalDays(prevMonth, prevYear, firstDayOfPrevMonth, lastDayOfPrevMonth, currentUser, currentTarget)

                    ]).then(function(promises) {
 
                        deferred.resolve('done');
                         
                    }, function(error) {

                        deferred.reject('fail');
                    });

                }, function() {
                    deferred.reject('fail');
                });



            });

            return deferred.promise;
        }

        DcrSchedulerSummaryCollection.prototype.getData = function(Month, Year) {
            var deferred = $q.defer();
            this.fetchAllWhere({
                "Month": Month,
                "Year": Year
            }).then(this.fetchRecursiveFromCursor).then(function(entity) {
                deferred.resolve(entity);
            }, function() {
                deferred.reject;
            });
            return deferred.promise;

        }
        DcrSchedulerSummaryCollection.prototype.getCurrentCalls = function(currentMonth, currentYear, currentUser) {

            var deferred = $q.defer();
            var that = this;

            var query = "SELECT Count(Id) NoofFieldDays , sum(Call_Days__c) calldaysCount ,Sum(Doctor_Count__c) DoctorCallCount,OwnerId userId from DCR__c where (Activity1__r.name = 'Field Work'  or Activity2__r.name = 'Field Work' )  AND CALENDAR_MONTH(Date__c)=" + currentMonth + " AND CALENDAR_YEAR(Date__c)=" + currentYear + " AND OwnerId='" + currentUser.Id + "' AND Status__c = 'Submitted' group By ownerID"
            that.fetchFromSalesforce(query)
                .then(that.fetchRecursiveFromResponse)
                .then(function(response) {
                    if (response != null && response.length > 0) {

                        var entities = [{ Query_Index: 1, Month: currentMonth, Year: currentYear, Field_1: response[0].NoofFieldDays, Field_2: response[0].calldaysCount, Field_3: response[0].DoctorCallCount }];
                        that.store().upsertSoupEntries(true, that.model.tableSpec.local, entities, deferred.resolve, deferred.reject);


                    } else {
                        deferred.reject("no data3");
                    }
                }, function(error) {

                    deferred.reject("no data4");
                });

            return deferred.promise;
        };



        DcrSchedulerSummaryCollection.prototype.getCurrentDoctors = function(currentMonth, currentYear, currentUser, currentTarget) {
            var deferred = $q.defer();
            var that = this;

            var query = "SELECT count_Distinct(Assignment__c) noOfrecords,dcr__r.territory_code__c territory  from DCR_Junction__c where CALENDAR_MONTH(DCR__r.Date__c)=" + currentMonth + " AND Assignment__r.Account__r.RecordType.Name ='Doctor' AND CALENDAR_YEAR(DCR__r.Date__c )=" + currentYear + " AND (DCR__r.territory_code__c ='" + currentTarget.Territory__c + ";' OR DCR__r.territory_code__c ='" + currentTarget.Territory__c + "') AND DCR__r.Status__c ='Submitted' group by DCR__r.territory_code__c"
            that.fetchFromSalesforce(query)
                .then(that.fetchRecursiveFromResponse)
                .then(function(response) {
                    if (response != null && response.length > 0) {

                        var entities = [{ Query_Index: 2, Month: currentMonth, Year: currentYear, Field_1: response[0].noOfrecords }];
                        that.store().upsertSoupEntries(true, that.model.tableSpec.local, entities, deferred.resolve, deferred.reject);


                    } else {
                        deferred.reject("no data5");
                    }
                }, function(error) {

                    deferred.reject("no data6");
                });

            return deferred.promise;

        };

        DcrSchedulerSummaryCollection.prototype.getTotalDoctors = function(currentMonth, currentYear, currentTarget, lastDayOfMonth) {
            var deferred = $q.defer();
            var that = this;

            var query = "select count(Id) noOfrecords,Target__r.Name target from Assignment__c where Target__r.Name='" + currentTarget.Territory__c + "' AND Account__r.RecordType.Name ='Doctor' AND ((Effective_Date__c <=" + lastDayOfMonth + " and Deactivation_Date__c >" + lastDayOfMonth + ") OR (Effective_Date__c <=" + lastDayOfMonth + " AND Deactivation_Date__c = null AND Status__c in ('Active','Submit for deactivation','Approved for Deactivation'))) AND (Frequency__c!=null or Frequency__c != '') group by Target__r.Name"
            that.fetchFromSalesforce(query)
                .then(that.fetchRecursiveFromResponse)
                .then(function(response) {
                    var entities;
                    if (response != null && response.length > 0) {

                        entities = [{ Query_Index: 3, Month: currentMonth, Year: currentYear, Field_1: response[0].noOfrecords }];
                        that.store().upsertSoupEntries(true, that.model.tableSpec.local, entities, deferred.resolve, deferred.reject);


                    } else {
                         entities = [{ Query_Index: 3, Month: currentMonth, Year: currentYear, Field_1: 0 }];
                        that.store().upsertSoupEntries(true, that.model.tableSpec.local, entities, deferred.resolve, deferred.reject);
                    }
                }, function(error) {

                    deferred.reject("no data8");
                });

            return deferred.promise;
        };

        DcrSchedulerSummaryCollection.prototype.getDays = function(currentMonth, currentYear, firstDayOfMonth, lastDayOfMonth, currentUser, currentTarget) {
            var deferred = $q.defer();
            var that = this;

            var query = "select count(id) noOfrecords from mtp__c where target__r.name='" + currentTarget.Territory__c + "' and date__c>= " + firstDayOfMonth + " and date__c<= " + lastDayOfMonth;

            that.fetchFromSalesforce(query)
                .then(that.fetchRecursiveFromResponse)
                .then(function(response) {
                    if (response != null && response.length > 0) {

                        var entities = [{ Query_Index: 4, Month: currentMonth, Year: currentYear, Field_1: response[0].noOfrecords }];
                        that.store().upsertSoupEntries(true, that.model.tableSpec.local, entities, deferred.resolve, deferred.reject);
                    } else {
                        deferred.reject("no data9");
                    }
                }, function(error) {

                    deferred.reject("no data10");
                });

            return deferred.promise;
        };

        DcrSchedulerSummaryCollection.prototype.getTotalDays = function(currentMonth, currentYear, firstDayOfMonth, lastDayOfMonth, currentUser, currentTarget) {
            var deferred = $q.defer();
            var that = this;
            var query = "select count(id) noOfrecords from Leave_Request__c where OwnerId='" + currentUser.Id + "' and From_Date__c>= " + firstDayOfMonth + " and From_Date__c<= " + lastDayOfMonth + " and  Status__c = 'Approved'";

            that.fetchFromSalesforce(query)
                .then(that.fetchRecursiveFromResponse)
                .then(function(response) {
                    if (response != null && response.length > 0) {

                        var entities = [{ Query_Index: 5, Month: currentMonth, Year: currentYear, Field_1: response[0].noOfrecords }];
                        that.store().upsertSoupEntries(true, that.model.tableSpec.local, entities, deferred.resolve, deferred.reject);


                    } else {
                        deferred.reject("no data11");
                    }
                }, function(error) {

                    deferred.reject("no data12");
                });

            return deferred.promise;
        };


        return DcrSchedulerSummaryCollection;
    }

    abbottApp.factory('dcrSchedulerSummaryCollection', ['utils', 'query', 'entityCollection', 'dcrSchedulerSummaryModel', '$injector', '$q', 'sfdcAccount', '$rootScope', 'userCollection', 'targetCollection', '$filter', dcrSchedulerSummaryCollection]);
})();