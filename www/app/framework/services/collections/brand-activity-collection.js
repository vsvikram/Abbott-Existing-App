(function () {
    function brandActivityCollection(utils, entityCollection, brandActivityModel) {
        var BrandActivityCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            BrandActivityCollection.super.constructor.apply(this, arguments);
        };
        BrandActivityCollection = utils.extend(BrandActivityCollection, entityCollection);

        BrandActivityCollection.prototype.model = brandActivityModel;

        BrandActivityCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise.then(function (config) {
                config += " WHERE Campaign__r.Status__c = 'Approved'";
                config += " AND Campaign__r.Applicable_Brands__c != null";
                return config;
            });
        };

        return BrandActivityCollection;
    }


    abbottApp.factory('brandActivityCollection', ['utils', 'entityCollection', 'brandActivityModel', brandActivityCollection]);
})();