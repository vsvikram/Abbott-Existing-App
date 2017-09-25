abbottApp.controller('missedDoctorCallDetailsController', ['fullDayActivityCollection', 'entityCollection','userCollection', 'missedDoctorCallService', 'targetCollection', 'divisionCollection', '$scope', '$rootScope','$stateParams', '$filter','abbottConfigService', '$q', 'popupService', 'SALESFORCE_QUERIES',
function(fullDayActivityCollection, entityCollection,userCollection, missedDoctorCallService, targetCollection,divisionCollection,$scope, $rootScope, $stateParams, $filter, abbottConfigService, $q, popupService, SALESFORCE_QUERIES) {

   // Title text Configuration
    	$scope.config = {
                left: {
                    text: "Missed Doctors"
                },
                right: {
                    text: ""
                }
    };

    // Getting the list of missed doctor call details
    $scope.missedDoctorDetails = missedDoctorCallService.getDocList();

    // Header Configuration
    $scope.abwheaderConfig = {
                hambergFlag: true,
                applogoFlag: true,
                textFlag  : false,
                syncFlag: true,
                toggleSideMenu: false,
                notifyFlag: true,
                notifyCount: 3,
                searchFlag: false,
                searchHandler : searchHandler
        };

    function searchHandler(searchVal) {
            $scope.searchVal = searchVal;
    };

}]);