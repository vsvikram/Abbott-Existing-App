(function() {
    function abbExchangeService($q, associatedAppCollection) {
        var appData = [],
            getAppList, doProcessing, self = this;

        self.getAppList = function() {
            var deferred = $q.defer();
            if (appData.length) {

                deferred.resolve(appData);
                console.log("Got the data already", appData);
            } else {
                var associatedAppCollectionInstance = new associatedAppCollection();
                associatedAppCollectionInstance.fetchAll().then(associatedAppCollectionInstance.fetchRecursiveFromCursor).then(function(appList) {
                    var data = self.doProcessing(appList);
                    data.then(function(data) {
                        console.log("Data processed",data);
                        deferred.resolve(data);
                    });
                });
            }
            return deferred.promise;
        };

        self.doProcessing = function(appData) {
            var deferred = $q.defer();
            angular.forEach(appData, function(data, key) {
                if (data.Package_Name__c != null) {

                    //To do : Need to implement schema for IOS for checking using the device.platform
                    appData[key].isInstalled = true;
                    document.addEventListener("deviceready", function(){
                        appAvailability.check(
                            data.Package_Name__c,       // URI Scheme or Package Name
                            function() {  // Success callback
                                // is available
                                appData[key].isInstalled = true;
                                if((appData.length - 1) == key){
                                    deferred.resolve(appData);
                                }

                            },
                            function() {  // Error callback
                                appData[key].isInstalled = false;
                                if((appData.length - 1) == key){
                                    deferred.resolve(appData);
                                }
                            }
                        );
                    });


                } else {
                    appData[key].isInstalled = true;
                    console.log('Scheme not available for' + appData[key].Name);
                    if((appData.length - 1) == key){
                        deferred.resolve(appData);

                    }
                }
            });

            return deferred.promise;
        };
    }

    abbottApp.service('abbExchangeService', [
        '$q',
        'associatedAppCollection',
        abbExchangeService
    ]);
})();