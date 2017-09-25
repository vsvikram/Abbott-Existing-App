(function () {
    function queryCursor($q) {
        function mapEntries(response) {
            return response.currentPageOrderedEntries.map(function (entry) {
                return entry.pop();
            });
        }

        function mapCursor(object, response) {
            if (!object.records) {
                object.records = [];
            }
            object.records = object.records.concat(mapEntries(response));
            delete response.currentPageOrderedEntries;
            Object.keys(response).forEach(function (key) {
                object[key] = response[key];
            });
            return object;
        }

        var QueryCursor = function (response) {
            mapCursor(this, response);
        };

        QueryCursor.prototype.store = function () {
            return cordova.require('com.salesforce.plugin.smartstore');
        };

        QueryCursor.prototype.hasMore = function () {
            return this.currentPageIndex < this.totalPages - 1;
        };

        QueryCursor.prototype.getMore = function () {
            var that = this,
              deferred = $q.defer();
            this.store().moveCursorToNextPage(true, this, function (response) {
                mapCursor(that, response);
                deferred.resolve(that);
            }, deferred.reject);
            return deferred.promise;
        };

        QueryCursor.prototype.closeCursor = function () {
            var deferred = $q.defer();
            this.store().closeCursor(true, this, deferred.resolve, deferred.reject);
            return deferred.promise;
        };

        return QueryCursor;
    }

    abbottApp.factory('queryCursor', [
      '$q',
      queryCursor
    ]);
})();