abbottApp.run(['$rootScope', '$window', 'abbottConfigService', 'LANGUAGES', 'navigationService', 'publisher', 'popupService', 'databaseManager', 'sfdcAccount', 'userPreferences', 'userCollection', 'deviceCollection','divisionCollection', 'spinner', '$cordovaDevice', 'locationService', '$cordovaSplashscreen','$document',
function ($rootScope, $window, abbottConfigService, LANGUAGES, navigationService, publisher, popupService, databaseManager, sfdcAccount, userPreferences, userCollection, deviceCollection, divisionCollection, spinner, $cordovaDevice, locationService, $cordovaSplashscreen, $document) {
    $rootScope.pixelRadio = $window.devicePixelRatio;
    abbottConfigService.setLocale(LANGUAGES.ENGLISH);
    $rootScope.loggedUserName = abbottConfigService.getLocale().Unknown;

    var locale = abbottConfigService.getLocale();

    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
    document.addEventListener("resume", onResume, false);

    document.addEventListener("pause", onPause, false);
    window.addEventListener('native.keyboardhide', keyboardHideHandler);
    window.addEventListener('native.keyboardshow', keyboardShowHandler);

    function keyboardHideHandler() {
        publisher.publish({
            type: "keyboardHide"
        });
    }

    function keyboardShowHandler(e) {
        publisher.publish({
            type: "keyboardShow",
            keyboardHeight: e.keyboardHeight
        });
    }

    function onResume() {
        //locationService.trackLocation();
    }

    function onPause() {
        //locationService.stopTrackLocation();
    }

    function onBackKeyDown() {
        $rootScope.$apply(function () {
            navigationService.backFunc();
        });
    }

    function onDeviceReady() {
        window.ga.startTrackerWithId('GTM-K6FMZ9G');
        window.ga.debugMode();

        $rootScope.$apply(function () {
            $rootScope.platform = $cordovaDevice.getPlatform();
            if ($rootScope.platform === "iOS") {
                cordova.plugins.Keyboard.automaticScrollToTopOnHiding = true;
            }
        });

        $rootScope.transparentConfig = abbottConfigService.getTransparency();
        spinner.show();
        abbottConfigService.setTransparency($rootScope.transparentConfig);
        $cordovaSplashscreen.hide();

        cordova.require("com.salesforce.plugin.oauth").getAuthCredentials(function (credentials) {
            sfdcAccount.handleRefreshSession(credentials)
                showDisclaimer(function (run) {
                 setup(run);
                });
        }, function () {
            popupService.openPopup("Problem connecting to salesforce", "Ok", '35%');
        });
        AndroidFullScreen.immersiveMode(function () {
            console.log('immersive mode is on.');
        }, function () {
            console.log('immersive mode is off.');
        });
    }

    $rootScope.$on('databaseAvailable', prefetchData);

    $rootScope.$on('databaseAvailable', prefetchdivision);

    function setup(run) {
        databaseManager.initDatabase().then(function () {
            $rootScope.databaseInited = true;
            console.log("database inited " + new Date());
            spinner.show(locale.gettingUserInfo);
            sfdcAccount.getCurrentUserId().then(function (currentUserId) {
                userPreferences.getPreferences().then(function (preferences) {
                    if (!preferences.LastLoggedUserId || run) {
                        console.log("sync started " + new Date());
                        new deviceCollection().getCurrentDevice().then(function(device) {
                           var syncTime = device.Last_Syncronization__c;
                           var lastLoginTime = syncTime ? new Date(syncTime) : null;
                           if(lastLoginTime)
                            $rootScope.lastLoginTime = lastLoginTime.getDate()  + "/" + (lastLoginTime.getMonth()+1) + "/" + lastLoginTime.getFullYear() ;

                           var today = new Date();
                           var dateString = today.getDate()  + "/" + (today.getMonth()+1) + "/" + today.getFullYear() ;
                           console.log($rootScope.lastLoginTime);
                           console.log(dateString);
                           if($rootScope.lastLoginTime === dateString)
                                databaseManager.runSync(false, $rootScope.userType);
                           else
                                databaseManager.runSync(true, $rootScope.userType);
                            });
                    } else {
                        //locationService.trackLocation();
                        if (!preferences.Is_Last_Sync_Completed && currentUserId == preferences.LastLoggedUserId) {
                            var locale = abbottConfigService.getLocale();
                            popupService.openPopup(locale.LastSyncFailure, locale.OK, '35%');
                        }
                    }
                    spinner.hide();
                });
                window.ga.setUserId(currentUserId);
                cordova.getAppVersion.getVersionNumber(function (version) {
                    window.ga.setAppVersion(version);
                });

            });
        });
    }


            $document.find('body').on('mousemove keydown DOMMouseScroll mousewheel mousedown touchstart', detectIdle);

            $rootScope.$watch(detectIdle);

            function detectIdle() {
             if(angular.isDefined(localStorage.getItem('logInStart')) &&  localStorage.getItem('logInStart') !== null){
                var loginTime = localStorage.getItem('logInStart');
                var absLoginTime = new Date(loginTime);
                var now = new Date();
                var timeDiff = Math.abs(now.getTime() - absLoginTime.getTime());
                if (timeDiff >= 12*3600*1000) {//change this timer to 12 hrs
                    //place the existing logoff code here
                        var userCollectionInstance = new userCollection();
                        userCollectionInstance.getActiveUser().then(function (activeUser) {
                        if (activeUser.Mobile_Login__c == true) {
                         localStorage.removeItem('logInStart');
                         localStorage.removeItem('isLoggedIn');
                         sfdcAccount.logout();
                        }
                        })
                }
                }
            }

    function prefetchData() {
         setTimeout(function () {
            var userCollectionInstance = new userCollection();
            userCollectionInstance.getActiveUser().then(function (activeUser) {
                if (activeUser) {
                    $rootScope.loggedUserDesignation = activeUser.Designation__c;
                    $rootScope.loggedUserName = activeUser.Name;
                }
            });
        }, 500);
    }

    function prefetchdivision() {
             setTimeout(function () {
                var userDivisionInstance = new divisionCollection();
                userDivisionInstance.getDivision().then(function (userDivision) {
                    if (userDivision) {
                        $rootScope.division = userDivision.Division_Name__c;
                    }
                });
            }, 500);
     }

    function showDisclaimer(callback) {
        console.log("Disclaimer shown " + new Date());
        var isFirstTime = localStorage.getItem("disclaimerShown") !== "true";
        if(!(angular.isDefined(localStorage.getItem('logInStart'))) ||  localStorage.getItem('logInStart') == null){
         var d = new Date();
         localStorage.setItem('logInStart', d);
         $rootScope.userLogIn = localStorage.getItem('loginStart');
         }
        var isLoggedIn = localStorage.getItem('isLoggedIn');
        localStorage.setItem("isLoggedIn", true);
        console.log(isLoggedIn);
        if (isFirstTime) {
            popupService.openDisclaimer(locale.disclaimer, locale.decline, locale.signin, function () { }, function () {
                localStorage.setItem("disclaimerShown", true);
                localStorage.setItem("dataCleared15", true);
                databaseManager.clearTransactionalData().then(setTimeout(callback(true), 0));
            });
        } else if (localStorage.getItem("dataCleared15") != "true") {
            databaseManager.clearTransactionalData().then(setTimeout(callback(true), 0));
            localStorage.setItem("dataCleared15", true);
        }
        else if(isLoggedIn == "true"){
        console.log(typeof(isLoggedIn));
        console.log(isLoggedIn);
           callback();
       }
       else {
        console.log(typeof(isLoggedIn));
        console.log(isLoggedIn);
        callback(true);
        }

    }

}]);
