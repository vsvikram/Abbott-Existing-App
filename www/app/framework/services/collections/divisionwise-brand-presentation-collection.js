(function () {
    function divisionwiseBrandPresentationCollection(utils, entityCollection, divisionwiseBrandPresentationModel, userCollection) {
        var DivisionwiseBrandPresentationCollection = function () {
            this.prepareServerConfig = utils.bind(this.prepareServerConfig, this);
            DivisionwiseBrandPresentationCollection.super.constructor.apply(this, arguments);
        };
        DivisionwiseBrandPresentationCollection = utils.extend(DivisionwiseBrandPresentationCollection, entityCollection);

        DivisionwiseBrandPresentationCollection.prototype.model = divisionwiseBrandPresentationModel;

        return DivisionwiseBrandPresentationCollection;
    }

    abbottApp.factory('divisionwiseBrandPresentationCollection', [
      'utils',
      'entityCollection',
      'divisionwiseBrandPresentationModel',
      'userCollection',
      divisionwiseBrandPresentationCollection
    ]);
})();