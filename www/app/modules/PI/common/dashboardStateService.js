abbottApp.service('dashboardStateService', ['$rootScope', 'userDetailService', 'netWorkingService', '$q', '$filter', 'entityCollection', 'SALESFORCE_QUERIES', 'userCollection', 'piDocterCoverageService', function($rootScope, userDetailService, netWorkingService, $q, $filter, entityCollection, SALESFORCE_QUERIES, userCollection, piDocterCoverageService) {

    var entityCollectionInstance = new entityCollection();
    var currentDate = new Date();
    var prevMonth = new Date(currentDate);
    prevMonth.setMonth(currentDate.getMonth() - 1);
    var prev2Month = new Date(currentDate);
    prev2Month.setMonth(currentDate.getMonth() - 2);
    this.previousMonth = $filter('date')(prevMonth, 'MMM').toUpperCase();
    this.compareMonth = $filter('date')(prev2Month, 'MMM').toUpperCase();
    this.overAllBrand = {
        "EBRAND_NAME__c": "OverAll",
        "EBRAND_CD__c": "TOTAL"
    };
    this.selectedBrand = {
        "EBRAND_NAME__c": "OverAll",
        "EBRAND_CD__c": "TOTAL"
    };
    this.rawTrendData = {};
    this.rawBrandData = {};
    this.defaultThreshold = 0;
    this.tileInfo = {
        "SEC_ACH_PRCT__c": {
            label: 'SALES TARGET ACHIEVED',
            stateToGo: '',
            value: 0,
            state: ''
        },
        "PRI_SEC_PRCT__c": {
            label: 'Primary : Secondary',
            stateToGo: '',
            value: 0,
            state: ''
        },
        "DOCTOR_COVERAGE": {
            label: 'DOCTOR COVERAGE',
            stateToGo: 'piHome.doctorCoverage',
            value: 0,
            state: ''
        },
        "SUCCESS_CONCENTRATION": {
            label: 'SUCCESS CONCENTRATION',
            stateToGo: '',
            value: 0,
            state: ''
        },
        "IMS_EI": {
            label: 'IMS EI',
            stateToGo: '',
            value: 0,
            state: ''
        },
        "CLAIMS_PCNT__c": {
            label: 'CLAIMS',
            stateToGo: '',
            value: 0,
            state: ''
        }
    };
    this.setBrandValue = function(brandObj) {
        this.selectedBrand['EBRAND_NAME__c'] = brandObj.EBRAND_NAME__c;
        this.selectedBrand['EBRAND_CD__c'] = brandObj.EBRAND_CD__c;
        $rootScope.$emit("brandUpdated");
    };
    this.getSelectedBrand = function(brandObj) {
        return this.selectedBrand;
    };
    this.getPrevDay = function() {
        var currentDate = new Date();
        var nextDate = currentDate.setDate(currentDate.getDate() - 1);
        return $filter('date')(nextDate, 'd MMM yyyy');
    };

    this.getDocCoveageFilterData = function (userType) {
        var self = this;
        var q = $q.defer();

        var docterCoverage = {
            'ZBM': [{
                Name: '',
                Id: '',
                Description: 'Area 1',
                type: 'ABM'
            },{
                Name: '',
                Id: '',
                Description: 'Area 2',
                type: 'ABM'
            },{
                Name: '',
                Id: '',
                Description: 'Area 3',
                type: 'ABM'
            },{
                Name: '',
                Id: '',
                Description: 'Area 4',
                type: 'ABM'
            },{
                Name: '',
                Id: '',
                Description: 'Area 5',
                type: 'ABM'
            },{
                Name: '',
                Id: '',
                Description: 'Area 6',
                type: 'ABM'
            },{
                Name: '',
                Id: '',
                Description: 'Area 7',
                type: 'ABM'
            }],
            'ABM': [{
                Name: '',
                Id: '',
                Description: 'Territory 1',
                type: 'TBM'
            },{
                Name: '',
                Id: '',
                Description: 'Territory 2',
                type: 'TBM'
            },{
                Name: '',
                Id: '',
                Description: 'Territory 3',
                type: 'TBM'
            },{
                Name: '',
                Id: '',
                Description: 'Territory 4',
                type: 'TBM'
            }],
            'TBM': [{
                Name: '',
                Id: '',
                Description: 'Territory 1'
            }]
        };

        q.resolve(docterCoverage[userType]);

        return q.promise;
        /*userDetailService.getUserInfo().then(function(userDetail) {                    
            var getTragetsQuery = SALESFORCE_QUERIES.SERVER_QUERIES.getPIDocCoverageFilter;
            getTragetsQuery = getTragetsQuery.replace(/\$PARENTTERRITORYID\$/g, userDetail.userTerritoryID);
            entityCollectionInstance.fetchFromSalesforce(getTragetsQuery).then(function(res) {
                if (res != null && res.records.length > 0) {
                    self.rawBrandData = res.records;
                    q.resolve(self.rawBrandData);
                } else {
                    q.resolve(null);
                }
            }, function(error) {
                q.reject(error);
            });
        });
        return q.promise;*/
    };


    this.getBrandFilterData = function() {
        var self = this;
        var q = $q.defer();
        userDetailService.getUserInfo().then(function(userDetail) {
            var getTragetsQuery = SALESFORCE_QUERIES.SERVER_QUERIES.getPIBrandData;
            getTragetsQuery = getTragetsQuery.replace(/\$Z_A_T_ID\$/g, userDetail.userTerritory);
            entityCollectionInstance.fetchFromSalesforce(getTragetsQuery).then(function(res) {
                if (res != null && res.records.length > 0) {
                    self.rawBrandData = res.records;
                    q.resolve(self.rawBrandData);
                } else {
                    q.resolve(null);
                }
            }, function() {
                q.reject(error);
            });
        });
        return q.promise;
    };

    this.modifyStates = function(type) {
        this.areaType = type;
    };

    this.processDashboardData = function(data, dcData) {
        var self = this;
        var q = $q.defer();
        userDetailService.getUserInfo().then(function(userDetail) {
            self.userType = userDetail.Designation__c;
            //self.userType = "ZBM";

            /** Update Tile Value for Docter Coverage  **/
            if(dcData && dcData.dc) {
                self.tileInfo['DOCTOR_COVERAGE'].value = Math.round(dcData.dc.overall);
                self.tileInfo['DOCTOR_COVERAGE'].state = "";  // Todo: Update State
                self.tileInfo['DOCTOR_COVERAGE'].stateToGo = self.getDashTilesUrl(self.userType)['DOCTOR_COVERAGE'];
            }

            /** 
                To filter by brand
                Todo: Unpdate selected brand dynamicaly
            **/
            var brandData = data.filter(function(obj) {
                return (obj.EBRAND_CD__c == self.selectedBrand.EBRAND_CD__c);
            })[0];

            if (self.userType && self.userType == 'TBM') {
                delete self.tileInfo['SUCCESS_CONCENTRATION'];
                delete self.tileInfo['IMS_EI'];
            }

            /** Logic to update dashboard tile **/
            angular.forEach(brandData, function(value, key) {
                /* Logic toupdate Previous month value */
                var actualKey = key;
                var tileMappingKey = key.replace(self.previousMonth + '_', '');
                var compareMonthKey = key.replace(self.previousMonth, self.compareMonth);
                if(key =='Threshold__c'){
                        self.defaultThreshold = value;
                }
                if (self.tileInfo[tileMappingKey]) {
                    self.tileInfo[tileMappingKey].value = Math.round(value);
                    self.tileInfo[tileMappingKey].state = ((parseFloat(brandData[actualKey])) > (parseFloat(brandData[compareMonthKey]))) ? "up" : "down";
                    self.tileInfo[tileMappingKey].stateToGo = self.getDashTilesUrl(self.userType)[tileMappingKey];
                }
            });
            q.resolve(self.tileInfo);
        });
        return q.promise;
    };

    this.getTrendData = function() {
        var self = this;
        var q = $q.defer();
        userDetailService.getUserInfo().then(function(userDetail) {
            var getTragetsQuery = SALESFORCE_QUERIES.SERVER_QUERIES.getPIDashboardData;
            getTragetsQuery = getTragetsQuery.replace(/\$PREVIOUSMONTH\$/g, self.previousMonth);
            getTragetsQuery = getTragetsQuery.replace(/\$COMPAREMONTH\$/g, self.compareMonth);
            getTragetsQuery = getTragetsQuery.replace(/\$BRAND\$/g, self.selectedBrand.EBRAND_CD__c);
            getTragetsQuery = getTragetsQuery.replace(/\$Z_A_T_ID\$/g, userDetail.userTerritory);

            var promisesArr = [entityCollectionInstance.fetchFromSalesforce(getTragetsQuery)];
            $q.all(promisesArr).then(function(data) {
                //var dcData = (data[1] && data[1][0]) ? data[1][0] : {};

                if (data[0] != null && data[0].records.length > 0) {
                    self.rawTrendData = data[0].records;
                    var data = self.processDashboardData(self.rawTrendData);
                    data.then(function(data) {
                        q.resolve(data);
                    });
                } else {
                    q.resolve(null);
                }
            }, function() {
                q.reject(error);
            });
        });
        return q.promise;
    };
    
    this.getDashTilesUrl = function(UserType) {
        var StateUrls = {
            "ZBM": {
                SEC_ACH_PRCT__c: 'piHome.salesTarget.zone',
                PRI_SEC_PRCT__c: 'priSecondary',
                DOCTOR_COVERAGE: 'piHome.doctorCoverage.zone',
                SUCCESS_CONCENTRATION: 'successConcent',
                IMS_EI: 'imsEi',
                CLAIMS_PCNT__c: 'piHome.claims.zone'
            },
            "ABM": {
                SEC_ACH_PRCT__c: 'piHome.salesTarget.area',
                PRI_SEC_PRCT__c: 'priSecondary',
                DOCTOR_COVERAGE: 'piHome.doctorCoverage.area',
                SUCCESS_CONCENTRATION: 'successConcent',
                IMS_EI: 'imsEi',
                CLAIMS_PCNT__c: 'piHome.claims.area'
            },
            "TBM": {
                SEC_ACH_PRCT__c: 'piHome.salesTarget.territory',
                PRI_SEC_PRCT__c: 'priSecondary',
                DOCTOR_COVERAGE: 'piHome.doctorCoverage.territory',
                SUCCESS_CONCENTRATION: 'successConcent',
                IMS_EI: 'imsEi',
                CLAIMS_PCNT__c: 'piHome.claims.territory'
            }
        };
        return StateUrls[UserType]
    }
}]);