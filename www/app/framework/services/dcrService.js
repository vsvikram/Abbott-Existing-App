abbottApp.service("dcrPatchService", function () {
    var patchArray = [];
    var nameArray  = [];
    this.getPatch = function () {
        return this.patchArray;
    },
    this.setPatch =  function (patchList) {
        this.patchArray = patchList;
    }
    this.getNames = function () {
            return this.nameArray;
    },
    this.setNames =  function (nameList) {
            this.nameArray = nameList;
    }
});