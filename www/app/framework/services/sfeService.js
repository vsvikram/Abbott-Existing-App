abbottApp.service("missedDoctorCallService", function () {
    var DocList = [];
    this.getDocList = function () {
        return this.DocList;
    },
    this.setDocList =  function (docList) {
        this.DocList = docList;
    }
});