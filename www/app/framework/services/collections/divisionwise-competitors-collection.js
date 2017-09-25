(function () {
    function divisionwiseCompetitorsCollection(utils, entityCollection, divisionwiseCompetitorsModel) {
        var DivisionwiseCompetitorsCollection = function () {
            DivisionwiseCompetitorsCollection.super.constructor.apply(this, arguments);
        };
        DivisionwiseCompetitorsCollection = utils.extend(DivisionwiseCompetitorsCollection, entityCollection);

        DivisionwiseCompetitorsCollection.prototype.model = divisionwiseCompetitorsModel;

        return DivisionwiseCompetitorsCollection;
    }

    abbottApp.factory('divisionwiseCompetitorsCollection', [
      'utils',
      'entityCollection',
      'divisionwiseCompetitorsModel',
      divisionwiseCompetitorsCollection
    ]);
})();