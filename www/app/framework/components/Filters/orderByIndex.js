abbottApp.filter('index', function () {
    return function (array, index) {
        if (!index)
            index = 'index';
        for (var i = 0; i < array.length; ++i) {
            array[i][index] = i;
        }
        return array;
    };
});