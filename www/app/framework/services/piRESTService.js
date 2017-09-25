/**
 * Client service
 * Wrap Angular service invocation.
 * Two reasons:
 *    a) Enable injection so that clients can be tested outside client runtime
 *    b) Use Deferred/Promise API
 */
abbottApp.factory('PIService', ['sfdcAccount', '$q', '$log',
    /**
     * Standard invocation arguments except that onSuccess and onFailure must not be specified, instead use the returned
     * promise.
     */
    function PIClientService(sfdcAccount, $q, $log) {
        // interface
        var registry = {
            response: [],
            invoke: invoke,
            status: status,
            invocationData: {},
            setInvocationData: setInvocationData
        };
        return registry;
        // implementation
        function reset() {
            registry.response.length = 0;
        };

        function clearData() {
            registry.invocationData = {};
        }

        function invoke(invocationData) {
            var invocationData = (invocationData !== null && invocationData !== undefined) ? invocationData : registry.invocationData;
            var deferred = $q.defer();

            var onSuccess = function(data, status, headers, config) {
                console.log(data);
                console.log(status);
                console.log();
                console.log();
            };
            var onFailure = function(data, status, headers, config) {
            };
            sfdcAccount.getSfdcClient().apexrest(invocationData.url, invocationData.method, JSON.stringify(invocationData.data), {}, onSuccess, onFailure);
            //$http(invocationData).success(onSuccess).error(onFailure);

        };

        function setInvocationData(method, url, data) {
            registry.invocationData.method = method;
            registry.invocationData.url = url;
            registry.invocationData.data = data;
        };
    }
]);