(function () {
    function campaignCollection(utils, entityCollection, campaignModel) {
        var CampaignCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            CampaignCollection.super.constructor.apply(this, arguments);
        };
        CampaignCollection = utils.extend(CampaignCollection, entityCollection);

        CampaignCollection.prototype.model = campaignModel;

        CampaignCollection.prototype.prepareServerConfig = function (configPromise) {
            return configPromise.then(function (config) {
                config += " WHERE Status__c = 'Approved'";
                config += " AND Applicable_Brands__c = null";
                return config;
            });
        };

        return CampaignCollection;
    }


    abbottApp.factory('campaignCollection', ['utils', 'entityCollection', 'campaignModel', campaignCollection]);
})();