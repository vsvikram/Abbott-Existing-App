(function () {
    function dcrUnlockReasonCollection(utils, entityCollection, dcrUnlockReasonModel) {
        var DcrUnlockReasonCollection = function () {
            DcrUnlockReasonCollection.super.constructor.apply(this, arguments);
        };
        DcrUnlockReasonCollection = utils.extend(DcrUnlockReasonCollection, entityCollection);

        DcrUnlockReasonCollection.prototype.model = dcrUnlockReasonModel;

        return DcrUnlockReasonCollection;
    }

    abbottApp.factory('dcrUnlockReasonCollection', [
      'utils',
      'entityCollection',
      'dcrUnlockReasonModel',
      dcrUnlockReasonCollection
    ]);
})();