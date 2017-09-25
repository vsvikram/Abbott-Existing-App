/**
 * $stateProvider configuration
 */

abbottApp.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/home');

	$stateProvider.state('home', {
		url : '/home',
		templateUrl : 'app/modules/Home/homeNew.html',
		controller : 'HomeController'
	}).state('abbExchange', {
      		url : '/abbExchange/:viewState/:appName',
      		templateUrl : 'app/modules/AbbExchange/abbExchange.html',
      		controller : 'appExchangeController'
    }).state('MTPList', {
		url : '/mtpList',
		params : {
			date : null
		},
		templateUrl : 'app/modules/MTP/MTPList.html',
		controller : 'MTPListController'
	}).state('LandingPage', {
        url : '/LandingPage',
        templateUrl : 'app/modules/LandingPage/LandingPage.html',
        controller : 'LandingPage'
    }).state('media', {
		url : '/media',
		templateUrl : 'app/modules/Media/views/media.html',
		controller : 'mediaController as media'
	}).state('helpdeskLanding', {
		url : '/helpdeskLanding',
		templateUrl : 'app/modules/Helpdesk/HelpdeskLanding.html',
		controller : 'HelpdeskLandingController'
	}).state('helpdeskCreate', {
		url : '/helpdeskCreate',
		parent : 'helpdeskLanding',
		templateUrl : 'app/modules/Helpdesk/HelpdeskCreate.html',
		controller : 'HelpdeskCreateController'
	}).state('dcrCalendar', {
		url : '/dcrCalendar',
		templateUrl : 'app/modules/DCR/DCRCalendar.html',
		controller : 'DCRCalendarController'
	}).state('dcrActivitySelection', {
		url : '/dcrActivitySelection',
		params : {
			dateDCR : null
		},
		templateUrl : 'app/modules/DCR/DCRActivitySelection.html',
		controller : 'DCRActivitySelectionController'
	}).state('dcrList', {
        url : '/dcrList',
        templateUrl : 'app/modules/DCR/DCRList.html',
        controller : 'DCRListController'
    }).state('DCRcreateDoctorChemistStockists', {
        url : '/DCRcreateDoctorChemistStockists',
        templateUrl : 'app/modules/DCR/DCRcreateDoctorChemistStockists.html',
        controller : 'DCRCreateController'
    }).state('dcrCreateActivity', {
        url : '/dcrCreateActivity',
        params: {
            dcrActiviyIndex : null
        },
        templateUrl : 'app/modules/DCR/DCRCreateActivity.html',
        controller : 'DCRCreateController'
    }).state('dcrSummary', {
        url : '/dcrSummary',
        templateUrl : 'app/modules/DCR/DCRSummary.html',
        controller : 'DCRCreateController'
    }).state('dcrEnterCallDetails', {
		url : '/dcrEnterCallDetails',
		params : {
			customerType : null,
			selectedDate : null,
			customerIndex:null
		},
	 
		templateUrl : 'app/modules/DCR/DCREnterCallDetails.html',
		controller : 'DCREnterCallDetailsController'
	}).state('dcrCreateOthersLanding', {
		url : '/dcrLanding/dcrCreateOthersLanding',
		templateUrl : 'app/modules/DCR/DCRCreateOthersLanding.html',
		controller : 'DCRCreateOthersLandingController'
	}).state('dcrCreateOthers', {
		url : '/dcrCreateOthers',
		parent : 'dcrCreateOthersLanding',
		templateUrl : 'app/modules/DCR/DCRCreateOthers.html',
		controller : 'DCRCreateOthersController'
	}).state('addDoc', {
		url : '/addDoc',
		params : {
			selectedTab : null,
			selectedDate : null
		},
		templateUrl : 'app/modules/DocByPatch/AddDoc.html',
		controller : 'AddDocController'
	}).state('dcrAddDoc', {
            		url : '/dcrAddDoc',
            		params : {
                      selectedTab : null,
                      selectedDate : null
                  },
            		templateUrl : 'app/modules/DocByPatch/dcrAddDoc.html',
            		controller : 'AddDocController'
     }).state('SFE', {
		url : '/SFE',
		params : {
			selectedTab : null,
			selectedDate : null
		},
		templateUrl : 'app/modules/SFE/SFEHome.html',
		controller : 'SFEHomeController'
	}).state('performanceMatrix', {
		url : '/SFE/performanceMatrix',
		params : {
			selectedTab : null,
			selectedDate : null
		},
		templateUrl : 'app/modules/SFE/performanceMatrics.html',
		controller : 'performanceMatricsController'
	}).state('doctorCallMatrix', {
		url : '/SFE/doctorCallMatrix',
		params : {
			selectedTab : null,
			selectedDate : null
		},
		templateUrl : 'app/modules/SFE/doctorCallMatrics.html',
		controller : 'doctorCallMatricsController'
	}).state('missedDoctorCallDetails', {
      		url : '/SFE/missedDoctorCallDetails',
      		templateUrl : 'app/modules/SFE/missedDoctorCallDetails.html',
      		controller : 'missedDoctorCallDetailsController'
     }).state('incentiveMatrix', {
		url : '/SFE/incentiveMatrix',
		params : {
			selectedTab : null,
			selectedDate : null
		},
		templateUrl : 'app/modules/SFE/incentiveMatrics.html',
		controller : 'incentiveMatricsController'
	}).state('salesMatrix', {
		url : '/SFE/salesMatrix',
		params : {
			selectedTab : null,
			selectedDate : null
		},
		templateUrl : 'app/modules/SFE/salesMatrics.html',
		controller : 'salesMatricsController'
	}).state('incentiveCalculator', {
		url : '/SFE/incentiveCalculator',
		params : {
			userid : null,
			username : null
		},
		templateUrl : 'app/modules/SFE/incentiveCalculator.html',
		controller : 'incentiveCalculatorController'
	}).state('ViewExpense', {
      		url : '/ViewExpense',
      		params : {
      			date : null
      		},
      		templateUrl : 'app/modules/Expense/ViewExpense.html',
      		controller : 'viewExpenseController'
    }).state('Expense', {
		url : '/Expense',
		params : {
			date : null
		},
		templateUrl : 'app/modules/Expense/FileExpense.html',
		controller : 'fileExpenseController'
	}).state('ExpenseUpload', {
          url : '/ExpenseUpload',
          params : {
              date : null
          },
          templateUrl : 'app/modules/Expense/ExpenseUpload.html',
          controller : 'expenseUploadController'
     }).state('leave', {
        url : '/leave/home',
        templateUrl : 'app/modules/Leave/LeaveHome.html',
        controller : 'leaveHomeController'
    }).state('leaveSummary', {
        url : '/leave/leaveSummary',
        templateUrl : 'app/modules/Leave/leaveSummary.html',
        controller : 'leaveSummaryController'
    }).state('applyLeave', {
        url : '/leave/applyLeave',
        params : {
            selectedGroup : null
        },
        templateUrl : 'app/modules/Leave/applyLeave.html',
        controller : 'applyLeaveController'
    }).state('organizationalLeave', {
        url : '/leave/organizationalLeave',
        templateUrl : 'app/modules/Leave/organizationalLeave.html',
        controller : 'organizationalLeaveController'
    }).state('leavePolicy', {
        url : '/leave/leavePolicy',
        templateUrl : 'app/modules/Leave/leavePolicy.html',
        controller : 'leavePolicyController'
    }).state('leaveDetails', {
        url : '/leave/leaveDetails',
        params : {
            selectedGroup : null
        },
        templateUrl : 'app/modules/Leave/leaveDetails.html',
        controller : 'leaveDetailsController'
    })


	/* ##### PI Module Starts Here ###### */
    .state('piHome', {
        url: '/piHome',
        templateUrl: 'app/modules/PI/piHome/piHome.html',
        controller:'piHomeController'
    })
    .state('piHome.piDashboard', {
        url: '/piHome/piDashboard',
        templateUrl: 'app/modules/PI/piDashboard/piDashboard.html',
        controller:'piDashboardController'
    })
    .state('piHome.filter', {
        url: '/piHome/filter',
        templateUrl: 'app/frameworks/components/PIFilter/filter.html',
        controller:'filterController'
    })
    .state('piHome.salesTarget', {
        url: '/salesTarget',
        templateUrl: 'app/modules/PI/salesTarget/sales.html',
        controller:'salesController'         
    })
    /*Zone, Area and Territory States*/
    .state('piHome.salesTarget.zone', {
        url: '/piHome/salesTarget/zone/:object',
        templateUrl: 'app/modules/PI/salesTarget/zone/zone.html',
        controller:'salesZoneController'         
    })
    .state('piHome.salesTarget.area', {
        url: '/piHome/salesTarget/area/:object',
        templateUrl: 'app/modules/PI/salesTarget/area/area.html',
        controller:'salesAreaController'         
    })
    .state('piHome.salesTarget.territory', {
        url: '/piHome/salesTarget/territory/:object',
        templateUrl: 'app/modules/PI/salesTarget/territory/territory.html',
        controller:'salesTrrController'         
    })
    .state('piHome.priSecondary', {
        url: '/piHome/priSecondary',
        templateUrl: 'app/modules/PI/priSecondary/priSecondary.html',
        controller:'priSecondaryController'         
    })
    // .state('piHome.doctorCoverage', {
    //     url: '/piHome/doctorCoverage',
    //     templateUrl: 'app/modules/PI/doctorCoverage/doc.html',
    //     controller:'docController'         
    // })
    /*Docter Coverage:  Zone, Area and Territory States*/
    .state('piHome.doctorCoverage', {
        url: '/piHome/doctorCoverage',
        templateUrl: 'app/modules/PI/doctorCoverage/doc.html',
        controller:'docCoverageCtrl'
    })
    .state('piHome.doctorCoverage.zone', {
        url: '/piHome/doctorCoverage/zone/:object',
        templateUrl: 'app/modules/PI/doctorCoverage/zone/zone.html',
        controller:'docCoverageZoneCtrl'
    })
    .state('piHome.doctorCoverage.area', {
        url: '/piHome/doctorCoverage/area/:object',
        templateUrl: 'app/modules/PI/doctorCoverage/area/area.html',
        controller:'docCoverageAreaCtrl'
    })
    .state('piHome.doctorCoverage.territory', {
        url: '/piHome/doctorCoverage/territory/:object',
        templateUrl: 'app/modules/PI/doctorCoverage/territory/territory.html',
        controller:'docCoverageTerritoryCtrl'
    })        
    .state('piHome.successConcent', {
        url: '/piHome/successConcent',
        templateUrl: 'app/modules/PI/successConcent/successConcent.html',
        controller:'successConcentController'         
    })
    .state('piHome.imsEi', {
        url: '/piHome/imsEi',
        templateUrl: 'app/modules/PI/imsEi/imsEi.html',
        controller:'imsEiController'         
    })
    .state('piHome.claims', {
        url: '/piHome/claims',
        templateUrl: 'app/modules/PI/claims/claims.html',
        controller:'claimsController'         
    })
    .state('piHome.claims.zone', {
        url: '/piHome/claims/zone/:object',
        templateUrl: 'app/modules/PI/claims/zone/zone.html',
        controller:'claimsZoneController'         
    })
    .state('piHome.claims.area', {
        url: '/piHome/claims/area/:object',
        templateUrl: 'app/modules/PI/claims/area/area.html',
        controller:'claimsAreaController'         
    })
    .state('piHome.claims.territory', {
        url: '/piHome/claims/territory/:object',
        templateUrl: 'app/modules/PI/claims/claimsTerritory/claimsTerritory.html',
        controller:'claimsTerritoryCtrl'         
    });
    /* ##### PI Module Ends Here ###### */
});

abbottApp.config(['ngDialogProvider',
function(ngDialogProvider) {
	ngDialogProvider.setDefaults({
		className : 'ngdialog-theme-default',
		plain : false,
		showClose : false
	});
}]); 
