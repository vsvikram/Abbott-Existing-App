(function () {
    function activitySelectionCollection(utils, entityCollection, activitySelectionModel) {
        var ActivitySelectionCollection = function () {
            this.getActivitySelectionByDate = utils.bind(this.getActivitySelectionByDate, this);
            ActivitySelectionCollection.super.constructor.apply(this, arguments);
        };
        ActivitySelectionCollection = utils.extend(ActivitySelectionCollection, entityCollection);

        ActivitySelectionCollection.prototype.model = activitySelectionModel;

        ActivitySelectionCollection.prototype.getActivitySelectionByDate = function (moment) {
            var query = this._fetchAllQuery().where({
                'Date__c': moment.format('YYYY-MM-DD')
            });
            return this.fetchWithQuery(query).then(this.getEntityFromResponse);
        };

        return ActivitySelectionCollection;
    }


    abbottApp.factory('activitySelectionCollection', ['utils', 'entityCollection', 'activitySelectionModel', activitySelectionCollection]);
})();
