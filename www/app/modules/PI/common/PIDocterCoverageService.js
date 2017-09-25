abbottApp.service('piDocterCoverageService', ['$q', '$filter', 'userDetailService', 'PIService', function($q, $filter, userDetailService, PIService) {
    this.docterCoverage = null;
    this.getData = function() {
        var q = $q.defer();
        var self = this,
            err = "Error @ getDocterCoverageData";

        // if (self.docterCoverage) {
        //     q.resolve(self.docterCoverage);
        // } else {
            userDetailService.getUserInfo().then(function(userDetail) {                
                var invocationData = {}, payLoad, dcBXY, dcLXY, dcCAXY;
                payLoad = {"inputData":{"userid": userDetail.Id, "territory": userDetail.userTerritory}};
                invocationData.url = "/DocCoverageAPI";
                invocationData.method = "POST";
                invocationData.data = payLoad;
                PIService.invoke(invocationData).then(function(sRes) {
                    if(sRes){
                        self.docterCoverage = sRes;
                        q.resolve(sRes);
                    } else {
                        q.reject({error:'No Data'});
                    }
                });
            });
        // }
        return q.promise;
    };
}]);


