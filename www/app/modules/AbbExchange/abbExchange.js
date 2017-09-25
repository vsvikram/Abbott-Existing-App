abbottApp.controller('appExchangeController', ['$scope', '$rootScope','$state','$timeout','associatedAppCollection','navigationService', 'abbExchangeService','popupService', '$stateParams',  function($scope, $rootScope, $state, $timeout, associatedAppCollection, navigationService, abbExchangeService, popupService, $stateParams) {

    $scope.showSortSettings = false;
    $scope.showFilterSettings = false;
    $scope.sPage = false;
    $scope.fpage = false;
    $scope.show = false;
    $scope.installedCards = [];
    $scope.array = [];
    $scope.filtering = "";
    $scope.appFilter = "None";
    $scope.displayFilter = 'None';
    $scope.appSort = "";
    $scope.starCount = "";
    $scope.halfStarCount = "";
    $scope.halfStarArray = [];
    $scope.fullArray = [];
    $scope.sorting="Latest";

    // Back icon functionality
    $scope.prevFilterScreen = function() {
        $state.reload();
    }

    // Getting the Applist data by calling the abbexchange service
    var appData = abbExchangeService.getAppList();
    $timeout( function(){
        appData.then(function(data) {
            $scope.appCards = data;
        });
    },100);

    //showing the sorting section while clicking on the sort icon
    $scope.sortSettings = function() {
        $scope.showFilterSettings = false;
        $scope.showSortSettings = !$scope.showSortSettings;
        if (window.innerWidth < 980) {
            $scope.sPage = true;
        }
    }

    //showing the filtering section while clicking on the filter icon
    $scope.filterSettings = function() {
        $scope.showSortSettings = false;
        $scope.showFilterSettings = !$scope.showFilterSettings;
        if (window.innerWidth < 980) {
            $scope.fPage = true;
        }
    }

    //showing the submenu while clicking on the dot image in App
    $scope.cardSettings = function(appcard, value) {
        $scope.showKnowMore = true;
        appcard.showSettings = value;
        $scope.sortDot('toggle');

    }
    $scope.sortDot = function(e) {
        $scope.status = e;
    }

    // opening the popup while clicking on the appname and know more link
    $scope.openPopup = function(appcard) {
        $scope.showKnowMore = false;
        appcard.ratingArray = $scope.getNumber(appcard);
        appcard.halfRatingArray = $scope.getHalfRating(appcard);
        appcard.ratedArray = $scope.getCount(appcard);

        //calling the popup service
        popupService.appExchangePopup(appcard);
    }

    $scope.closePopup = function() {
        popupService.closePopup();
    }

    // Functionality for filtering the apps
    $scope.applyFilter = function() {
        $scope.showSortSettings = false;
        $scope.showFilterSettings = !$scope.showFilterSettings;
        if (window.innerWidth < 980) {
            $scope.fPage = false;
        }

        // adding the extra parameter for filter if it is installed apps
        var defaultFilter = ($stateParams.viewState == "installed") ? { isInstalled: true } : {},
            defaultSort = '';

        if ($scope.appFilter == 'myApp') {
            defaultFilter = { isInstalled: true };
        } else if ($scope.appFilter == 'fileSize') {
            defaultSort = 'Filesize__c';
        } else if ($scope.appFilter == 'category') {
            defaultSort = 'Category__c';
        }else if ($scope.appFilter == 'None') {
            defaultSort = 'appDate';
        }
        $scope.filtering = defaultFilter;
        $scope.sort = defaultSort;
    }


    if($stateParams.viewState == 'installed') {
        $scope.filtering = { isInstalled: true };
    } else {
        $scope.filtering = '';
    }
    if($stateParams.appName) {
           $scope.filtering = { Name:$stateParams.appName };
    }

    // Functionality for Sorting the apps
    $scope.applySort = function() {
            $scope.showFilterSettings = false;
            $scope.showSortSettings = !$scope.showSortSettings;
            if (window.innerWidth < 980) {
                $scope.sPage = false;
            }
            // adding the extra parameter for sort if it is installed apps
            var defaultFilter = ($stateParams.viewState == "installed") ? { isInstalled: true } : {},
            defaultSort = '';

            if ($scope.appSort == '') {
                 defaultSort = "-Date__c";
            }
            if ($scope.appSort == 'appDate') {
                defaultSort = "-Date__c";
            } else if ($scope.appSort == "appName") {
                defaultSort = "Name";
            } else if ($scope.appSort == "-appName") {
                defaultSort = "-Name";
            } else if ($scope.appSort == "rating") {
                defaultSort = "-Rating__c";
            }
            else if ($scope.appSort == "recommended") {
                defaultSort = "Priority__c";
            }
            $scope.filtering = defaultFilter;
            $scope.sort = defaultSort;
        }

    $scope.sort = "appDate";

    // sort function for getting the latest apps
    $scope.latest = function() {
        $scope.filtering = '';
        $scope.appSort = "appDate";
        $scope.sorting = "Latest";
    }

    // sort function for getting the apps in ascending order
    $scope.asc = function() {
        $scope.filtering = '';
        $scope.appSort = "appName";
        $scope.sorting = "A-Z";
    }

    // sort function for getting the apps in descending order
    $scope.desc = function() {
        $scope.filtering = '';
        $scope.appSort = "-appName";
        $scope.sorting = "Z-A";
    }

    // sort function for getting the Popular apps
    $scope.popularRating = function() {
        $scope.filtering = '';
        $scope.appSort = "rating";
        $scope.sorting = "Popular";
    }

     // sort function for getting the Recommended apps
    $scope.recommended = function() {
        $scope.filtering = '';
       $scope.appSort = "recommended";
       $scope.sorting = "Recommended";
   }

    // Filter logic
    $scope.sortAcc = function(e) {
       //Close and open for the same click in the filters available
        if($scope.status == e){
            $scope.status = "None";
        }else{
            $scope.status = e;
        }

        $scope.appFilter = $scope.status;

        if ($scope.appFilter == 'myApp') {
            $scope.displayFilter = 'My apps';
        } else if ($scope.appFilter == 'fileSize') {
            $scope.displayFilter = 'File Size';
        } else if ($scope.appFilter == 'category') {
            $scope.displayFilter = 'Category';
        }else if ($scope.appFilter == 'None') {
              //Reset logic
             $scope.displayFilter = 'None';
        }
    }

    // function for hiding the three dots submenu
    $scope.hideSettings = function() {
        var i = 0;
        for (i = 0; i < $scope.appCards.length; i++) {
            if ($scope.appCards[i].showSettings == true)
                $scope.appCards[i].showSettings = false;
        }
        $scope.sortDot('');
    }

    // For displaying filled star ratings
    $scope.getNumber = function(appcard) {
        var x = 0;
        $scope.array = [];

        for (x = 1; x <= appcard.Rating__c; x++) {
            $scope.array.push(x);
        }
        $scope.starCount = $scope.array.length;

        return $scope.array;

    }

     // For displaying half star ratings
        $scope.getHalfRating = function(appcard) {
            $scope.halfStarArray = [];
            var halfRatingCount = appcard.Rating__c % 1;
            if(halfRatingCount != 0)
            {
                    $scope.halfStarArray.push(1);
            }
            $scope.halfStarCount = $scope.halfStarArray.length;

            return $scope.halfStarArray;
        }

    // For displaying empty star ratings
    $scope.getCount = function(appcard) {
        var y = 0;
        var remaining = 5 - ($scope.starCount + $scope.halfStarCount);

        $scope.fullArray = [];
        for (y = 1; y <= remaining; y++) {
            $scope.fullArray.push(y);
        }
        return $scope.fullArray;
    }

    // Configuration for header
    $scope.abwheaderConfig = {
        hambergFlag: true,
        applogoFlag: true,
        syncFlag: true,
        toggleSideMenu: false,
        notifyFlag: true,
        notifyCount: 3,
        searchFlag: false,
        searchHandler: searchHandler
    }

    function searchHandler(searchVal) {
        $scope.searchVal = searchVal;
    }
}]);

// Filter for getting the unique category name
abbottApp.filter('uniquewithkey', function() {
   return function(collection, keyname) {
      var output = [],
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });
      return output;
   };
});
