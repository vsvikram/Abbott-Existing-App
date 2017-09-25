abbottApp.directive('navigationPanel', ['$rootScope', '$state', 'navigationService', 'abbottConfigService', 'menuStatus', '$timeout', 'popupService', 'databaseManager', 'dcrLockedStatusCollection', '$cordovaInAppBrowser', 'sfdcAccount',
function ($rootScope, $state, navigationService, abbottConfigService, menuStatus, $timeout, popupService, databaseManager, DcrLockedStatusCollection, $cordovaInAppBrowser, sfdcAccount) {

    var linker = function (scope, elem, attrs) {

        scope.getLocale = function () {
            return abbottConfigService.getLocale();
        };

        scope.getOptions = function () {
            return [{
                icon: 'menuHomeIcon',
                iconSelected: 'menuHomeIconSelected',
                title: 'Home',
                state: 'home',
                selected: true,
                disabled: false, 
                order: 1 
            }, {
                icon: 'menuMTPIcon',
                iconSelected: 'menuMTPIconSelected',
                title: 'My Monthly Plan',
                state: 'MTPList',
                selected: false,
                disabled: $rootScope.disableMTPAndDCRUsingViewPort || $rootScope.LastSyncFail,
                order: 2
            }, {
                icon: 'menuDCRIcon',
                iconSelected: 'menuDCRIconSelected',
                title: 'My DCR',
                state: 'dcrCalendar',
                selected: false,
                disabled: $rootScope.disableMTPAndDCRUsingViewPort || $rootScope.LastSyncFail,
                order: 3
            }, {
                icon: 'showPresentations',
                iconSelected: 'showPresentationsSelected',
                title: 'Media',
                state: 'media',
                selected: false,
                disabled: !$rootScope.clmEnabled,
                order: 4
            }, {
                icon: 'menuMyLeaveIcon',
                iconSelected: 'menuMyLeaveIconSelected',
                title: 'My Leave',
                state: 'leave',
                selected: false,
                disabled: false,
                order: 5
            }, {
                icon: 'menuHelpdeskIcon',
                iconSelected: 'menuHelpdeskIconSelected',
                title: 'Helpdesk',
                state: 'helpdeskCreate',
                selected: false,
                disabled: false,
                order: 6
            }];
        };

        scope.options = scope.getOptions();

        scope.navigateToSegment = function (url) {
            $timeout(function () {
                scope.status = false;
                if (url == 'leave') {
                    var options = {
                        location: 'no',
                        toolbar: 'no'
                    };
                    var loginUrl = sfdcAccount.getSfdcClient().loginUrl;
                    var isProd = loginUrl != null && loginUrl.indexOf('test') == -1;
                    var leaveUrl = isProd ? 'https://abbworld--c.ap4.visual.force.com/apex/leaveHome' : 'https://abbworld--ailtesting--c.cs31.visual.force.com/apex/leaveHome';
                    $cordovaInAppBrowser.open(leaveUrl, '_blank', options);
                } else {
                    navigationService.navigate(url, null, true);
                }
            }, 100);
        };
        scope.toggleMenu = function () {
            menuStatus.setMenuStatus(false);
            scope.status = menuStatus.getMenuStatus();
        };
        scope.manualMasterSync = function () {
            var shouldCheckDcrLockedStatus = ['MTPList', 'dcrActivitySelection', 'dcrCreate'].some(function (stateName) {
                return $state.current.name === stateName;
            });
            scope.toggleMenu();
            databaseManager.runSync($rootScope.LastSyncFail,$rootScope.userType);
            shouldCheckDcrLockedStatus && subscribeOnDatabaseAvailable();
        };

        function subscribeOnDatabaseAvailable() {
            var subscription = $rootScope.$on('databaseAvailable', function () {
                scope.options = scope.getOptions();
                new DcrLockedStatusCollection().getDcrLockedStatus().then(function (lockedStatus) {
                    var isLockedUser = lockedStatus && ["Locked", "Requested For Unlock"].some(function (status) {
                        return lockedStatus.Status__c === status;
                    });

                    isLockedUser && $state.go('home');
                    subscription();
                });
            });
        }


        scope.onSelection = function (aIndex) {
            angular.forEach(scope.options, function (value, index) {
                if (index == aIndex) {
                    value.selected = true;
                } else {
                    value.selected = false;
                }

            });
        };
    };
    return {
        restrict: 'E',
        scope: {
            status: '='
        },
        link: linker,
        templateUrl: 'app/framework/components/sideMenu/sideMenu.html'
    };
}]);
