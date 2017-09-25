/**
 * publisher service
 */
abbottApp.service('publisher', ['$rootScope', '$log',

    function publisher($rootScope, $log) {
        this.publish = function(message) {
            $rootScope.$emit(message.type, message);
        };
    }
]);
