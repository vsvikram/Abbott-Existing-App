abbottApp.service('getDateUtility', function() {
    this.getDate = function(dateString) {
        if (dateString && dateString.length) {
            var temparray = [];
            temparray = dateString.split("-");
            var year = temparray[0],
                month = temparray[1],
                day = temparray[2];
            return new Date(year, month - 1, day);
        } else {
            return new Date();
        }
    };

    this.formatDate = function() {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

});