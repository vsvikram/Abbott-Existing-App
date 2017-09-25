abbottApp.controller('expenseUploadController', ['$stateParams', '$scope', '$rootScope', 'abbottConfigService', 'navigationService', '$filter', 'popupService', 'utils', 'userCollection', 'expenseCollection', 'expenseDetailsCollection', 'divisionCollection', 'attachmentCollection', 'EXPENSE_TYPES',
    function($stateParams, $scope, $rootScope, abbottConfigService, navigationService, $filter, popupService, utils, userCollection, expenseCollection, expenseDetailsCollection, divisionCollection, attachmentCollection, EXPENSE_TYPES) {
        var attachmentCollectionInstance = new attachmentCollection(),
            expenseCollectionInstance = new expenseCollection(),
            expenseDetailsCollectionInstance = new expenseDetailsCollection(),
            divisionCollectionInstance = new divisionCollection();

        $scope.abwheaderConfig = {
            hambergFlag: true,
            applogoFlag: true,
            textFlag: false,
            syncFlag: true,
            toggleSideMenu: false,
            notifyFlag: true,
            notifyCount: 3,
            searchFlag: false,
            searchHandler: searchHandler
        };

        function searchHandler(searchVal) {
            $scope.searchVal = searchVal;
        }

        $scope.locale = abbottConfigService.getLocale();
        $rootScope.mobClaimBool = false;
        $scope.buttonDisabled = true;
        $scope.mobileExpenseAmount = '';
        $scope.mobileExpenseDesc = $scope.locale.MobileExpenses;
        $scope.mobileExpenseRemarks = '';
        $scope.hotelExpenseAmount = '';
        $scope.hotelExpenseDesc = $scope.locale.HotelExpenses;
        $scope.hotelExpenseRemarks = '';
        $scope.mobileExpenseList = [{
            'description': $scope.mobileExpenseDesc,
            'amount': '',
            'remarks': '',
            'Attachment': {
                'Body': ''
            }
        }];
        $scope.hotelExpenseList = [{
            'description': $scope.hotelExpenseDesc,
            'amount': '',
            'remarks': '',
            'Attachment': {
                'Body': ''
            }
        }];

        var reset = function() {
            $scope.locale = abbottConfigService.getLocale();
            $rootScope.mobClaimBool = false;
            $scope.buttonDisabled = true;
            $scope.mobileExpenseAmount = '';
            $scope.mobileExpenseDesc = $scope.locale.MobileExpenses;
            $scope.mobileExpenseRemarks = '';
            $scope.hotelExpenseAmount = '';
            $scope.hotelExpenseDesc = $scope.locale.HotelExpenses;
            $scope.hotelExpenseRemarks = '';
            $scope.mobileExpenseList = [{
                'description': $scope.mobileExpenseDesc,
                'amount': '',
                'remarks': '',
                'Attachment': {
                    'Body': ''
                }
            }];
            $scope.hotelExpenseList = [{
                'description': $scope.hotelExpenseDesc,
                'amount': '',
                'remarks': '',
                'Attachment': {
                    'Body': ''
                }
            }];
        }

        $scope.init = function() {
            window.ga.trackView('ExpenseUpload');
            window.ga.trackTiming('ExpenseUpload Page Load Start Time', 20000, 'ExpenseUploadStart', 'ExpenseUpload Starts');
            $scope.transperantConfig = abbottConfigService.getTransparency();
            $scope.transperantConfig.display = true;
            $scope.transperantConfig.showBusyIndicator = true;
            $scope.transperantConfig.showTransparancy = true;
            abbottConfigService.setTransparency($scope.transperantConfig);
            $scope.locale = abbottConfigService.getLocale();
            reset();
            getUserDetail();
            /* getUserDetail().then(getMobileExpenseUsers).finally(function () {
                $scope.transperantConfig.display = false;
            });*/
            $scope.transperantConfig.display = false;
            window.ga.trackTiming('ExpenseUpload Page Load Finish Time', 20000, 'ExpenseUploadFinish', 'ExpenseUpload Finishes');
        };

        var getUserDetail = function() {
            return new userCollection().getActiveUser().then(function(activeUser) {
                $scope.userDetail = activeUser;
            })
            $scope.userDetail = activeUser;
            if ($scope.userDetail.Expense_Company__c == null) {
                $scope.userDetail.Expense_Company__c = $scope.userDetail.CompanyName;
            }
        };

        var getDivisions = function() {
            return divisionCollectionInstance.fetchAll().then(divisionCollectionInstance.fetchRecursiveFromCursor).then(function(division) {
                return division;
            })
            $scope.divisions = division;
        };

        // Mobile Expense screen not required in Phase 1 dev-- hence commenting the code snippet below
        /*var getMobileExpenseUsers = function () {
                 var tempdivlist = [];
                 if ($scope.userDetail.CompanyName != '' && $scope.userDetail.CompanyName != null && ($scope.userDetail.CompanyName == $scope.locale.AIL_ORGANISATION || $scope.userDetail.CompanyName == $scope.locale.AHPL_ORGANISATION)) {
                     return getDivisions().then(function (division) {
                         angular.forEach(division, function (div) {
                             if (div.Company_Code__c == $scope.locale.AIL_ORGANISATION || div.Company_Code__c == $scope.locale.AHPL_ORGANISATION && div.Mobile_Claim_applicable__c == true) {
                                 tempdivlist.push(div);
                             }
                         })
                         if (angular.isDefined(tempdivlist) && tempdivlist.length != 0) {
                             var tempdesg = [];
                             if (tempdivlist[0].MobileClaimApplicableDesignations__c != '' && tempdivlist[0].MobileClaimApplicableDesignations__c != null) {
                                 tempdesg = tempdivlist[0].MobileClaimApplicableDesignations__c.split(';');
                             }
                         }
                         if (angular.isDefined(tempdesg) && tempdesg.length != 0) {
                             if (tempdesg.length > 0 && $scope.userDetail.Designation__c != '' && $scope.userDetail.Designation__c != null) {

                                 if ($scope.userDetail.Expense_Designation__c != '' && $scope.userDetail.Expense_Designation__c != null) {
                                     angular.forEach(tempdesg, function (temp) {

                                         if (temp == $scope.userDetail.Expense_Designation__c) {
                                             $rootScope.mobClaimBool = true;
                                         }
                                     })
                                 }
                                 else if ($scope.userDetail.Designation__c != '' && $scope.userDetail.Designation__c != null) {
                                     angular.forEach(tempdesg, function (temp) {
                                         if (temp == $scope.userDetail.Expense_Designation__c) {
                                             $rootScope.mobClaimBool = true;
                                         }
                                     })

                                 }
                             }
                         }
                     })
                 }
             };
*/
        var validateExpense = function($event) {
            $scope.errorMessages = [];

            if (!$scope.expenseUpload.$valid) {
                $event.preventDefault();
                angular.forEach($scope.expenseUpload.$error.required, function(errMessage) {
                    if (errMessage.$name == 'hotelAmount')
                        $scope.errorMessages.push($scope.locale.HotelExpenseRequired);
                    else if (errMessage.$name == 'hotelRemarks')
                        $scope.errorMessages.push($scope.locale.HotelRemarksRequired);
                    else if (errMessage.$name == 'hotelreceipt')
                        $scope.errorMessages.push($scope.locale.HotelAttachmentRequired);
                    else
                        $scope.errorMessages.push($scope.locale.ExpenseSubmissionFailed);
                });
                angular.forEach($scope.expenseUpload.$error.maxlength, function(errMessage) {
                    if (errMessage.$name == 'hotelAmount')
                        $scope.errorMessages.push($scope.locale.HotelExpenseMaxlength);
                    else
                        $scope.errorMessages.push($scope.locale.ExpenseSubmissionFailed);
                });
                popupService.openConfirmWithTemplateUrl($scope, 'app/modules/Expense/ErrorMessages.html', '80%', '70%')
                return false;
            } else {
                return true;
            }
        };


        $scope.uploadHotelAttachment = function($event) {
            if (validateExpense($event) && $scope.hotelExpenseList && $scope.hotelExpenseList.length) {
                angular.forEach($scope.hotelExpenseList, function(hotelData) {
                    if (hotelData && hotelData.amount != '' && hotelData.remarks != '' && hotelData.Attachment.Body.length) {
                        var expenseDetailsObj = {};
                        expenseDetailsObj.Expense__c = $rootScope.expenseIdVal;
                        expenseDetailsObj.Expense_Type__c = EXPENSE_TYPES.MISCELLANEOUS;
                        expenseDetailsObj.Misc_Description__c = EXPENSE_TYPES.HOTEL_EXPENSE;
                        expenseDetailsObj.Misc_Amount__c = parseInt(hotelData.amount);
                        expenseDetailsObj.Misc_Detailed_Remarks__c = hotelData.remarks;
                        expenseDetailsObj.ERN_Code__c = $rootScope.ERNCode;
                        console.log(expenseDetailsObj);

                        expenseDetailsCollectionInstance.upsertEntities([expenseDetailsObj]).then(function(response) {
                            if (response[0].Id == undefined) {
                                expenseDetailsObj.Id = response[0]._soupEntryId;
                                expenseDetailsObj._soupEntryId = response[0]._soupEntryId;
                                expenseDetailsCollectionInstance.upsertEntities([expenseDetailsObj]).then(function(response) {
                                    var hotelAttachment = hotelData.Attachment;
                                    var body = hotelAttachment.Body.split('base64,');
                                    hotelAttachment.Body = body[1];
                                    var ext = body[0];
                                    var isImage = ext.indexOf('data:image/') !== -1;
                                    if (ext && isImage)
                                        ext = ext.substring("data:image/".length, ext.indexOf(";"));
                                    else
                                        ext = ext.substring("data:application/".length, ext.indexOf(";"));
                                    hotelAttachment.ParentId = response[0]._soupEntryId;
                                    hotelAttachment.OwnerId = $scope.userDetail.Id;
                                    hotelAttachment.Name = $scope.locale.HOTEL_BILL + $scope.userDetail.Id + ' ' + $rootScope.dcrDate + '.' + ext;
                                    return attachmentCollectionInstance.upsertEntities([hotelAttachment]);
                                }).then(function() {
                                    $rootScope.disablingEdit = true;
                                    $scope.buttonDisabled = true;
                                    $scope.init();
                                    popupService.openPopup($scope.locale.ExpenseSubmittedSuccessfully, $scope.locale.OK, '35%', function() {
                                        popupService.closePopup();
                                        //Mobile expense not included in dev phase 1
                                        /* if($rootScope.mobClaimBool == true)
                                         navigationService.navigate('MobileExpenseUpload');
                                         else */
                                        navigationService.navigate('dcrCalendar');
                                    });
                                });
                            }
                        });
                    }
                });
            }
        };

        $scope.goToLanding = function() {
            navigationService.navigate('LandingPage');
        };

        $scope.closeSFCFares = function() {
            popupService.closePopup();
        };
    }
]);