(function() {
	function campaignBrandActivityCollection(utils, entityCollection, campaignBrandActivityModel) {
		var CampaignBrandActivityCollection = function() {
			this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
			CampaignBrandActivityCollection.super.constructor.apply(this, arguments);
		};
		CampaignBrandActivityCollection = utils.extend(CampaignBrandActivityCollection, entityCollection);

		CampaignBrandActivityCollection.prototype.model = campaignBrandActivityModel;

		CampaignBrandActivityCollection.prototype.prepareServerConfig = function(configPromise) {
			return configPromise.then(function(config) {
				config += " WHERE Status__c = 'Approved'";
				config += " AND Applicable_Brands__c != null";
				return config;
			});
		};

		return CampaignBrandActivityCollection;
	}


	abbottApp.factory('campaignBrandActivityCollection', ['utils', 'entityCollection', 'campaignBrandActivityModel', campaignBrandActivityCollection]);
})(); 