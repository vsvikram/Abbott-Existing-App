(function() {
	function attachmentModel(utils, entityModel) {
		var AttachmentModel = function() {
			AttachmentModel.super.constructor.apply(this, arguments);
		};

		AttachmentModel = utils.extend(AttachmentModel, entityModel);

		AttachmentModel.description = 'Attachment';
		AttachmentModel.tableSpec = {
			sfdc : 'Attachment',
			local : 'Attachment'
		};

		AttachmentModel.fieldsSpec = [
			{sfdc : 'Id', indexWithType : 'string'},
			{sfdc : 'Body',upload : true},
			{sfdc : 'BodyLength'},
			{sfdc : 'ContentType',upload:true},
			{sfdc : 'Description'},
			{sfdc : 'IsDeleted'},
			{sfdc : 'IsPartnerShared'},
			{sfdc : 'IsPrivate'},
			{sfdc : 'Name',upload : true},
			{sfdc : 'OwnerId',upload : true},
			{sfdc : 'ParentId',upload : true, indexWithType : 'string'}
		];

		AttachmentModel.mapModel();
		return AttachmentModel;
	}


	abbottApp.factory('attachmentModel', ['utils', 'entityModel', attachmentModel]);
})();
